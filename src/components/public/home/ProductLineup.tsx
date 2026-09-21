import Link from "next/link";
import {
  ProductImageCarousel,
  type ProductCarouselImage,
} from "@/components/public/home/ProductImageCarousel";

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path
        d="M1 5.5h9M6 1l4.5 4.5L6 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TankGaugeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="17" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 13c1.8-1.9 3 1.9 4.8 0 1.8-1.9 3 1.9 4.8 0 1-1.1 1.7-.6 2.4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 4V2m0 2v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DataBoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="3" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="5.5" y="6" width="11" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.5" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function LedPriceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="17" height="12" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 6h4M12 6h4.5M5.5 9.5h3M11 9.5h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 14.5v5M8 19.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DispenserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 19.5V4a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 12 4v15.5M2.5 19.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="5.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 6.5h2l3 3v6.5a1.75 1.75 0 0 0 3.5 0V11l-1.8-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoftwareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 19h6M11 15.5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 11.5l3-3 2.5 2.5L14 7.5l3 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Solution = {
  readonly name: string;
  readonly tag: string;
  readonly description: string;
  readonly specs: readonly string[];
  readonly icon: React.ReactNode;
};

const SOLUTIONS: readonly Solution[] = [
  {
    name: "ASTC Smart Tank",
    tag: "Đo bồn tự động",
    description:
      "Tủ giám sát bể chứa đọc dữ liệu từ thước đo tự động, hiển thị tồn kho thực tế của từng bể ngay tại trạm trên màn hình cảm ứng.",
    specs: [
      "Mức nhiên liệu và mức nước đáy bể",
      "Nhiệt độ theo từng bể",
      "Thể tích quy đổi theo dung tích bể",
      "Cảnh báo mức cao / thấp và bất thường",
    ],
    icon: <TankGaugeIcon />,
  },
  {
    name: "ASTC BOX Data Controller",
    tag: "Thu nhận dữ liệu cột bơm",
    description:
      "Tủ thu nhận dữ liệu kết nối trực tiếp tới các cột bơm, ghi nhận từng giao dịch và tổng lượng bán của mỗi vòi bơm.",
    specs: [
      "Theo dõi trạng thái kết nối từng vòi",
      "Số lít, đơn giá và số tiền mỗi lần bơm",
      "Tổng lít lũy kế của từng vòi",
      "Cổng LAN để truyền dữ liệu về phần mềm",
    ],
    icon: <DataBoxIcon />,
  },
  {
    name: "Bảng giá xăng dầu LED",
    tag: "Hiển thị đơn giá",
    description:
      "Bảng giá điện tử lắp ngoài trời hiển thị đơn giá từng mặt hàng, cập nhật tập trung thay cho việc thay số bằng tay.",
    specs: [
      "Nhiều dòng theo số mặt hàng của trạm",
      "Chữ số LED độ sáng cao, đọc rõ ban ngày",
      "Cập nhật giá tập trung",
      "Nhiều kích thước theo mặt bằng trạm",
    ],
    icon: <LedPriceIcon />,
  },
  {
    name: "Cột bơm xăng dầu",
    tag: "Thiết bị tại trạm",
    description:
      "Cột bơm phục vụ bán lẻ tại trạm, cấu hình số vòi và mặt hàng theo quy mô từng điểm bán, kết nối được với tủ thu nhận dữ liệu.",
    specs: [
      "Cấu hình một mặt hoặc hai mặt bơm",
      "Nhiều vòi, nhiều loại nhiên liệu",
      "Màn hình hiển thị lít, đơn giá, số tiền",
      "Giao tiếp dữ liệu với hệ thống quản lý",
    ],
    icon: <DispenserIcon />,
  },
  {
    name: "Phần mềm quản lý trạm",
    tag: "Quản lý tập trung",
    description:
      "Lớp phần mềm tổng hợp dữ liệu từ bể chứa và cột bơm về một nơi, phục vụ theo dõi và đối chiếu hoạt động của trạm.",
    specs: [
      "Tổng hợp dữ liệu bể chứa và cột bơm",
      "Báo cáo theo ca và theo mặt hàng",
      "Đối chiếu lượng bán với tồn kho bể",
      "Truy cập từ xa qua kết nối mạng",
    ],
    icon: <SoftwareIcon />,
  },
];

const PRODUCT_GALLERY_IMAGES: readonly ProductCarouselImage[] = [
  {
    src: "/images/home/astc-box-data-controller.png",
    alt: "Tủ ASTC BOX Data Controller hiển thị dữ liệu trạm xăng dầu",
    title: "ASTC BOX Data Controller",
    description:
      "Tủ thu nhận và hiển thị dữ liệu từ các cột bơm, hỗ trợ theo dõi trạng thái kết nối và giao dịch tại trạm.",
  },
  {
    src: "/images/home/astc-box-data-controller-front.png",
    alt: "Mặt trước tủ ASTC BOX Data Controller",
    title: "Giao diện theo dõi tại trạm",
    description:
      "Màn hình tích hợp trên tủ giúp nhân sự vận hành quan sát dữ liệu và trạng thái của từng vòi bơm tại chỗ.",
  },
  {
    src: "/images/home/astc-smart-tank.png",
    alt: "Tủ ASTC Smart Tank hiển thị thông tin bồn chứa",
    title: "ASTC Smart Tank",
    description:
      "Tủ giám sát bể chứa tập trung thông tin mức nhiên liệu, nhiệt độ, thể tích và các cảnh báo vận hành.",
  },
];

function SolutionRow({ solution, order }: { solution: Solution; order: number }) {
  return (
    <li className="group border-b border-border-ui/50 last:border-b-0">
      <div className="flex flex-col gap-4 rounded-card py-6 transition-colors sm:flex-row sm:gap-6 sm:px-4 lg:py-7 group-hover:bg-surface-card">
        <div className="flex shrink-0 items-start gap-4">
          <span
            aria-hidden="true"
            className="pt-1.5 font-heading text-[13px] font-semibold tabular-nums text-brand/40"
          >
            {String(order).padStart(2, "0")}
          </span>
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-card text-brand transition-colors group-hover:bg-white"
          >
            {solution.icon}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h3 className="font-heading text-[18px] font-semibold leading-7 text-content-heading lg:text-[20px]">
              {solution.name}
            </h3>
            <span className="rounded-pill border border-border-tag bg-surface-tag px-2.5 py-0.5 font-sans text-[12px] leading-[18px] text-brand-dark">
              {solution.tag}
            </span>
          </div>

          <p className="mt-2 max-w-2xl font-sans text-[14px] leading-6 text-content-body lg:text-[15px]">
            {solution.description}
          </p>

          <ul className="mt-3 grid gap-y-1.5 sm:grid-cols-2 sm:gap-x-6">
            {solution.specs.map((spec) => (
              <li
                key={spec}
                className="flex items-start gap-2 font-sans text-[13px] leading-5 text-content-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/50"
                />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function ProductLineup() {
  return (
    <section
      id="thiet-bi"
      aria-labelledby="lineup-heading"
      className="bg-white"
    >
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <header className="lg:col-span-4">
            <p className="font-sans text-[13px] uppercase leading-5 tracking-[0.12em] text-brand">
              Giới thiệu
            </p>
            <h2
              id="lineup-heading"
              className="mt-3 font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
            >
              Thiết bị và phần mềm cho trạm xăng dầu
            </h2>
            <p className="mt-4 max-w-md font-sans text-[15px] leading-6 text-content-body lg:text-[16px]">
              Các nhóm sản phẩm đang được giới thiệu, từ giám sát bể chứa và thu
              nhận dữ liệu cột bơm đến hiển thị giá và phần mềm quản lý. Thông
              số kỹ thuật và phạm vi triển khai được xác nhận theo từng dự án.
            </p>
            <Link
              href="/lien-he"
              className="mt-6 inline-flex items-center gap-1 font-sans text-[14px] leading-4 tracking-[0.05em] text-brand-dark transition-colors hover:underline"
            >
              Liên hệ tư vấn cấu hình
              <ArrowIcon />
            </Link>
          </header>

          <ul className="lg:col-span-8">
            {SOLUTIONS.map((solution, index) => (
              <SolutionRow
                key={solution.name}
                solution={solution}
                order={index + 1}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 pb-12 sm:px-6 lg:px-16 lg:pb-20">
        <ProductImageCarousel
          title="Hình ảnh sản phẩm"
          images={PRODUCT_GALLERY_IMAGES}
        />
      </div>
    </section>
  );
}
