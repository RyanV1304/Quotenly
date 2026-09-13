import type { Metadata } from "next";
import TradePage from "@/components/marketing/TradePage";

export const metadata: Metadata = {
  title: "Krewbill for Handymen",
  description:
    "Quoting and invoicing built for handymen. Quote odd jobs and multi-day projects, get client approval online, and invoice without paying per teammate.",
};

export default function HandymenPage() {
  return (
    <TradePage
      tradeName="handymen"
      headline="Quoting and invoicing built for handymen"
      subhead="From a quick punch list to a multi-day project, quote it, get the client's sign-off online, and invoice without a per-seat software bill."
      painPoints={[
        {
          title: "A punch list is a lot of small line items",
          body: "Handyman work is rarely one task — it's a list of small jobs on one visit. Krewbill's line-item builder handles a long list just as easily as a single big-ticket item.",
        },
        {
          title: "Estimates on the spot matter",
          body: "Clients often want a number before you leave. Build the quote from your phone and send the approval link right there, instead of promising to \"follow up with a number.\"",
        },
        {
          title: "Solo today, a helper tomorrow",
          body: "A lot of handyman businesses start as one person and add help as work picks up. Krewbill doesn't charge more when you bring someone on — the price you start with is the price you keep.",
        },
        {
          title: "Looking professional matters more when you're small",
          body: "A branded, professional quote and invoice — not a text message with a number in it — is one of the easiest ways to look established next to bigger competitors.",
        },
      ]}
      highlights={[
        "Quotes and invoices clients can approve and pay attention to from any device, with a digital signature",
        "Labor, materials, and flat-fee line items for a quick punch list or a bigger project",
        "Branded PDFs with your business name and logo, not a generic template",
        "Works just as well solo as it does once you bring on help",
        "No scheduling or dispatch bloat to learn — just quoting and invoicing, done well",
      ]}
    />
  );
}
