// components/CategoryFilter.tsx
import CATEGORIES from "@/lib/categories";

export default function CategoryFilter() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
      {CATEGORIES.map((c) => (
        <button
          key={c.slug}
          type="button"
          aria-label={c.name}
          className="px-3 py-2 rounded-xl border bg-white/50 hover:bg-white transition"
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
