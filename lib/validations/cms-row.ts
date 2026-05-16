import { z } from "zod";

const uuidLike = z.string().min(1).max(64);

export const serviceRowSchema = z.object({
  id: uuidLike,
  title_de: z.string().min(1).max(400),
  description_de: z.string().max(4000).nullable(),
  sort_order: z.number().int().min(-9999).max(9999),
  published: z.boolean(),
});

export const portfolioRowSchema = z.object({
  id: uuidLike,
  title_de: z.string().min(1).max(400),
  summary_de: z.string().max(4000).nullable(),
  category_de: z.string().max(200).nullable(),
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
