// lib/supabaseServer.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** Server-only Supabase client. Lazy singleton. */
export function getSupabaseServer(): SupabaseClient {
  // Accept both your Vercel names and common alternates
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  // Prefer the service role key in server code; fallback to anon for read-only
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || // <— Vercel recommended name
    process.env.SUPABASE_SERVICE_ROLE ||     // alternate
    process.env.SUPABASE_SECRET ||           // alternate
    undefined;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    undefined;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) is missing");
  }

  const key = serviceKey ?? anonKey;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (server) or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    );
  }

  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}
