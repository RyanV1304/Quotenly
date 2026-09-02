import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-bg-white px-4 py-8 text-center text-sm text-ink-faint">
      <p>Krewbill &mdash; free during our launch period.</p>
      <div className="mt-2 flex items-center justify-center gap-4">
        <Link href="/privacy" className="hover:text-ink-soft">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-ink-soft">
          Terms
        </Link>
      </div>
    </footer>
  );
}
