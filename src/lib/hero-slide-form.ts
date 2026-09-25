import { HERO_SLIDE_FOCUSES, type HeroSlideFocus, type HeroSlideInput } from "@/lib/validations";

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

// Form admin gửi lên dạng chuỗi; chuyển về đúng kiểu mà heroSlideSchema mong đợi.
export function heroSlideInputFromForm(formData: FormData): HeroSlideInput {
  const focus = text(formData.get("focus"));

  return {
    image: text(formData.get("image")),
    imageAlt: text(formData.get("imageAlt")),
    blurDataUrl: text(formData.get("blurDataUrl")) || null,
    focus: (HERO_SLIDE_FOCUSES as readonly string[]).includes(focus)
      ? (focus as HeroSlideFocus)
      : "right",
    // Checkbox không gửi gì khi bỏ tick, nên vắng mặt nghĩa là đang ẩn.
    published: formData.get("published") !== null,
  };
}
