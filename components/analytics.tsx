// components/analytics.tsx
"use client";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;          // e.g., G-XXXXXXX
const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE;  // e.g., browseai.online

export function Analytics() {
  return (
    <>
      {/* Google Analytics */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
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

      {/* Plausible Analytics */}
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
