export type AdminNavItem = {
  label: string;
  href: string;
  icon: "dashboard" | "product" | "category" | "news" | "project" | "request" | "logout";
};

export const adminMainNav: AdminNavItem[] = [
  { label: "Tổng quan",    href: "/admin",            icon: "dashboard" },
  { label: "Danh mục",    href: "/admin/danh-muc",   icon: "category"  },
  { label: "Sản phẩm",    href: "/admin/san-pham",   icon: "product"   },
  { label: "Tin tức",     href: "/admin/tin-tuc",    icon: "news"      },
  { label: "Dự án",       href: "/admin/du-an",      icon: "project"   },
  { label: "Yêu cầu",     href: "/admin/yeu-cau",    icon: "request"   },
];

// Signing out is an action, not a destination, so it is rendered by the sidebar
// as a form rather than listed here. "/admin/cai-dat" was removed: no such route
// exists.
