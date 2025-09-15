// components/ToolsExplorer.tsx
"use client";

import React from "react";
import useSWRInfinite from "swr/infinite";

type Tool = {
  id: string | number;
  name: string;
  tagline?: string;
  description?: string;
  category?: string; // 🔧 CHANGE: align with your schema
  posted_at?: string; // 🔧 CHANGE: align with your schema
  logo_url?: string; // optional
  // ...add any other columns you render
};

type ApiResponse = {
  ok: boolean;
  page: number;
  pageSize: number;
  total: number;
  items: Tool[];
};

const PAGE_SIZE = 100; // 🔧 CHANGE default page size

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ToolsExplorer({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState(initialCategory);
  const [sort, setSort] = React.useState<"desc" | "asc">("desc");

  const getKey = (pageIndex: number, previousPageData: ApiResponse | null) => {
    if (previousPageData && previousPageData.items.length === 0) return null; // end
    const page = pageIndex + 1;
    const sp = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      sort,
    });
    if (q.trim()) sp.set("q", q.trim());
    if (category.trim()) sp.set("category", category.trim());

    return `/api/tools/list?${sp.toString()}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<ApiResponse>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const items = React.useMemo(
    () => (data ? data.flatMap((d) => d.items) : []),
    [data]
  );

  // Infinite scroll sentinel
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSize((s) => s + 1);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [setSize]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    // reset list
    setSize(1);
  }

  function onChangeCategory(next: string) {
    setCategory(next);
    setSize(1);
  }

  function onToggleSort() {
    setSort((s) => (s === "desc" ? "asc" : "desc"));
    setSize(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Controls */}
      <form onSubmit={onSearch} className="mb-4 grid gap-3 sm:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools..."
          className="sm:col-span-2 rounded-xl border px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => onChangeCategory(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option value="">All categories</option>
          {/* 🔧 CHANGE: Hardcode popular categories or render from props */}
          <option value="AI">AI</option>
          <option value="Developer Tools">Developer Tools</option>
          <option value="Marketing">Marketing</option>
          <option value="Design">Design</option>
        </select>

        <button
          type="button"
          onClick={onToggleSort}
          className="rounded-xl border px-3 py-2"
          title="Toggle sort by posted_at"
        >
          Sort: {sort === "desc" ? "Newest" : "Oldest"}
        </button>
      </form>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl border p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {t.logo_url ? (
                <img
                  src={t.logo_url}
                  alt={t.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
              )}
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                {t.posted_at && (
                  <p className="text-xs text-gray-500">
                    {new Date(t.posted_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {t.tagline && <p className="text-sm">{t.tagline}</p>}
            {t.description && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                {t.description}
              </p>
            )}
            {t.category && (
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {t.category}
                </span>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Load status */}
      <div ref={sentinelRef} className="h-10" />
      <div className="mt-4 text-center text-sm text-gray-500">
        {isValidating ? "Loading…" : items.length === 0 ? "No results" : "Scroll to load more"}
      </div>
    </div>
  );
}
