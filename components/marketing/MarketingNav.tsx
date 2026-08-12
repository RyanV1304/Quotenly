import Link from "next/link";

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink">
          Quotenly
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
        <div className="flex items-center gap-5 text-sm">
          <Link href="/login" className="hidden font-medium text-ink-soft transition-colors hover:text-ink sm:block">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
