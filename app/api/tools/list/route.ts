import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function GET(req: Request) {
  try {
    const supa = supabasePublic();
    const { searchParams } = new URL(req.url);

    // --- Pagination ---
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize") || 100), 500); // 🔧 tune max
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // --- Filters ---
    const topic = searchParams.get("topic")?.trim().toLowerCase() || null;
    const q = searchParams.get("q")?.trim() || ""; // 🔧 search keyword
    const sort = (searchParams.get("sort") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    let phIds: string[] | null = null;

    if (topic) {
      const { data: ids, error: idErr } = await supa
        .from("tool_topics")
        .select("ph_id")
        .eq("topic_slug", topic)
        .limit(5000);
      if (idErr) return NextResponse.json({ ok: false, error: idErr.message }, { status: 500 });
      phIds = (ids || []).map((r) => r.ph_id);
      if (!phIds.length) return NextResponse.json({ ok: true, tools: [], total: 0 });
    }

    let query = supa
      .from("tools")
      .select(
        "ph_id,name,tagline,slug,website_url,votes,comments,thumbnail_url,posted_at",
        { count: "exact" }
      )
      .eq("source", "ph")
      .order("posted_at", { ascending: sort === "asc" })
      .range(from, to);

    if (phIds) query = query.in("ph_id", phIds);

    if (q) {
      // 🔧 adjust searchable columns
      query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%`);
    }

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({
      ok: true,
      tools: data ?? [],
      page,
      pageSize,
      total: count ?? 0,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
