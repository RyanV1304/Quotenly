import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for Roofers",
  description:
    "Quoting and invoicing built for roofers. Quote repairs and full replacements, get client approval online, and invoice without paying per teammate.",
};

export default function RoofersPage() {
  return (
    <TradePage
      tradeName="roofers"
      headline="Quoting and invoicing built for roofers"
      subhead="From a storm-damage repair to a full roof replacement, quote it clearly, get the client's sign-off online, and invoice without a per-seat software bill."
      painPoints={[
        {
          title: "A full replacement quote is a big number, so it needs to be clear",
          body: "Materials, labor, tear-off, and disposal add up fast. Breaking a roof replacement into clear line items helps a client trust the total instead of just seeing one large figure.",
        },
        {
          title: "Storm and insurance jobs move fast",
          body: "Repair quotes tied to insurance claims often need to go out quickly and clearly. Send a professional, branded quote the same day you inspect the damage.",
        },
        {
          title: "Crews grow with the job",
          body: "A bigger replacement often means bringing on extra hands for the week. Krewbill's flat pricing means that doesn't touch your software cost.",
        },
        {
          title: "Clients want to see it before crews show up on the roof",
          body: "A shareable link with online approval means the client signs off on the full scope and price before materials get ordered or a crew gets scheduled.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for repairs and full replacements alike",
        "Branded PDFs with your business name and logo, not a generic template",
        "Owner sees every job; teammates only see what's assigned to them",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
