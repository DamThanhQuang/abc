import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/public/contact/ContactForm";

export const metadata: Metadata = {
  title: "Liên Hệ | FuelPrecision Industrial",
  description: "Liên hệ với đội ngũ chuyên gia FuelPrecision để được tư vấn giải pháp hệ thống nhiên liệu.",
};

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3h4l2 4.5-2 1.5a11 11 0 0 0 4 4l1.5-2L17 13v4a1 1 0 0 1-1 1A15 15 0 0 1 2 4a1 1 0 0 1 1-1Z" stroke="#0f4c81" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M2 7l8 5 8-5" stroke="#0f4c81" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6Z" stroke="#0f4c81" strokeWidth="1.6" />
      <circle cx="10" cy="8" r="2" stroke="#0f4c81" strokeWidth="1.6" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="#0f4c81" strokeWidth="1.6" />
      <path d="M10 6v4l3 2" stroke="#0f4c81" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CONTACT_INFO = [
  { icon: <PhoneIcon />,   label: "Điện thoại",   value: "+84 24 3856 7890" },
  { icon: <EmailIcon />,   label: "Email",         value: "contact@fuelprecision.vn" },
  { icon: <LocationIcon />,label: "Địa chỉ",       value: "Tầng 8, Tòa nhà FuelPrecision, 120 Hoàng Quốc Việt, Cầu Giấy, Hà Nội" },
  { icon: <ClockIcon />,   label: "Giờ làm việc",  value: "Thứ 2 – Thứ 6: 8:00 – 17:30" },
];

export default function LienHePage() {
  return (
    <>
      <PageHero
        title="Liên Hệ Với Chúng Tôi"
        subtitle="Đội ngũ kỹ thuật và kinh doanh sẵn sàng hỗ trợ bạn trong vòng 24 giờ"
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
      />

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
        {/*
          Mobile:  form first, info card below
          Desktop: 7 + 5 column grid side by side
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Contact form */}
          <div className="lg:col-span-7">
            <h2 className="mb-2 font-heading font-semibold text-[22px] lg:text-[26px] leading-8 text-content-heading">
              Gửi yêu cầu
            </h2>
            <p className="mb-6 lg:mb-8 font-sans text-[14px] lg:text-[15px] leading-6 text-content-muted">
              Điền vào biểu mẫu bên dưới và chúng tôi sẽ phản hồi trong vòng 1–2 ngày làm việc.
            </p>
            <ContactForm />
          </div>

          {/* Company info */}
          <aside className="lg:col-span-5">
            <div className="rounded-card bg-surface-card p-6 lg:p-8 shadow-card">
              <h2 className="mb-5 lg:mb-6 font-heading font-semibold text-[18px] lg:text-[20px] leading-7 text-content-heading">
                Thông tin liên hệ
              </h2>

              <ul className="flex flex-col gap-5 lg:gap-6">
                {CONTACT_INFO.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 lg:gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white shadow-card">
                      {item.icon}
                    </span>
                    <div>
                      <p className="mb-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
                        {item.label}
                      </p>
                      <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-content-heading">
                        {item.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="my-5 lg:my-6 border-t border-border-ui" />

              <h3 className="mb-3 lg:mb-4 font-heading font-semibold text-[14px] lg:text-[15px] text-content-heading">
                Văn phòng khu vực
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { city: "TP. Hồ Chí Minh", addr: "28 Lý Tự Trọng, Quận 1" },
                  { city: "Đà Nẵng",          addr: "96 Nguyễn Văn Linh, Thanh Khê" },
                ].map((b) => (
                  <div key={b.city}>
                    <p className="font-sans text-[13px] font-semibold text-content-heading">{b.city}</p>
                    <p className="font-sans text-[13px] text-content-muted">{b.addr}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
