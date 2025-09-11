"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

const PAGE_SIZE = 30; // initial + each load-more

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read selected topic from URL (?topic=slug)
  const initialTopic = useMemo(
    () => (searchParams?.get("topic") ?? "").toLowerCase(),
    [searchParams]
  );

  const [topics, setTopics] = useState<Topic[]>([]);
  const [topic, setTopic] = useState<string>(initialTopic);
  const [tools, setTools] = useState<Tool[]>([]);
  const [limit, setLimit] = useState<number>(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // keep the topic in the URL so links are shareable
  function updateUrl(nextTopic: string) {
    const p = new URLSearchParams(searchParams?.toString() ?? "");
    if (nextTopic) p.set("topic", nextTopic);
    else p.delete("topic");
    router.replace(`/?${p.toString()}`, { scroll: false });
  }

  async function fetchTopics() {
    try {
      const r = await fetch("/api/topics/list", { cache: "no-store" });
      const j = await r.json();
      if (j.ok) setTopics(j.topics as Topic[]);
    } catch {
      /* non-fatal */
    }
  }

  async function loadTools(currTopic: string, currLimit: number) {
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (currTopic) qs.set("topic", currTopic);
      qs.set("limit", String(currLimit));
      const r = await fetch(`/api/tools/list?${qs.toString()}`, { cache: "no-store" });
      const j = await r.json();
      if (j.ok) setTools(j.tools as Tool[]);
      else setErr(j.error || "Failed to load tools");
    } catch (e: any) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  // first load
  useEffect(() => {
    fetchTopics();
  }, []);

  // when topic or limit changes, reload tools
  useEffect(() => {
    loadTools(topic, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, limit]);

  // keep state in sync if user lands with ?topic= in URL
  useEffect(() => {
    if (initialTopic !== topic) setTopic(initialTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

  function onChangeTopic(next: string) {
    setLimit(PAGE_SIZE); // reset pagination when filter changes
    setTopic(next);
    updateUrl(next);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Latest on Product Hunt</h1>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Category</label>
          <select
            className="border rounded-md p-2 text-sm"
            value={topic}
            onChange={(e) => onChangeTopic(e.target.value)}
          >
            <option value="">All</option>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <div>Loading…</div>}
      {!loading && err && <div className="text-red-600">Error: {err}</div>}
      {!loading && !err && tools.length === 0 && (
        <div>No tools yet. Check back soon!</div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((t) => (
          <li key={t.ph_id} className="rounded-2xl border p-4 shadow-sm bg-white">
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

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {t.tagline}
                </div>
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

      {!loading && tools.length >= limit && (
        <div className="flex justify-center">
          <button
            onClick={() => setLimit((n) => n + PAGE_SIZE)}
            className="px-4 py-2 rounded-md border shadow-sm text-sm"
          >
            Load more
          </button>
        </div>
      )}
    </main>
  );
}
