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

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

// Một link tel: chỉ gọi được một số, nên khi có nhiều số thì bấm nút sẽ mở
// danh sách để người dùng chọn số cần gọi.
export function FloatingPhoneMenu({ phones }: { phones: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

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

  const buttonClass = `${floatingButtonClass} bg-brand ring-brand/15 hover:bg-brand-dark`;
  const halo = (
    <span aria-hidden="true" className="contact-halo contact-halo-delayed absolute inset-0 -z-10 rounded-full bg-brand" />
  );

  if (phones.length === 1) {
    return (
      <a href={telHref(phones[0])} aria-label={`Gọi ${phones[0]}`} className={buttonClass}>
        {halo}
        <span className="relative z-10 flex items-center justify-center"><PhoneIcon /></span>
        <span className={floatingTooltipClass}>Gọi {phones[0]}</span>
      </a>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Gọi điện, chọn số"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={buttonClass}
      >
        {halo}
        <span className="relative z-10 flex items-center justify-center"><PhoneIcon /></span>
        {open ? null : <span className={floatingTooltipClass}>Gọi điện</span>}
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute bottom-0 right-full mr-3 w-56 overflow-hidden rounded-xl border border-border-ui bg-white shadow-[0_12px_32px_rgba(0,29,54,0.18)]"
        >
          <p className="border-b border-border-ui px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-content-muted">
            Chọn số để gọi
          </p>
          <ul>
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  href={telHref(phone)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 font-heading text-[16px] font-semibold text-content-heading transition-colors hover:bg-surface-card focus-visible:bg-surface-card focus-visible:outline-none"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <PhoneIcon className="h-4 w-4" />
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
