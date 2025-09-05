// app/categories/page.tsx
import Link from "next/link";
import CATEGORIES from "@/lib/categories";

export const metadata = {
  title: "All Categories - AI Directory",
  description: "Browse all categories of AI tools."
};

export default function CategoriesPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="block px-3 py-2 rounded-xl border bg-white/50 hover:bg-white transition"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
