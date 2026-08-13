import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateInvoiceDetails, sendInvoice, markInvoicePaid, sendReminderNow } from "@/app/actions/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(id, name)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const [{ data: lineItems }, { data: members }] = await Promise.all([
    supabase.from("invoice_line_items").select("*").eq("invoice_id", id).order("sort_order"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
  ]);

  const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;
  const updateAction = updateInvoiceDetails.bind(null, id);
  const sendAction = sendInvoice.bind(null, id);
  const paidAction = markInvoicePaid.bind(null, id);
  const reminderAction = sendReminderNow.bind(null, id);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.share_token}`;
  const isOverdue =
    invoice.due_date &&
    invoice.status !== "paid" &&
    new Date(invoice.due_date) < new Date();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link href="/app/invoices" className="btn-link w-fit">
        &larr; Back to invoices
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Invoice for {client?.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <StatusBadge status={isOverdue ? "overdue" : invoice.status} />
            <a href={shareUrl} target="_blank" className="btn-link" rel="noreferrer">
              Public link
            </a>
            <a href={`/api/invoices/${id}/pdf`} className="btn-link" target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {invoice.status === "draft" && (
            <form action={sendAction}>
              <button type="submit" className="btn-primary">
                Send to client
              </button>
            </form>
          )}
          {invoice.status !== "paid" && invoice.status !== "draft" && (
            <form action={reminderAction}>
              <button type="submit" className="btn-secondary">
                Send reminder now
              </button>
            </form>
          )}
        </div>
      </div>

      {invoice.status === "paid" ? (
        <div className="alert-success">
          Paid {invoice.paid_at ? formatDate(invoice.paid_at) : ""}
          {invoice.paid_note && <> &mdash; {invoice.paid_note}</>}
        </div>
      ) : (
        <details className="group rounded-lg border border-line bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink">Mark as paid</summary>
          <form action={paidAction} className="mt-3 flex flex-col gap-3">
            <label className="field-label">
              Payment date
              <input
                type="date"
                name="paidDate"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="input"
              />
            </label>
            <label className="field-label">
              Note (optional)
              <input name="paidNote" placeholder="e.g. Paid via Zelle" className="input" />
            </label>
            <button type="submit" className="btn-primary w-fit">
              Confirm paid
            </button>
          </form>
        </details>
      )}

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

      <p className="font-mono text-right text-base font-semibold text-ink">Total: {formatCurrency(invoice.total)}</p>

      <form action={updateAction} className="flex flex-col gap-4">
        <label className="field-label">
          Assign to
          <select name="assigned_to" defaultValue={invoice.assigned_to ?? ""} className="input">
            <option value="">Unassigned</option>
            {members?.map((m) => (
              <option key={m.user_id} value={m.user_id ?? ""}>
                {m.invited_email}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Due date
          <input type="date" name="due_date" defaultValue={invoice.due_date ?? ""} className="input" />
        </label>
        <label className="field-label">
          Payment instructions
          <textarea
            name="payment_instructions"
            defaultValue={invoice.payment_instructions ?? ""}
            className="input"
            placeholder="Pay via check, cash, or Zelle to..."
          />
        </label>
        <button type="submit" className="btn-secondary w-fit">
          Save changes
        </button>
      </form>
    </div>
  );
}
