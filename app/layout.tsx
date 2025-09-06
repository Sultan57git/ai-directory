// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://browseai.online"),
  title: {
    default: "BrowseAI Online",
    template: "%s • BrowseAI Online",
  },
  description:
    "Discover and explore AI tools by category on BrowseAI Online. Browse 20+ categories, explore tools, and find the right AI for you.",
  openGraph: {
    title: "BrowseAI Online",
    description:
      "Discover and explore AI tools by category on BrowseAI Online. Browse 20+ categories, explore tools, and find the right AI for you.",
    url: "https://browseai.online",
    siteName: "BrowseAI Online",
    images: ["/opengraph-image"], // auto from app/opengraph-image.tsx
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@browseai_online",
    creator: "@browseai_online",
    images: ["/twitter-image"], // auto from app/twitter-image.tsx
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
