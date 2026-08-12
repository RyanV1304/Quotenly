import Link from "next/link";

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-black">
          Quotenly
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-black/60 sm:flex">
          <Link href="/#product" className="hover:text-black">
            Product
          </Link>
          <Link href="/#pricing" className="hover:text-black">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-black">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/login" className="hidden font-medium text-black/70 hover:text-black sm:block">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
