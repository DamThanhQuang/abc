export type AdminNavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "product" | "news" | "request" | "settings" | "logout";
};

export const adminMainNav: AdminNavItem[] = [
  { label: "Tổng quan",    href: "/admin",            icon: "dashboard" },
  { label: "Sản phẩm",    href: "/admin/san-pham",   icon: "product"   },
  { label: "Tin tức",     href: "/admin/tin-tuc",    icon: "news"      },
  { label: "Yêu cầu",     href: "/admin/yeu-cau",    icon: "request"   },
];

export const adminFooterNav: AdminNavItem[] = [
  { label: "Cài đặt",     href: "/admin/cai-dat",    icon: "settings"  },
  { label: "Đăng xuất",   href: "/dang-nhap",        icon: "logout"    },
];
