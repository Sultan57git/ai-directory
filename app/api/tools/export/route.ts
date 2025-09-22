import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/tools/export
 * Streams ALL Product Hunt tools as CSV by paging 1000 rows at a time.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 }
    );
  }

  const pageSize = 1000; // Supabase REST per-request limit
  let from = 0;
  let total = Infinity;

  const lines: string[] = [];
  let wroteHeader = false;

  while (from < total) {
    const to = from + pageSize - 1;

    // Ask PostgREST for CSV. Header present only on first page.
    const resp = await fetch(
      `${url}/rest/v1/tools?select=ph_id,name,tagline,slug,website_url,votes,comments,thumbnail_url,posted_at&source=eq.ph&order=posted_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "text/csv",
          Prefer: `count=exact,header=${wroteHeader ? "absent" : "present"}`,
          Range: `${from}-${to}`,
        },
      }
    );

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json({ ok: false, error: text || resp.statusText }, { status: resp.status });
    }

    // total count from Content-Range: "0-999/32711"
    const cr = resp.headers.get("content-range") || "";
    const slash = cr.indexOf("/");
    if (slash !== -1) {
      const tot = Number(cr.slice(slash + 1));
      if (!Number.isNaN(tot)) total = tot;
    }

    const chunk = await resp.text();

    if (!chunk.trim()) break;

    if (!wroteHeader) {
      lines.push(chunk.trimEnd()); // header + first rows
      wroteHeader = true;
    } else {
      // append rows only (no header). Ensure newline between pages.
      const rowsOnly = chunk.replace(/^[^\n]*\n/, ""); // drop first line
      if (rowsOnly.trim()) lines.push(rowsOnly.trimEnd());
    }

    from += pageSize;
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=producthunt_tools.csv`,
      "Cache-Control": "no-store",
    },
  });
}
