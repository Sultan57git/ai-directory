// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { NavigationHeader } from "@/components/navigation-header";

export const metadata: Metadata = {
  title: "AI Directory",
  description: "Browse AI tools at browseai.online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NavigationHeader /> {/* header renders once, globally */}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
