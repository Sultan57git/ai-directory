import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PH_API = "https://api.producthunt.com/v2/api/graphql";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function buildQuery(includeTopics: boolean, first: number) {
  const topicsBlock = includeTopics
    ? `
        topics(first: 10) {
          edges { node { id name slug } }
        }
      `
    : ``;

  return `
    query FetchPosts($after: String) {
      posts(order: RANKING, after: $after, first: ${first}) {
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

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

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
  try { json = text ? JSON.parse(text) : null; }
  catch (e: any) { return { ok: false as const, status: 500, error: `PH JSON parse failed: ${e?.message}` }; }

  if (json?.errors?.length) {
    return { ok: false as const, status: 429, error: `PH GraphQL error: ${JSON.stringify(json.errors)}` };
  }

  const data = json?.data?.posts;
  if (!data) return { ok: false as const, status: 500, error: "PH GraphQL error: no data.posts" };
  return { ok: true as const, status: 200, data };
}

function mapNodes(edges: any[]) {
  return edges.map((e: any) => {
    const n = e.node;
    return {
      source: "ph" as const,
      ph_id: String(n.id),
      name: n.name ?? null,
      tagline: n.tagline ?? null,
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

function unauthorized(req: Request) {
  const incoming = (req.headers.get("x-admin-key") ?? "").trim();
  const expected = (process.env.ADMIN_API_KEY ?? "").trim();
  return expected && incoming !== expected;
}

function bearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
}

/** GET: used by Vercel Cron. Accepts Authorization: Bearer <CRON_SECRET> OR ?token=<CRON_SECRET>.
 *  Proxies to POST so the actual worker stays in one place. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const headerToken = bearer(req);
  const qsToken = url.searchParams.get("token") || "";
  const expected = (process.env.CRON_SECRET || "").trim();

  if (expected && headerToken !== expected && qsToken !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const headers = new Headers({ "x-admin-key": process.env.ADMIN_API_KEY || "" });
  const proxy = new Request(req.url, { method: "POST", headers, body: "{}" });
  return POST(proxy);
}

export async function POST(req: Request) {
  if (unauthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supa = supabaseAdmin();
    const url = new URL(req.url);

    // Tunables
    const PAGES = Math.min(Number(url.searchParams.get("pages") || 6), 200);
    const DELAY = Math.max(Number(url.searchParams.get("delay") || 800), 0);
    const SIZE  = Math.max(10, Math.min(Number(url.searchParams.get("size") || 25), 50));
    const INCLUDE_TOPICS = ["1","true","yes"].includes((url.searchParams.get("topics")||"0").toLowerCase());

    const MAX_BACKOFF = 3;

    // Resume point
    const { data: state } = await supa
      .from("ph_sync_state")
      .select("last_cursor")
      .eq("id", true)
      .maybeSingle();

    let after: string | undefined = state?.last_cursor || undefined;
    let total = 0;

    for (let i = 0; i < PAGES; i++) {
      // fetch one page (with backoff on complexity/rate)
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

      const toolRows = mapNodes(edges || []);
      if (toolRows.length) {
        const { error: tErr } = await supa.from("tools").upsert(toolRows, { onConflict: "ph_id" });
        if (tErr) return NextResponse.json({ ok: false, error: tErr.message }, { status: 500 });

        if (INCLUDE_TOPICS) {
          const topicRows: { ph_id: string; topic_slug: string; topic_name: string }[] = [];
          for (let idx = 0; idx < (edges || []).length; idx++) {
            const tEdges = edges[idx]?.node?.topics?.edges ?? [];
            for (const te of tEdges) {
              const tn = te?.node;
              if (tn?.slug && tn?.name) {
                topicRows.push({
                  ph_id: toolRows[idx].ph_id,
                  topic_slug: tn.slug,
                  topic_name: tn.name,
                });
              }
            }
          }
          if (topicRows.length) {
            const { error: tpErr } = await supa
              .from("tool_topics")
              .upsert(topicRows, { onConflict: "ph_id,topic_slug" });
            if (tpErr) return NextResponse.json({ ok: false, error: tpErr.message }, { status: 500 });
          }
        }

        total += toolRows.length;
      }

      // advance & persist cursor
      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
        after = undefined;
        await supa.from("ph_sync_state").upsert({
          id: true, last_cursor: null, updated_at: new Date().toISOString(),
        });
        break;
      } else {
        after = pageInfo.endCursor ?? undefined;
        await supa.from("ph_sync_state").upsert({
          id: true, last_cursor: after, updated_at: new Date().toISOString(),
        });
      }

      if (DELAY > 0) await sleep(DELAY);
    }

    return NextResponse.json({
      ok: true, upserted: total, pages: PAGES, size: SIZE, topics: INCLUDE_TOPICS, delay_ms: DELAY,
      next_cursor: after || null
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
