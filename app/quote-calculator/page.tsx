import type { Metadata } from "next";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import QuoteCalculator from "@/components/QuoteCalculator";

export const metadata: Metadata = {
  title: "Free Quote Calculator",
  description:
    "A free, no-signup quote calculator for trade crews. Add line items, set a tax rate, and get an instant subtotal and total — no account needed.",
};

export default function QuoteCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />

      <section className="bg-bg-white px-6 py-16 text-center">
        <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Free tool, no signup
        </span>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
          Quote calculator
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          Add your line items, set a tax rate, and get an instant total. No account, no email, nothing saved
          anywhere — just a fast, useful calculator for trade work.
        </p>
      </section>

      <section className="bg-bg-white px-6 pb-20">
        <QuoteCalculator />
      </section>

      <MarketingFooter />
    </div>
  );
}
