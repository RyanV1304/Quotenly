import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateQuote, sendQuote, convertToInvoice, duplicateQuote } from "@/app/actions/quotes";
import LineItemsEditor from "@/components/LineItemsEditor";
import StatusBadge from "@/components/StatusBadge";
import CopyLinkButton from "@/components/CopyLinkButton";
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

  const [{ data: quote }, { data: lineItems }, { data: members }, { data: templates }, { data: existingInvoice }] =
    await Promise.all([
      supabase.from("quotes").select("*, clients(id, name)").eq("id", id).single(),
      supabase.from("quote_line_items").select("*").eq("quote_id", id).order("sort_order"),
      supabase
        .from("workspace_members")
        .select("user_id, invited_email")
        .eq("workspace_id", membership.workspaceId)
        .not("joined_at", "is", null),
      supabase.from("line_item_templates").select("*").eq("workspace_id", membership.workspaceId).order("label"),
      supabase.from("invoices").select("id").eq("quote_id", id).maybeSingle(),
    ]);

  if (!quote) notFound();

  const client = Array.isArray(quote.clients) ? quote.clients[0] : quote.clients;
  const updateAction = updateQuote.bind(null, id);
  const sendAction = sendQuote.bind(null, id);
  const convertAction = convertToInvoice.bind(null, id);
  const duplicateAction = duplicateQuote.bind(null, id);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.share_token}`;
  const readOnly = quote.status !== "draft";

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link href="/app/quotes" className="btn-link w-fit">
        &larr; Back to quotes
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Quote for {client?.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <StatusBadge status={quote.status} />
            {quote.viewed_at && <span>Viewed {formatDate(quote.viewed_at)}</span>}
            <a href={shareUrl} target="_blank" className="btn-link" rel="noreferrer">
              Public link
            </a>
            <CopyLinkButton url={shareUrl} />
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {quote.status === "draft" && (
            <form action={sendAction}>
              <button type="submit" className="btn-primary">
                Send to client
              </button>
            </form>
          )}
          {quote.status === "approved" && !existingInvoice && (
            <form action={convertAction}>
              <button type="submit" className="btn-primary">
                Convert to invoice
              </button>
            </form>
          )}
          {existingInvoice && (
            <Link href={`/app/invoices/${existingInvoice.id}`} className="btn-secondary">
              View invoice
            </Link>
          )}
          {quote.status === "declined" && (
            <form action={duplicateAction}>
              <button type="submit" className="btn-secondary">
                Duplicate as new draft
              </button>
            </form>
          )}
        </div>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {readOnly ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                  <th className="px-4 py-2.5 font-semibold">Qty</th>
                  <th className="px-4 py-2.5 font-semibold">Rate</th>
                  <th className="px-4 py-2.5 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {lineItems?.map((li) => (
                  <tr key={li.id} className="bg-bg-white">
                    <td className="px-4 py-2.5 text-ink">{li.description}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{li.quantity}</td>
                    <td className="font-mono px-4 py-2.5 text-ink-soft">{formatCurrency(li.rate)}</td>
                    <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(li.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {quote.notes && (
            <div className="rounded-lg border border-line bg-bg-white p-4 text-sm">
              <p className="text-ink-faint">Notes</p>
              <p className="mt-1 text-ink">{quote.notes}</p>
            </div>
          )}
          {quote.exclusions && (
            <div className="rounded-lg border border-line bg-bg-white p-4 text-sm">
              <p className="text-ink-faint">Not included</p>
              <p className="mt-1 text-ink">{quote.exclusions}</p>
            </div>
          )}
          {quote.signature_url && (
            <div className="rounded-lg border border-line bg-bg-white p-4 text-sm">
              <p className="text-ink-faint">Client signature</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={quote.signature_url} alt="Client signature" className="mt-2 h-20 rounded border border-line bg-white" />
            </div>
          )}
        </>
      ) : (
        <form action={updateAction} className="flex flex-col gap-4">
          <label className="field-label">
            Assign to
            <select name="assigned_to" defaultValue={quote.assigned_to ?? ""} className="input">
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

          <label className="field-label">
            Notes
            <textarea name="notes" defaultValue={quote.notes ?? ""} className="input" />
          </label>

          <label className="field-label">
            Exclusions / What&apos;s not included
            <textarea
              name="exclusions"
              defaultValue={quote.exclusions ?? ""}
              className="input"
              placeholder="e.g. Permits, drywall repair, paint touch-up"
            />
            <span className="text-xs font-normal text-ink-faint">
              Optional. Shown to the client as &quot;Not included&quot;, separate from your notes above.
            </span>
          </label>

          <button type="submit" className="btn-secondary w-fit">
            Save changes
          </button>
        </form>
      )}

      <p className="font-mono text-right text-base font-semibold text-ink">Total: {formatCurrency(quote.total)}</p>
    </div>
  );
}
