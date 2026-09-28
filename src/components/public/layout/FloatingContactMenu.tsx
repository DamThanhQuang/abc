"use client";

import { useEffect, useId, useRef, useState } from "react";
import { floatingButtonClass, floatingTooltipClass } from "./floating-contact-styles";

function PhoneIcon({ className = "contact-phone-icon h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7.1 3.5 9.4 7a1.5 1.5 0 0 1-.2 1.9L7.8 10.3a14.2 14.2 0 0 0 5.9 5.9l1.4-1.4a1.5 1.5 0 0 1 1.9-.2l3.5 2.3a1.5 1.5 0 0 1 .6 1.8l-.7 2a2 2 0 0 1-1.9 1.3C9.4 22 2 14.6 2 5.5a2 2 0 0 1 1.3-1.9l2-.7a1.5 1.5 0 0 1 1.8.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ZaloIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8.5 7.5h23a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H20l-6.7 4v-4H8.5a4 4 0 0 1-4-4v-14a4 4 0 0 1 4-4Z"
        fill="currentColor"
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

export type ContactChannel = "phone" | "zalo";

// Cấu hình phải serializable: component này là client component, nên chỉ nhận
// discriminator từ server chứ không nhận hàm hay element.
const CHANNELS = {
  phone: {
    buttonClass: "bg-brand ring-brand/15 hover:bg-brand-dark",
    haloClass: "bg-brand contact-halo-delayed",
    menuTitle: "Chọn số để gọi",
    triggerLabel: "Gọi điện, chọn số",
    triggerTooltip: "Gọi điện",
    external: false,
    actionLabel: (phone: string) => `Gọi ${phone}`,
    href: (phone: string) => `tel:${phone.replace(/\D/g, "")}`,
  },
  zalo: {
    buttonClass: "bg-[#0068ff] ring-[#0068ff]/15 hover:bg-[#005be0]",
    haloClass: "bg-[#1681ff]",
    menuTitle: "Chọn số để nhắn Zalo",
    triggerLabel: "Nhắn Zalo, chọn số",
    triggerTooltip: "Nhắn Zalo",
    external: true,
    actionLabel: (phone: string) => `Nhắn Zalo ${phone}`,
    href: (phone: string) => `https://zalo.me/${phone.replace(/\D/g, "")}`,
  },
} as const;

function ChannelIcon({ channel, className }: { channel: ContactChannel; className?: string }) {
  return channel === "zalo" ? <ZaloIcon className={className} /> : <PhoneIcon className={className} />;
}

type Props = {
  channel: ContactChannel;
  numbers: readonly string[];
};

// Một link tel: hay zalo.me chỉ mở được một số, nên khi có nhiều số thì bấm nút
// sẽ mở danh sách để người dùng chọn số cần liên hệ.
export function FloatingContactMenu({ channel, numbers }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const config = CHANNELS[channel];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (numbers.length === 0) return null;

  const buttonClass = `${floatingButtonClass} ${config.buttonClass}`;
  const halo = (
    <span
      aria-hidden="true"
      className={`contact-halo absolute inset-0 -z-10 rounded-full ${config.haloClass}`}
    />
  );
  const externalProps = config.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  if (numbers.length === 1) {
    const only = numbers[0];
    return (
      <a
        href={config.href(only)}
        aria-label={config.actionLabel(only)}
        className={buttonClass}
        {...externalProps}
      >
        {halo}
        <span className="relative z-10 flex items-center justify-center">
          <ChannelIcon channel={channel} />
        </span>
        <span className={floatingTooltipClass}>{config.actionLabel(only)}</span>
      </a>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={config.triggerLabel}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={buttonClass}
      >
        {halo}
        <span className="relative z-10 flex items-center justify-center">
          <ChannelIcon channel={channel} />
        </span>
        {open ? null : <span className={floatingTooltipClass}>{config.triggerTooltip}</span>}
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute bottom-0 right-full mr-3 w-56 overflow-hidden rounded-xl border border-border-ui bg-white shadow-[0_12px_32px_rgba(0,29,54,0.18)]"
        >
          <p className="border-b border-border-ui px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
            {config.menuTitle}
          </p>
          <ul>
            {numbers.map((phone) => (
              <li key={phone}>
                <a
                  href={config.href(phone)}
                  aria-label={config.actionLabel(phone)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 font-heading text-[16px] font-semibold text-content-heading transition-colors hover:bg-surface-card focus-visible:bg-surface-card focus-visible:outline-none"
                  {...externalProps}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      channel === "zalo" ? "bg-[#0068ff]/10 text-[#0068ff]" : "bg-brand/10 text-brand"
                    }`}
                  >
                    <ChannelIcon channel={channel} className="h-4 w-4" />
                  </span>
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
