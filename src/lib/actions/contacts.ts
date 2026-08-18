"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactSchema, contactStatusSchema } from "@/lib/validations";
import type { ContactInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string };

// ─── Public: submit contact form ──────────────────────────────────────────────
export async function submitContact(data: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await db.contactRequest.create({ data: parsed.data });

    // Send notification email (optional — requires RESEND_API_KEY)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    "FuelPrecision <no-reply@fuelprecision.vn>",
        to:      process.env.ADMIN_EMAIL ?? "admin@fuelprecision.vn",
        subject: `[Yêu cầu mới] ${parsed.data.subject}`,
        text:    `Từ: ${parsed.data.name} <${parsed.data.email}>\nCông ty: ${parsed.data.company ?? "—"}\n\n${parsed.data.message}`,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("submitContact:", err);
    return { success: false, error: "Không thể gửi yêu cầu. Vui lòng thử lại." };
  }
}

// ─── Admin: update contact status ─────────────────────────────────────────────
export async function updateContactStatus(id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED"): Promise<ActionResult> {
  const parsed = contactStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: "Dữ liệu không hợp lệ." };

  try {
    await db.contactRequest.update({
      where: { id: parsed.data.id },
      data:  { status: parsed.data.status },
    });
    revalidatePath("/admin/yeu-cau");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("updateContactStatus:", err);
    return { success: false, error: "Không thể cập nhật trạng thái." };
  }
}

// ─── Admin: delete contact ────────────────────────────────────────────────────
export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    await db.contactRequest.delete({ where: { id } });
    revalidatePath("/admin/yeu-cau");
    return { success: true };
  } catch (err) {
    console.error("deleteContact:", err);
    return { success: false, error: "Không thể xóa yêu cầu." };
  }
}
