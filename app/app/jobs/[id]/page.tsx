import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { uploadJobPhoto, deleteJobPhoto, addJobExpense, deleteJobExpense, updateJobStatus } from "@/app/actions/jobs";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function JobDetailPage({
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

  const [{ data: job }, { data: photos }, { data: expenses }] = await Promise.all([
    supabase.from("jobs").select("*, clients(id, name), quotes(id, total), invoices(id, total)").eq("id", id).single(),
    supabase.from("job_photos").select("*").eq("job_id", id).order("created_at", { ascending: false }),
    supabase.from("job_expenses").select("*").eq("job_id", id).order("date", { ascending: false }),
  ]);

  if (!job) notFound();
  if (membership.role === "teammate" && job.assigned_to !== membership.userId) notFound();

  const client = Array.isArray(job.clients) ? job.clients[0] : job.clients;
  const quote = Array.isArray(job.quotes) ? job.quotes[0] : job.quotes;

  const uploadAction = uploadJobPhoto.bind(null, id);
  const expenseAction = addJobExpense.bind(null, id);
  const statusAction = updateJobStatus.bind(null, id);

  const quotedTotal = quote?.total ?? 0;
  const actualTotal = (expenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const profit = quotedTotal - actualTotal;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <Link href="/app/jobs" className="btn-link w-fit">
        &larr; Back to jobs
      </Link>

      {error && <p className="alert-error">{error}</p>}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{job.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {client && (
              <Link href={`/app/clients/${client.id}`} className="text-brand hover:underline">
                {client.name}
              </Link>
            )}
          </p>
        </div>
        <form action={statusAction} className="flex items-center gap-2">
          <select name="status" defaultValue={job.status} className="input">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn-secondary shrink-0">
            Update
          </button>
        </form>
      </div>

      {expenses && expenses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-line bg-bg-white p-4">
            <p className="text-xs text-ink-faint">Quoted</p>
            <p className="font-mono mt-1 text-lg font-bold text-ink">{formatCurrency(quotedTotal)}</p>
          </div>
          <div className="rounded-lg border border-line bg-bg-white p-4">
            <p className="text-xs text-ink-faint">Actual cost</p>
            <p className="font-mono mt-1 text-lg font-bold text-ink">{formatCurrency(actualTotal)}</p>
          </div>
          <div className="rounded-lg border border-line bg-bg-white p-4">
            <p className="text-xs text-ink-faint">Profit</p>
            <p className={`font-mono mt-1 text-lg font-bold ${profit < 0 ? "text-danger" : "text-success"}`}>
              {formatCurrency(profit)}
            </p>
          </div>
        </div>
      )}

      {!quote && (
        <p className="text-sm text-ink-faint">
          This job isn&apos;t linked to a quote yet, so &quot;Quoted&quot; will show as $0 until one is.
        </p>
      )}

      <section>
        <h2 className="font-display text-lg font-bold text-ink">Photos</h2>
        <form action={uploadAction} className="mt-3 flex items-center gap-2">
          <input name="photo" type="file" accept="image/*" required className="text-sm text-ink-soft" />
          <button type="submit" className="btn-secondary shrink-0">
            Upload
          </button>
        </form>
        {photos && photos.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p) => {
              const deleteAction = deleteJobPhoto.bind(null, id, p.id);
              return (
                <div key={p.id} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                  <a href={p.url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="Job photo" className="h-full w-full object-cover" />
                  </a>
                  <form action={deleteAction} className="absolute right-1 top-1">
                    <button
                      type="submit"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-white text-ink-soft opacity-0 shadow transition-opacity group-hover:opacity-100 hover:text-danger"
                      aria-label="Delete photo"
                      title="Delete photo"
                    >
                      &times;
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-faint">No photos yet.</p>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-ink">Expenses</h2>
        <form action={expenseAction} className="mt-3 grid grid-cols-4 gap-2">
          <input name="description" required placeholder="Description" className="input col-span-2" />
          <input name="amount" type="number" step="0.01" min="0.01" required placeholder="Amount" className="input" />
          <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
          <button type="submit" className="btn-secondary col-span-4 w-fit">
            Add expense
          </button>
        </form>
        {expenses && expenses.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-line">
                {expenses.map((e) => {
                  const deleteAction = deleteJobExpense.bind(null, id, e.id);
                  return (
                    <tr key={e.id} className="bg-bg-white">
                      <td className="px-4 py-2.5 text-ink">{e.description}</td>
                      <td className="font-mono px-4 py-2.5 text-ink">{formatCurrency(e.amount)}</td>
                      <td className="px-4 py-2.5 text-ink-faint">{formatDate(e.date)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <form action={deleteAction}>
                          <button type="submit" className="btn-link-danger">
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-faint">No expenses logged yet.</p>
        )}
      </section>
    </div>
  );
}
