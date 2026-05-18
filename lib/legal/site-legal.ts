import { getLegalContent } from "@/lib/legal/cms";
import { operatorToSiteInfo } from "@/lib/legal/operator";

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

/** @deprecated Use getLegalContent() — kept for legacy imports */
export async function getLegalSiteInfo(): Promise<LegalSiteInfo> {
  const legal = await getLegalContent();
  return operatorToSiteInfo(legal.operator);
}
