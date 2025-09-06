// components/skip-to-content.tsx
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-white text-black px-3 py-2 rounded-lg shadow"
    >
      Skip to content
    </a>
  );
}
