// components/tools-grid.tsx
import Link from "next/link";
import { TOOLS, type Tool } from "@/lib/tools";

type ToolsGridProps = { category?: string };

function filterTools(category?: string): Tool[] {
  if (!category) return TOOLS;
  return TOOLS.filter((t) => t.categories.includes(category));
}

export function ToolsGrid({ category }: ToolsGridProps) {
  const tools = filterTools(category);

  if (tools.length === 0) {
    return (
      <div className="rounded-2xl border p-6">
        <p className="text-sm text-muted-foreground">No tools found in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <div key={t.id} className="rounded-xl border p-4 bg-background">
          <h3 className="text-lg font-semibold">{t.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
          <div className="mt-3">
            <Link href={t.url} target="_blank" className="text-sm underline underline-offset-4">
              Visit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
