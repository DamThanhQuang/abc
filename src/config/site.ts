// ─── Site metadata ────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "FuelPrecision",
  description: "Giải pháp nhiên liệu chính xác cho hạ tầng hiện đại",
  url: "https://fuelprecision.vn",
} as const;

// ─── Main navigation ──────────────────────────────────────────────────────────

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Trang Chủ",  href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm",   href: "/san-pham" },
  { label: "Tin tức",    href: "/tin-tuc" },
  { label: "Liên hệ",    href: "/lien-he" },
];

// ─── Footer navigation ────────────────────────────────────────────────────────

export type FooterNavColumn = {
  heading: string;
  links: NavItem[];
};

/**
 * Two columns ordered to match Figma:
 *   Col 1 — "Công ty"   (~40px heading, shorter) — left
 *   Col 2 — "Sản phẩm"  (~77px heading, longer)  — right
 */
export const footerNav: FooterNavColumn[] = [
  {
    heading: "Công ty",
    links: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Tin tức",    href: "/tin-tuc" },
      { label: "Liên hệ",    href: "/lien-he" },
    ],
  },
  {
    heading: "Sản phẩm",
    links: [
      { label: "Máy bơm nhiên liệu",    href: "/san-pham?category=may-bom" },
      { label: "Đồng hồ đo lưu lượng",  href: "/san-pham?category=dong-ho-do-luu-luong" },
      { label: "Hệ thống bồn chứa",     href: "/san-pham?category=he-thong-bon-chua" },
      { label: "Vòi bơm tự động",        href: "/san-pham?category=voi-bom-tu-dong" },
    ],
  },
];

export const footerTagline =
  "Kỹ thuật hệ thống nhiên liệu hiệu suất cao cho cơ sở hạ tầng công nghiệp hiện đại.";

export const footerCopyright =
  `© ${new Date().getFullYear()} FuelPrecision Industrial. Đã đăng ký bản quyền.`;
