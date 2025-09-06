'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className="px-4 py-2 rounded-xl border">Try again</button>
    </main>
  );
}
