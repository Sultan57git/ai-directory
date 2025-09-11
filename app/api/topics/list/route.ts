import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supa() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET() {
  const s = supa();
  const { data, error } = await s
    .from("tool_topics")
    .select("topic_slug, topic_name, ph_id")
    .limit(100000);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const r of data || []) {
    const key = r.topic_slug;
    if (!map.has(key)) map.set(key, { slug: r.topic_slug, name: r.topic_name, count: 0 });
    map.get(key)!.count++;
  }
  const topics = Array.from(map.values()).sort((a, b) => b.count - a.count);
  return NextResponse.json({ ok: true, topics });
}
