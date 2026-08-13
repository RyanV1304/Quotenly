import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default async function QuotesPage() {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, status, total, created_at, clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Quotes</h1>
        <Link href="/app/quotes/new" className="btn-primary">
          New quote
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Total</th>
              <th className="px-4 py-2.5 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {quotes?.map((q) => {
              const client = Array.isArray(q.clients) ? q.clients[0] : q.clients;
              return (
                <tr key={q.id} className="bg-white">
                  <td className="px-4 py-2.5">
                    <Link href={`/app/quotes/${q.id}`} className="font-medium text-brand hover:underline">
                      {client?.name ?? "Unknown client"}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(q.total)}</td>
                  <td className="px-4 py-2.5 text-ink-faint">{formatDate(q.created_at)}</td>
                </tr>
              );
            })}
            {quotes?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                  {membership.role === "owner" ? "No quotes yet." : "No quotes assigned to you yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
