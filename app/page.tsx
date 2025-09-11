"use client";

import { useEffect, useState } from "react";

type Tool = {
  ph_id: string;
  name: string;
  tagline: string | null;
  slug: string | null;
  website_url: string | null;
  votes: number | null;
  comments: number | null;
  thumbnail_url: string | null;
  posted_at: string | null;
};

type Topic = { slug: string; name: string; count: number };

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadTools(t?: string) {
    setLoading(true);
    setErr(null);
    try {
      const url = t ? `/api/tools/list?topic=${encodeURIComponent(t)}` : "/api/tools/list";
      const r = await fetch(url);
      const j = await r.json();
      if (j.ok) setTools(j.tools as Tool[]);
      else setErr(j.error || "Failed to load tools");
    } catch (e: any) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    loadTools();

    // load topics (will show once your topics cron has populated tool_topics)
    fetch("/api/topics/list")
      .then(r => r.json())
      .then(j => { if (j.ok) setTopics(j.topics as Topic[]); });
  }, []);

  useEffect(() => {
    loadTools(topic || undefined);
  }, [topic]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Latest on Product Hunt</h1>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Category</label>
          <select
            className="border rounded-md p-2 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">All</option>
            {topics.map(t => (
              <option key={t.slug} value={t.slug}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <div>Loading…</div>}
      {!loading && err && <div className="text-red-600">Error: {err}</div>}
      {!loading && !err && tools.length === 0 && <div>No tools yet.</div>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <li key={t.ph_id} className="rounded-2xl border p-4 shadow-sm">
            <div className="flex gap-4">
              {t.thumbnail_url ? (
                <img src={t.thumbnail_url} alt={t.name} className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gray-200" />
              )}

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{t.tagline}</div>
                <div className="mt-2 text-sm text-gray-500">⭐ {t.votes ?? 0} · 💬 {t.comments ?? 0}</div>

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
