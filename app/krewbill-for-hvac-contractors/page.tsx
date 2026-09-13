import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for HVAC Contractors",
  description:
    "Quoting and invoicing built for HVAC contractors. Quote installs and repairs, get client approval online, and invoice without paying per teammate.",
};

export default function HvacPage() {
  return (
    <TradePage
      tradeName="HVAC contractors"
      headline="Quoting and invoicing built for HVAC contractors"
      subhead="From a same-day repair to a full system install, quote it clearly, let the client approve online, and invoice without a per-seat software bill."
      painPoints={[
        {
          title: "System installs have real numbers behind them",
          body: "A new furnace or AC install is unit cost, labor, and often permit or disposal fees. Break it into labor, materials, and flat-fee line items so the total makes sense to the client, not just a single scary number.",
        },
        {
          title: "Repair calls need speed",
          body: "No AC in July isn't a job that waits. Quote it and send the approval link from the truck so you can get started the same visit.",
        },
        {
          title: "Bigger jobs need a real paper trail",
          body: "Install jobs often involve financing conversations or insurance questions later. A branded PDF quote and invoice with clear status — sent, viewed, approved, paid — gives you and the client something to point back to.",
        },
        {
          title: "Crews grow seasonally — your bill shouldn't spike with them",
          body: "Add techs for the summer rush and Krewbill's price stays flat. No per-seat cost to budget around as your crew size changes with the season.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for installs and repair calls alike",
        "Branded PDFs with your business name and logo, not a generic template",
        "Owner sees every job; teammates only see what's assigned to them",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
