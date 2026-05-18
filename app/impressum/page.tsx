import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { buildImpressumSections } from "@/lib/legal/impressum-content";
import { getLegalSiteInfo } from "@/lib/legal/site-legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 TMG — OrzuIT.",
  robots: { index: true, follow: true },
};

export default async function ImpressumPage() {
  const info = await getLegalSiteInfo();
  const sections = buildImpressumSections(info);

  return (
    <LegalPage
      title="Impressum"
      intro={`Anbieterkennzeichnung für ${info.brand} gemäß § 5 Telemediengesetz (TMG) und § 18 Medienstaatsvertrag (MStV).`}
      sections={sections}
    />
  );
}
