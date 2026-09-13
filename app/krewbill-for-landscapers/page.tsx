import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for Landscapers",
  description:
    "Quoting and invoicing built for landscapers. Quote seasonal and one-time jobs, get client approval online, and invoice without paying per teammate.",
};

export default function LandscapersPage() {
  return (
    <TradePage
      tradeName="landscapers"
      headline="Quoting and invoicing built for landscapers"
      subhead="From a one-time cleanup to a seasonal maintenance contract, quote it clearly, get the client's approval online, and invoice without a per-seat software bill."
      painPoints={[
        {
          title: "Seasonal jobs need seasonal crews",
          body: "Spring and fall bring bigger crews and bigger workloads. Krewbill's flat pricing means adding seasonal help doesn't mean a bigger software bill on top of payroll.",
        },
        {
          title: "One-time jobs and repeat maintenance are different quotes",
          body: "A one-time cleanup is a simple line-item quote. A recurring maintenance job needs the same clarity, sent as a fresh quote each time the scope changes.",
        },
        {
          title: "Material and labor costs vary job to job",
          body: "Mulch, plants, and hardscape materials versus labor hours — break them into separate line items so a client comparing quotes can actually see what they're paying for.",
        },
        {
          title: "You're often quoting from the property, not the office",
          body: "Build the quote while you're walking the yard and send it before you're back in the truck — no need to remember every detail for later.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for one-time jobs and recurring maintenance alike",
        "Branded PDFs with your business name and logo, not a generic template",
        "Owner sees every job; teammates only see what's assigned to them",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
