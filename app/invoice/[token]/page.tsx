import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markInvoiceViewed } from "@/app/actions/public";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import PoweredByBadge from "@/components/PoweredByBadge";
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
    <div className="min-h-screen bg-bg-white px-4 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div>
          {branding?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo_url} alt={branding.business_name ?? ""} className="mb-2 h-12" />
          )}
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            {branding?.business_name ?? "Invoice"}
            {invoice.invoice_number && (
              <span className="ml-2 font-mono text-base font-medium text-ink-faint">INV-{invoice.invoice_number}</span>
            )}
          </h1>
          {branding?.address && <p className="text-sm text-ink-soft">{branding.address}</p>}
          {branding?.phone && <p className="text-sm text-ink-soft">{branding.phone}</p>}
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-sm text-ink-faint">Billed to</p>
            <p className="font-medium text-ink">{client?.name}</p>
            {client?.job_address && <p className="text-sm text-ink-soft">{client.job_address}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-faint">Due date</p>
            <p className="font-medium text-ink">{formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Description</th>
                <th className="px-4 py-2.5 font-semibold">Qty</th>
                <th className="px-4 py-2.5 font-semibold">Rate</th>
                <th className="px-4 py-2.5 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(lineItems as LineItem[] | null)?.map((li) => (
                <tr key={li.id} className="bg-white">
                  <td className="px-4 py-2.5 text-ink">{li.description}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{li.quantity}</td>
                  <td className="font-mono px-4 py-2.5 text-ink-soft">{formatCurrency(li.rate)}</td>
                  <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(li.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="font-mono text-ink-soft">Subtotal: {formatCurrency(invoice.subtotal)}</div>
          <div className="font-mono text-lg font-bold text-ink">Total: {formatCurrency(invoice.total)}</div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm font-medium">
            Status: <StatusBadge status={invoice.status} />
          </p>
          {invoice.payment_instructions && (
            <>
              <p className="mt-3 text-sm text-ink-faint">How to pay</p>
              <p className="text-sm text-ink">{invoice.payment_instructions}</p>
            </>
          )}
        </div>

        <PoweredByBadge />
      </div>
    </div>
  );
}
