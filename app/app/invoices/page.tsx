import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function InvoicesPage() {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, status, total, due_date, created_at, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Invoices</h1>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Client</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Total</th>
            <th className="py-2 font-medium">Due</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.map((inv) => {
            const client = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
            return (
              <tr key={inv.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">
                  <Link href={`/app/invoices/${inv.id}`} className="underline">
                    {client?.name ?? "Unknown client"}
                  </Link>
                </td>
                <td className="py-2 capitalize">{inv.status}</td>
                <td className="py-2">{formatCurrency(inv.total)}</td>
                <td className="py-2 text-black/50 dark:text-white/50">{formatDate(inv.due_date)}</td>
              </tr>
            );
          })}
          {invoices?.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-black/50 dark:text-white/50">
                {membership.role === "owner" ? "No invoices yet." : "No invoices assigned to you yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
