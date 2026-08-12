import ComparisonPage from "@/components/marketing/ComparisonPage";

export default function VsJobberPage() {
  return (
    <ComparisonPage
      competitorName="Jobber"
      headline="Quotenly vs. Jobber, honestly."
      subhead="Jobber is a full field-service platform: scheduling, dispatch, routing, and per-user pricing. Quotenly is just quoting and invoicing, priced flat for your whole crew."
      rows={[
        { feature: "Pricing model", quotenly: "Free during launch, flat price later", competitor: "Per-user, tiered plans" },
        { feature: "Quotes & online approval", quotenly: "Included", competitor: "Included" },
        { feature: "Invoicing & payment tracking", quotenly: "Included", competitor: "Included" },
        { feature: "Scheduling & dispatch board", quotenly: "Not included, on purpose", competitor: "Included" },
        { feature: "Route planning", quotenly: "Not included, on purpose", competitor: "Included" },
        { feature: "Team size", quotenly: "Unlimited teammates", competitor: "Priced per additional user" },
        { feature: "Setup", quotenly: "Minutes, no onboarding call", competitor: "Guided onboarding typical" },
      ]}
      honestNote="Jobber does more than Quotenly — it's a full field-service management platform. If you need dispatch and routing, Jobber may be the better fit. If you just need to quote a job and get paid without paying per teammate, that's what Quotenly is built for."
    />
  );
}
