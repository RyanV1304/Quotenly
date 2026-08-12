const STYLES: Record<string, string> = {
  draft: "bg-line text-ink-soft",
  sent: "bg-warning-tint text-warning",
  viewed: "bg-warning-tint text-warning",
  approved: "bg-success-tint text-success",
  paid: "bg-success-tint text-success",
  declined: "bg-danger-tint text-danger",
  overdue: "bg-danger-tint text-danger",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? "bg-line text-ink-soft";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
