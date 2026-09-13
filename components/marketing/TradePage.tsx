import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import ClosingCta from "@/components/marketing/ClosingCta";

export interface TradePainPoint {
  title: string;
  body: string;
}

export default function TradePage({
  tradeName,
  headline,
  subhead,
  painPoints,
  highlights,
}: {
  tradeName: string;
  headline: string;
  subhead: string;
  painPoints: TradePainPoint[];
  highlights: string[];
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />

      <section className="bg-bg-white px-6 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Built for {tradeName}
        </span>
        <h1 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
          {headline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">{subhead}</p>
      </section>

      <section className="bg-bg-white px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
            Where {tradeName.toLowerCase()} actually lose time on paperwork
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((item) => (
              <div key={item.title} className="rounded-lg border border-line p-5">
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-tint px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-lg border border-line bg-bg-white p-8">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            One flat price, whether it&apos;s just you or a full crew
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-ink-soft">
            {highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <span className="mt-0.5 shrink-0 text-brand">&#10003;</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-semibold text-ink">
            Your team can grow without your software bill growing with it.
          </p>
        </div>
      </section>

      <ClosingCta />
      <MarketingFooter />
    </div>
  );
}
