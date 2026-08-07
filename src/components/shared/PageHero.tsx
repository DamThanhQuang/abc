import Image from "next/image";
import Link from "next/link";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  breadcrumbs?: Crumb[];
};

export function PageHero({ title, subtitle, imageSrc, breadcrumbs }: PageHeroProps) {
  return (
    <section
      className="
        relative overflow-hidden bg-brand-dark
        min-h-[200px] sm:min-h-[220px] lg:h-[280px]
      "
    >
      {imageSrc && (
        <div className="absolute inset-0">
          <Image src={imageSrc} alt="" fill className="object-cover object-center" preload sizes="100vw" />
        </div>
      )}
      <div
        className={imageSrc ? "absolute inset-0 bg-page-hero-tint" : "absolute inset-0 bg-brand-gradient"}
        aria-hidden="true"
      />

      <div
        className="
          relative z-10 mx-auto flex h-full max-w-content
          flex-col justify-center
          px-4 sm:px-6 lg:px-16
          py-8 lg:py-0
        "
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="font-sans text-[12px] text-white/40">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="font-sans text-[12px] lg:text-[13px] text-white/70 hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-sans text-[12px] lg:text-[13px] text-white/90 line-clamp-1">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1
          className="
            font-heading font-bold
            text-[26px] sm:text-[32px] lg:text-[40px]
            leading-[34px] sm:leading-[40px] lg:leading-[48px]
            tracking-[-0.02em] text-white
            line-clamp-2
          "
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-2 lg:mt-3 max-w-[600px] font-sans text-[13px] sm:text-[14px] lg:text-[16px] leading-5 lg:leading-6 text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
