// lib/supabase/browser.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  // 🔧 CHANGE: make sure these envs exist in Vercel
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
