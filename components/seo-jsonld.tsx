// components/seo-jsonld.tsx
import Script from "next/script";

export function SeoJsonLd({ json }: { json: Record<string, any> }) {
  return (
    <Script
      id={"jsonld-" + (json['@type'] || 'data')}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
