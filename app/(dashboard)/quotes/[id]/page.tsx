import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateQuote, sendQuote, convertToInvoice } from "@/app/actions/quotes";
import LineItemsEditor from "@/components/LineItemsEditor";
import { formatCurrency } from "@/lib/format";

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
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.share_token}`;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link href="/quotes" className="text-sm underline">
        &larr; Back to quotes
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quote for {client?.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Status: <span className="capitalize">{quote.status}</span> &middot;{" "}
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
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

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

        <button type="submit" className="w-fit rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30">
          Save changes
        </button>
      </form>

      <p className="text-sm font-medium">Total: {formatCurrency(quote.total)}</p>
    </div>
  );
}
