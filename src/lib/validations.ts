import { z } from "zod";

export const idSchema = z.string().cuid();

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang");

function isAllowedImageSource(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const imageSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(isAllowedImageSource, "Ảnh phải là đường dẫn nội bộ hoặc URL HTTPS hợp lệ");

// ─── Product ──────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  slug:         slugSchema,
  name:         z.string().min(1).max(200),
  categoryId:   z.string().min(1),
  model:        z.string().max(200).optional(),
  spec:         z.string().max(2000).optional(),
  description:  z.string().max(10_000).optional(),
  image:        imageSourceSchema,
  images:       z.array(imageSourceSchema).max(10).default([]),
  imageAlt:     z.string().max(300).optional(),
  features:     z.array(z.string().min(1).max(500)).max(30).default([]),
  published:    z.boolean().default(true),
  technicalSpecs: z.array(z.object({
    label: z.string().min(1).max(200),
    value: z.string().min(1).max(1000),
    order: z.number().int().default(0),
  })).default([]),
});

export const categorySchema = z.object({
  slug:        slugSchema,
  name:        z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  image:       z.union([imageSourceSchema, z.literal("")]).optional(),
  order:       z.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Use the schema input type so fields with defaults (including `images`) can
// still be omitted by older internal callers. Parsed data always has defaults.
export type ProductInput = z.input<typeof productSchema>;

// ─── News article ─────────────────────────────────────────────────────────────
export const newsSchema = z.object({
  slug:        slugSchema,
  title:       z.string().min(1).max(300),
  excerpt:     z.string().min(1).max(500),
  content:     z.string().max(200_000).optional(),
  image:       imageSourceSchema,
  imageAlt:    z.string().max(300).optional(),
  category:    z.string().min(1).max(100),
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
  subject: z.string().min(1, "Vui lòng chọn chủ đề").max(200),
  message: z.string().min(10, "Nội dung tối thiểu 10 ký tự").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Contact status update (admin) ───────────────────────────────────────────
export const contactStatusSchema = z.object({
  id:     z.string().cuid(),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
});
