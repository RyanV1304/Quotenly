import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { createClientRecord } from "@/app/actions/clients";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const membership = await requireMembership();
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("workspace_id", membership.workspaceId)
    .order("name");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Clients</h1>

      {error && <p className="alert-error">{error}</p>}

      <details className="group rounded-lg border border-line bg-white p-5">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Add a client</summary>
        <form action={createClientRecord} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" required placeholder="Client name" className="input col-span-2" />
          <input name="contact_email" type="email" placeholder="Email" className="input" />
          <input name="contact_phone" placeholder="Phone" className="input" />
          <input name="job_address" placeholder="Job address" className="input col-span-2" />
          <textarea name="notes" placeholder="Notes" className="input col-span-2" />
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Save client
          </button>
        </form>
      </details>

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Contact</th>
              <th className="px-4 py-2.5 font-semibold">Job address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients?.map((c) => (
              <tr key={c.id} className="bg-white">
                <td className="px-4 py-2.5">
                  <Link href={`/app/clients/${c.id}`} className="font-medium text-brand hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-ink-soft">{c.contact_email || c.contact_phone || "-"}</td>
                <td className="px-4 py-2.5 text-ink-soft">{c.job_address || "-"}</td>
              </tr>
            ))}
            {clients?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-ink-faint">
                  No clients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
