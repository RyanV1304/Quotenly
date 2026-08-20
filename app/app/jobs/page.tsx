import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { createJob } from "@/app/actions/jobs";
import { formatDate } from "@/lib/format";
import ExportCsvButton from "@/components/ExportCsvButton";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const membership = await requireMembership();
  const { error } = await searchParams;
  const supabase = await createClient();

  let jobsQuery = supabase
    .from("jobs")
    .select("id, title, status, created_at, clients(name), quotes(total)")
    .eq("workspace_id", membership.workspaceId)
    .order("created_at", { ascending: false });

  if (membership.role === "teammate") {
    jobsQuery = jobsQuery.eq("assigned_to", membership.userId);
  }

  const [{ data: jobs }, { data: clients }, { data: members }] = await Promise.all([
    jobsQuery,
    supabase.from("clients").select("id, name").eq("workspace_id", membership.workspaceId).order("name"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
  ]);

  const jobIds = (jobs ?? []).map((j) => j.id);
  const { data: allExpenses } = jobIds.length
    ? await supabase.from("job_expenses").select("job_id, amount").in("job_id", jobIds)
    : { data: [] as { job_id: string; amount: number }[] };
  const actualCostByJobId = new Map<string, number>();
  for (const e of allExpenses ?? []) {
    actualCostByJobId.set(e.job_id, (actualCostByJobId.get(e.job_id) ?? 0) + e.amount);
  }

  const csvColumns = ["Client", "Job", "Status", "Quoted", "Actual cost", "Profit", "Created"];
  const csvRows = (jobs ?? []).map((j) => {
    const client = Array.isArray(j.clients) ? j.clients[0] : j.clients;
    const quote = Array.isArray(j.quotes) ? j.quotes[0] : j.quotes;
    const quoted = quote?.total ?? 0;
    const actual = actualCostByJobId.get(j.id) ?? 0;
    return [
      client?.name ?? "Unknown client",
      j.title,
      j.status,
      quoted.toFixed(2),
      actual.toFixed(2),
      (quoted - actual).toFixed(2),
      j.created_at.slice(0, 10),
    ];
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Jobs</h1>
        <ExportCsvButton filename="jobs.csv" columns={csvColumns} rows={csvRows} />
      </div>

      {error && <p className="alert-error">{error}</p>}

      <details className="group rounded-lg border border-line bg-bg-white p-5">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Add a job</summary>
        <form action={createJob} className="mt-4 grid grid-cols-2 gap-3">
          <input name="title" required placeholder="Job title (e.g. Kitchen faucet repair)" className="input col-span-2" />
          <select name="client_id" required className="input" defaultValue="">
            <option value="" disabled>
              Select a client
            </option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="assigned_to" className="input" defaultValue="">
            <option value="">Unassigned</option>
            {members?.map((m) => (
              <option key={m.user_id} value={m.user_id ?? ""}>
                {m.invited_email}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary col-span-2 w-fit">
            Create job
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Job</th>
              <th className="px-4 py-2.5 font-semibold">Client</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {jobs?.map((j) => {
              const client = Array.isArray(j.clients) ? j.clients[0] : j.clients;
              return (
                <tr key={j.id} className="bg-bg-white">
                  <td className="px-4 py-2.5">
                    <Link href={`/app/jobs/${j.id}`} className="font-medium text-brand hover:underline">
                      {j.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{client?.name ?? "Unknown client"}</td>
                  <td className="px-4 py-2.5 capitalize text-ink-soft">{j.status}</td>
                  <td className="px-4 py-2.5 text-ink-faint">{formatDate(j.created_at)}</td>
                </tr>
              );
            })}
            {jobs?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                  {membership.role === "owner" ? "No jobs yet." : "No jobs assigned to you yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
