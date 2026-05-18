import type { LegalOperator } from "@/lib/legal/cms-types";
import type { LegalSiteInfo } from "@/lib/legal/site-legal";

export function operatorToSiteInfo(op: LegalOperator): LegalSiteInfo {
  const addressLines = [op.addressLine1, op.addressLine2]
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    brand: op.brand.trim() || "OrzuIT",
    company: op.company.trim() || "OrzuIT",
    representative: op.representative.trim() || null,
    addressLines,
    email: op.email.trim() || "kontakt@orzuit.de",
    phone: op.phone.trim() || null,
    vatId: op.vatId.trim() || null,
    registerCourt: op.registerCourt.trim() || null,
    registerNumber: op.registerNumber.trim() || null,
  };
}
