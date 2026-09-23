export type TechnicalSpecInput = {
  label: string;
  value: string;
  order: number;
};

// Trường technicalSpecs đi qua form dưới dạng JSON trong một hidden input, nên
// nội dung của nó là dữ liệu người dùng gửi lên: JSON.parse trần ở đây sẽ ném
// lỗi và làm hỏng cả lần lưu. Hàm này trả về mảng rỗng thay vì ném.
export function parseTechnicalSpecs(
  value: FormDataEntryValue | null,
): TechnicalSpecInput[] {
  if (typeof value !== "string" || value.trim() === "") return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => {
      if (typeof entry !== "object" || entry === null) return null;

      const { label, value: specValue } = entry as Record<string, unknown>;
      if (typeof label !== "string" || typeof specValue !== "string") return null;

      const trimmedLabel = label.trim();
      const trimmedValue = specValue.trim();
      if (trimmedLabel === "" || trimmedValue === "") return null;

      return { label: trimmedLabel, value: trimmedValue };
    })
    .filter((entry): entry is { label: string; value: string } => entry !== null)
    .map((entry, index) => ({ ...entry, order: index }));
}
