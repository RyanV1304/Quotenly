import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateQuote, sendQuote, convertToInvoice, duplicateQuote } from "@/app/actions/quotes";
import LineItemsEditor from "@/components/LineItemsEditor";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(id, name)")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const [{ data: lineItems }, { data: members }, { data: templates }] = await Promise.all([
    supabase.from("quote_line_items").select("*").eq("quote_id", id).order("sort_order"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
    supabase.from("line_item_templates").select("*").eq("workspace_id", membership.workspaceId).order("label"),
  ]);

  const client = Array.isArray(quote.clients) ? quote.clients[0] : quote.clients;
  const updateAction = updateQuote.bind(null, id);
  const sendAction = sendQuote.bind(null, id);
  const convertAction = convertToInvoice.bind(null, id);
  const duplicateAction = duplicateQuote.bind(null, id);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.share_token}`;
  const readOnly = quote.status !== "draft";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link href="/app/quotes" className="text-sm underline">
        &larr; Back to quotes
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quote for {client?.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Status: <span className="capitalize">{quote.status}</span>
            {quote.viewed_at && <> &middot; Viewed {formatDate(quote.viewed_at)}</>} &middot;{" "}
            <a href={shareUrl} target="_blank" className="underline" rel="noreferrer">
              Public link
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          {quote.status === "draft" && (
            <form action={sendAction}>
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
                Send to client
              </button>
            </form>
          )}
          {quote.status === "approved" && (
            <form action={convertAction}>
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
                Convert to invoice
              </button>
            </form>
          )}
          {quote.status === "declined" && (
            <form action={duplicateAction}>
              <button type="submit" className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30">
                Duplicate as new draft
              </button>
            </form>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {readOnly ? (
        <>
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
              {lineItems?.map((li) => (
                <tr key={li.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2">{li.description}</td>
                  <td className="py-2">{li.quantity}</td>
                  <td className="py-2">{formatCurrency(li.rate)}</td>
                  <td className="py-2">{formatCurrency(li.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {quote.notes && (
            <div className="text-sm">
              <p className="text-black/60 dark:text-white/60">Notes</p>
              <p>{quote.notes}</p>
            </div>
          )}
        </>
      ) : (
        <form action={updateAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Assign to
            <select name="assigned_to" defaultValue={quote.assigned_to ?? ""} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20">
              <option value="">Unassigned</option>
              {members?.map((m) => (
                <option key={m.user_id} value={m.user_id ?? ""}>
                  {m.invited_email}
                </option>
              ))}
            </select>
          </label>

          <LineItemsEditor
            templates={templates ?? []}
            initialTaxRate={quote.tax_rate}
            initialItems={(lineItems ?? []).map((li) => ({
              description: li.description,
              type: li.type,
              quantity: li.quantity,
              rate: li.rate,
            }))}
          />

          <label className="flex flex-col gap-1 text-sm">
            Notes
            <textarea
              name="notes"
              defaultValue={quote.notes ?? ""}
              className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            />
          </label>

          <button type="submit" className="w-fit rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30">
            Save changes
          </button>
        </form>
      )}

      <p className="text-sm font-medium">Total: {formatCurrency(quote.total)}</p>
    </div>
  );
}
