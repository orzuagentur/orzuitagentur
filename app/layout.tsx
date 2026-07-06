import type { Metadata } from "next";
import Script from "next/script";
import type { CSSProperties } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteAnalyticsTracker } from "@/components/analytics/site-analytics-tracker";
import { ConditionalSiteChrome } from "@/components/layout/conditional-site-chrome";
import { getMarketingContent } from "@/lib/cms/load-public";
import { getSiteUrl } from "@/lib/site/url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "OrzuIT — Software, KI & Web für wachsende Unternehmen",
    template: "%s | OrzuIT",
  },
  description:
    "Individuelle Software, KI-Automatisierung und moderne Weblösungen: OrzuIT plant, entwickelt und betreibt digitale Produkte mit klarem Nutzen für Ihr Team.",
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
  const designStyle = {
    "--accent": marketing.designSystem.accent,
    "--accent-2": marketing.designSystem.accent2,
    "--foreground": marketing.designSystem.foreground,
    "--background": marketing.designSystem.background,
    "--admin-section-padding": marketing.designSystem.sectionPadding,
    "--admin-radius-preset": marketing.designSystem.radius,
    "--site-card-shadow":
      marketing.designSystem.shadowPreset === "none"
        ? "none"
        : marketing.designSystem.shadowPreset === "deep"
          ? "0 34px 90px -46px rgba(0,0,0,0.96)"
          : marketing.designSystem.shadowPreset === "neon"
            ? "0 0 42px -14px var(--accent-glow)"
            : "0 24px 64px -40px rgba(0,0,0,0.82)",
    "--site-border-strength":
      marketing.designSystem.borderPreset === "none"
        ? "transparent"
        : marketing.designSystem.borderPreset === "strong"
          ? "var(--border-strong)"
          : marketing.designSystem.borderPreset === "accent"
            ? "color-mix(in oklab, var(--accent) 42%, var(--border))"
            : "var(--border)",
  } as CSSProperties;

  return (
    <html
      lang="de"
      className="h-full antialiased"
    >
      <head>
        {marketing.siteAssets.faviconUrl ? (
          <link rel="icon" href={marketing.siteAssets.faviconUrl} />
        ) : null}
        {marketing.siteAssets.appleIconUrl ? (
          <link rel="apple-touch-icon" href={marketing.siteAssets.appleIconUrl} />
        ) : null}
      </head>
      <body
        className="flex min-h-full flex-col bg-[var(--background)]"
        data-typography-scale={marketing.designSystem.typographyScale}
        data-spacing-preset={marketing.designSystem.spacingPreset}
        data-shadow-preset={marketing.designSystem.shadowPreset}
        data-border-preset={marketing.designSystem.borderPreset}
        data-glassmorphism={marketing.designSystem.glassmorphism ? "on" : "off"}
        data-motion-preset={marketing.designSystem.motionPreset}
        data-framer-preset={marketing.designSystem.framerPreset}
        data-parallax={marketing.designSystem.parallaxEnabled ? "on" : "off"}
        data-tilt={marketing.designSystem.tiltEnabled ? "on" : "off"}
        data-glow={marketing.designSystem.glowEnabled ? "on" : "off"}
        data-reduced-motion={marketing.designSystem.reducedMotion ? "on" : "off"}
        data-scroll-reveal={marketing.designSystem.scrollRevealIntensity}
        style={designStyle}
      >
        <ConditionalSiteChrome
          nav={marketing.nav}
          footer={marketing.footer}
          contact={marketing.contact}
        >
          {children}
        </ConditionalSiteChrome>
        <SiteAnalyticsTracker />
        <Analytics />
        <SpeedInsights />
        <Script
          src="https://www.orzux.com/widget/orzu-chat.js"
          data-widget-token="ff4ab3a82c3f77a309c4b84333279bbc23c977bc24348a6c"
          data-site-key="orzu_live_06626623ae309fa9a0ca3c25457212eb567aa045b4af69b7"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
