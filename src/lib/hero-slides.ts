import type { HeroSlideFocus } from "@/lib/validations";

export type HeroSlideView = {
  readonly src: string;
  readonly alt: string;
  readonly blurDataUrl?: string | null;
  readonly focus: HeroSlideFocus;
};

// Banner dùng object-cover nên luôn bị cắt theo tỉ lệ màn hình; trên điện thoại
// khung hẹp và cao nên phần hai bên bị cắt nhiều nhất. Nửa trái còn bị chữ và
// gradient che, vì vậy mặc định giữ phần bên phải của ảnh.
// `className` dùng trên trang chủ; `mobile`/`desktop` là cùng vị trí đó dạng
// CSS object-position, để khung xem trước trong admin mô phỏng từng màn hình.
export const HERO_FOCUS_OPTIONS: ReadonlyArray<{
  value: HeroSlideFocus;
  label: string;
  className: string;
  mobile: string;
  desktop: string;
}> = [
  { value: "right",  label: "Lệch phải (khuyến nghị)", className: "object-[68%_center] lg:object-center", mobile: "68% center", desktop: "center" },
  { value: "center", label: "Chính giữa",              className: "object-center",                        mobile: "center",     desktop: "center" },
  { value: "left",   label: "Lệch trái",               className: "object-[32%_center] lg:object-center", mobile: "32% center", desktop: "center" },
];

export function heroFocusOption(focus: HeroSlideFocus) {
  return HERO_FOCUS_OPTIONS.find((option) => option.value === focus) ?? HERO_FOCUS_OPTIONS[0];
}

export function heroFocusClassName(focus: HeroSlideFocus): string {
  return heroFocusOption(focus).className;
}

// Dùng khi chưa có slide nào được xuất bản, để banner không bao giờ trống.
export const FALLBACK_HERO_SLIDES: readonly HeroSlideView[] = [
  {
    src: "/images/hero-fuel-station-clean.png",
    alt: "Trạm xăng dầu được trang bị thiết bị của Ánh Sáng Toàn Cầu",
    focus: "right",
  },
];
