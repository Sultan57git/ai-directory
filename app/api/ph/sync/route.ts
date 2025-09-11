import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PH_API = process.env.PH_API_URL ?? "https://api.producthunt.com/v2/api/graphql";
const PH_TOKEN = process.env.PH_DEV_TOKEN;

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
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

async function fetchPage(after?: string) {
  if (!PH_TOKEN) throw new Error("PH_DEV_TOKEN missing");
  const res = await fetch(PH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PH_TOKEN}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { after } }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PH fetch failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.data.posts as {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: { node: any }[];
  };
}

function mapNodes(edges: any[]) {
  return edges.map((e) => {
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

export async function POST(req: Request) {
  // simple admin guard
  const incoming = (req.headers.get("x-admin-key") ?? "").trim();
  const expected = (process.env.ADMIN_API_KEY ?? "").trim();
  if (expected && incoming !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supa = supabaseAdmin();

  let after: string | undefined = undefined;
  let total = 0;
  const MAX_PAGES = 10; // safety cap (50 * 10 = 500 posts per run)

  for (let page = 0; page < MAX_PAGES; page++) {
    const { pageInfo, edges } = await fetchPage(after);
    const rows = mapNodes(edges);

    if (rows.length) {
      const { error } = await supa
        .from("tools")
        .upsert(rows, { onConflict: "ph_id" });
      if (error) throw error;
      total += rows.length;
    }

    if (!pageInfo.hasNextPage || !pageInfo.endCursor) break;
    after = pageInfo.endCursor;
  }

  return NextResponse.json({ ok: true, upserted: total });
}

// Optional: quick GET to check health
export async function GET() {
  return NextResponse.json({ ok: true });
}
