import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function DashboardPage() {
  const membership = await requireMembership();
  const supabase = await createClient();

  if (membership.role === "teammate") {
    const [{ data: quotes }, { data: invoices }] = await Promise.all([
      supabase
        .from("quotes")
        .select("id, status, total, created_at, clients(name)")
        .eq("assigned_to", membership.userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("invoices")
        .select("id, status, total, created_at, clients(name)")
        .eq("assigned_to", membership.userId)
        .order("created_at", { ascending: false }),
    ]);

    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-semibold">Your jobs</h1>
        <JobSection title="Quotes" rows={quotes ?? []} kind="quotes" />
        <JobSection title="Invoices" rows={invoices ?? []} kind="invoices" />
      </div>
    );
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, status, total, created_at, assigned_to");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const totalOutstanding = (invoices ?? [])
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.total, 0);

  const totalPaidThisMonth = (invoices ?? [])
    .filter((i) => i.status === "paid" && new Date(i.created_at) >= startOfMonth)
    .reduce((sum, i) => sum + i.total, 0);

  const { data: members } = await supabase
    .from("workspace_members")
    .select("user_id, invited_email, role")
    .eq("workspace_id", membership.workspaceId)
    .not("joined_at", "is", null);

  const memberUserIds = (members ?? []).map((m) => m.user_id).filter((id): id is string => !!id);
  const { data: profiles } = memberUserIds.length
    ? await supabase.from("users").select("id, name").in("id", memberUserIds)
    : { data: [] as { id: string; name: string }[] };
  const nameByUserId = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const { data: allQuotes } = await supabase.from("quotes").select("id, status, assigned_to");
  const { data: allInvoices } = await supabase.from("invoices").select("id, status, assigned_to, total");

  const breakdown = (members ?? []).map((m) => {
    const quoteCount = (allQuotes ?? []).filter((q) => q.assigned_to === m.user_id).length;
    const memberInvoices = (allInvoices ?? []).filter((i) => i.assigned_to === m.user_id);
    return {
      key: m.user_id ?? m.invited_email,
      name: (m.user_id && nameByUserId.get(m.user_id)) || m.invited_email,
      quoteCount,
      invoiceCount: memberInvoices.length,
      invoiceTotal: memberInvoices.reduce((sum, i) => sum + i.total, 0),
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/60 dark:text-white/60">Total outstanding</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/60 dark:text-white/60">Paid this month</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalPaidThisMonth)}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Per-teammate breakdown</h2>
        <table className="mt-2 w-full text-left text-sm">
          <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
            <tr>
              <th className="py-2 font-medium">Teammate</th>
              <th className="py-2 font-medium">Quotes</th>
              <th className="py-2 font-medium">Invoices</th>
              <th className="py-2 font-medium">Invoice total</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((b) => (
              <tr key={b.key} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">{b.name}</td>
                <td className="py-2">{b.quoteCount}</td>
                <td className="py-2">{b.invoiceCount}</td>
                <td className="py-2">{formatCurrency(b.invoiceTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobSection({
  title,
  rows,
  kind,
}: {
  title: string;
  rows: { id: string; status: string; total: number; created_at: string; clients: { name: string } | { name: string }[] | null }[];
  kind: "quotes" | "invoices";
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-black/50 dark:text-white/50">Nothing assigned yet.</p>
      ) : (
        <table className="mt-2 w-full text-left text-sm">
          <tbody>
            {rows.map((r) => {
              const client = Array.isArray(r.clients) ? r.clients[0] : r.clients;
              return (
                <tr key={r.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2">
                    <Link href={`/app/${kind}/${r.id}`} className="underline">
                      {client?.name ?? "Unknown client"}
                    </Link>
                  </td>
                  <td className="py-2 capitalize">{r.status}</td>
                  <td className="py-2">{formatCurrency(r.total)}</td>
                  <td className="py-2 text-black/50 dark:text-white/50">{formatDate(r.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
