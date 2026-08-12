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
    <div className="flex min-h-screen flex-col">
      <MarketingNav />

      <section className="bg-wash bg-dot-grid bg-white px-6 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-blue-pale px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">
          Quotenly vs {competitorName}
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-black/60">{subhead}</p>
      </section>

      <section className="bg-white px-6 pb-20">
        <div className="mx-auto max-w-3xl overflow-x-auto rounded-2xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-brand-blue-pale/40">
                <th className="px-5 py-3 font-semibold text-black">Feature</th>
                <th className="px-5 py-3 font-semibold text-brand-blue-deep">Quotenly</th>
                <th className="px-5 py-3 font-semibold text-black/60">{competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-black">{row.feature}</td>
                  <td className="px-5 py-3 text-brand-blue-deep">{row.quotenly}</td>
                  <td className="px-5 py-3 text-black/60">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-black/40">{honestNote}</p>
      </section>

      <ClosingCta />
      <MarketingFooter />
    </div>
  );
}
