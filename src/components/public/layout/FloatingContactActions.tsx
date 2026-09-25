import { companyInfo } from "@/config/site";
import { floatingButtonClass, floatingTooltipClass } from "./floating-contact-styles";
import { FloatingPhoneMenu } from "./FloatingPhoneMenu";

function ZaloIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path
        d="M8.5 7.5h23a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H20l-6.7 4v-4H8.5a4 4 0 0 1-4-4v-14a4 4 0 0 1 4-4Z"
        fill="white"
      />
      <text
        x="20"
        y="22.5"
        textAnchor="middle"
        fill="#0068ff"
        fontFamily="Arial, sans-serif"
        fontSize="9.5"
        fontWeight="700"
      >
        Zalo
      </text>
    </svg>
  );
}

type ContactButtonProps = {
  href: string;
  label: string;
  tooltip: string;
  children: React.ReactNode;
  external?: boolean;
  className: string;
  haloClassName: string;
  delayedHalo?: boolean;
};

function ContactButton({
  href,
  label,
  tooltip,
  children,
  external = false,
  className,
  haloClassName,
  delayedHalo = false,
}: ContactButtonProps) {
  // Không dùng thuộc tính title: nó hiện thêm tooltip mặc định của trình duyệt,
  // trùng với tooltip tự vẽ bên dưới.
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${floatingButtonClass} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`contact-halo absolute inset-0 -z-10 rounded-full ${
          delayedHalo ? "contact-halo-delayed" : ""
        } ${haloClassName}`}
      />
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      <span className={floatingTooltipClass}>{tooltip}</span>
    </a>
  );
}

export function FloatingContactActions() {
  const rawZaloId = process.env.NEXT_PUBLIC_ZALO_ID?.trim() ?? "";
  const zaloNumber = rawZaloId.replace(/\D/g, "");
  // Cùng hai số như header và dải liên hệ cuối trang chủ.
  const phones = [companyInfo.phone, companyInfo.phoneSecondary].filter(Boolean);

  return (
    <aside
      aria-label="Liên hệ nhanh"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      {zaloNumber ? (
        <ContactButton
          href={`https://zalo.me/${zaloNumber}`}
          label="Nhắn tin qua Zalo"
          tooltip="Nhắn Zalo"
          external
          className="bg-[#0068ff] ring-[#0068ff]/15 hover:bg-[#005be0]"
          haloClassName="bg-[#1681ff]"
        >
          <ZaloIcon />
        </ContactButton>
      ) : null}

      <FloatingPhoneMenu phones={phones} />
    </aside>
  );
}
