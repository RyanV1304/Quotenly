import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Krewbill vs. Jobber",
  description:
    "Jobber is a full field-service platform with per-user pricing. Krewbill is just quoting and invoicing, priced flat for your whole crew. See the honest comparison.",
};

export default function VsJobberPage() {
  return (
    <ComparisonPage
      competitorName="Jobber"
      headline="Krewbill vs. Jobber, honestly."
      subhead="Jobber is a full field-service platform: scheduling, dispatch, routing, and per-user pricing. Krewbill is just quoting and invoicing, priced flat for your whole crew."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Scheduling & dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Route planning", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Setup", krewbill: "Minutes, no onboarding call", competitor: "Guided onboarding typical" },
      ]}
      honestNote="Jobber does more than Krewbill — it's a full field-service management platform. If you need dispatch and routing, Jobber may be the better fit. If you just need to quote a job and get paid without paying per teammate, that's what Krewbill is built for."
      pricingExampleTitle="What a 5-person crew actually pays"
      pricingExampleBody={`On Jobber's Grow plan ($149/mo with annual billing, 1 user included), each additional teammate is $29/mo. A 5-person crew comes out to $149 + 4 × $29 = $265/mo — and that's before add-ons like the Marketing Suite ($99/mo) or Receptionist ($29/mo). Grow to 10 people and you're at $149 + 9 × $29 = $410/mo, just in per-seat fees.

Krewbill is free during launch. When we introduce pricing, it'll be one flat price for your whole crew — a 3-person crew and a 15-person crew pay the same.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — fully free during our launch period, no feature caps, no per-seat cost, no credit card required to start. We'll introduce a paid plan eventually, but it'll be one flat price, and current users get advance notice before anything changes.",
        },
        {
          q: "What happens to my price as my team grows?",
          a: "Nothing. Krewbill doesn't charge per teammate — add your 6th person or your 16th and your bill doesn't move. That's the opposite of Jobber's model, where every added seat is another $29/mo.",
        },
        {
          q: "Can I switch from Jobber easily?",
          a: "Setting up a Krewbill workspace takes minutes, and you can start sending quotes and invoices right away. We don't have an automatic import from Jobber yet, so you'll re-add your clients as you go rather than migrating your full job history — worth knowing upfront rather than discovering it midway.",
        },
        {
          q: "Does Krewbill do scheduling and dispatch like Jobber?",
          a: "No, and that's intentional. Krewbill is just quoting and invoicing. If your crew needs a dispatch board, route planning, or job scheduling, Jobber is built for that and Krewbill isn't trying to replace it.",
        },
      ]}
    />
  );
}
