import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";

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
        <h1 className="text-xl font-semibold">Quotes</h1>
        <Link href="/app/quotes/new" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
          New quote
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Client</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Total</th>
            <th className="py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {quotes?.map((q) => {
            const client = Array.isArray(q.clients) ? q.clients[0] : q.clients;
            return (
              <tr key={q.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">
                  <Link href={`/app/quotes/${q.id}`} className="underline">
                    {client?.name ?? "Unknown client"}
                  </Link>
                </td>
                <td className="py-2 capitalize">{q.status}</td>
                <td className="py-2">{formatCurrency(q.total)}</td>
                <td className="py-2 text-black/50 dark:text-white/50">{formatDate(q.created_at)}</td>
              </tr>
            );
          })}
          {quotes?.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-black/50 dark:text-white/50">
                {membership.role === "owner" ? "No quotes yet." : "No quotes assigned to you yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
