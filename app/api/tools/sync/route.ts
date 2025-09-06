import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import algoliasearch from "algoliasearch";

// Create Supabase client with service role (server-only!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key (set in Vercel env, never expose to client)
);

// Algolia client
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX!);

export async function POST() {
  try {
    // 1. Fetch published tools from Supabase
    const { data: tools, error } = await supabase
      .from("tools")
      .select("id,name,tagline,category,url,tags,logo_url")
      .eq("status", "published");

    if (error) throw error;

    if (!tools || tools.length === 0) {
      return NextResponse.json({ ok: true, count: 0 });
    }

    // 2. Push to Algolia
    const objects = tools.map((t) => ({
      objectID: t.id, // Algolia requires objectID
      ...t,
    }));

    await index.saveObjects(objects);

    return NextResponse.json({ ok: true, count: objects.length });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
