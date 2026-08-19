import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatCurrency, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const membership = await requireMembership();
  const supabase = await createClient();
  const { success } = await searchParams;
  const ownershipBanner = success === "ownership-transferred" && (
    <p className="alert-success">Ownership was transferred. Your role has been updated.</p>
  );

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
      <div className="flex flex-col gap-10">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Your jobs</h1>
        {ownershipBanner}
        <JobSection title="Quotes" rows={quotes ?? []} kind="quotes" />
        <JobSection title="Invoices" rows={invoices ?? []} kind="invoices" />
      </div>
    );
  }

  const [{ data: invoices }, { data: members }, { data: allQuotes }] = await Promise.all([
    supabase.from("invoices").select("id, status, total, created_at, assigned_to"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email, role")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
    supabase.from("quotes").select("id, status, assigned_to"),
  ]);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const totalOutstanding = (invoices ?? [])
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + i.total, 0);

  const totalPaidThisMonth = (invoices ?? [])
    .filter((i) => i.status === "paid" && new Date(i.created_at) >= startOfMonth)
    .reduce((sum, i) => sum + i.total, 0);

  const memberUserIds = (members ?? []).map((m) => m.user_id).filter((id): id is string => !!id);
  const { data: profiles } = memberUserIds.length
    ? await supabase.from("users").select("id, name").in("id", memberUserIds)
    : { data: [] as { id: string; name: string }[] };
  const nameByUserId = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const breakdown = (members ?? []).map((m) => {
    const quoteCount = (allQuotes ?? []).filter((q) => q.assigned_to === m.user_id).length;
    const memberInvoices = (invoices ?? []).filter((i) => i.assigned_to === m.user_id);
    return {
      key: m.user_id ?? m.invited_email,
      name: (m.user_id && nameByUserId.get(m.user_id)) || m.invited_email,
      quoteCount,
      invoiceCount: memberInvoices.length,
      invoiceTotal: memberInvoices.reduce((sum, i) => sum + i.total, 0),
    };
  });

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
      {ownershipBanner}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-line bg-bg-white p-5">
          <p className="text-sm text-ink-soft">Total outstanding</p>
          <p className="font-mono mt-1.5 text-2xl font-bold text-ink">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="rounded-lg border border-line bg-bg-white p-5">
          <p className="text-sm text-ink-soft">Paid this month</p>
          <p className="font-mono mt-1.5 text-2xl font-bold text-ink">{formatCurrency(totalPaidThisMonth)}</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink">Per-teammate breakdown</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Teammate</th>
                <th className="px-4 py-2.5 font-semibold">Quotes</th>
                <th className="px-4 py-2.5 font-semibold">Invoices</th>
                <th className="px-4 py-2.5 font-semibold">Invoice total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {breakdown.map((b) => (
                <tr key={b.key} className="bg-bg-white">
                  <td className="px-4 py-2.5 text-ink">{b.name}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{b.quoteCount}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{b.invoiceCount}</td>
                  <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(b.invoiceTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink-faint">Nothing assigned yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const client = Array.isArray(r.clients) ? r.clients[0] : r.clients;
                return (
                  <tr key={r.id} className="bg-bg-white">
                    <td className="px-4 py-2.5">
                      <Link href={`/app/${kind}/${r.id}`} className="font-medium text-brand hover:underline">
                        {client?.name ?? "Unknown client"}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(r.total)}</td>
                    <td className="px-4 py-2.5 text-ink-faint">{formatDate(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
