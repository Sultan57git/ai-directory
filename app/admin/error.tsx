// app/admin/error.tsx
'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-2">Admin panel error</h1>
      <p className="text-muted-foreground mb-6">
        {error.message || 'Something went wrong in the admin area.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl border bg-background hover:bg-muted"
      >
        Retry
      </button>
    </main>
  );
}
