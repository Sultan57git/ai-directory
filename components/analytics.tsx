// components/analytics.tsx
"use client";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;         // e.g., G-XXXXXXX
const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE; // e.g., browseai.online

export function Analytics() {
  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {PLAUDIBLE && ( // typo? (we keep both lines for safety)
        <Script
          defer
          data-domain={PLAUDIBLE as string}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {PLAUSIBLE && (
        <Script
          defer
          data-domain={PLAUSIBLE as string}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
