// app/categories/[slug]/page.tsx
import { notFound } from "next/navigation";
import CATEGORIES from "@/lib/categories";
import CategoryFilter from "@/components/CategoryFilter";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  const title = category ? `${category.name} Tools` : "Category";
  const description = category
    ? `Explore the best ${category.name} tools and products.`
    : "Explore tools by category.";
  return { title, description };
}

export default function CategoryPage({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return notFound();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-6">
        Browse AI tools under <strong>{category.name}</strong>.
      </p>

      {/* Quick switcher */}
      <div className="mb-8">
        <CategoryFilter />
      </div>

      {/* Replace with your real listing */}
      <section className="rounded-2xl border p-6 bg-background">
        <h2 className="text-xl font-semibold mb-3">Featured in {category.name}</h2>
        <p className="text-sm text-muted-foreground">
          (Placeholder) Add your <code>ToolsGrid</code> or other listings here.
        </p>
      </section>
    </main>
  );
}
