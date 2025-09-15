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

type ApiResponse = {
  ok: boolean;
  tools: Tool[];
  page: number;
  pageSize: number;
  total: number;
  error?: string;
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 60; // you can tune this

  async function fetchPage(p: number, append = false) {
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setErr(null);
    }

    try {
      const url = `/api/tools/list?page=${p}&pageSize=${pageSize}`;
      const res = await fetch(url, { cache: "no-store" });
      const json: ApiResponse = await res.json();

      // Debug aid in case UI gets stuck
      console.log("API /tools/list resp:", json);

      if (!json.ok) throw new Error(json.error || "Failed to fetch tools");
      setTools((prev) => (append ? [...prev, ...json.tools] : json.tools));
      setPage(json.page);
      setHasMore(json.page * json.pageSize < (json.total || 0));
    } catch (e: any) {
      console.error("Tools fetch error:", e);
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // initial load
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Latest on Product Hunt</h1>
        <div className="text-sm text-gray-500">
          {loading ? "Loading…" : `Showing ${tools.length}${hasMore ? " +" : ""}`}
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
          Error: {err}
        </div>
      )}

      {!loading && !err && tools.length === 0 && (
        <div>No tools yet.</div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Load more */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchPage(page + 1, true)}
            disabled={loadingMore}
            className="px-6 py-2 rounded-xl border shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingMore ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
}
