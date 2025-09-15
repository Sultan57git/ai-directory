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

  // pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 60; // 🔧 change page size if you like

  // load a page
  async function loadPage(p: number, append = false) {
    if (p < 1) return;
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setErr(null);
    }

    try {
      const res = await fetch(`/api/tools/list?page=${p}&pageSize=${pageSize}`);
      const json: ApiResponse = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to fetch");

      setTools((prev) => (append ? [...prev, ...json.tools] : json.tools));
      setPage(json.page);
      setHasMore(json.page * json.pageSize < (json.total || 0));
    } catch (e: any) {
      setErr(String(e));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // first load
  useEffect(() => {
    loadPage(1, false);
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Latest Product Hunt Tools</h1>

      {loading && <div>Loading…</div>}
      {!loading && err && <div className="text-red-600">Error: {err}</div>}
      {!loading && !err && tools.length === 0 && <div>No tools yet.</div>}

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
      {hasMore && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => loadPage(page + 1, true)}
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
