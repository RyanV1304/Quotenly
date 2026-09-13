import Link from "next/link";

const BY_TRADE = [
  { href: "/krewbill-for-electricians", label: "Electricians" },
  { href: "/krewbill-for-plumbers", label: "Plumbers" },
  { href: "/krewbill-for-hvac-contractors", label: "HVAC contractors" },
  { href: "/krewbill-for-handymen", label: "Handymen" },
  { href: "/krewbill-for-landscapers", label: "Landscapers" },
  { href: "/krewbill-for-roofers", label: "Roofers" },
];

const COMPARE = [
  { href: "/vs-jobber", label: "Krewbill vs. Jobber" },
  { href: "/vs-housecall-pro", label: "Krewbill vs. Housecall Pro" },
  { href: "/jobber-alternative-for-electricians", label: "Jobber alternative for electricians" },
  { href: "/jobber-alternative-for-plumbers", label: "Jobber alternative for plumbers" },
  { href: "/housecall-pro-alternative-for-hvac", label: "Housecall Pro alternative for HVAC" },
  { href: "/jobber-alternative-for-handymen", label: "Jobber alternative for handymen" },
  { href: "/best-invoicing-software-for-trades", label: "Best invoicing software for trades" },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-bg-white px-4 py-12 text-sm text-ink-faint">
      <div className="mx-auto grid max-w-4xl gap-8 text-left sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">By trade</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {BY_TRADE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Compare</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {COMPARE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center">
        <p>Krewbill &mdash; free during our launch period.</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link href="/privacy" className="hover:text-ink-soft">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink-soft">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
