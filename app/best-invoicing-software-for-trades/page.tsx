import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import ClosingCta from "@/components/marketing/ClosingCta";

export const metadata: Metadata = {
  title: "Best Invoicing Software for Trade Crews",
  description:
    "A straight-talking buyer's guide for handyman, electrical, plumbing, and cleaning crews: what to look for in quoting and invoicing software, why per-seat pricing adds up, and where Krewbill honestly fits.",
};

const LOOK_FOR = [
  {
    title: "A quote your client can approve online",
    body: "A shareable link where the client can review line items and approve with a signature — no account, no phone tag, no printing anything.",
  },
  {
    title: "Real invoice status, not just \"sent\"",
    body: "Draft, sent, viewed, overdue, paid — you should be able to see exactly where every invoice stands without calling the client to ask.",
  },
  {
    title: "Team visibility that matches how you run the crew",
    body: "The owner should see everything. Teammates should only see the jobs assigned to them — not every client's numbers.",
  },
  {
    title: "A line-item builder that fits trade work",
    body: "Labor, materials, and flat fees, with quantity and rate — not a generic \"product catalog\" built for retail.",
  },
  {
    title: "Branded, professional PDFs",
    body: "Your logo and business info on the quote and invoice, not a generic template with the software's name plastered across it.",
  },
  {
    title: "Pricing that doesn't punish you for hiring",
    body: "The clearest sign a tool is priced for a big company, not a crew: your bill goes up every time you add a person.",
  },
];

const FAQS = [
  {
    q: "Is this page just an ad for Krewbill?",
    a: "Honestly, yes and no. We built Krewbill, so we're not neutral — but the criteria above are genuinely what we'd tell a friend to check regardless of which tool they pick. If another tool fits your crew better, use that one.",
  },
  {
    q: "What if I actually need scheduling or dispatch?",
    a: "Then a full field-service platform like Jobber or Housecall Pro is probably the better fit — they're built for that. Krewbill deliberately doesn't do scheduling, dispatch, or route planning, so don't force it if that's what you need.",
  },
  {
    q: "How much does this kind of software normally cost?",
    a: "Full field-service platforms typically start around $30–60/mo for one user and add roughly $25–100/mo per additional teammate depending on the plan — so a 5-person crew commonly lands somewhere between $200–450/mo once seat fees are added up. See our breakdowns of Jobber and Housecall Pro's actual published pricing for the specifics.",
  },
  {
    q: "Is Krewbill free forever?",
    a: "It's free during our current launch period, with no feature caps and no per-seat cost. We plan to introduce a paid plan eventually — one flat price, not per seat — and existing users will get advance notice before anything changes.",
  },
];

export default function BestInvoicingSoftwarePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />

      <section className="bg-bg-white px-6 py-20 text-center">
        <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Buyer&apos;s guide
        </span>
        <h1 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
          The honest guide to picking quoting &amp; invoicing software
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
          What small trade crews should actually look for, why per-seat pricing gets expensive faster than it looks,
          and where Krewbill honestly fits into the decision.
        </p>
      </section>

      <section className="bg-bg-white px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
            What to actually look for
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Ignore the feature-list arms race for a second. For a handyman, electrical, plumbing, cleaning, or
            landscaping crew, these are the things that actually matter day to day.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {LOOK_FOR.map((item) => (
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
            Why per-seat pricing gets expensive faster than it looks
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Most field-service platforms price per user, with the first seat cheap and every added teammate costing
            more on top. Jobber&apos;s Grow plan, for example, is $149/mo for one user and $29/mo per additional
            person — a 5-person crew lands at $265/mo, and a 10-person crew at $410/mo, before any add-ons. Housecall
            Pro&apos;s Essentials plan covers 5 users for $149/mo, but the 6th person costs an extra $100/mo, so an
            8-person crew is $449/mo.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            None of that is a knock on those tools — they do more than Krewbill does, and that has to be paid for
            somehow. It&apos;s just worth knowing the number before you&apos;re three teammates in and surprised by
            the bill. See the full breakdowns for{" "}
            <Link href="/vs-jobber" className="text-brand hover:underline">
              Jobber
            </Link>{" "}
            and{" "}
            <Link href="/vs-housecall-pro" className="text-brand hover:underline">
              Housecall Pro
            </Link>
            .
          </p>
          <p className="mt-4 text-xs text-ink-faint">
            Pricing referenced is each competitor&apos;s own published pricing as of September 2026, and may have
            changed since.
          </p>
        </div>
      </section>

      <section className="bg-bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">
            Where Krewbill honestly fits
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Krewbill covers the list above: quotes clients approve online, invoices with real status tracking,
            owner/teammate visibility, a labor/materials/flat-fee line-item builder, and branded PDFs — at one flat
            price for the whole crew instead of a per-seat bill.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            What it deliberately doesn&apos;t do: scheduling, dispatch boards, route planning, inventory tracking, or
            in-app payment collection. If your crew genuinely needs those, a full field-service platform is the
            better fit, and we&apos;d rather tell you that upfront than have you find out after signing up.
          </p>
        </div>
      </section>

      <section className="bg-bg-white px-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-center text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">
            Common questions
          </h2>
          <div className="mt-8 flex flex-col divide-y divide-line">
            {FAQS.map((faq) => (
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
