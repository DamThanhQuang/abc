"use client";

import { useState } from "react";

export function CopyPhoneButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyPhone}
      className="inline-flex h-9 items-center justify-center rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] font-semibold text-brand-dark transition-colors hover:border-brand hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      aria-live="polite"
    >
      {copied ? "Đã sao chép" : "Sao chép"}
    </button>
  );
}
