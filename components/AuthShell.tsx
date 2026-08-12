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
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-technician.webp"
          alt="Trade technician working on-site"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="glow-blob left-[-10%] top-[-10%] h-96 w-96 bg-brand/40" />
        <div className="glow-blob bottom-[-15%] right-[-10%] h-80 w-80 bg-cta-end/25" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
            Quotenly
          </Link>
          <div>
            <p className="font-display max-w-sm text-2xl font-bold leading-tight tracking-[-0.02em] text-white">
              Quote it. Send it. Get paid.
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Built for small trade crews &mdash; one flat price, no per-seat billing, no bloat.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-bg-white px-4 py-12">
        <Link
          href="/"
          className="font-display absolute left-6 top-6 text-base font-bold tracking-tight text-ink hover:text-brand lg:hidden"
        >
          Quotenly
        </Link>

        <div className="w-full max-w-sm">
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
    </div>
  );
}
