import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PH_API = "https://api.producthunt.com/v2/api/graphql";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

// Expanded: include topics
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
        topics(first: 20) {
          edges { node { id name slug } }
        }
      }
    }
  }
}
`;

async function fetchPH(after?: string) {
  const token = process.env.PH_DEV_TOKEN;
  if (!token) {
    return { ok: false, status: 500, error: "PH_DEV_TOKEN missing" as const };
  }

  const res = await fetch(PH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, error: `PH error ${res.status}: ${text}` as const };
  }

  let json: any = null;
  try { json = text ? JSON.parse(text) : null; }
  catch (e: any) {
    return { ok: false, status: 500, error: `PH JSON parse failed: ${e?.message}` as const };
  }

  const data = json?.data?.posts;
  if (!data) {
    const err = json?.errors ? JSON.stringify(json.errors) : "no data.posts";
    return { ok: false, status: 500, error: `PH GraphQL error: ${err}` as const };
  }

  return { ok: true as const, status: 200, data };
}

// Map PH nodes -> tools table rows (ph_id as TEXT)
function mapNodes(edges: any[]) {
  return edges.map((e: any) => {
    const n = e.node;
    return {
      source: "ph" as const,
      ph_id: String(n.id),                              // TEXT
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
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  if (unauthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supa = supabaseAdmin();

    // Allow deeper pagination: /api/ph/sync?pages=60  -> 60 * 50 = 3000 posts
    const url = new URL(req.url);
    const PAGES = Math.min(Number(url.searchParams.get("pages") || 10), 200); // safety cap

    let after: string | undefined = undefined;
    let total = 0;

    for (let i = 0; i < PAGES; i++) {
      const ph = await fetchPH(after);
      if (!ph.ok) {
        return NextResponse.json({ ok: false, error: ph.error }, { status: ph.status });
      }

      const { pageInfo, edges } = ph.data as {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: any[];
      };

      const toolRows = mapNodes(edges || []);
      if (toolRows.length) {
        const { error: toolsErr } = await supa
          .from("tools")
          .upsert(toolRows, { onConflict: "ph_id" }); // PH upsert key
        if (toolsErr) {
          return NextResponse.json({ ok: false, error: toolsErr.message }, { status: 500 });
        }

        // Build topic rows aligned by index to edges
        const topicRows: { ph_id: string; topic_slug: string; topic_name: string }[] = [];
        for (let idx = 0; idx < (edges || []).length; idx++) {
          const n = edges[idx]?.node;
          const tEdges = n?.topics?.edges ?? [];
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
          // composite conflict key
          const { error: topicsErr } = await supa
            .from("tool_topics")
            .upsert(topicRows, { onConflict: "ph_id,topic_slug" });
          if (topicsErr) {
            return NextResponse.json({ ok: false, error: topicsErr.message }, { status: 500 });
          }
        }

        total += toolRows.length;
      }

      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) break;
      after = pageInfo.endCursor ?? undefined;
    }

    return NextResponse.json({ ok: true, upserted: total, pages: PAGES });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    console.error("ph/sync error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
