export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border-ui border-t-brand" />
        <p className="font-sans text-[13px] text-content-muted">Dang tai...</p>
      </div>
    </div>
  );
}
