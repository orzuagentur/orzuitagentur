import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { buildDatenschutzSections } from "@/lib/legal/datenschutz-content";
import { getLegalSiteInfo } from "@/lib/legal/site-legal";

export const metadata: Metadata = {
  title: "Datenschutz",
  description:
    "Datenschutzerklärung gemäß DSGVO — Informationen zur Verarbeitung personenbezogener Daten auf der Website von OrzuIT.",
  robots: { index: true, follow: true },
};

export default async function DatenschutzPage() {
  const info = await getLegalSiteInfo();
  const sections = buildDatenschutzSections(info);
  const updatedLabel = `Stand: ${new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro={`Informationen zur Verarbeitung personenbezogener Daten beim Besuch dieser Website und bei der Nutzung unseres Kontaktformulars (${info.brand}).`}
      sections={sections}
      updatedLabel={updatedLabel}
    />
  );
}
