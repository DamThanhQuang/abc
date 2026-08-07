type StatCardProps = {
  icon?: React.ReactNode;
  value: string;
  label: string;
};

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-1 rounded-card bg-surface-card p-6 shadow-card">
      {icon && <div className="mb-1">{icon}</div>}
      <p className="font-heading font-semibold text-[24px] leading-8 text-content-heading">
        {value}
      </p>
      <p className="font-sans text-[14px] leading-5 text-content-body">
        {label}
      </p>
    </div>
  );
}
