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
    <div className="bg-wash relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-blue-pale/40 px-4 py-12">
      <div className="animate-blob-drift pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
      <div
        className="animate-blob-drift pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <Link
        href="/"
        className="absolute left-6 top-6 text-sm font-extrabold tracking-tight text-black hover:text-brand-blue"
      >
        Quotenly
      </Link>

      <div className="animate-fade-in-up relative w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-brand-blue/10">
        {eyebrow && (
          <span className="inline-block rounded-full bg-brand-blue-pale px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-black">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-black/60">{subtitle}</p>}

        <div className="mt-6">{children}</div>

        {footer && <div className="mt-6 text-center text-sm text-black/60">{footer}</div>}
      </div>
    </div>
  );
}
