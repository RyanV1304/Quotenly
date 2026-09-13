import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Jobber Alternative for Electricians",
  description:
    "Looking for a Jobber alternative for your electrical business? Krewbill covers quoting and invoicing at one flat price instead of per-user, for crews of any size.",
};

export default function JobberAlternativeElectriciansPage() {
  return (
    <ComparisonPage
      competitorName="Jobber"
      headline="A Jobber alternative built for electricians"
      subhead="If your electrical business just needs to quote panel upgrades and service calls, get client approval, and invoice — without paying Jobber's per-user fee for scheduling and dispatch you may not use — Krewbill is worth a look."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Scheduling & dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Route planning", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Setup", krewbill: "Minutes, no onboarding call", competitor: "Guided onboarding typical" },
      ]}
      honestNote="Jobber does more than Krewbill — it's a full field-service management platform with dispatch and routing. If your electrical crew genuinely needs that, Jobber may be the better fit. If you mainly need to quote a panel upgrade or service call and get paid, Krewbill does that without the per-seat bill."
      pricingExampleTitle="What a 4-person electrical crew actually pays"
      pricingExampleBody={`On Jobber's Grow plan ($149/mo with annual billing, 1 user included), each additional teammate is $29/mo. A 4-person crew — you plus 3 electricians or apprentices — comes out to $149 + 3 × $29 = $236/mo, before add-ons like the Marketing Suite or Receptionist.

Krewbill is free during launch. When we introduce pricing, it'll be one flat price for your whole crew — whether that's a 4-person shop or a 12-person one.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — fully free during our launch period, no feature caps, no per-seat cost, no credit card required to start. We'll introduce a paid plan eventually, but it'll be one flat price, and current users get advance notice before anything changes.",
        },
        {
          q: "Can Krewbill handle a panel upgrade quote, not just a simple repair?",
          a: "Yes. The line-item builder supports labor, materials, and flat fees separately, so a panel upgrade quote with permit costs and material line items looks as clear as a quick service-call quote.",
        },
        {
          q: "What happens to my price as I hire more electricians?",
          a: "Nothing. Krewbill doesn't charge per teammate — add your 5th person or your 15th and your bill doesn't move. That's the opposite of Jobber's model, where every added seat is another $29/mo.",
        },
        {
          q: "Does Krewbill do scheduling and dispatch like Jobber?",
          a: "No, and that's intentional. Krewbill is just quoting and invoicing. If your crew needs a dispatch board, route planning, or job scheduling across multiple trucks, Jobber is built for that and Krewbill isn't trying to replace it.",
        },
      ]}
    />
  );
}
