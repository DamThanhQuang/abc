"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export function SubmitButton({
  children,
  pendingText,
  className,
  disabled = false,
  "aria-label": ariaLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      aria-label={ariaLabel}
      className={cn(className, "disabled:opacity-60 disabled:cursor-not-allowed")}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span
            role="status"
            aria-label="Đang xử lý"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {pendingText ?? children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
