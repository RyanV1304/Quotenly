import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateClientRecord, addClientNote, deleteClientNote } from "@/app/actions/clients";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

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

  let quotesQuery = supabase
    .from("quotes")
    .select("id, status, total, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });
  let invoicesQuery = supabase
    .from("invoices")
    .select("id, status, total, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  if (membership.role === "teammate") {
    quotesQuery = quotesQuery.eq("assigned_to", membership.userId);
    invoicesQuery = invoicesQuery.eq("assigned_to", membership.userId);
  }

  const [{ data: client }, { data: quotes }, { data: invoices }, { data: notes }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).eq("workspace_id", membership.workspaceId).single(),
    quotesQuery,
    invoicesQuery,
    supabase.from("client_notes").select("*").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  if (membership.role === "teammate" && (quotes ?? []).length === 0 && (invoices ?? []).length === 0) {
    notFound();
  }

  const authorIds = Array.from(new Set((notes ?? []).map((n) => n.author_user_id).filter((v): v is string => !!v)));
  const { data: authors } = authorIds.length
    ? await supabase.from("users").select("id, name").in("id", authorIds)
    : { data: [] as { id: string; name: string }[] };
  const authorNameById = new Map((authors ?? []).map((a) => [a.id, a.name]));

  const updateAction = updateClientRecord.bind(null, id);
  const addNoteAction = addClientNote.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <Link href="/app/clients" className="btn-link w-fit">
        &larr; Back to clients
      </Link>

      {error && <p className="alert-error">{error}</p>}

      <details className="group rounded-lg border border-line bg-bg-white p-5">
        <summary className="font-display cursor-pointer text-xl font-bold text-ink">{client.name}</summary>
        <form action={updateAction} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" defaultValue={client.name} required className="input col-span-2" />
          <input name="contact_email" type="email" defaultValue={client.contact_email ?? ""} placeholder="Email" className="input" />
          <input name="contact_phone" defaultValue={client.contact_phone ?? ""} placeholder="Phone" className="input" />
          <input name="job_address" defaultValue={client.job_address ?? ""} placeholder="Job address" className="input col-span-2" />
          <textarea name="notes" defaultValue={client.notes ?? ""} placeholder="Notes" className="input col-span-2" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Save changes
          </button>
        </form>
      </details>

      <div className="grid grid-cols-2 gap-3 text-sm text-ink-soft">
        <div>Email: {client.contact_email || "-"}</div>
        <div>Phone: {client.contact_phone || "-"}</div>
        <div className="col-span-2">Job address: {client.job_address || "-"}</div>
        {client.notes && <div className="col-span-2">Notes: {client.notes}</div>}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink">Notes</h2>
        <p className="mt-1 text-sm text-ink-soft">Timestamped notes — e.g. &quot;Called 8/15 — prefers afternoon appointments&quot;.</p>
        <form action={addNoteAction} className="mt-3 flex gap-2">
          <textarea name="note_text" required placeholder="Add a note..." className="input flex-1" rows={2} />
          <button type="submit" className="btn-secondary shrink-0 self-end">
            Add note
          </button>
        </form>
        {notes && notes.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2">
            {notes.map((n) => {
              const deleteAction = deleteClientNote.bind(null, id, n.id);
              return (
                <div key={n.id} className="rounded-lg border border-line bg-bg-white p-3 text-sm">
                  <p className="text-ink">{n.note_text}</p>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-ink-faint">
                    <span>
                      {n.author_user_id ? authorNameById.get(n.author_user_id) ?? "Unknown" : "Unknown"} &middot;{" "}
                      {formatDateTime(n.created_at)}
                    </span>
                    <form action={deleteAction}>
                      <button type="submit" className="btn-link-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-faint">No notes yet.</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Quotes</h2>
          <Link href={`/app/quotes/new?clientId=${id}`} className="btn-link">
            New quote
          </Link>
        </div>
        <JobTable rows={quotes ?? []} kind="quotes" />
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink">Invoices</h2>
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
    return <p className="mt-3 text-sm text-ink-faint">None yet.</p>;
  }
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id} className="bg-bg-white">
              <td className="px-4 py-2.5">
                <Link href={`/app/${kind}/${r.id}`} className="font-mono font-medium text-brand hover:underline">
                  {r.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-2.5">
                <StatusBadge status={r.status} />
              </td>
              <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(r.total)}</td>
              <td className="px-4 py-2.5 text-ink-faint">{formatDate(r.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
