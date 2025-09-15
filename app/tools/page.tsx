"use client";

import { useEffect, useMemo, useState } from "react";

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
  // data + ui
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 60;

  // filters
  const [q, setQ] = useState("");               // search keyword
  const [topic, setTopic] = useState("");       // tool_topics.topic_slug
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  // build url for current state
  const buildUrl = useMemo(() => {
    return (p: number) => {
      const sp = new URLSearchParams({
        page: String(p),
        pageSize: String(pageSize),
        sort,
      });
      if (q.trim()) sp.set("q", q.trim());
      if (topic.trim()) sp.set("topic", topic.trim().toLowerCase());
      return `/api/tools/list?${sp.toString()}`;
    };
  }, [q, topic, sort]);

  async function fetchPage(p: number, append = false) {
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setErr(null);
    }
    try {
      const res = await fetch(buildUrl(p), { cache: "no-store" });
      const json: ApiResponse = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to fetch tools");
      setTools((prev) => (append ? [...prev, ...json.tools] : json.tools));
      setPage(json.page);
      setHasMore(json.page * json.pageSize < (json.total || 0));
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // initial
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handlers
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchPage(1, false);
  }
  function onChangeSort() {
    setSort((s) => (s === "desc" ? "asc" : "desc"));
    // after toggling sort, reset to first page
    setTimeout(() => fetchPage(1, false), 0);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Latest on Product Hunt</h1>
        {!loading && (
          <span className="text-sm text-gray-500">
            Showing {tools.length} {hasMore ? "+" : ""} tools
          </span>
        )}
      </div>

      {/* Filters */}
      <form onSubmit={onSubmit} className="mb-5 grid gap-3 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name/tagline…"
          className="rounded-xl border px-3 py-2 md:col-span-2"
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic slug (e.g. marketing)"
          className="rounded-xl border px-3 py-2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl border px-4 py-2"
            title="Apply filters"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onChangeSort}
            className="rounded-xl border px-4 py-2"
            title="Toggle sort by posted_at"
          >
            {sort === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>
      </form>

      {loading && <div>Loading…</div>}
      {err && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          Error: {err}
        </div>
      )}
      {!loading && !err && tools.length === 0 && <div>No tools found.</div>}

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
                {t.tagline && (
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {t.tagline}
                  </div>
                )}
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
