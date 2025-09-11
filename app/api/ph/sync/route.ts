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
      }
    }
  }
}
`;

async function fetchPH(after?: string) {
  const token = process.env.PH_DEV_TOKEN;
  if (!token) {
    return { ok: false, status: 500, error: "PH_DEV_TOKEN missing" };
  }

  const res = await fetch(PH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });

  const text = await res.text(); // read once safely
  if (!res.ok) {
    return { ok: false, status: res.status, error: `PH error ${res.status}: ${text}` };
  }

  let json: any = null;
  try { json = text ? JSON.parse(text) : null; }
  catch (e: any) {
    return { ok: false, status: 500, error: `PH JSON parse failed: ${e?.message}` };
  }

  const data = json?.data?.posts;
  if (!data) {
    const err = json?.errors ? JSON.stringify(json.errors) : "no data.posts";
    return { ok: false, status: 500, error: `PH GraphQL error: ${err}` };
  }

  return { ok: true, status: 200, data };
}

function mapNodes(edges: any[]) {
  return edges.map((e: any) => {
    const n = e.node;
    return {
      ph_id: Number(n.id),
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

    let after: string | undefined = undefined;
    let total = 0;
    const MAX_PAGES = 10; // 50 * 10 = 500 posts per run

    for (let i = 0; i < MAX_PAGES; i++) {
      const ph = await fetchPH(after);
      if (!ph.ok) {
        // return early with a clear JSON error
        return NextResponse.json({ ok: false, error: ph.error }, { status: ph.status });
      }

      const { pageInfo, edges } = ph.data as {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: any[];
      };

      const rows = mapNodes(edges || []);
      if (rows.length) {
        const { error } = await supa.from("tools").upsert(rows, { onConflict: "ph_id" });
        if (error) {
          return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
        }
        total += rows.length;
      }

      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) break;
      after = pageInfo.endCursor ?? undefined;
    }

    return NextResponse.json({ ok: true, upserted: total });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    console.error("ph/sync error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
