import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markInvoiceViewed } from "@/app/actions/public";
import { formatCurrency, formatDate } from "@/lib/format";
import type { LineItem } from "@/lib/types";

export default async function PublicInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const [{ data: invoices }, { data: lineItems }] = await Promise.all([
    supabase.rpc("get_invoice_by_token", { p_token: token }),
    supabase.rpc("get_invoice_line_items_by_token", { p_token: token }),
  ]);

  const invoice = invoices?.[0];
  if (!invoice) notFound();

  if (invoice.status === "sent") {
    await markInvoiceViewed(token);
  }

  const [{ data: clients }, { data: brandings }] = await Promise.all([
    supabase.rpc("get_client_public_info", { p_client_id: invoice.client_id }),
    supabase.rpc("get_branding_public_info", { p_workspace_id: invoice.workspace_id }),
  ]);
  const client = clients?.[0];
  const branding = brandings?.[0];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        {branding?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={branding.logo_url} alt={branding.business_name ?? ""} className="mb-2 h-12" />
        )}
        <h1 className="text-2xl font-semibold">{branding?.business_name ?? "Invoice"}</h1>
        {branding?.address && <p className="text-sm text-black/60 dark:text-white/60">{branding.address}</p>}
        {branding?.phone && <p className="text-sm text-black/60 dark:text-white/60">{branding.phone}</p>}
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-black/60 dark:text-white/60">Billed to</p>
          <p className="font-medium">{client?.name}</p>
          {client?.job_address && <p className="text-sm text-black/60 dark:text-white/60">{client.job_address}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm text-black/60 dark:text-white/60">Due date</p>
          <p className="font-medium">{formatDate(invoice.due_date)}</p>
        </div>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Rate</th>
            <th className="py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(lineItems as LineItem[] | null)?.map((li) => (
            <tr key={li.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{li.description}</td>
              <td className="py-2">{li.quantity}</td>
              <td className="py-2">{formatCurrency(li.rate)}</td>
              <td className="py-2">{formatCurrency(li.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-end gap-1 text-sm">
        <div>Subtotal: {formatCurrency(invoice.subtotal)}</div>
        <div className="text-lg font-semibold">Total: {formatCurrency(invoice.total)}</div>
      </div>

      <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <p className="text-sm font-medium">
          Status: <span className="capitalize">{invoice.status}</span>
        </p>
        {invoice.payment_instructions && (
          <>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">How to pay</p>
            <p className="text-sm">{invoice.payment_instructions}</p>
          </>
        )}
      </div>
    </div>
  );
}
