import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ExportCsvButton from "@/components/ExportCsvButton";

const STATUS_OPTIONS = ["draft", "sent", "viewed", "overdue", "paid"] as const;

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const membership = await requireMembership();
  const { status: statusFilter } = await searchParams;
  const supabase = await createClient();

  let invoicesQuery = supabase
    .from("invoices")
    .select("id, invoice_number, status, total, due_date, created_at, clients(name)")
    .order("created_at", { ascending: false });
  if (statusFilter && (STATUS_OPTIONS as readonly string[]).includes(statusFilter)) {
    invoicesQuery = invoicesQuery.eq("status", statusFilter);
  }
  const { data: invoices } = await invoicesQuery;

  const invoiceIds = (invoices ?? []).map((inv) => inv.id);
  const { data: linkedJobs } = invoiceIds.length
    ? await supabase.from("jobs").select("invoice_id, title").in("invoice_id", invoiceIds)
    : { data: [] as { invoice_id: string | null; title: string }[] };
  const jobTitleByInvoiceId = new Map((linkedJobs ?? []).map((j) => [j.invoice_id, j.title]));

  const csvColumns = ["Client", "Job", "Invoice #", "Status", "Total", "Due date", "Created"];
  const csvRows = (invoices ?? []).map((inv) => {
    const client = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
    return [
      client?.name ?? "Unknown client",
      jobTitleByInvoiceId.get(inv.id) ?? "",
      inv.invoice_number ? `INV-${inv.invoice_number}` : "",
      inv.status,
      inv.total.toFixed(2),
      inv.due_date ?? "",
      inv.created_at.slice(0, 10),
    ];
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Invoices</h1>
        <div className="flex gap-2">
          <ExportCsvButton
            filename={statusFilter ? `invoices-${statusFilter}.csv` : "invoices.csv"}
            columns={csvColumns}
            rows={csvRows}
          />
          <Link href="/app/quotes" className="btn-primary">
            Add invoice
          </Link>
        </div>
      </div>
      <p className="-mt-4 text-sm text-ink-soft">
        Invoices are created from approved quotes. Pick a quote on the next page to convert it.
      </p>

      <form className="flex items-center gap-2">
        <select name="status" defaultValue={statusFilter ?? ""} className="input w-40">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Filter
        </button>
        {statusFilter && (
          <Link href="/app/invoices" className="btn-link">
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-semibold">#</th>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Total</th>
              <th className="px-4 py-2.5 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {invoices?.map((inv) => {
              const client = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
              return (
                <tr key={inv.id} className="bg-bg-white">
                  <td className="font-mono px-4 py-2.5 text-ink-faint">
                    {inv.invoice_number ? `INV-${inv.invoice_number}` : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link href={`/app/invoices/${inv.id}`} className="font-medium text-brand hover:underline">
                      {client?.name ?? "Unknown client"}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-2.5 text-ink-faint">{formatDate(inv.due_date)}</td>
                </tr>
              );
            })}
            {invoices?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-faint">
                  {statusFilter
                    ? `No ${statusFilter} invoices.`
                    : membership.role === "owner"
                      ? "No invoices yet."
                      : "No invoices assigned to you yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
