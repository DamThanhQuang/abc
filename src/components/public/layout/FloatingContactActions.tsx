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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="contact-phone-icon h-6 w-6"
    >
      <path
        d="M7.1 3.5 9.4 7a1.5 1.5 0 0 1-.2 1.9L7.8 10.3a14.2 14.2 0 0 0 5.9 5.9l1.4-1.4a1.5 1.5 0 0 1 1.9-.2l3.5 2.3a1.5 1.5 0 0 1 .6 1.8l-.7 2a2 2 0 0 1-1.9 1.3C9.4 22 2 14.6 2 5.5a2 2 0 0 1 1.3-1.9l2-.7a1.5 1.5 0 0 1 1.8.6Z"
        fill="currentColor"
      />
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
  return (
    <a
      href={href}
      aria-label={label}
      title={tooltip}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group relative isolate flex size-13 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,53,95,0.28)] ring-4 transition-colors duration-200 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-14 ${className}`}
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
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-content-heading px-3 py-2 font-sans text-[12px] font-medium leading-4 text-white opacity-0 shadow-lg motion-safe:translate-x-2 motion-safe:transition-[opacity,transform] group-hover:opacity-100 motion-safe:group-hover:translate-x-0 group-focus-visible:opacity-100 motion-safe:group-focus-visible:translate-x-0 sm:block">
        {tooltip}
      </span>
    </a>
  );
}

export function FloatingContactActions() {
  const rawZaloId = process.env.NEXT_PUBLIC_ZALO_ID?.trim() ?? "";
  const contactNumber = rawZaloId.replace(/\D/g, "");
  const displayPhone =
    process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim() || rawZaloId;

  if (!contactNumber) {
    return null;
  }

  return (
    <aside
      aria-label="Liên hệ nhanh"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      <ContactButton
        href={`https://zalo.me/${contactNumber}`}
        label="Nhắn tin qua Zalo"
        tooltip="Nhắn Zalo"
        external
        className="bg-[#0068ff] ring-[#0068ff]/15 hover:bg-[#005be0]"
        haloClassName="bg-[#1681ff]"
      >
        <ZaloIcon />
      </ContactButton>

      <ContactButton
        href={`tel:${contactNumber}`}
        label={`Gọi ${displayPhone}`}
        tooltip={`Gọi ${displayPhone}`}
        className="bg-brand ring-brand/15 hover:bg-brand-dark"
        haloClassName="bg-brand"
        delayedHalo
      >
        <PhoneIcon />
      </ContactButton>
    </aside>
  );
}
