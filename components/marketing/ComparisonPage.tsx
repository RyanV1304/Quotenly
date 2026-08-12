import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import ClosingCta from "@/components/marketing/ClosingCta";

export interface ComparisonRow {
  feature: string;
  quotenly: string;
  competitor: string;
}

export default function ComparisonPage({
  competitorName,
  headline,
  subhead,
  rows,
  honestNote,
}: {
  competitorName: string;
  headline: string;
  subhead: string;
  rows: ComparisonRow[];
  honestNote: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />

      <section className="bg-bg-white px-6 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Quotenly vs {competitorName}
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
                <th className="px-5 py-3 font-semibold text-brand-dark">Quotenly</th>
                <th className="px-5 py-3 font-semibold text-ink-soft">{competitorName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.feature} className="bg-white">
                  <td className="px-5 py-3 font-medium text-ink">{row.feature}</td>
                  <td className="px-5 py-3 text-brand-dark">{row.quotenly}</td>
                  <td className="px-5 py-3 text-ink-soft">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-ink-faint">{honestNote}</p>
      </section>

      <ClosingCta />
      <MarketingFooter />
    </div>
  );
}
