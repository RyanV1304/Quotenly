import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import ClosingCta from "@/components/marketing/ClosingCta";

export interface ComparisonRow {
  feature: string;
  krewbill: string;
  competitor: string;
}

export interface ComparisonFaq {
  q: string;
  a: string;
}

export default function ComparisonPage({
  competitorName,
  headline,
  subhead,
  rows,
  honestNote,
  pricingExampleTitle,
  pricingExampleBody,
  pricingAsOf,
  faqs,
}: {
  competitorName: string;
  headline: string;
  subhead: string;
  rows: ComparisonRow[];
  honestNote: string;
  pricingExampleTitle: string;
  pricingExampleBody: string;
  pricingAsOf: string;
  faqs: ComparisonFaq[];
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />

      <section className="bg-bg-white px-6 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Krewbill vs {competitorName}
        </span>
        <h1 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">{subhead}</p>
      </section>

      <section className="bg-bg-white px-6 pb-20">
        <div className="mx-auto max-w-3xl overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-brand-tint">
                <th className="px-5 py-3 font-semibold text-ink">Feature</th>
                <th className="px-5 py-3 font-semibold text-brand-dark">Krewbill</th>
                <th className="px-5 py-3 font-semibold text-ink-soft">{competitorName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.feature} className="bg-white">
                  <td className="px-5 py-3 font-medium text-ink">{row.feature}</td>
                  <td className="px-5 py-3 text-brand-dark">{row.krewbill}</td>
                  <td className="px-5 py-3 text-ink-soft">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-ink-faint">{honestNote}</p>
      </section>

      <section className="bg-brand-tint px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-lg border border-line bg-bg-white p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{pricingExampleTitle}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{pricingExampleBody}</p>
          <p className="mt-4 text-xs text-ink-faint">Pricing shown is {competitorName}&apos;s own published pricing as of {pricingAsOf}, and may have changed since.</p>
        </div>
      </section>

      <section className="bg-bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-center text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">
            Questions about switching from {competitorName}
          </h2>
          <div className="mt-8 flex flex-col divide-y divide-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4 first:pt-0 last:pb-0">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden sm:text-base">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="shrink-0 text-ink-faint transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
      <MarketingFooter />
    </div>
  );
}
