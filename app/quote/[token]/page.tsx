import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveQuote, declineQuote, markQuoteViewed } from "@/app/actions/public";
import { formatCurrency } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import type { LineItem } from "@/lib/types";

export default async function PublicQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const [{ data: quotes }, { data: lineItems }] = await Promise.all([
    supabase.rpc("get_quote_by_token", { p_token: token }),
    supabase.rpc("get_quote_line_items_by_token", { p_token: token }),
  ]);

  const quote = quotes?.[0];
  if (!quote) notFound();

  if (quote.status === "sent") {
    await markQuoteViewed(token);
  }

  const [{ data: clients }, { data: brandings }] = await Promise.all([
    supabase.rpc("get_client_public_info", { p_client_id: quote.client_id }),
    supabase.rpc("get_branding_public_info", { p_workspace_id: quote.workspace_id }),
  ]);
  const client = clients?.[0];
  const branding = brandings?.[0];

  const approveAction = approveQuote.bind(null, token);
  const declineAction = declineQuote.bind(null, token);

  return (
    <div className="min-h-screen bg-bg-white px-4 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div>
          {branding?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo_url} alt={branding.business_name ?? ""} className="mb-2 h-12" />
          )}
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{branding?.business_name ?? "Quote"}</h1>
          {branding?.address && <p className="text-sm text-ink-soft">{branding.address}</p>}
          {branding?.phone && <p className="text-sm text-ink-soft">{branding.phone}</p>}
        </div>

        <div>
          <p className="text-sm text-ink-faint">Prepared for</p>
          <p className="font-medium text-ink">{client?.name}</p>
          {client?.job_address && <p className="text-sm text-ink-soft">{client.job_address}</p>}
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Description</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Qty</th>
                <th className="px-4 py-2.5 font-semibold">Rate</th>
                <th className="px-4 py-2.5 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(lineItems as LineItem[] | null)?.map((li) => (
                <tr key={li.id} className="bg-white">
                  <td className="px-4 py-2.5 text-ink">{li.description}</td>
                  <td className="px-4 py-2.5 capitalize text-ink-soft">{li.type}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{li.quantity}</td>
                  <td className="font-mono px-4 py-2.5 text-ink-soft">{formatCurrency(li.rate)}</td>
                  <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(li.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quote.notes && (
          <div className="rounded-lg border border-line bg-white p-4 text-sm">
            <p className="text-ink-faint">Notes</p>
            <p className="mt-1 text-ink">{quote.notes}</p>
          </div>
        )}

        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="font-mono text-ink-soft">Subtotal: {formatCurrency(quote.subtotal)}</div>
          <div className="font-mono text-lg font-bold text-ink">Total: {formatCurrency(quote.total)}</div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm">
            Status: <StatusBadge status={quote.status} />
          </p>
          {quote.status === "sent" && (
            <div className="mt-4 flex gap-2">
              <form action={approveAction}>
                <button type="submit" className="btn-primary">
                  Approve this quote
                </button>
              </form>
              <form action={declineAction}>
                <button type="submit" className="btn-secondary">
                  Decline
                </button>
              </form>
            </div>
          )}
          {quote.status === "approved" && (
            <p className="mt-3 font-medium text-success">You&apos;ve approved this quote. Thank you!</p>
          )}
          {quote.status === "declined" && (
            <p className="mt-3 text-ink-soft">You&apos;ve declined this quote.</p>
          )}
        </div>
      </div>
    </div>
  );
}
