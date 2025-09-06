// app/page.tsx
import { Hero } from "@/components/hero";
import { FeaturedTools } from "@/components/featured-tools";
import CategoryFilter from "@/components/CategoryFilter";
import { ToolsGrid } from "@/components/tools-grid";
import { Stats } from "@/components/stats";
import { Newsletter } from "@/components/newsletter";
import { AIRecommendations } from "@/components/ai-recommendations";
import { SeoJsonLd } from "@/components/seo-jsonld";

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      {/* Organization JSON-LD */}
      {/* @ts-ignore */}
      <SeoJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BrowseAI Online",
          url: "https://browseai.online",
          logo: "https://browseai.online/icon.svg",
          sameAs: ["https://twitter.com/browseai_online"],
        }}
      />

      {/* Header removed here; it's already in app/layout.tsx */}

      <section className="border-b">
        <Hero />
      </section>

      <section className="container mx-auto px-4 py-12">
        <Stats />
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-12">
            <CategoryFilter />
            <FeaturedTools />
            <ToolsGrid />
          </div>
          <aside className="space-y-6">
            <AIRecommendations />
          </aside>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
