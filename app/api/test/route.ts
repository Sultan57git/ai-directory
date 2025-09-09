import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    producthunt: process.env.PRODUCTHUNT_TOKEN ? "✅ found" : "❌ missing",
    supabase: process.env.SUPABASE_URL ? "✅ found" : "❌ missing",
  });
}
