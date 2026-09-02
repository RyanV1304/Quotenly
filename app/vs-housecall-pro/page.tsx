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
    />
  );
}
