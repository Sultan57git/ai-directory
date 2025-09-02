import { NavigationHeader } from "@/components/navigation-header";
import { Hero } from "@/components/hero";
import { FeaturedTools } from "@/components/featured-tools";
import { CategoryFilter } from "@/components/category-filter";
import { ToolsGrid } from "@/components/tools-grid";
import { Stats } from "@/components/stats";
import { Newsletter } from "@/components/newsletter";
import { AIRecommendations } from "@/components/ai-recommendations";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top navigation */}
      <NavigationHeader />

      {/* Hero / landing section */}
      <section className="border-b">
        <Hero />
      </section>

      {/* Stats / metrics */}
      <section className="container mx-auto px-4 py-12">
        <Stats />
      </section>

      {/* Main grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Left: filters + featured + tools */}
          <div className="lg:col-span-3 space-y-12">
            <CategoryFilter />
            <FeaturedTools />
            <ToolsGrid />
          </div>

          {/* Right: AI suggestions */}
          <aside className="space-y-6">
            <AIRecommendations />
          </aside>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Newsletter />
        </div>
      </section>
    </main>
  );
}
