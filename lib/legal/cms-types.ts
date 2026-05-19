import type { LegalSection } from "@/lib/legal/types";

export type LegalOperator = {
  brand: string;
  company: string;
  representative: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  vatId: string;
  registerCourt: string;
  registerNumber: string;
};

export type LegalPageContent = {
  title: string;
  intro: string;
  metaDescription: string;
  showUpdatedLabel: boolean;
  version: string;
  updatedAt: string;
  sections: LegalSection[];
};

export type LegalContent = {
  operator: LegalOperator;
  impressum: LegalPageContent;
  datenschutz: LegalPageContent;
};
