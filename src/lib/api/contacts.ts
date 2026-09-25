import type { ContactStatus } from "@prisma/client";
import { db } from "@/lib/db";
import type { ContactRequest } from "@/types/contact";

export async function getContacts(
  options: { status?: ContactStatus } = {},
): Promise<ContactRequest[]> {
  const contacts = await db.contactRequest.findMany({
    where: options.status ? { status: options.status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return contacts.map((c) => ({
    ...c,
    status: c.status === "NEW" ? "new" : c.status === "IN_PROGRESS" ? "in-progress" : "resolved",
    createdAt: c.createdAt.toISOString(),
  })) as unknown as ContactRequest[];
}

export async function getContactById(id: string): Promise<ContactRequest | null> {
  const contact = await db.contactRequest.findUnique({ where: { id } });
  if (!contact) return null;
  return {
    ...contact,
    status: contact.status === "NEW" ? "new" : contact.status === "IN_PROGRESS" ? "in-progress" : "resolved",
    createdAt: contact.createdAt.toISOString(),
  } as unknown as ContactRequest;
}

export async function getContactStats() {
  const [total, newCount, inProgressCount, resolvedCount] = await Promise.all([
    db.contactRequest.count(),
    db.contactRequest.count({ where: { status: "NEW" } }),
    db.contactRequest.count({ where: { status: "IN_PROGRESS" } }),
    db.contactRequest.count({ where: { status: "RESOLVED" } }),
  ]);
  return { total, newCount, inProgressCount, resolvedCount };
}
