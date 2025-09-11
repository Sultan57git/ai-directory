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

    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);
    const topic = searchParams.get("topic")?.trim().toLowerCase() || null;

    let phIds: string[] | null = null;

    if (topic) {
      const { data: ids, error: idErr } = await supa
        .from("tool_topics")
        .select("ph_id")
        .eq("topic_slug", topic)
        .limit(5000);
      if (idErr) return NextResponse.json({ ok: false, error: idErr.message }, { status: 500 });
      phIds = (ids || []).map((r) => r.ph_id);
      if (!phIds.length) return NextResponse.json({ ok: true, tools: [] });
    }

    let q = supa
      .from("tools")
      .select("ph_id,name,tagline,slug,website_url,votes,comments,thumbnail_url,posted_at")
      .eq("source", "ph")
      .order("posted_at", { ascending: false })
      .limit(limit);

    if (phIds) q = q.in("ph_id", phIds);

    const { data, error } = await q;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, tools: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
