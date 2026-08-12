import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateClientRecord } from "@/app/actions/clients";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", membership.workspaceId)
    .single();

  if (!client) notFound();

  const [{ data: quotes }, { data: invoices }] = await Promise.all([
    supabase.from("quotes").select("id, status, total, created_at").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("id, status, total, created_at").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  const updateAction = updateClientRecord.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <Link href="/app/clients" className="text-sm underline">
        &larr; Back to clients
      </Link>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <details className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <summary className="cursor-pointer text-xl font-semibold">{client.name}</summary>
        <form action={updateAction} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" defaultValue={client.name} required className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="contact_email" type="email" defaultValue={client.contact_email ?? ""} placeholder="Email" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="contact_phone" defaultValue={client.contact_phone ?? ""} placeholder="Phone" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="job_address" defaultValue={client.job_address ?? ""} placeholder="Job address" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <textarea name="notes" defaultValue={client.notes ?? ""} placeholder="Notes" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <button type="submit" className="col-span-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
            Save changes
          </button>
        </form>
      </details>

      <div className="grid grid-cols-2 gap-3 text-sm text-black/70 dark:text-white/70">
        <div>Email: {client.contact_email || "-"}</div>
        <div>Phone: {client.contact_phone || "-"}</div>
        <div className="col-span-2">Job address: {client.job_address || "-"}</div>
        {client.notes && <div className="col-span-2">Notes: {client.notes}</div>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quotes</h2>
          <Link href={`/app/quotes/new?clientId=${id}`} className="text-sm underline">
            New quote
          </Link>
        </div>
        <JobTable rows={quotes ?? []} kind="quotes" />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Invoices</h2>
        <JobTable rows={invoices ?? []} kind="invoices" />
      </div>
    </div>
  );
}

function JobTable({
  rows,
  kind,
}: {
  rows: { id: string; status: string; total: number; created_at: string }[];
  kind: "quotes" | "invoices";
}) {
  if (rows.length === 0) {
    return <p className="mt-2 text-sm text-black/50 dark:text-white/50">None yet.</p>;
  }
  return (
    <table className="mt-2 w-full text-left text-sm">
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-black/5 dark:border-white/5">
            <td className="py-2">
              <Link href={`/app/${kind}/${r.id}`} className="underline">
                {r.id.slice(0, 8)}
              </Link>
            </td>
            <td className="py-2 capitalize">{r.status}</td>
            <td className="py-2">{formatCurrency(r.total)}</td>
            <td className="py-2 text-black/50 dark:text-white/50">{formatDate(r.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
