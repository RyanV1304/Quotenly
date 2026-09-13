import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for Plumbers",
  description:
    "Quoting and invoicing built for plumbers. Quote emergency calls and scheduled jobs, get client approval online, and invoice without paying per teammate.",
};

export default function PlumbersPage() {
  return (
    <TradePage
      tradeName="plumbers"
      headline="Quoting and invoicing built for plumbers"
      subhead="Emergency call or scheduled repipe, get a quote out fast, let the client approve it online, and invoice without a per-seat software bill."
      painPoints={[
        {
          title: "Emergency calls need a quote in minutes, not hours",
          body: "A burst pipe doesn't wait for you to get back to the office. Krewbill's line-item builder is fast enough to quote from the job site and send the link right there.",
        },
        {
          title: "Scheduled jobs need more detail than a phone estimate",
          body: "A repipe or water heater install has real material costs on top of labor. Break it into labor, materials, and flat-fee line items so the client sees exactly what they're paying for, not just a lump sum.",
        },
        {
          title: "Clients want to approve before you start",
          body: "Especially for bigger jobs, a shareable link with online approval means the client signs off before you show up with materials — no surprises on either side.",
        },
        {
          title: "A second truck shouldn't mean a bigger bill",
          body: "Add a second plumber or a helper and Krewbill's price doesn't change. No per-seat fees to plan around as you grow.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for emergency calls and scheduled jobs alike",
        "Branded PDFs with your business name and logo, not a generic template",
        "Owner sees every job; teammates only see what's assigned to them",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
