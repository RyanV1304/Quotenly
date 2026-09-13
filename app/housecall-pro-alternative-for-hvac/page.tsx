import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Housecall Pro Alternative for HVAC",
  description:
    "Looking for a Housecall Pro alternative for your HVAC business? Krewbill covers quoting and invoicing at one flat price instead of per-user, for crews of any size.",
};

export default function HousecallProAlternativeHvacPage() {
  return (
    <ComparisonPage
      competitorName="Housecall Pro"
      headline="A Housecall Pro alternative built for HVAC contractors"
      subhead="If your HVAC business just needs to quote installs and repairs, get client approval, and invoice — without paying Housecall Pro's per-seat fee once your crew grows past a handful of techs — Krewbill is worth a look."
      rows={[
        { feature: "Pricing model", krewbill: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", krewbill: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", krewbill: "Included", competitor: "Included" },
        { feature: "Dispatch board", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Inventory / parts tracking", krewbill: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", krewbill: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Learning curve", krewbill: "Minutes", competitor: "Larger feature set to learn" },
      ]}
      honestNote="Housecall Pro is built for HVAC crews that want dispatch, inventory tracking, and marketing tools in one platform. If your team genuinely needs that, Housecall Pro may be the better fit. If you mainly need to quote installs and repairs and invoice without a per-seat bill, Krewbill does that one job well."
      pricingExampleTitle="What an 8-tech HVAC crew actually pays"
      pricingExampleBody={`Housecall Pro's Essentials plan is $149/mo (annual billing) and covers up to 5 users. An 8-person crew — you plus 7 techs — needs 3 extra seats at $100/mo each: $149 + 3 × $100 = $449/mo. Need the top-tier Max plan for GPS tracking and advanced reporting, and the base jumps to $299/mo before extra seats at $75/mo each.

Krewbill is free during launch. When we introduce pricing, it'll be one flat price for your whole crew — no per-seat cliff to plan around as you add techs for a busy season.`}
      pricingAsOf="September 2026"
      faqs={[
        {
          q: "Is Krewbill really free?",
          a: "Yes — fully free during our launch period, no feature caps, no per-seat cost, no credit card required to start. We'll introduce a paid plan eventually, but it'll be one flat price, and current users get advance notice before anything changes.",
        },
        {
          q: "Can Krewbill handle a full system install quote, not just a repair?",
          a: "Yes. The line-item builder supports labor, materials, and flat fees separately, so an install quote with unit cost, labor, and permit fees looks as clear as a quick repair quote.",
        },
        {
          q: "What happens to my price as I add techs for a busy season?",
          a: "Nothing. Krewbill doesn't charge per teammate, so there's no seat-count cliff to worry about. Housecall Pro's Essentials plan covers up to 5 users, but the 6th tech costs an extra $100/mo — with Krewbill, adding people never changes your bill.",
        },
        {
          q: "Does Krewbill include dispatch and inventory tracking like Housecall Pro?",
          a: "No, and that's intentional. Krewbill is just quoting and invoicing. If your crew needs a dispatch board or parts/inventory tracking, Housecall Pro is built for that and Krewbill isn't trying to replace it.",
        },
      ]}
    />
  );
}
