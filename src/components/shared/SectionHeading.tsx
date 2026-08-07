import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  heading: string;
  subtitle?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  heading,
  subtitle,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 lg:mb-12 flex items-end",
        align === "center" ? "flex-col items-center text-center" : "justify-between gap-4",
        className,
      )}
    >
      <div className={align === "center" ? "" : "max-w-2xl"}>
        <h2
          className="
            font-heading font-semibold
            text-[24px] sm:text-[28px] lg:text-[32px]
            leading-[32px] sm:leading-[36px] lg:leading-[40px]
            tracking-[-0.01em] text-content-heading
          "
        >
          {heading}
        </h2>
        {subtitle && (
          <p className="mt-2 font-sans text-[14px] lg:text-[16px] leading-6 text-content-muted">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="
            inline-flex shrink-0 items-center gap-1 pb-1
            font-sans text-[14px] leading-4 tracking-[0.05em]
            text-brand-dark hover:underline transition-colors
          "
        >
          {action.label}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M1 5.5h9M6 1l4.5 4.5L6 10" stroke="#00355f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
