import { z } from "zod";

export const pageStatusSchema = z.enum(["draft", "published", "scheduled"]);
export const pageTemplateSchema = z.enum(["landing", "legal", "blank"]);
export const pageLocaleSchema = z.enum(["de", "en"]);

export const pageRowSchema = z.object({
  id: z.string().min(1).max(64),
  parent_id: z.string().max(64).nullable(),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: nur klein, Zahlen und Bindestriche"),
  title_de: z.string().min(1).max(300),
  title_en: z.string().max(300).nullable(),
  locale: pageLocaleSchema,
  status: pageStatusSchema,
  template: pageTemplateSchema,
  excerpt_de: z.string().max(1000).nullable(),
  body_de: z.string().max(40000).nullable(),
  meta_description_de: z.string().max(500).nullable(),
  seo_title: z.string().max(160).nullable().optional(),
  seo_description: z.string().max(500).nullable().optional(),
  canonical_url: z.string().max(1000).nullable().optional(),
  robots_index: z.boolean().optional(),
  schema_json: z.record(z.string(), z.unknown()).optional(),
  og_image_url: z.string().max(1000).nullable().optional(),
  og_generated_prompt: z.string().max(1000).nullable().optional(),
  sitemap_enabled: z.boolean().optional(),
  scheduled_at: z.string().max(80).nullable(),
  sort_order: z.number().int().min(-9999).max(9999),
});

export const pageCreateSchema = pageRowSchema.omit({ id: true });
