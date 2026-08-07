import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  imageSrc?: string;
};

export function HeroSection({ imageSrc }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-surface-hero
        min-h-[420px] sm:min-h-[500px] lg:h-[600px]"
    >
      {/* Background image */}
      {imageSrc && (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            preload
            sizes="100vw"
          />
        </div>
      )}

      {/* Gradient overlay — left fade (desktop) / full tint (mobile) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(247,249,255,0.97) 0%, rgba(247,249,255,0.90) 40%, rgba(247,249,255,0.70) 65%, rgba(247,249,255,0) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="
          relative z-10 mx-auto h-full max-w-content
          px-4 sm:px-6 lg:px-16
          flex items-center
          py-12 lg:py-0
        "
      >
        {/* On mobile: full-width. On desktop: 8/12 columns */}
        <div className="w-full lg:w-2/3 xl:w-[calc(8/12*100%)] flex flex-col gap-4 lg:gap-6">

          {/* Badge */}
          <span
            className="
              self-start
              bg-surface-tag border border-border-tag rounded-pill
              px-[13px] py-[5px]
              font-sans text-[13px] lg:text-[14px] leading-4 tracking-[0.05em]
              text-brand-dark whitespace-nowrap
            "
          >
            Industrial Grade Equipment
          </span>

          {/* H1 — scales from mobile to desktop */}
          <h1
            className="
              font-heading font-bold
              text-[28px] leading-[36px]
              sm:text-[36px] sm:leading-[44px]
              lg:text-[48px] lg:leading-[56px]
              tracking-[-0.02em]
              text-content-heading
            "
          >
            Giải pháp nhiên liệu chính xác cho
            <br className="hidden sm:block" />
            {" "}hạ tầng hiện đại
          </h1>

          {/* Description */}
          <p
            className="
              font-sans leading-7
              text-[15px] sm:text-[16px] lg:text-[18px]
              text-content-body max-w-[672px]
            "
          >
            Kỹ thuật hệ thống nhiên liệu hiệu suất cao, đáng tin cậy. From
            robust commercial pumps to intelligent monitoring technology, we
            build the backbone of fluid management.
          </p>

          {/* CTAs */}
          <div className="flex flex-row items-center gap-3 pt-1 lg:pt-3">
            <Link
              href="/san-pham"
              className="
                inline-flex items-center justify-center
                bg-brand text-white
                font-sans text-[14px] leading-4 tracking-[0.05em]
                rounded-btn px-6 py-[13px]
                shadow-btn
                hover:bg-brand/90 transition-colors
              "
            >
              Xem danh mục
            </Link>
            <Link
              href="/lien-he"
              className="
                inline-flex items-center justify-center
                border border-brand text-brand
                font-sans text-[14px] leading-4 tracking-[0.05em]
                rounded-btn px-6 py-[13px]
                hover:bg-surface-card transition-colors
              "
            >
              Liên hệ kinh doanh
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
