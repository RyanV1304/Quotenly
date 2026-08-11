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
      <h1 className="text-xl font-semibold">Clients</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <details className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <summary className="cursor-pointer text-sm font-medium">Add a client</summary>
        <form action={createClientRecord} className="mt-4 grid grid-cols-2 gap-3">
          <input name="name" required placeholder="Client name" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="contact_email" type="email" placeholder="Email" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="contact_phone" placeholder="Phone" className="rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <input name="job_address" placeholder="Job address" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <textarea name="notes" placeholder="Notes" className="col-span-2 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20" />
          <button type="submit" className="col-span-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
            Save client
          </button>
        </form>
      </details>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Contact</th>
            <th className="py-2 font-medium">Job address</th>
          </tr>
        </thead>
        <tbody>
          {clients?.map((c) => (
            <tr key={c.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">
                <Link href={`/clients/${c.id}`} className="underline">
                  {c.name}
                </Link>
              </td>
              <td className="py-2">{c.contact_email || c.contact_phone || "-"}</td>
              <td className="py-2">{c.job_address || "-"}</td>
            </tr>
          ))}
          {clients?.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-black/50 dark:text-white/50">
                No clients yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
