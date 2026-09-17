import { z } from "zod";

export const idSchema = z.string().cuid();

// ─── Product ──────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  slug:         z.string().min(1).max(100),
  name:         z.string().min(1).max(200),
  categoryId:   z.string().min(1),
  model:        z.string().optional(),
  spec:         z.string().optional(),
  description:  z.string().optional(),
  image:        z.string().min(1),
  images:       z.array(z.string().trim().min(1)).max(10).default([]),
  imageAlt:     z.string().optional(),
  features:     z.array(z.string()).default([]),
  published:    z.boolean().default(true),
  technicalSpecs: z.array(z.object({
    label: z.string(),
    value: z.string(),
    order: z.number().int().default(0),
  })).default([]),
});

export const categorySchema = z.object({
  slug:        z.string().min(1).max(100),
  name:        z.string().min(1).max(200),
  description: z.string().optional(),
  image:       z.string().optional(),
  order:       z.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Use the schema input type so fields with defaults (including `images`) can
// still be omitted by older internal callers. Parsed data always has defaults.
export type ProductInput = z.input<typeof productSchema>;

// ─── News article ─────────────────────────────────────────────────────────────
export const newsSchema = z.object({
  slug:        z.string().min(1).max(100),
  title:       z.string().min(1).max(300),
  excerpt:     z.string().min(1).max(500),
  content:     z.string().optional(),
  image:       z.string().min(1),
  imageAlt:    z.string().optional(),
  category:    z.string().min(1),
  readingTime: z.number().int().positive().optional(),
  published:   z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
});

export type NewsInput = z.infer<typeof newsSchema>;

// ─── Contact form (public) ────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
  company: z.string().max(200).optional(),
  email:   z.string().email("Email không hợp lệ"),
  phone:   z.string().max(20).optional(),
  subject: z.string().min(1, "Vui lòng chọn chủ đề"),
  message: z.string().min(10, "Nội dung tối thiểu 10 ký tự").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Contact status update (admin) ───────────────────────────────────────────
export const contactStatusSchema = z.object({
  id:     z.string().cuid(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
});
