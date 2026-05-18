import { z } from "zod";

const legalBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().max(12000) }),
  z.object({
    type: z.literal("ul"),
    items: z.array(z.string().max(2000)).max(60),
  }),
  z.object({
    type: z.literal("contact"),
    lines: z.array(z.string().max(500)).max(30),
  }),
]);

export const legalSectionSchema = z.object({
  id: z
    .string()
    .max(80)
    .regex(/^[a-z0-9-]+$/, "ID: nur Kleinbuchstaben, Ziffern und Bindestrich"),
  title: z.string().max(400),
  blocks: z.array(legalBlockSchema).max(40),
});

const legalOperatorSchema = z.object({
  brand: z.string().max(120),
  company: z.string().max(200),
  representative: z.string().max(200),
  addressLine1: z.string().max(300),
  addressLine2: z.string().max(300),
  email: z.string().max(200),
  phone: z.string().max(80),
  vatId: z.string().max(80),
  registerCourt: z.string().max(200),
  registerNumber: z.string().max(80),
});

const legalPageSchema = z.object({
  title: z.string().max(200),
  intro: z.string().max(4000),
  metaDescription: z.string().max(500),
  showUpdatedLabel: z.boolean(),
  sections: z.array(legalSectionSchema).max(40),
});

export const legalContentSchema = z.object({
  operator: legalOperatorSchema,
  impressum: legalPageSchema,
  datenschutz: legalPageSchema,
});
