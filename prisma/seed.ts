import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── Admin user ─────────────────────────────────────────────────────────────
  const password = process.env.ADMIN_SEED_PASSWORD ?? "admin123456";
  const hashedPassword = await hash(password, 12);
  await db.admin.upsert({
    where: { email: "admin@fuelprecision.vn" },
    update: {},
    create: {
      email: "admin@fuelprecision.vn",
      password: hashedPassword,
      name: "FuelPrecision Admin",
    },
  });
  console.log("Admin user created -> admin@fuelprecision.vn / " + password);

  // ── Categories ───────────────────────────────────────────────────────────
  const categoriesData = [
    { slug: "may-bom", name: "May bom", description: "May bom chuyen nhien lieu cong nghiep", order: 0 },
    { slug: "dong-ho-do-luu-luong", name: "Dong ho do", description: "Dong ho do luu luong nhien lieu", order: 1 },
    { slug: "voi-bom-tu-dong", name: "Voi bom", description: "Voi bom tu dong phan phoi nhien lieu", order: 2 },
    { slug: "he-thong-bon-chua", name: "He thong bon chua", description: "Bon chua ngam va tren mat dat", order: 3 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const category = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, category.id);
  }
  console.log(categoriesData.length + " categories seeded");

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "may-bom-chuyen-tai-fp500x",
      name: "May Bom Chuyen Nhien Lieu Luu Luong Cao",
      categorySlug: "may-bom",
      model: "FP-500X",
      spec: "500 L/min",
      description:
        "May bom canh gat quay chiu tai nang duoc thiet ke de chuyen nhien lieu voi luu luong cao va ap suat on dinh.",
      image: "/images/products/pump-fp500x.svg",
      features: [
        "Luu luong toi da 500 L/phut",
        "Ap suat lam viec len den 10 bar",
        "Vo bang gang duc chong an mon",
        "Phu hop voi xang, dau diesel va dau nhon",
        "Bao hanh 24 thang",
      ],
      technicalSpecs: [
        { label: "Luu luong", value: "500 L/min", order: 0 },
        { label: "Ap suat toi da", value: "10 bar", order: 1 },
        { label: "Dien ap", value: "220V / 380V", order: 2 },
        { label: "Cong suat", value: "2.2 kW", order: 3 },
        { label: "Ket noi", value: "DN50", order: 4 },
        { label: "Trong luong", value: "18 kg", order: 5 },
      ],
    },
    {
      slug: "dong-ho-do-luu-luong-fm-digital",
      name: "Dong Ho Do Luu Luong Ky Thuat So",
      categorySlug: "dong-ho-do-luu-luong",
      model: "FM-Digital-Pro",
      spec: "Do chinh xac 0.5%",
      description:
        "Dong ho do luu luong banh rang hinh bau duc do chinh xac cao, phu hop he thong phan phoi nhien lieu cong nghiep.",
      image: "/images/products/flowmeter-fm-digital.svg",
      features: [
        "Do chinh xac +/-0.5% toan thang do",
        "Man hinh LCD hien thi tuc thi",
        "Tong ket luu luong tich luy",
        "Dau ra xung 4-20mA",
        "Cap bao ve IP65",
      ],
      technicalSpecs: [
        { label: "Do chinh xac", value: "+/-0.5%", order: 0 },
        { label: "Pham vi do", value: "10-500 L/min", order: 1 },
        { label: "Ap suat toi da", value: "16 bar", order: 2 },
        { label: "Nhiet do moi truong", value: "-20C den +60C", order: 3 },
        { label: "Ket noi", value: "DN25 / DN40", order: 4 },
        { label: "Nguon dien", value: "9-36V DC", order: 5 },
      ],
    },
    {
      slug: "voi-phun-tu-dong-nzl-auto",
      name: "Voi Bom Tu Dong",
      categorySlug: "voi-bom-tu-dong",
      model: "NZL-Auto-1",
      spec: "Thiet ke cong thai hoc",
      description:
        "Voi tu dong ngat cho viec phan phoi nhien lieu khoi luong lon, an toan va tien loi cho van hanh lien tuc.",
      image: "/images/products/nozzle-auto.svg",
      features: [
        "Tu dong ngat khi binh day",
        "Khoa an toan khi khong su dung",
        "Tay cam chong tron truot",
        "Vong kin chong ro ri kep",
        "Tuong thich voi xang va diesel",
      ],
      technicalSpecs: [
        { label: "Luu luong toi da", value: "80 L/min", order: 0 },
        { label: "Ap suat toi da", value: "3.5 bar", order: 1 },
        { label: "Ket noi", value: "3/4\" BSP", order: 2 },
        { label: "Vat lieu than", value: "Hop kim nhom", order: 3 },
        { label: "Trong luong", value: "0.85 kg", order: 4 },
        { label: "Nhiet do", value: "-20C den +50C", order: 5 },
      ],
    },
    {
      slug: "bon-chua-ngam-doi-vach-ust-3000",
      name: "Bon Chua Ngam Doi Vach",
      categorySlug: "he-thong-bon-chua",
      model: "UST-3000",
      spec: "Dung tich 30.000 L",
      description:
        "Bon chua ngam doi vach thep-soi thuy tinh voi he thong phat hien ro ri lien tuc, dap ung tieu chuan moi truong quoc te.",
      image: "/images/products/ust-3000.svg",
      features: [
        "Vach kep thep - composite soi thuy tinh",
        "He thong phat hien ro ri dien tu tich hop",
        "Bao ve catot chong an mon",
        "Mieng tham chong tran",
        "Chung nhan UL 1316 & EN 13160",
      ],
      technicalSpecs: [
        { label: "Dung tich", value: "30.000 L", order: 0 },
        { label: "Duong kinh", value: "2.500 mm", order: 1 },
        { label: "Chieu dai", value: "6.200 mm", order: 2 },
        { label: "Ap suat thu", value: "0.05 bar", order: 3 },
        { label: "Vat lieu", value: "Thep & GRP", order: 4 },
        { label: "Tuoi tho", value: ">30 nam", order: 5 },
      ],
    },
    {
      slug: "may-bom-ly-tam-fp-centri",
      name: "May Bom Ly Tam Cong Suat Cao",
      categorySlug: "may-bom",
      model: "FP-Centri-55",
      spec: "Cot ap 55m",
      description:
        "May bom ly tam truc ngang danh cho he thong van chuyen nhien lieu duong ong dai, hieu suat cao va do ben vuot troi.",
      image: "/images/products/pump-centri.svg",
      features: [
        "Cot ap toi da 55 met",
        "Luu luong 200-800 L/phut",
        "Hieu suat thuy luc >82%",
        "Truc bom o bi kep tu boi tron",
        "Vo bom thep khong gi 316L",
      ],
      technicalSpecs: [
        { label: "Luu luong", value: "200-800 L/min", order: 0 },
        { label: "Cot ap", value: "55 m", order: 1 },
        { label: "Cong suat", value: "11 kW", order: 2 },
        { label: "Toc do", value: "1450 rpm", order: 3 },
        { label: "Ket noi", value: "DN80", order: 4 },
        { label: "Trong luong", value: "45 kg", order: 5 },
      ],
    },
    {
      slug: "bo-dieu-khien-phan-phoi-fp-ctrl",
      name: "Bo Dieu Khien Phan Phoi Thong Minh",
      categorySlug: "dong-ho-do-luu-luong",
      model: "FP-CTRL-Pro",
      spec: "Ket noi IoT",
      description:
        "Bo dieu khien phan phoi nhien lieu tich hop man hinh cam ung, ket noi IoT va quan ly ton kho thoi gian thuc.",
      image: "/images/products/controller-fp-ctrl.svg",
      features: [
        "Man hinh cam ung 7\" HD",
        "Ket noi 4G/Wi-Fi/Ethernet",
        "Quan ly nhieu voi phun dong thoi",
        "Xuat du lieu CSV/Excel",
        "Tich hop he thong ERP/POS",
      ],
      technicalSpecs: [
        { label: "Man hinh", value: "7\" 1024x600", order: 0 },
        { label: "CPU", value: "ARM Cortex-A7", order: 1 },
        { label: "Ket noi", value: "4G / Wi-Fi / ETH", order: 2 },
        { label: "Nguon dien", value: "110-240V AC", order: 3 },
        { label: "Cap bao ve", value: "IP54", order: 4 },
        { label: "Nhiet do", value: "-10C den +55C", order: 5 },
      ],
    },
  ];

  for (const p of products) {
    const { technicalSpecs, categorySlug, ...productData } = p;
    const categoryId = categoryMap.get(categorySlug)!;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        categoryId,
        technicalSpecs: { create: technicalSpecs },
      },
    });
  }
  console.log(products.length + " products seeded");

  // ── News articles ──────────────────────────────────────────────────────────
  const articles = [
    {
      slug: "fuelprecision-ra-mat-may-bom-fp800-ultra",
      title: "FuelPrecision Ra Mat Dong May Bom FP-800 Ultra: Hieu Suat Vuot Troi Cho Ha Tang Hien Dai",
      excerpt:
        "Dong may bom FP-800 Ultra moi nhat cua chung toi mang den cong nghe tien tien voi luu luong 800 L/phut va hieu suat vuot troi.",
      category: "San pham moi",
      image: "/images/news/fp800-launch.svg",
      readingTime: 4,
      publishedAt: new Date("2024-11-15"),
    },
    {
      slug: "fuelprecision-dat-chung-nhan-iso-9001-2024",
      title: "FuelPrecision Dat Chung Nhan ISO 9001:2015 Trong Ky Danh Gia Tai Chung Nhan Nam 2024",
      excerpt:
        "Sau qua trinh kiem dinh nghiem ngat, he thong quan ly chat luong cua FuelPrecision tiep tuc duoc cong nhan dat chuan quoc te ISO 9001:2015.",
      category: "Tin cong ty",
      image: "/images/news/iso-certification.svg",
      readingTime: 3,
      publishedAt: new Date("2024-10-28"),
    },
    {
      slug: "xu-huong-he-thong-nhien-lieu-thong-minh-2025",
      title: "Xu Huong He Thong Nhien Lieu Thong Minh Nam 2025: IoT va Tu Dong Hoa Dan Dat Nganh",
      excerpt:
        "Cac giai phap giam sat ton kho thoi gian thuc, dieu khien tu xa va tich hop ERP dang dinh hinh lai cach cac doanh nghiep quan ly ha tang nhien lieu.",
      category: "Kien thuc nganh",
      image: "/images/news/smart-fuel-trends.svg",
      readingTime: 6,
      publishedAt: new Date("2024-10-10"),
    },
    {
      slug: "du-an-trien-khai-he-thong-nhien-lieu-cang-hai-phong",
      title: "FuelPrecision Hoan Thanh Du An Trien Khai He Thong Nhien Lieu Tai Cang Hai Phong",
      excerpt:
        "Du an lap dat he thong phan phoi nhien lieu tu dong quy mo lon tai Cang Container Quoc te Hai Phong da duoc hoan thanh dung tien do.",
      category: "Du an noi bat",
      image: "/images/news/haiphong-port.svg",
      readingTime: 5,
      publishedAt: new Date("2024-09-20"),
    },
    {
      slug: "huong-dan-bao-tri-may-bom-nhien-lieu-cong-nghiep",
      title: "Huong Dan Bao Tri May Bom Nhien Lieu Cong Nghiep: Keo Dai Tuoi Tho Thiet Bi",
      excerpt:
        "Cac quy trinh bao tri dinh ky dung cach giup keo dai tuoi tho may bom len den 30%, giam thieu thoi gian dung may.",
      category: "Kien thuc nganh",
      image: "/images/news/pump-maintenance.svg",
      readingTime: 7,
      publishedAt: new Date("2024-09-05"),
    },
    {
      slug: "fuelprecision-tham-gia-vietnam-oil-gas-expo-2024",
      title: "FuelPrecision Tham Gia Vietnam Oil & Gas Expo 2024 Voi Gian Hang Trinh Dien Cong Nghe",
      excerpt:
        "Tai trien lam dau khi lon nhat Viet Nam nam 2024, FuelPrecision trinh bay cac giai phap ha tang nhien lieu the he moi.",
      category: "Su kien",
      image: "/images/news/expo-2024.svg",
      readingTime: 3,
      publishedAt: new Date("2024-08-18"),
    },
  ];

  for (const a of articles) {
    await db.newsArticle.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }
  console.log(articles.length + " news articles seeded");

  // ── Contact requests ───────────────────────────────────────────────────────
  const existing = await db.contactRequest.count();
  if (existing === 0) {
    await db.contactRequest.createMany({
      data: [
        {
          name: "Nguyen Van Minh",
          company: "Tong Cong ty Xang Dau Viet Nam",
          email: "minh.nv@petrolimex.com.vn",
          phone: "+84 91 234 5678",
          subject: "Yeu cau bao gia may bom FP-500X",
          message: "Chung toi can bao gia cho 5 may bom FP-500X de lap dat tai 5 tram xang trong quy 1/2025.",
          status: "NEW",
        },
        {
          name: "Tran Thi Lan",
          company: "Cong ty CP Dau khi Hai Phong",
          email: "lan.tt@haiphongoil.vn",
          phone: "+84 90 876 5432",
          subject: "Ho tro ky thuat dong ho do FM-Digital",
          message: "Dong ho do FM-Digital-Pro lap thang truoc hien thi sai so do. Can ky thuat vien ho tro kiem tra.",
          status: "IN_PROGRESS",
        },
        {
          name: "Le Hoang Nam",
          company: "Cang Hang khong Quoc te Noi Bai",
          email: "nam.lh@noi-bai.vn",
          phone: "+84 98 765 4321",
          subject: "Du an he thong nhien lieu hang khong",
          message: "Chung toi dang lap ke hoach nang cap he thong cap nhien lieu cho toan bo nha ga.",
          status: "NEW",
        },
        {
          name: "Pham Duc Thinh",
          company: "Nha may nhiet dien Pha Lai",
          email: "thinh.pd@phalaiplant.vn",
          phone: "+84 97 654 3210",
          subject: "Bao gia bon chua UST-3000",
          message: "Can bao gia 3 bon chua ngam UST-3000 cho du an mo rong nha may.",
          status: "RESOLVED",
        },
        {
          name: "Hoang Thi Mai",
          company: "Tap doan TH Group",
          email: "mai.ht@thgroup.vn",
          phone: "+84 93 456 7890",
          subject: "Hop tac phan phoi thiet bi",
          message: "TH Group muon tro thanh doi tac phan phoi san pham FuelPrecision tai khu vuc mien Trung.",
          status: "IN_PROGRESS",
        },
      ],
    });
    console.log("5 contact requests seeded");
  }

  console.log("\nSeed complete!");
  console.log("Admin login: admin@fuelprecision.vn / " + password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
