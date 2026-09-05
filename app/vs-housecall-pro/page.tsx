import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Krewbill vs. Housecall Pro",
  description:
    "Housecall Pro bundles scheduling, dispatch, and marketing tools into a per-user platform. Krewbill focuses on quotes and invoices at one flat price. See the honest comparison.",
};

export default function VsHousecallProPage() {
  return (
    <ComparisonPage
      competitorName="Housecall Pro"
      headline="Krewbill vs. Housecall Pro, honestly."
      subhead="Housecall Pro bundles scheduling, dispatch, and marketing tools into a per-user platform. Krewbill focuses on one thing — quotes and invoices — at one flat price."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Inventory / parts tracking", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Learning curve", krewbill: "Minutes", competitor: "Larger feature set to learn" },
      ]}
      honestNote="Housecall Pro is built for crews that want dispatch, marketing, and fleet tools in one platform. If your team just needs to send quotes, get approvals, and invoice without a per-seat bill, Krewbill does that one job well."
      pricingExampleTitle="What it costs as your crew grows"
      pricingExampleBody={`Housecall Pro's Essentials plan is $149/mo (annual billing) and covers up to 5 users — reasonable at exactly 5 people. But grow past that and extra seats are $100/mo each: an 8-person crew is $149 + 3 × $100 = $449/mo. Need the top-tier Max plan (GPS tracking, advanced reporting) and the base jumps to $299/mo before extra seats at $75/mo each.

Krewbill is free during launch. When we introduce pricing, it'll be one flat price for your whole crew, whether that's 5 people or 15 — no per-seat cliff to plan around as you hire.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — fully free during our launch period, no feature caps, no per-seat cost, no credit card required to start. We'll introduce a paid plan eventually, but it'll be one flat price, and current users get advance notice before anything changes.",
        },
        {
          q: "What happens to my price as my team grows?",
          a: "Nothing. Krewbill doesn't charge per teammate, so there's no seat-count cliff to worry about. Housecall Pro's Essentials plan covers up to 5 users, but the 6th person costs an extra $100/mo — with Krewbill, adding people never changes your bill.",
        },
        {
          q: "Can I switch from Housecall Pro easily?",
          a: "Setting up a Krewbill workspace takes minutes, and you can start sending quotes and invoices right away. We don't have an automatic import from Housecall Pro yet, so you'll re-add your clients as you go rather than migrating your full job history — worth knowing upfront.",
        },
        {
          q: "Does Krewbill include marketing tools like Housecall Pro?",
          a: "Not the full suite. Krewbill can automatically ask a client for a review once you mark their invoice paid, but it doesn't have Housecall Pro's postcard campaigns or broader marketing automation — that's deliberately out of scope so we can keep quoting and invoicing simple.",
        },
      ]}
    />
  );
}
