import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  const key = req.headers.get("x-admin-key");
  if (process.env.ADMIN_API_KEY && key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabaseServer();

    // sample query
    const { data, error } = await supabase.from("tools").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      sampleCount: data?.length ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
