import { getMarketingContent } from "@/lib/cms/load-public";

export type LegalSiteInfo = {
  brand: string;
  company: string;
  representative: string | null;
  addressLines: string[];
  email: string;
  phone: string | null;
  vatId: string | null;
  registerCourt: string | null;
  registerNumber: string | null;
};

function envOrNull(key: string): string | null {
  const v = process.env[key]?.trim();
  return v ? v : null;
}

export async function getLegalSiteInfo(): Promise<LegalSiteInfo> {
  const marketing = await getMarketingContent();
  const email =
    envOrNull("NEXT_PUBLIC_LEGAL_EMAIL") ?? marketing.footer.email;

  const line1 = envOrNull("NEXT_PUBLIC_LEGAL_ADDRESS_LINE1");
  const line2 = envOrNull("NEXT_PUBLIC_LEGAL_ADDRESS_LINE2");
  const addressLines = [line1, line2].filter((x): x is string => Boolean(x));

  if (addressLines.length === 0) {
    const location = marketing.footer.locationLine?.trim();
    if (location) addressLines.push(location);
  }

  return {
    brand: process.env.NEXT_PUBLIC_LEGAL_BRAND?.trim() || "OrzuIT",
    company: process.env.NEXT_PUBLIC_LEGAL_COMPANY?.trim() || "OrzuIT",
    representative: envOrNull("NEXT_PUBLIC_LEGAL_REPRESENTATIVE"),
    addressLines,
    email,
    phone: envOrNull("NEXT_PUBLIC_LEGAL_PHONE"),
    vatId: envOrNull("NEXT_PUBLIC_LEGAL_VAT_ID"),
    registerCourt: envOrNull("NEXT_PUBLIC_LEGAL_REGISTER_COURT"),
    registerNumber: envOrNull("NEXT_PUBLIC_LEGAL_REGISTER_NUMBER"),
  };
}
