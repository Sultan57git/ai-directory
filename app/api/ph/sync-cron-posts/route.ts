import { NextResponse } from "next/server";

function bearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = bearer(req);
  const expected = (process.env.CRON_SECRET || "").trim();
  if (expected && token !== expected) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  // Fast posts-only backfill (no topics)
  const target = `${origin}/api/ph/sync?pages=6&size=20&topics=0&delay=800`;

  const r = await fetch(target, {
    method: "GET",
    headers: { authorization: `Bearer ${expected}` },
  });

  const j = await r.json().catch(() => ({}));
  return NextResponse.json(j, { status: r.status });
}
