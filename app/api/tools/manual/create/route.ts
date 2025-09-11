import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
  return createClient(url, key, { auth: { persistSession: false } });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  // Optional gate
  const inc = (req.headers.get("x-admin-key") ?? "").trim();
  const exp = (process.env.ADMIN_API_KEY ?? "").trim();
  if (exp && inc !== exp) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  if (!name) return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });

  const slug = slugify(String(form.get("slug") || name));
  const website_url = String(form.get("website_url") || "").trim() || null;
  const tagline = String(form.get("tagline") || "").trim() || null;
  const file = form.get("logo") as File | null;

  const supa = adminClient();

  // Upload logo if provided
  let thumbnail_url: string | null = null;
  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${slug}/${Date.now()}.${ext}`;
    const { error: upErr } = await supa.storage.from("tool-logos")
      .upload(path, file, { upsert: true, contentType: file.type || "image/png" });
    if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    thumbnail_url = supa.storage.from("tool-logos").getPublicUrl(path).data.publicUrl;
  }

  // Upsert manual row by slug (no ph_id)
  const { error } = await supa.from("tools").upsert({
    source: "manual",
    ph_id: null,
    name,
    slug,
    website_url,
    tagline,
    votes: 0,
    comments: 0,
    thumbnail_url,
    posted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug, thumbnail_url });
}
