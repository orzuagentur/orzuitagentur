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

const imageUrlField = z
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
  image_url: imageUrlField,
  image_alt: z.string().max(300).nullable(),
  icon_name: z.string().max(120).nullable(),
  tags: z.array(z.string().max(80)).max(20),
  cta_label: z.string().max(120).nullable(),
  animation_preset: z.string().max(80).nullable(),
  enable_3d: z.boolean(),
  video_url: imageUrlField,
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const serviceCreateSchema = serviceRowSchema.omit({ id: true });

export const portfolioRowSchema = z.object({
  id: uuidLike,
  slug: z.string().min(1).max(120),
  title_de: z.string().min(1).max(400),
  summary_de: z.string().max(4000).nullable(),
  body_de: z.string().max(20000).nullable(),
  category_de: z.string().max(200).nullable(),
  project_url: projectUrlField,
  image_url: imageUrlField,
  image_alt: z.string().max(300).nullable(),
  icon_name: z.string().max(120).nullable(),
  tags: z.array(z.string().max(80)).max(20),
  cta_label: z.string().max(120).nullable(),
  animation_preset: z.string().max(80).nullable(),
  enable_3d: z.boolean(),
  video_url: imageUrlField,
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const portfolioCreateSchema = portfolioRowSchema.omit({ id: true });

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
