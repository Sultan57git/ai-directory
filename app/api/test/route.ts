import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const has = (k: string) => Boolean(process.env[k]);
  return NextResponse.json({
    ok: true,
    env: {
      SUPABASE_URL: has("SUPABASE_URL"),
      SUPABASE_ANON_KEY: has("SUPABASE_ANON_KEY"),
      SUPABASE_SERVICE_ROLE: has("SUPABASE_SERVICE_ROLE"),
      NEXT_PUBLIC_SUPABASE_URL: has("NEXT_PUBLIC_SUPABASE_URL"),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      PH_DEV_TOKEN: has("PH_DEV_TOKEN"),
      PH_CLIENT_ID: has("PH_CLIENT_ID"),
      PH_CLIENT_SECRET: has("PH_CLIENT_SECRET"),
      ADMIN_API_KEY: has("ADMIN_API_KEY"),
    },
  });
}
