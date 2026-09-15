import Image from "next/image";

type LogoMarkProps = {
  className?: string;
};

/** Full Ánh Sáng Toàn Cầu logo used across public and admin layouts. */
export function LogoMark({ className = "h-12 w-auto" }: LogoMarkProps) {
  return (
    <Image
      src="/images/brand/anh-sang-toan-cau-logo.png"
      alt="Ánh Sáng Toàn Cầu"
      width={1536}
      height={1024}
      className={className}
    />
  );
}
