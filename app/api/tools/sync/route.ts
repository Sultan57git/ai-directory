import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const key = req.headers.get("x-admin-key");
  if (process.env.ADMIN_API_KEY && key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from("tools").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, sampleCount: data?.length ?? 0 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message ?? String(err) }, { status: 500 });
  }
}
