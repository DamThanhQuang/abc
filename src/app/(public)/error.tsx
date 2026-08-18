"use client";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <p className="font-heading text-[48px] font-bold text-red-200 leading-none mb-2">Loi</p>
        <h1 className="font-heading font-bold text-[22px] text-content-heading mb-3">
          Da xay ra loi
        </h1>
        <p className="font-sans text-[14px] text-content-muted mb-6">
          Xin loi, da co loi xay ra. Vui long thu lai.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-brand text-white rounded-btn px-6 py-[13px] font-sans text-[14px] leading-4 tracking-[0.05em] shadow-btn hover:bg-brand/90 transition-colors"
        >
          Thu lai
        </button>
      </div>
    </div>
  );
}
