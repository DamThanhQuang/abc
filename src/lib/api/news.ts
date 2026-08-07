import type { NewsArticle } from "@/types/news";

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    slug: "fuelprecision-ra-mat-may-bom-fp800-ultra",
    title: "FuelPrecision Ra Mắt Dòng Máy Bơm FP-800 Ultra: Hiệu Suất Vượt Trội Cho Hạ Tầng Hiện Đại",
    excerpt:
      "Dòng máy bơm FP-800 Ultra mới nhất của chúng tôi mang đến công nghệ tiên tiến với lưu lượng 800 L/phút và hiệu suất vượt trội, sẵn sàng đáp ứng nhu cầu công nghiệp quy mô lớn.",
    category: "Sản phẩm mới",
    publishedAt: "2024-11-15",
    readingTime: 4,
    image: "/images/news/fp800-launch.svg",
    imageAlt: "Ra mắt máy bơm FP-800 Ultra",
  },
  {
    id: "2",
    slug: "fuelprecision-dat-chung-nhan-iso-9001-2024",
    title: "FuelPrecision Đạt Chứng Nhận ISO 9001:2015 Trong Kỳ Đánh Giá Tái Chứng Nhận Năm 2024",
    excerpt:
      "Sau quá trình kiểm định nghiêm ngặt, hệ thống quản lý chất lượng của FuelPrecision tiếp tục được công nhận đạt chuẩn quốc tế ISO 9001:2015, khẳng định cam kết chất lượng bền vững.",
    category: "Tin công ty",
    publishedAt: "2024-10-28",
    readingTime: 3,
    image: "/images/news/iso-certification.svg",
    imageAlt: "Chứng nhận ISO 9001:2015",
  },
  {
    id: "3",
    slug: "xu-huong-he-thong-nhien-lieu-thong-minh-2025",
    title: "Xu Hướng Hệ Thống Nhiên Liệu Thông Minh Năm 2025: IoT và Tự Động Hóa Dẫn Dắt Ngành",
    excerpt:
      "Các giải pháp giám sát tồn kho thời gian thực, điều khiển từ xa và tích hợp ERP đang định hình lại cách các doanh nghiệp quản lý hạ tầng nhiên liệu công nghiệp trong năm 2025.",
    category: "Kiến thức ngành",
    publishedAt: "2024-10-10",
    readingTime: 6,
    image: "/images/news/smart-fuel-trends.svg",
    imageAlt: "Xu hướng hệ thống nhiên liệu thông minh",
  },
  {
    id: "4",
    slug: "du-an-trien-khai-he-thong-nhien-lieu-cang-hai-phong",
    title: "FuelPrecision Hoàn Thành Dự Án Triển Khai Hệ Thống Nhiên Liệu Tại Cảng Hải Phòng",
    excerpt:
      "Dự án lắp đặt hệ thống phân phối nhiên liệu tự động quy mô lớn tại Cảng Container Quốc tế Hải Phòng đã được hoàn thành đúng tiến độ, nâng cao đáng kể năng lực tiếp nhận tàu.",
    category: "Dự án nổi bật",
    publishedAt: "2024-09-20",
    readingTime: 5,
    image: "/images/news/haiphong-port.svg",
    imageAlt: "Dự án cảng Hải Phòng",
  },
  {
    id: "5",
    slug: "huong-dan-bao-tri-may-bom-nhien-lieu-cong-nghiep",
    title: "Hướng Dẫn Bảo Trì Máy Bơm Nhiên Liệu Công Nghiệp: Kéo Dài Tuổi Thọ Thiết Bị",
    excerpt:
      "Các quy trình bảo trì định kỳ đúng cách giúp kéo dài tuổi thọ máy bơm lên đến 30%, giảm thiểu thời gian dừng máy và tiết kiệm đáng kể chi phí vận hành cho doanh nghiệp.",
    category: "Kiến thức ngành",
    publishedAt: "2024-09-05",
    readingTime: 7,
    image: "/images/news/pump-maintenance.svg",
    imageAlt: "Bảo trì máy bơm công nghiệp",
  },
  {
    id: "6",
    slug: "fuelprecision-tham-gia-vietnam-oil-gas-expo-2024",
    title: "FuelPrecision Tham Gia Vietnam Oil & Gas Expo 2024 Với Gian Hàng Trình Diễn Công Nghệ",
    excerpt:
      "Tại triển lãm dầu khí lớn nhất Việt Nam năm 2024, FuelPrecision trình bày các giải pháp hạ tầng nhiên liệu thế hệ mới, thu hút sự quan tâm của hơn 200 đối tác tiềm năng.",
    category: "Sự kiện",
    publishedAt: "2024-08-18",
    readingTime: 3,
    image: "/images/news/expo-2024.svg",
    imageAlt: "Vietnam Oil & Gas Expo 2024",
  },
];

export const NEWS_PER_PAGE = 4;

export function getNewsArticles(): NewsArticle[] {
  return NEWS_ARTICLES;
}

export function getNewsArticlesByPage(
  page: number,
): { articles: NewsArticle[]; total: number; totalPages: number } {
  const total = NEWS_ARTICLES.length;
  const totalPages = Math.ceil(total / NEWS_PER_PAGE);
  const start = (page - 1) * NEWS_PER_PAGE;
  return {
    articles: NEWS_ARTICLES.slice(start, start + NEWS_PER_PAGE),
    total,
    totalPages,
  };
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}
