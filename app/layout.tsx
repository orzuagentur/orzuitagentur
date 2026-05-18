import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConditionalSiteChrome } from "@/components/layout/conditional-site-chrome";
import { getMarketingContent } from "@/lib/cms/load-public";
import { getSiteUrl } from "@/lib/site/url";
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
  metadataBase: getSiteUrl(),
  title: {
    default: "OrzuIT — Premium IT & KI-Lösungen",
    template: "%s | OrzuIT",
  },
  description:
    "Luxuriöse digitale Erlebnisse, zukunftsweisende Software und KI — OrzuIT entwickelt Ihre Vision mit Präzision und Klarheit.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "OrzuIT",
  },
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
