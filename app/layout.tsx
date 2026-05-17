import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConditionalSiteChrome } from "@/components/layout/conditional-site-chrome";
import { getMarketingContent } from "@/lib/cms/load-public";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase:
    process.env.NEXT_PUBLIC_SITE_URL &&
    (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http://") ||
      process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://"))
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : new URL("http://localhost:3000"),
  title: "OrzuIT — Premium IT & KI-Lösungen",
  description:
    "Luxuriöse digitale Erlebnisse, zukunftsweisende Software und KI — OrzuIT entwickelt Ihre Vision mit Präzision und Klarheit.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const marketing = await getMarketingContent();

  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)]">
        <ConditionalSiteChrome nav={marketing.nav} footer={marketing.footer}>
          {children}
        </ConditionalSiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
