import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(20).max(8000),
  privacyAccepted: z
    .boolean()
    .refine((v) => v === true, "Bitte bestätigen Sie die Datenschutzhinweise."),
  source: z.string().max(64).default("website"),
});

export type LeadInput = z.infer<typeof leadSchema>;
