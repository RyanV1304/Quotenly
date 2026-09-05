import Link from "next/link";

export default function PoweredByBadge() {
  return (
    <div className="pt-2 text-center">
      <Link href="/" className="text-xs text-ink-faint transition-colors hover:text-ink-soft">
        Powered by Krewbill
      </Link>
    </div>
  );
}
