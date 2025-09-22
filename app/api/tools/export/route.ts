import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Streams CSV directly from Supabase REST (PostgREST) using your SERVICE key in Vercel env
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
  const q =
    "select=ph_id,name,tagline,slug,website_url,votes,comments,thumbnail_url,posted_at" +
    "&source=eq.ph&order=posted_at.desc";

  // Ask PostgREST for CSV
  const resp = await fetch(`${url}/rest/v1/tools?${q}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "text/csv",
      Prefer: "count=exact,header=present",
      Range: "0-999999" // big range to get all rows
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ ok: false, error: text }, { status: resp.status });
  }

  const body = await resp.text();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=producthunt_tools.csv`,
    },
  });
}
