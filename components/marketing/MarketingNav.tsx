import Link from "next/link";

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink">
          Krewbill
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
          <Link href="/#product" className="transition-colors hover:text-ink">
            Product
          </Link>
          <Link href="/#pricing" className="transition-colors hover:text-ink">
            Pricing
          </Link>
          <Link href="/#faq" className="transition-colors hover:text-ink">
            FAQ
          </Link>
        </nav>
        <div className="hidden items-center gap-5 text-sm sm:flex">
          <Link href="/login" className="font-medium text-ink-soft transition-colors hover:text-ink">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>
        <details className="relative sm:hidden">
          <summary className="flex h-9 w-9 list-none items-center justify-center rounded-lg border border-line text-ink [&::-webkit-details-marker]:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-12 flex w-48 flex-col gap-1 rounded-lg border border-line bg-white p-2 text-sm font-medium text-ink shadow-lg">
            <Link href="/#product" className="rounded-md px-3 py-2 hover:bg-brand-tint">
              Product
            </Link>
            <Link href="/#pricing" className="rounded-md px-3 py-2 hover:bg-brand-tint">
              Pricing
            </Link>
            <Link href="/#faq" className="rounded-md px-3 py-2 hover:bg-brand-tint">
              FAQ
            </Link>
            <div className="my-1 h-px bg-line" />
            <Link href="/login" className="rounded-md px-3 py-2 hover:bg-brand-tint">
              Log in
            </Link>
            <Link href="/signup" className="rounded-md px-3 py-2 font-semibold text-brand hover:bg-brand-tint">
              Start free
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
