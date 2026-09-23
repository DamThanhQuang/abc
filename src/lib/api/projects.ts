import { db } from "@/lib/db";
import type { Project } from "@/types/project";

export async function getProjects(
  options: { limit?: number } = {},
): Promise<Project[]> {
  const projects = await db.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    ...(options.limit === undefined ? {} : { take: options.limit }),
  });
  return projects as unknown as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const project = await db.project.findUnique({ where: { id } });
  return project as unknown as Project | null;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
// Cố ý không lọc published: trang quản trị phải thấy cả bản nháp. Không gọi hàm
// này từ route công khai.
export async function listProjectsForAdmin(): Promise<Project[]> {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return projects as unknown as Project[];
}
