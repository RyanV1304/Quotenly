import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Jobber Alternative for Handymen",
  description:
    "Looking for a Jobber alternative for your handyman business? Krewbill covers quoting and invoicing at one flat price instead of per-user, whether you're solo or growing.",
};

export default function JobberAlternativeHandymenPage() {
  return (
    <ComparisonPage
      competitorName="Jobber"
      headline="A Jobber alternative built for handymen"
      subhead="If you just need to quote a punch list or a bigger project, get client approval, and invoice — without paying Jobber's per-user fee for scheduling and dispatch you probably don't need solo — Krewbill is worth a look."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, never per-seat", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Scheduling & dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Route planning", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Setup", krewbill: "Minutes, no onboarding call", competitor: "Guided onboarding typical" },
      ]}
      honestNote="Jobber does more than Krewbill — it's a full field-service management platform with dispatch and routing, built with multi-truck crews in mind. If you're solo or have one helper, that's often more than you need. If you mainly want to quote a job and get paid, Krewbill does that without the per-seat bill."
      pricingExampleTitle="What a solo handyman plus one helper actually pays"
      pricingExampleBody={`On Jobber's Grow plan ($149/mo with annual billing, 1 user included), each additional teammate is $29/mo. Even a small 2-person operation — you plus one helper — comes out to $149 + $29 = $178/mo, before any add-ons.

Krewbill is free during our launch period, no credit card required. When we do introduce pricing, it will be one flat rate for your whole team — never per user — whether you're solo, just added a helper, or grow to a full crew later.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — free during our launch period, no credit card required. When we do introduce pricing, it will be one flat rate for your whole team — never per user — and current users get advance notice before anything changes.",
        },
        {
          q: "Is Krewbill overkill if I'm working solo?",
          a: "No — it's built to work just as well for one person as it does for a crew. You get the same quoting, invoicing, and branded PDFs whether or not you've hired anyone yet.",
        },
        {
          q: "What happens to my price if I bring on a helper?",
          a: "Nothing. Krewbill doesn't charge per teammate — add your first helper or your fifth and your bill doesn't move. That's the opposite of Jobber's model, where every added seat is another $29/mo.",
        },
        {
          q: "Does Krewbill do scheduling and dispatch like Jobber?",
          a: "No, and that's intentional. Krewbill is just quoting and invoicing. If you eventually run multiple trucks and need a dispatch board or route planning, Jobber is built for that and Krewbill isn't trying to replace it.",
        },
      ]}
    />
  );
}
