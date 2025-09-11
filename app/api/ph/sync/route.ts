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

// Reduced topics(first:10) to lower complexity per page
const QUERY = `
query FetchPosts($after: String) {
  posts(order: RANKING, after: $after, first: 50) {
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
        topics(first: 10) {
          edges { node { id name slug } }
        }
      }
    }
  }
}
`;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPH(after?: string) {
  const token = process.env.PH_DEV_TOKEN!;
  const res = await fetch(PH_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });
  const text = await res.text();
  if (!res.ok) return { ok: false as const, status: res.status, error: `PH error ${res.status}: ${text}` };

  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch (e: any) {
    return { ok: false as const, status: 500, error: `PH JSON parse failed: ${e?.message}` };
  }

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
      ph_id: String(n.id),                            // TEXT
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

// Health check
export async function GET() { return NextResponse.json({ ok: true }); }

export async function POST(req: Request) {
  if (unauthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supa = supabaseAdmin();

    // Controls
    const url = new URL(req.url);
    const PAGES = Math.min(Number(url.searchParams.get("pages") || 6), 200);   // small batch
    const DELAY = Math.max(Number(url.searchParams.get("delay") || 800), 0);   // ms between pages
    const MAX_BACKOFF = 3;

    // 1) READ last cursor from DB (resume point)
    const { data: state } = await supa
      .from("ph_sync_state")
      .select("last_cursor")
      .eq("id", true)
      .maybeSingle();

    let after: string | undefined = state?.last_cursor || undefined;
    let total = 0;

    for (let i = 0; i < PAGES; i++) {
      // 2) Fetch one page with backoff if PH says complexity/rate limit
      let tries = 0;
      let got: Awaited<ReturnType<typeof fetchPH>>;
      while (true) {
        got = await fetchPH(after);
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
        const { error: toolsErr } = await supa
          .from("tools")
          .upsert(toolRows, { onConflict: "ph_id" });
        if (toolsErr) return NextResponse.json({ ok: false, error: toolsErr.message }, { status: 500 });

        // 3) Upsert topics
        const topicRows: { ph_id: string; topic_slug: string; topic_name: string }[] = [];
        for (let idx = 0; idx < (edges || []).length; idx++) {
          const n = edges[idx]?.node;
          const tEdges = n?.topics?.edges ?? [];
          for (const te of tEdges) {
            const tn = te?.node;
            if (tn?.slug && tn?.name) {
              topicRows.push({ ph_id: toolRows[idx].ph_id, topic_slug: tn.slug, topic_name: tn.name });
            }
          }
        }
        if (topicRows.length) {
          const { error: topicsErr } = await supa
            .from("tool_topics")
            .upsert(topicRows, { onConflict: "ph_id,topic_slug" });
          if (topicsErr) return NextResponse.json({ ok: false, error: topicsErr.message }, { status: 500 });
        }

        total += toolRows.length;
      }

      // 4) Advance the cursor and PERSIST it (resume point)
      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
        after = undefined; // reached the end; next run will start from newest again
        await supa.from("ph_sync_state").upsert({ id: true, last_cursor: null, updated_at: new Date().toISOString() });
        break;
      } else {
        after = pageInfo.endCursor ?? undefined;
        await supa.from("ph_sync_state").upsert({ id: true, last_cursor: after, updated_at: new Date().toISOString() });
      }

      if (DELAY > 0) await sleep(DELAY);
    }

    return NextResponse.json({ ok: true, upserted: total, pages: PAGES, delay_ms: DELAY, next_cursor: after || null });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
