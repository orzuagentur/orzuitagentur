import { DEFAULT_MARKETING } from "@/lib/cms/defaults";
import { cloneMarketingDefault } from "@/lib/cms/merge";
import type { LegalContent, LegalOperator } from "@/lib/legal/cms-types";
import { buildDatenschutzSections } from "@/lib/legal/datenschutz-content";
import { buildImpressumSections } from "@/lib/legal/impressum-content";
import { operatorToSiteInfo } from "@/lib/legal/operator";

export const DEFAULT_LEGAL_OPERATOR: LegalOperator = {
  brand: "OrzuIT",
  company: "OrzuIT",
  representative: "",
  addressLine1: DEFAULT_MARKETING.footer.locationLine,
  addressLine2: "",
  email: DEFAULT_MARKETING.footer.email,
  phone: "",
  vatId: "",
  registerCourt: "",
  registerNumber: "",
};

function buildDefaultLegalContent(): LegalContent {
  const operator = { ...DEFAULT_LEGAL_OPERATOR };
  const info = operatorToSiteInfo(operator);

  return {
    operator,
    impressum: {
      title: "Impressum",
      intro: `Anbieterkennzeichnung für ${info.brand} gemäß § 5 Telemediengesetz (TMG) und § 18 Medienstaatsvertrag (MStV).`,
      metaDescription:
        "Impressum und Anbieterkennzeichnung gemäß § 5 TMG — OrzuIT.",
      showUpdatedLabel: false,
      version: "1.0",
      updatedAt: "2026-05-19",
      sections: buildImpressumSections(info),
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      intro: `Informationen zur Verarbeitung personenbezogener Daten beim Besuch dieser Website und bei der Nutzung unseres Kontaktformulars (${info.brand}).`,
      metaDescription:
        "Datenschutzerklärung gemäß DSGVO — Informationen zur Verarbeitung personenbezogener Daten auf der Website von OrzuIT.",
      showUpdatedLabel: true,
      version: "1.0",
      updatedAt: "2026-05-19",
      sections: buildDatenschutzSections(info),
    },
  };
}

export const DEFAULT_LEGAL: LegalContent = buildDefaultLegalContent();

export function cloneLegalDefault(): LegalContent {
  return cloneMarketingDefault(DEFAULT_LEGAL);
}
