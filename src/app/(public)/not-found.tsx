import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <p className="font-heading text-[72px] font-bold text-brand/20 leading-none mb-2">404</p>
        <h1 className="font-heading font-bold text-[22px] text-content-heading mb-3">
          Khong tim thay trang
        </h1>
        <p className="font-sans text-[14px] text-content-muted mb-6">
          Trang ban dang tim kiem khong ton tai hoac da bi di chuyen.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-brand text-white rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] shadow-btn hover:bg-brand/90 transition-colors"
        >
          Ve trang chu
        </Link>
      </div>
    </div>
  );
}
