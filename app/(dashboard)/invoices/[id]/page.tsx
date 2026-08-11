import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateInvoiceDetails, sendInvoice, markInvoicePaid } from "@/app/actions/invoices";
import { formatCurrency } from "@/lib/format";

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
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.share_token}`;
  const isOverdue =
    invoice.due_date &&
    invoice.status !== "paid" &&
    new Date(invoice.due_date) < new Date();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link href="/invoices" className="text-sm underline">
        &larr; Back to invoices
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Invoice for {client?.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Status: <span className="capitalize">{isOverdue ? "overdue" : invoice.status}</span> &middot;{" "}
            <a href={shareUrl} target="_blank" className="underline" rel="noreferrer">
              Public link
            </a>{" "}
            &middot;{" "}
            <a href={`/api/invoices/${id}/pdf`} className="underline" target="_blank" rel="noreferrer">
              Download PDF
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <form action={sendAction}>
              <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
                Send to client
              </button>
            </form>
          )}
          {invoice.status !== "paid" && (
            <form action={paidAction}>
              <button type="submit" className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30">
                Mark as paid
              </button>
            </form>
          )}
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

      <p className="text-right text-sm font-medium">Total: {formatCurrency(invoice.total)}</p>

      <form action={updateAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Assign to
          <select name="assigned_to" defaultValue={invoice.assigned_to ?? ""} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20">
            <option value="">Unassigned</option>
            {members?.map((m) => (
              <option key={m.user_id} value={m.user_id ?? ""}>
                {m.invited_email}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Due date
          <input type="date" name="due_date" defaultValue={invoice.due_date ?? ""} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Payment instructions
          <textarea name="payment_instructions" defaultValue={invoice.payment_instructions ?? ""} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20" placeholder="Pay via check, cash, or Zelle to..." />
        </label>
        <button type="submit" className="w-fit rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30">
          Save changes
        </button>
      </form>
    </div>
  );
}
