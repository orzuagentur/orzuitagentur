import { z } from "zod";

const uuidLike = z.string().min(1).max(64);

function normalizeProjectUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme;
}

const projectUrlField = z
  .string()
  .max(500)
  .transform((value) => normalizeProjectUrl(value))
  .pipe(z.union([z.string().url(), z.null()]));

export const serviceRowSchema = z.object({
  id: uuidLike,
  slug: z.string().min(1).max(120),
  title_de: z.string().min(1).max(400),
  description_de: z.string().max(4000).nullable(),
  body_de: z.string().max(20000).nullable(),
  category_de: z.string().max(200).nullable(),
  project_url: projectUrlField,
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const portfolioRowSchema = z.object({
  id: uuidLike,
  slug: z.string().min(1).max(120),
  title_de: z.string().min(1).max(400),
  summary_de: z.string().max(4000).nullable(),
  body_de: z.string().max(20000).nullable(),
  category_de: z.string().max(200).nullable(),
  project_url: projectUrlField,
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const testimonialRowSchema = z.object({
  id: uuidLike,
  quote_de: z.string().min(1).max(4000),
  author_de: z.string().min(1).max(200),
  role_de: z.string().max(200).nullable(),
  org_de: z.string().max(200).nullable(),
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const testimonialCreateSchema = testimonialRowSchema.omit({ id: true });
