"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { normalizeProductImages, PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/product-images";
import { productSchema, type ProductInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

export async function createProduct(data: ProductInput): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { technicalSpecs, ...productData } = parsed.data;
    const images = normalizeProductImages(productData.images);

    const product = await db.product.create({
      data: {
        ...productData,
        images,
        image: images[0] ?? productData.image ?? PRODUCT_IMAGE_PLACEHOLDER,
        technicalSpecs: {
          create: technicalSpecs,
        },
      },
    });

    revalidatePath("/san-pham");
    revalidatePath("/admin/san-pham");
    revalidatePath("/admin/danh-muc"); // shows a product count per category
    revalidatePath("/admin"); // dashboard totals
    return { success: true, id: product.id };
  } catch (err) {
    console.error("createProduct:", err);
    return { success: false, error: "Không thể tạo sản phẩm." };
  }
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = productSchema.partial().safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { technicalSpecs, ...productData } = parsed.data;
    const images = productData.images === undefined
      ? undefined
      : normalizeProductImages(productData.images);

    await db.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images !== undefined && {
          images,
          image: images[0] ?? productData.image ?? PRODUCT_IMAGE_PLACEHOLDER,
        }),
        ...(technicalSpecs !== undefined && {
          technicalSpecs: {
            deleteMany: {},
            create: technicalSpecs,
          },
        }),
      },
    });

    revalidatePath("/san-pham");
    revalidatePath(`/san-pham/${(await db.product.findUnique({ where: { id }, select: { slug: true } }))?.slug}`);
    revalidatePath("/admin/san-pham");
    revalidatePath("/admin/danh-muc"); // shows a product count per category
    revalidatePath("/admin"); // dashboard totals
    return { success: true };
  } catch (err) {
    console.error("updateProduct:", err);
    return { success: false, error: "Không thể cập nhật sản phẩm." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/san-pham");
    revalidatePath("/admin/san-pham");
    revalidatePath("/admin/danh-muc"); // shows a product count per category
    revalidatePath("/admin"); // dashboard totals
    return { success: true };
  } catch (err) {
    console.error("deleteProduct:", err);
    return { success: false, error: "Không thể xóa sản phẩm." };
  }
}
