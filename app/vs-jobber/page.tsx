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
    />
  );
}
