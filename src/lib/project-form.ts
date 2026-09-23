import type { ProjectInput } from "@/lib/validations";
import { PROJECT_IMAGE_PLACEHOLDER } from "@/components/admin/projects/ProjectFormFields";

function optionalText(value: FormDataEntryValue | null): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? undefined : text;
}

// Form admin gửi lên dạng chuỗi; chuyển về đúng kiểu mà projectSchema mong đợi.
export function projectInputFromForm(formData: FormData): ProjectInput {
  const name = (formData.get("name") as string) ?? "";
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const year = Number(formData.get("year"));

  return {
    slug,
    name: name.trim(),
    location: optionalText(formData.get("location")),
    client: optionalText(formData.get("client")),
    year: Number.isFinite(year) && year > 0 ? year : undefined,
    summary: optionalText(formData.get("summary")),
    description: optionalText(formData.get("description")),
    image: optionalText(formData.get("image")) ?? PROJECT_IMAGE_PLACEHOLDER,
    imageAlt: optionalText(formData.get("imageAlt")),
    scope: ((formData.get("scope") as string) ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""),
    // Checkbox không gửi gì khi bỏ tick, nên vắng mặt nghĩa là chưa xuất bản.
    published: formData.get("published") !== null,
  };
}
