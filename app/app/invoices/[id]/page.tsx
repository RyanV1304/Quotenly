import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import {
  updateInvoiceDetails,
  sendInvoice,
  markInvoicePaid,
  sendReminderNow,
  editSentInvoice,
} from "@/app/actions/invoices";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import LineItemsEditor from "@/components/LineItemsEditor";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; edit?: string }>;
}) {
  const { id } = await params;
  const { error, edit } = await searchParams;
  const membership = await requireMembership();
  const supabase = await createClient();

  const [{ data: invoice }, { data: lineItems }, { data: members }, { data: templates }] = await Promise.all([
    supabase.from("invoices").select("*, clients(id, name)").eq("id", id).single(),
    supabase.from("invoice_line_items").select("*").eq("invoice_id", id).order("sort_order"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
    supabase.from("line_item_templates").select("*").eq("workspace_id", membership.workspaceId).order("label"),
  ]);

  if (!invoice) notFound();

  const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;
  const updateAction = updateInvoiceDetails.bind(null, id);
  const sendAction = sendInvoice.bind(null, id);
  const paidAction = markInvoicePaid.bind(null, id);
  const reminderAction = sendReminderNow.bind(null, id);
  const editAction = editSentInvoice.bind(null, id);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.share_token}`;
  const isOverdue =
    invoice.due_date &&
    invoice.status !== "paid" &&
    new Date(invoice.due_date) < new Date();

  const isEditable = ["sent", "viewed", "overdue"].includes(invoice.status);
  const isEditing = edit === "1" && isEditable;

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
            <CopyLinkButton url={shareUrl} />
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
          {invoice.status !== "paid" && invoice.status !== "draft" && !isEditing && (
            <form action={reminderAction}>
              <button type="submit" className="btn-secondary">
                Send reminder now
              </button>
            </form>
          )}
          {isEditable && !isEditing && (
            <Link href={`/app/invoices/${id}?edit=1`} className="btn-secondary">
              Edit
            </Link>
          )}
        </div>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {invoice.status === "paid" && (
        <div className="alert-success">
          Paid {invoice.paid_at ? formatDate(invoice.paid_at) : ""}
          {invoice.paid_note && <> &mdash; {invoice.paid_note}</>}
        </div>
      )}

      {invoice.status !== "paid" && !isEditing && (
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

      {isEditing ? (
        <form action={editAction} className="flex flex-col gap-4">
          <p className="alert-warning">
            This invoice has already been sent. Saving changes will notify the client by email and reset the
            &quot;viewed&quot; status so you can see whether they&apos;ve looked at the update.
          </p>
          <LineItemsEditor
            templates={templates ?? []}
            initialTaxRate={invoice.tax_rate}
            initialItems={(lineItems ?? []).map((li) => ({
              description: li.description,
              type: li.type,
              quantity: li.quantity,
              rate: li.rate,
            }))}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary w-fit">
              Save and notify client
            </button>
            <Link href={`/app/invoices/${id}`} className="btn-secondary w-fit">
              Cancel
            </Link>
          </div>
        </form>
      ) : (
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
        </>
      )}
    </div>
  );
}
