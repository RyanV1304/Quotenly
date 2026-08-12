import Link from "next/link";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white px-4 py-12">
      <Link
        href="/"
        className="font-display absolute left-6 top-6 text-base font-bold tracking-tight text-ink hover:text-brand"
      >
        Quotenly
      </Link>

      <div
        className="w-full max-w-sm rounded-lg border border-line bg-white p-8"
        style={{ boxShadow: "0 8px 24px rgba(11,15,25,0.08)" }}
      >
        {eyebrow && (
          <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display mt-3 text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}

        <div className="mt-6">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>}
      </div>
    </div>
  );
}
