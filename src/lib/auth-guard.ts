import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type AdminIdentity = {
  id: string;
  email: string;
};

export type AdminGuardResult =
  | { ok: true; admin: AdminIdentity }
  | { ok: false; error: string };

// Deliberately generic: the caller surfaces this to the client, so it must not
// reveal whether the failure was a missing session, an expired one, or an
// infrastructure error.
const DENIED_MESSAGE = "Bạn không có quyền thực hiện thao tác này.";

/**
 * Gate for every administrative mutation.
 *
 * Server Actions are public HTTP endpoints — the `proxy` matcher only guards
 * navigation to /admin, so it cannot protect an action invoked directly.
 * Call this before touching the database.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return { ok: false, error: DENIED_MESSAGE };
    }

    // A JWT stays valid until it expires, so the token alone proves nothing
    // about the account today. Confirm it still exists on every use.
    const admin = await db.admin.findUnique({
      where: { id: user.id },
      select: { id: true, email: true },
    });

    if (!admin) {
      return { ok: false, error: DENIED_MESSAGE };
    }

    return { ok: true, admin: { id: admin.id, email: admin.email } };
  } catch {
    return { ok: false, error: DENIED_MESSAGE };
  }
}
