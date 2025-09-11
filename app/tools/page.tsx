"use client";

import { useEffect, useState } from "react";

type Tool = {
  ph_id: number;
  name: string;
  tagline: string | null;
  slug: string | null;
  website_url: string | null;
  votes: number | null;
  comments: number | null;
  thumbnail_url: string | null;
  posted_at: string | null;
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools/list")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setTools(json.tools);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Latest Product Hunt Tools</h1>
      {loading && <div>Loading…</div>}
      {!loading && tools.length === 0 && <div>No tools yet.</div>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t) => (
          <li key={t.ph_id} className="rounded-2xl border p-4 shadow-sm">
            <div className="flex gap-4">
              {t.thumbnail_url ? (
                <img
                  src={t.thumbnail_url}
                  alt={t.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gray-200" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-600">{t.tagline}</div>
                <div className="mt-2 text-sm text-gray-500">
                  ⭐ {t.votes ?? 0} · 💬 {t.comments ?? 0}
                </div>
                {t.website_url && (
                  <a
                    href={t.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-sm underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
