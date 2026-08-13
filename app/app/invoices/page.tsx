import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default async function InvoicesPage() {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, status, total, due_date, created_at, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Invoices</h1>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
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
                <tr key={inv.id} className="bg-white">
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
                <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                  {membership.role === "owner" ? "No invoices yet." : "No invoices assigned to you yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
