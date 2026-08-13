import type { Metadata } from "next";
import ComparisonPage from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "Quotenly vs. Housecall Pro",
  description:
    "Housecall Pro bundles scheduling, dispatch, and marketing tools into a per-user platform. Quotenly focuses on quotes and invoices at one flat price. See the honest comparison.",
};

export default function VsHousecallProPage() {
  return (
    <ComparisonPage
      competitorName="Housecall Pro"
      headline="Quotenly vs. Housecall Pro, honestly."
      subhead="Housecall Pro bundles scheduling, dispatch, and marketing tools into a per-user platform. Quotenly focuses on one thing — quotes and invoices — at one flat price."
      rows={[
        { feature: "Pricing model", quotenly: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", quotenly: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", quotenly: "Included", competitor: "Included" },
        { feature: "Dispatch board", quotenly: "Not included, on purpose", competitor: "Included" },
        { feature: "Inventory / parts tracking", quotenly: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", quotenly: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Learning curve", quotenly: "Minutes", competitor: "Larger feature set to learn" },
      ]}
      honestNote="Housecall Pro is built for crews that want dispatch, marketing, and fleet tools in one platform. If your team just needs to send quotes, get approvals, and invoice without a per-seat bill, Quotenly does that one job well."
    />
  );
}
