import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Jobber Alternative for Plumbers",
  description:
    "Looking for a Jobber alternative for your plumbing business? Krewbill covers quoting and invoicing at one flat price instead of per-user, for crews of any size.",
};

export default function JobberAlternativePlumbersPage() {
  return (
    <ComparisonPage
      competitorName="Jobber"
      headline="A Jobber alternative built for plumbers"
      subhead="If your plumbing business just needs to quote emergency and scheduled jobs, get client approval, and invoice — without paying Jobber's per-user fee for scheduling and dispatch you may not use — Krewbill is worth a look."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Scheduling & dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Route planning", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Setup", krewbill: "Minutes, no onboarding call", competitor: "Guided onboarding typical" },
      ]}
      honestNote="Jobber does more than Krewbill — it's a full field-service management platform with dispatch and routing. If your plumbing crew genuinely needs that across multiple trucks, Jobber may be the better fit. If you mainly need to quote a job fast and get paid, Krewbill does that without the per-seat bill."
      pricingExampleTitle="What a 6-person plumbing crew actually pays"
      pricingExampleBody={`On Jobber's Grow plan ($149/mo with annual billing, 1 user included), each additional teammate is $29/mo. A 6-person crew — you plus 5 plumbers or apprentices — comes out to $149 + 5 × $29 = $294/mo, before add-ons like the Marketing Suite or Receptionist.

Krewbill is free during launch. When we introduce pricing, it'll be one flat price for your whole crew — whether that's a 6-person shop or a 16-person one.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — fully free during our launch period, no feature caps, no per-seat cost, no credit card required to start. We'll introduce a paid plan eventually, but it'll be one flat price, and current users get advance notice before anything changes.",
        },
        {
          q: "Can I send a quote fast enough for an emergency call?",
          a: "Yes. The line-item builder is quick enough to build and send a quote from the job site — you're not filling out a long form before you can send a link.",
        },
        {
          q: "What happens to my price as I hire more plumbers?",
          a: "Nothing. Krewbill doesn't charge per teammate — add your 7th person or your 17th and your bill doesn't move. That's the opposite of Jobber's model, where every added seat is another $29/mo.",
        },
        {
          q: "Does Krewbill do scheduling and dispatch like Jobber?",
          a: "No, and that's intentional. Krewbill is just quoting and invoicing. If your crew needs a dispatch board, route planning, or job scheduling across multiple trucks, Jobber is built for that and Krewbill isn't trying to replace it.",
        },
      ]}
    />
  );
}
