import type { Product } from "@/types/product";

/** Placeholder data — replace with real API/CMS calls */
export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "may-bom-chuyen-tai-fp500x",
    name: "Máy Bơm Chuyển Nhiên Liệu Lưu Lượng Cao",
    category: "Máy bơm",
    categorySlug: "may-bom",
    model: "FP-500X",
    spec: "500 L/min",
    description:
      "Máy bơm cánh gạt quay chịu tải nặng được thiết kế để chuyển nhiên liệu với lưu lượng cao và áp suất ổn định.",
    image: "/images/products/pump-fp500x.svg",
    imageAlt: "Máy bơm chuyển tải dòng chảy cao FP-500X",
    features: [
      "Lưu lượng tối đa 500 L/phút",
      "Áp suất làm việc lên đến 10 bar",
      "Vỏ bằng gang đúc chống ăn mòn",
      "Phù hợp với xăng, dầu diesel và dầu nhờn",
      "Bảo hành 24 tháng",
    ],
    technicalSpecs: [
      { label: "Lưu lượng", value: "500 L/min" },
      { label: "Áp suất tối đa", value: "10 bar" },
      { label: "Điện áp", value: "220V / 380V" },
      { label: "Công suất", value: "2.2 kW" },
      { label: "Kết nối", value: "DN50" },
      { label: "Trọng lượng", value: "18 kg" },
    ],
  },
  {
    id: "2",
    slug: "dong-ho-do-luu-luong-fm-digital",
    name: "Đồng Hồ Đo Lưu Lượng Kỹ Thuật Số",
    category: "Đồng hồ đo",
    categorySlug: "dong-ho-do-luu-luong",
    model: "FM-Digital-Pro",
    spec: "Độ chính xác 0.5%",
    description:
      "Đồng hồ đo lưu lượng bánh răng hình bầu dục độ chính xác cao, phù hợp hệ thống phân phối nhiên liệu công nghiệp.",
    image: "/images/products/flowmeter-fm-digital.svg",
    imageAlt: "Đồng hồ đo lưu lượng kỹ thuật số FM-Digital-Pro",
    features: [
      "Độ chính xác ±0.5% toàn thang đo",
      "Màn hình LCD hiển thị tức thì",
      "Tổng kết lưu lượng tích lũy",
      "Đầu ra xung 4–20mA",
      "Cấp bảo vệ IP65",
    ],
    technicalSpecs: [
      { label: "Độ chính xác", value: "±0.5%" },
      { label: "Phạm vi đo", value: "10–500 L/min" },
      { label: "Áp suất tối đa", value: "16 bar" },
      { label: "Nhiệt độ môi trường", value: "-20°C đến +60°C" },
      { label: "Kết nối", value: "DN25 / DN40" },
      { label: "Nguồn điện", value: "9–36V DC" },
    ],
  },
  {
    id: "3",
    slug: "voi-phun-tu-dong-nzl-auto",
    name: "Vòi Bơm Tự Động",
    category: "Vòi bơm",
    categorySlug: "voi-bom-tu-dong",
    model: "NZL-Auto-1",
    spec: "Thiết kế công thái học",
    description:
      "Vòi tự động ngắt cho việc phân phối nhiên liệu khối lượng lớn, an toàn và tiện lợi cho vận hành liên tục.",
    image: "/images/products/nozzle-auto.svg",
    imageAlt: "Vòi phun tự động NZL-Auto-1",
    features: [
      "Tự động ngắt khi bình đầy",
      "Khóa an toàn khi không sử dụng",
      "Tay cầm chống trơn trượt",
      "Vòng kín chống rò rỉ kép",
      "Tương thích với xăng và diesel",
    ],
    technicalSpecs: [
      { label: "Lưu lượng tối đa", value: "80 L/min" },
      { label: "Áp suất tối đa", value: "3.5 bar" },
      { label: "Kết nối", value: "3/4\" BSP" },
      { label: "Vật liệu thân", value: "Hợp kim nhôm" },
      { label: "Trọng lượng", value: "0.85 kg" },
      { label: "Nhiệt độ", value: "-20°C đến +50°C" },
    ],
  },
  {
    id: "4",
    slug: "bon-chua-ngam-doi-vach-ust-3000",
    name: "Bồn Chứa Ngầm Đôi Vách",
    category: "Hệ thống bồn chứa",
    categorySlug: "he-thong-bon-chua",
    model: "UST-3000",
    spec: "Dung tích 30.000 L",
    description:
      "Bồn chứa ngầm đôi vách thép–sợi thủy tinh với hệ thống phát hiện rò rỉ liên tục, đáp ứng tiêu chuẩn môi trường quốc tế.",
    image: "/images/products/ust-3000.svg",
    imageAlt: "Bồn chứa ngầm đôi vách UST-3000",
    features: [
      "Vách kép thép – composite sợi thủy tinh",
      "Hệ thống phát hiện rò rỉ điện tử tích hợp",
      "Bảo vệ catốt chống ăn mòn",
      "Miệng thăm chống tràn",
      "Chứng nhận UL 1316 & EN 13160",
    ],
    technicalSpecs: [
      { label: "Dung tích", value: "30.000 L" },
      { label: "Đường kính", value: "2.500 mm" },
      { label: "Chiều dài", value: "6.200 mm" },
      { label: "Áp suất thử", value: "0.05 bar" },
      { label: "Vật liệu", value: "Thép & GRP" },
      { label: "Tuổi thọ", value: ">30 năm" },
    ],
  },
  {
    id: "5",
    slug: "may-bom-ly-tam-fp-centri",
    name: "Máy Bơm Ly Tâm Công Suất Cao",
    category: "Máy bơm",
    categorySlug: "may-bom",
    model: "FP-Centri-55",
    spec: "Cột áp 55m",
    description:
      "Máy bơm ly tâm trục ngang dành cho hệ thống vận chuyển nhiên liệu đường ống dài, hiệu suất cao và độ bền vượt trội.",
    image: "/images/products/pump-centri.svg",
    imageAlt: "Máy bơm ly tâm FP-Centri-55",
    features: [
      "Cột áp tối đa 55 mét",
      "Lưu lượng 200–800 L/phút",
      "Hiệu suất thủy lực >82%",
      "Trục bơm ổ bi kép tự bôi trơn",
      "Vỏ bơm thép không gỉ 316L",
    ],
    technicalSpecs: [
      { label: "Lưu lượng", value: "200–800 L/min" },
      { label: "Cột áp", value: "55 m" },
      { label: "Công suất", value: "11 kW" },
      { label: "Tốc độ", value: "1450 rpm" },
      { label: "Kết nối", value: "DN80" },
      { label: "Trọng lượng", value: "45 kg" },
    ],
  },
  {
    id: "6",
    slug: "bo-dieu-khien-phan-phoi-fp-ctrl",
    name: "Bộ Điều Khiển Phân Phối Thông Minh",
    category: "Đồng hồ đo",
    categorySlug: "dong-ho-do-luu-luong",
    model: "FP-CTRL-Pro",
    spec: "Kết nối IoT",
    description:
      "Bộ điều khiển phân phối nhiên liệu tích hợp màn hình cảm ứng, kết nối IoT và quản lý tồn kho thời gian thực.",
    image: "/images/products/controller-fp-ctrl.svg",
    imageAlt: "Bộ điều khiển phân phối thông minh FP-CTRL-Pro",
    features: [
      "Màn hình cảm ứng 7\" HD",
      "Kết nối 4G/Wi-Fi/Ethernet",
      "Quản lý nhiều vòi phun đồng thời",
      "Xuất dữ liệu CSV/Excel",
      "Tích hợp hệ thống ERP/POS",
    ],
    technicalSpecs: [
      { label: "Màn hình", value: "7\" 1024×600" },
      { label: "CPU", value: "ARM Cortex-A7" },
      { label: "Kết nối", value: "4G / Wi-Fi / ETH" },
      { label: "Nguồn điện", value: "110–240V AC" },
      { label: "Cấp bảo vệ", value: "IP54" },
      { label: "Nhiệt độ", value: "-10°C đến +55°C" },
    ],
  },
];

export const PRODUCTS_PER_PAGE = 3;

export type SortOption = "newest" | "oldest" | "name-az" | "name-za";

export type ProductQuery = {
  categorySlug?: string;
  search?: string;
  sort?: string;
};

function applySearch(products: Product[], search?: string): Product[] {
  if (!search?.trim()) return products;
  const q = search.trim().toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.model?.toLowerCase().includes(q) ?? false) ||
      (p.description?.toLowerCase().includes(q) ?? false),
  );
}

function applySort(products: Product[], sort?: string): Product[] {
  const copy = [...products];
  switch (sort as SortOption) {
    case "oldest":  return copy.sort((a, b) => Number(a.id) - Number(b.id));
    case "name-az": return copy.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    case "name-za": return copy.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    default:        return copy.sort((a, b) => Number(b.id) - Number(a.id)); // newest
  }
}

export function getProducts(query: ProductQuery = {}): Product[] {
  let result = PRODUCTS;
  if (query.categorySlug) result = result.filter((p) => p.categorySlug === query.categorySlug);
  result = applySearch(result, query.search);
  result = applySort(result, query.sort);
  return result;
}

export function getProductsByPage(
  page: number,
  query: ProductQuery = {},
): { products: Product[]; total: number; totalPages: number } {
  const all = getProducts(query);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  return {
    products: all.slice(start, start + PRODUCTS_PER_PAGE),
    total,
    totalPages,
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
