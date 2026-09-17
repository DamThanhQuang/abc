"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { checkRateLimit } from "@/lib/rate-limit";
import { idSchema, contactSchema, contactStatusSchema } from "@/lib/validations";
import type { ContactInput } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string };

const CONTACT_MAX = 5;
const CONTACT_WINDOW_MS = 60_000;

// ─── Public: submit contact form ──────────────────────────────────────────────
export async function submitContact(data: ContactInput): Promise<ActionResult> {
  let ip = "unknown";
  try {
    const hdrs = await headers();
    ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  } catch {
    // headers() throws outside a request scope (e.g., in tests)
  }
  const rl = checkRateLimit(`contact:${ip}`, CONTACT_MAX, CONTACT_WINDOW_MS);
  if (!rl.allowed) {
    return { success: false, error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." };
  }

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

    // A new lead has to show up for the admin immediately.
    revalidatePath("/admin/yeu-cau");
    revalidatePath("/admin");

    return { success: true };
  } catch (err) {
    console.error("submitContact:", err);
    return { success: false, error: "Không thể gửi yêu cầu. Vui lòng thử lại." };
  }
}

// ─── Admin: update contact status ─────────────────────────────────────────────
export async function updateContactStatus(id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED"): Promise<ActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

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
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  if (!idSchema.safeParse(id).success) return { success: false, error: "ID không hợp lệ." };

  try {
    await db.contactRequest.delete({ where: { id } });
    revalidatePath("/admin/yeu-cau");
    return { success: true };
  } catch (err) {
    console.error("deleteContact:", err);
    return { success: false, error: "Không thể xóa yêu cầu." };
  }
}
