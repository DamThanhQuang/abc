import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ─────────────────────────────────────────────────────────────
  const hashedPassword = await hash("admin123456", 12);
  await db.admin.upsert({
    where:  { email: "admin@fuelprecision.vn" },
    update: {},
    create: {
      email:    "admin@fuelprecision.vn",
      password: hashedPassword,
      name:     "FuelPrecision Admin",
    },
  });
  console.log("✓ Admin user created  →  admin@fuelprecision.vn / admin123456");

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "may-bom-chuyen-tai-fp500x",
      name: "Máy Bơm Chuyển Nhiên Liệu Lưu Lượng Cao",
      category: "Máy bơm", categorySlug: "may-bom",
      model: "FP-500X", spec: "500 L/min",
      description: "Máy bơm cánh gạt quay chịu tải nặng được thiết kế để chuyển nhiên liệu với lưu lượng cao và áp suất ổn định.",
      image: "/images/products/pump-fp500x.svg",
      features: ["Lưu lượng tối đa 500 L/phút", "Áp suất làm việc lên đến 10 bar", "Vỏ bằng gang đúc chống ăn mòn"],
      technicalSpecs: [
        { label: "Lưu lượng", value: "500 L/min", order: 0 },
        { label: "Áp suất tối đa", value: "10 bar", order: 1 },
        { label: "Điện áp", value: "220V / 380V", order: 2 },
        { label: "Công suất", value: "2.2 kW", order: 3 },
      ],
    },
    {
      slug: "dong-ho-do-luu-luong-fm-digital",
      name: "Đồng Hồ Đo Lưu Lượng Kỹ Thuật Số",
      category: "Đồng hồ đo", categorySlug: "dong-ho-do-luu-luong",
      model: "FM-Digital-Pro", spec: "Độ chính xác 0.5%",
      description: "Đồng hồ đo lưu lượng bánh răng hình bầu dục độ chính xác cao.",
      image: "/images/products/flowmeter-fm-digital.svg",
      features: ["Độ chính xác ±0.5% toàn thang đo", "Màn hình LCD hiển thị tức thì"],
      technicalSpecs: [
        { label: "Độ chính xác", value: "±0.5%", order: 0 },
        { label: "Phạm vi đo", value: "10–500 L/min", order: 1 },
      ],
    },
    {
      slug: "voi-phun-tu-dong-nzl-auto",
      name: "Vòi Bơm Tự Động",
      category: "Vòi bơm", categorySlug: "voi-bom-tu-dong",
      model: "NZL-Auto-1", spec: "Thiết kế công thái học",
      description: "Vòi tự động ngắt cho việc phân phối nhiên liệu khối lượng lớn.",
      image: "/images/products/nozzle-auto.svg",
      features: ["Tự động ngắt khi bình đầy", "Khóa an toàn khi không sử dụng"],
      technicalSpecs: [
        { label: "Lưu lượng tối đa", value: "80 L/min", order: 0 },
        { label: "Áp suất tối đa", value: "3.5 bar", order: 1 },
      ],
    },
  ];

  for (const p of products) {
    const { technicalSpecs, ...productData } = p;
    await db.product.upsert({
      where:  { slug: p.slug },
      update: {},
      create: {
        ...productData,
        technicalSpecs: { create: technicalSpecs },
      },
    });
  }
  console.log(`✓ ${products.length} products seeded`);

  // ── News articles ──────────────────────────────────────────────────────────
  const articles = [
    {
      slug: "fuelprecision-ra-mat-may-bom-fp800-ultra",
      title: "FuelPrecision Ra Mắt Dòng Máy Bơm FP-800 Ultra",
      excerpt: "Dòng máy bơm FP-800 Ultra mới nhất mang đến công nghệ tiên tiến với lưu lượng 800 L/phút.",
      category: "Sản phẩm mới",
      image: "/images/news/fp800-launch.svg",
      readingTime: 4,
      publishedAt: new Date("2024-11-15"),
    },
    {
      slug: "fuelprecision-dat-chung-nhan-iso-9001-2024",
      title: "FuelPrecision Đạt Chứng Nhận ISO 9001:2015",
      excerpt: "Hệ thống quản lý chất lượng tiếp tục được công nhận đạt chuẩn quốc tế ISO 9001:2015.",
      category: "Tin công ty",
      image: "/images/news/iso-certification.svg",
      readingTime: 3,
      publishedAt: new Date("2024-10-28"),
    },
  ];

  for (const a of articles) {
    await db.newsArticle.upsert({
      where:  { slug: a.slug },
      update: {},
      create: a,
    });
  }
  console.log(`✓ ${articles.length} news articles seeded`);

  // ── Contact requests ───────────────────────────────────────────────────────
  const existing = await db.contactRequest.count();
  if (existing === 0) {
    await db.contactRequest.createMany({
      data: [
        { name: "Nguyễn Văn Minh", company: "Petrolimex", email: "minh@petrolimex.vn", subject: "Yêu cầu báo giá", message: "Cần báo giá 5 máy bơm FP-500X.", status: "NEW" },
        { name: "Trần Thị Lan",    company: "HP Oil",     email: "lan@hpoil.vn",       subject: "Hỗ trợ kỹ thuật",  message: "Đồng hồ hiển thị sai số.", status: "IN_PROGRESS" },
        { name: "Lê Hoàng Nam",    company: "Nội Bài Airport", email: "nam@noibai.vn", subject: "Dự án lớn",       message: "Nâng cấp hệ thống cấp nhiên liệu.", status: "RESOLVED" },
      ],
    });
    console.log("✓ 3 contact requests seeded");
  }

  console.log("\n✅ Seed complete!");
  console.log("   Admin login: admin@fuelprecision.vn / admin123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
