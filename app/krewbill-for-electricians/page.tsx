import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for Electricians",
  description:
    "Quoting and invoicing built for electricians. Quote panel upgrades and service calls, get client approval online, and invoice without paying per teammate.",
};

export default function ElectriciansPage() {
  return (
    <TradePage
      tradeName="electricians"
      headline="Quoting and invoicing built for electricians"
      subhead="From a quick outlet repair to a full panel upgrade, get a professional quote in front of your client and get paid without a per-seat software bill."
      painPoints={[
        {
          title: "Panel upgrades need a real line-item breakdown",
          body: "A panel upgrade quote isn't one number — it's labor, permit costs, materials, and sometimes utility coordination. Krewbill's line-item builder handles labor, materials, and flat fees separately, so the client can see exactly what they're approving.",
        },
        {
          title: "Service calls vs. scheduled installs need different speed",
          body: "A same-day service call needs a quote you can send from the truck in minutes. A panel or rewiring job needs more detail. Krewbill works for both — quick line items for a fast job, or a fuller breakdown for a bigger one.",
        },
        {
          title: "Clients want to see it before they say yes",
          body: "Electrical work is expensive enough that clients want to review it, not just take your word on the phone. A shareable link with online approval means no printing, no phone tag, just a signature.",
        },
        {
          title: "Apprentices and helpers shouldn't add to your bill",
          body: "Bring on a second electrician or an apprentice and your software cost shouldn't change. Krewbill doesn't charge per teammate.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for panel upgrades, rewiring, and service calls alike",
        "Branded PDFs with your business name and logo, not a generic template",
        "Owner sees every job; teammates only see what's assigned to them",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
