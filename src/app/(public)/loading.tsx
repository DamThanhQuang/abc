export default function PublicLoading() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border-ui border-t-brand" />
        <p className="font-sans text-[13px] text-content-muted">Dang tai...</p>
      </div>
    </div>
  );
}
