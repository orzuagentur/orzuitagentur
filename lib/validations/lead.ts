import { z } from "zod";

const PHONE_RE = /^[\d\s+\-()./]{8,28}$/;

function phoneHasEnoughDigits(value: string) {
  return value.replace(/\D/g, "").length >= 8;
}

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .min(8, "Bitte geben Sie eine gültige Telefonnummer ein.")
    .max(28)
    .refine((v) => PHONE_RE.test(v) && phoneHasEnoughDigits(v), {
      message: "Bitte geben Sie eine gültige Telefonnummer ein.",
    }),
  company: z.string().trim().max(200).optional(),
  serviceInterest: z
    .string()
    .trim()
    .min(1, "Bitte wählen Sie eine Leistung oder ein Thema.")
    .max(200),
  message: z.string().trim().min(20).max(8000),
  privacyAccepted: z
    .boolean()
    .refine((v) => v === true, "Bitte bestätigen Sie die Datenschutzhinweise."),
  source: z.string().max(64).default("website"),
});

export type LeadInput = z.infer<typeof leadSchema>;
