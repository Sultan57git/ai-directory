import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PH_API = "https://api.producthunt.com/v2/api/graphql";

/** Admin Supabase client (service role key is required for writes) */
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // NOT the anon key
  return createClient(url, key, { auth: { persistSession: false } });
}

/** ---------- GraphQL ---------- */

function buildQuery(includeTopics: boolean, first: number) {
  const topicsBlock = includeTopics
    ? `
        topics(first: 10) {
          edges { node { id name slug } }
        }
      `
    : ``;

  // Use NEWEST for a stable historical walk; cursor-based
  return `
    query FetchPosts($after: String) {
      posts(order: NEWEST, after: $after, first: ${first}) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            name
            tagline
            slug
            website
            votesCount
            commentsCount
            createdAt
            thumbnail { url }
            ${topicsBlock}
          }
        }
      }
    }
  `;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPH(after: string | undefined, includeTopics: boolean, first: number) {
  const token = process.env.PH_DEV_TOKEN!;
  const QUERY = buildQuery(includeTopics, first);

  const res = await fetch(PH_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false as const, status: res.status, error: `PH error ${res.status}: ${text}` };
  }

  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e: any) {
    return { ok: false as const, status: 500, error: `PH JSON parse failed: ${e?.message}` };
  }

  if (json?.errors?.length) {
    return { ok: false as const, status: 429, error: `PH GraphQL error: ${JSON.stringify(json.errors)}` };
  }

  const data = json?.data?.posts;
  if (!data) return { ok: false as const, status: 500, error: "PH GraphQL error: no data.posts" };
  return { ok: true as const, status: 200, data };
}

/** ---------- Mapping helpers ---------- */

function mapPostsToPhPosts(edges: any[]) {
  return (edges || []).map((e: any) => {
    const n = e?.node ?? {};
    return {
      // table: ph_posts
      id: String(n.id), // PK
      name: n.name ?? null,
      description: n.tagline ?? null,
      slug: n.slug ?? null,
      website_url: n.website ?? null,
      votes: n.votesCount ?? 0,
      comments: n.commentsCount ?? 0,
      thumbnail_url: n.thumbnail?.url ?? null,
      posted_at: n.createdAt ? new Date(n.createdAt).toISOString() : null,
      updated_at: new Date().toISOString(),
    };
  });
}

function mapPostsToTools(edges: any[]) {
  return (edges || []).map((e: any) => {
    const n = e?.node ?? {};
    return {
      // table: tools (UI reads this)
      ph_id: String(n.id), // 🔧 ensure tools.ph_id is UNIQUE or PK
      name: n.name ?? null,
      tagline: n.tagline ?? null,
      slug: n.slug ?? null,
      website_url: n.website ?? null,
      votes: n.votesCount ?? 0,
      comments: n.commentsCount ?? 0,
      thumbnail_url: n.thumbnail?.url ?? null,
      posted_at: n.createdAt ? new Date(n.createdAt).toISOString() : null,
      source: "ph" as const,
      updated_at: new Date().toISOString(),
    };
  });
}

function mapTopicsToToolTopics(edges: any[]) {
  const rows: { ph_id: string; topic_slug: string; topic_name: string }[] = [];
  for (const e of edges || []) {
    const n = e?.node;
    const postId = String(n?.id ?? "");
    if (!postId) continue;
    const tEdges = n?.topics?.edges ?? [];
    for (const te of tEdges) {
      const tn = te?.node;
      if (tn?.slug && tn?.name) {
        rows.push({ ph_id: postId, topic_slug: tn.slug, topic_name: tn.name });
      }
    }
  }
  return rows;
}

function bearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
}

/** GET proxies to POST so logic lives in one place */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const headerToken = bearer(req);
  const qsToken = url.searchParams.get("token") || "";
  const expected = (process.env.CRON_SECRET || "").trim();

  if (expected && headerToken !== expected && qsToken !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const proxy = new Request(req.url, { method: "POST", headers: new Headers(), body: "{}" });
  return POST(proxy);
}

/** POST: run sync
 * Query params:
 * - mode=resume|full (default: resume)
 * - pages=number (default 6, max 200)
 * - size=10..50 (default 25)
 * - delay=ms between pages (default 800)
 * - topics=true|false (default false)
 */
export async function POST(req: Request) {
  try {
    const supa = supabaseAdmin();
    const url = new URL(req.url);

    // Tunables
    const MODE = (url.searchParams.get("mode") || "resume").toLowerCase() as "resume" | "full";
    const PAGES = Math.min(Number(url.searchParams.get("pages") || 6), 200);
    const DELAY = Math.max(Number(url.searchParams.get("delay") || 800), 0);
    const SIZE = Math.max(10, Math.min(Number(url.searchParams.get("size") || 25), 50));
    const INCLUDE_TOPICS = ["1", "true", "yes"].includes((url.searchParams.get("topics") || "0").toLowerCase());
    const MAX_BACKOFF = 3;

    // Cursor state
    const { data: state } = await supa
      .from("ph_sync_state")
      .select("last_cursor")
      .eq("id", true)
      .maybeSingle();

    // New behavior: if mode=full, start from scratch (ignore stored cursor)
    let after: string | undefined = MODE === "full" ? undefined : (state?.last_cursor || undefined);
    let total = 0;
    let pagesRun = 0;

    for (let i = 0; i < PAGES; i++) {
      pagesRun++;

      // Fetch a page (with exponential backoff on rate/complexity)
      let tries = 0;
      let got: Awaited<ReturnType<typeof fetchPH>>;
      while (true) {
        got = await fetchPH(after, INCLUDE_TOPICS, SIZE);
        if (got.ok) break;

        const msg = String(got.error || "");
        const isComplexity = got.status === 429 || /complexit|rate|limit/i.test(msg);
        if (!isComplexity || tries >= MAX_BACKOFF) {
          return NextResponse.json({ ok: false, page: i + 1, error: msg }, { status: 500 });
        }
        await sleep(Math.pow(2, tries) * 2000); // 2s, 4s, 8s
        tries++;
      }

      const { pageInfo, edges } = got.data as {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: any[];
      };

      // Upsert into ph_posts
      const phPosts = mapPostsToPhPosts(edges);
      if (phPosts.length) {
        const { error: upErr } = await supa
          .from("ph_posts")
          .upsert(phPosts, { onConflict: "id" }); // id is PK
        if (upErr) {
          return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
        }
        total += phPosts.length;
      }

      // Mirror into tools so the UI can see everything
      const toolsRows = mapPostsToTools(edges);
      if (toolsRows.length) {
        // ⚠️ Ensure an index/unique on tools.ph_id
        const { error: toolsErr } = await supa
          .from("tools")
          .upsert(toolsRows, { onConflict: "ph_id" }); // 🔧 change if your unique is different
        if (toolsErr) {
          // Don’t fail whole job; return as warning payload if you prefer
          console.warn("tools upsert error:", toolsErr.message);
        }
      }

      // Topic mappings for UI filter = tool_topics
      if (INCLUDE_TOPICS && edges.length) {
        const topicRows = mapTopicsToToolTopics(edges);
        if (topicRows.length) {
          const { error: tpErr } = await supa
            .from("tool_topics")
            .upsert(topicRows, { onConflict: "ph_id,topic_slug" });
          if (tpErr) {
            console.warn("tool_topics upsert error:", tpErr.message);
          }
        }
      }

      // Advance & persist cursor
      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
        after = undefined;
        await supa
          .from("ph_sync_state")
          .upsert({ id: true, last_cursor: null, updated_at: new Date().toISOString() });
        break;
      } else {
        after = pageInfo.endCursor ?? undefined;
        await supa
          .from("ph_sync_state")
          .upsert({ id: true, last_cursor: after, updated_at: new Date().toISOString() });
      }

      if (DELAY > 0) await sleep(DELAY);
    }

    return NextResponse.json({
      ok: true,
      mode: MODE,
      pages_run: pagesRun,
      upserted_posts: total,
      size: SIZE,
      topics: INCLUDE_TOPICS,
      delay_ms: DELAY,
      next_cursor: after || null,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
