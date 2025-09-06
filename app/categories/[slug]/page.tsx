// app/categories/[slug]/page.tsx
import { notFound } from "next/navigation";
import CATEGORIES from "@/lib/categories";
import CategoryFilter from "@/components/CategoryFilter";
import { ToolsGrid } from "@/components/tools-grid";
import { SeoJsonLd } from "@/components/seo-jsonld";

type Props = { params: { slug: string } };

export const revalidate = 3600;

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
  const { slug } = params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return notFound();

  return (
    <main id="main" className="container mx-auto px-4 py-10">
      {/* @ts-ignore */}
      <SeoJsonLd json={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type":"ListItem","position":1,"name":"Home","item":"https://browseai.online/"},
          {"@type":"ListItem","position":2,"name":"Categories","item":"https://browseai.online/categories"},
          {"@type":"ListItem","position":3,"name": category.name, "item": `https://browseai.online/categories/${category.slug}`}
        ]
      }}/>

      <h1 className="text-3xl font-semibold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-6">
        Browse AI tools under <strong>{category.name}</strong>.
      </p>

      <div className="mb-8">
        <CategoryFilter />
      </div>

      <section className="rounded-2xl border p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Tools in {category.name}</h2>
        <ToolsGrid category={slug} />
      </section>
    </main>
  );
}
