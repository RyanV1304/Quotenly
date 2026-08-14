import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand">404</p>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 max-w-md text-ink-soft">
          The page you&apos;re looking for may have been moved or never existed. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go to homepage
          </Link>
          <Link href="/app/dashboard" className="btn-secondary">
            Go to dashboard
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
