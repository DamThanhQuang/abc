export const companyInfo = {
  brandName: "Ánh Sáng Toàn Cầu",
  legalName: "Công ty Cổ phần Sản xuất và Thương mại Ánh Sáng Toàn Cầu",
  taxCode: "0110425439",
  address: "Số 11, ngõ 134 đường Giải Phóng, Phường Phương Liệt, TP Hà Nội, Việt Nam",
  streetAddress: "Số 11, ngõ 134 đường Giải Phóng, Phường Phương Liệt",
  locality: "Hà Nội",
  country: "VN",
  invoiceEmail: "hoadonastc@gmail.com",
} as const;

export const siteConfig = {
  name: companyInfo.brandName,
  description: "Thiết bị và giải pháp cho trạm xăng dầu",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export type FooterNavColumn = {
  heading: string;
  links: NavItem[];
};

export const footerNav: FooterNavColumn[] = [
  {
    heading: "Công ty",
    links: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Tin tức", href: "/tin-tuc" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
  {
    heading: "Sản phẩm",
    links: [
      { label: "Máy bơm nhiên liệu", href: "/san-pham?category=may-bom" },
      { label: "Đồng hồ đo lưu lượng", href: "/san-pham?category=dong-ho-do-luu-luong" },
      { label: "Hệ thống bồn chứa", href: "/san-pham?category=he-thong-bon-chua" },
      { label: "Vòi bơm tự động", href: "/san-pham?category=voi-bom-tu-dong" },
    ],
  },
];

export const footerTagline =
  "Thiết bị và giải pháp phục vụ hoạt động tại trạm xăng dầu.";

export const footerCopyright =
  `© ${new Date().getFullYear()} ${companyInfo.legalName}.`;
