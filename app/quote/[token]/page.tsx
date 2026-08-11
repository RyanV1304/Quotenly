import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { approveQuote } from "@/app/actions/public";
import { formatCurrency } from "@/lib/format";
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

  const [{ data: clients }, { data: brandings }] = await Promise.all([
    supabase.rpc("get_client_public_info", { p_client_id: quote.client_id }),
    supabase.rpc("get_branding_public_info", { p_workspace_id: quote.workspace_id }),
  ]);
  const client = clients?.[0];
  const branding = brandings?.[0];

  const approveAction = approveQuote.bind(null, token);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        {branding?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={branding.logo_url} alt={branding.business_name ?? ""} className="mb-2 h-12" />
        )}
        <h1 className="text-2xl font-semibold">{branding?.business_name ?? "Quote"}</h1>
        {branding?.address && <p className="text-sm text-black/60 dark:text-white/60">{branding.address}</p>}
        {branding?.phone && <p className="text-sm text-black/60 dark:text-white/60">{branding.phone}</p>}
      </div>

      <div>
        <p className="text-sm text-black/60 dark:text-white/60">Prepared for</p>
        <p className="font-medium">{client?.name}</p>
        {client?.job_address && <p className="text-sm text-black/60 dark:text-white/60">{client.job_address}</p>}
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 font-medium">Type</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Rate</th>
            <th className="py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(lineItems as LineItem[] | null)?.map((li) => (
            <tr key={li.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{li.description}</td>
              <td className="py-2 capitalize">{li.type}</td>
              <td className="py-2">{li.quantity}</td>
              <td className="py-2">{formatCurrency(li.rate)}</td>
              <td className="py-2">{formatCurrency(li.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-end gap-1 text-sm">
        <div>Subtotal: {formatCurrency(quote.subtotal)}</div>
        <div className="text-lg font-semibold">Total: {formatCurrency(quote.total)}</div>
      </div>

      <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <p className="text-sm">
          Status: <span className="font-medium capitalize">{quote.status}</span>
        </p>
        {quote.status === "sent" && (
          <form action={approveAction} className="mt-3">
            <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
              Approve this quote
            </button>
          </form>
        )}
        {quote.status === "approved" && (
          <p className="mt-2 text-green-700 dark:text-green-400">You&apos;ve approved this quote. Thank you!</p>
        )}
      </div>
    </div>
  );
}
