import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Toggle extra debug logs by setting DEBUG_SYNC=1 in Vercel (optional)
const DEBUG = process.env.DEBUG_SYNC === "1";

function getSupabaseServer() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL; // allow either name

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE ??
    process.env.SUPABASE_SECRET; // allow common aliases

  if (!url) throw new Error("Supabase URL env missing (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL).");
  if (!serviceKey) throw new Error("Service role key env missing (SUPABASE_SERVICE_ROLE_KEY).");

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function authorized(req: Request) {
  const incoming = (req.headers.get("x-admin-key") ?? "").trim(); // trim accidental spaces
  const expected = (process.env.ADMIN_API_KEY ?? "").trim();

  if (DEBUG) {
    console.log("ADMIN_API_KEY length (server):", expected.length);
    console.log("Incoming key length       :", incoming.length);
  }

  // If no ADMIN_API_KEY configured, allow; otherwise require exact match
  return expected ? incoming === expected : true;
}

// Optional: quick health check (no auth)
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServer();

    // Minimal sanity query
    const { data, error } = await supabase.from("tools").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json({ ok: true, sampleCount: data?.length ?? 0 });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    if (DEBUG) console.error("sync route error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
