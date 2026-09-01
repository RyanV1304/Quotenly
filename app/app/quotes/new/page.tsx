import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { createQuote } from "@/app/actions/quotes";
import LineItemsEditor from "@/components/LineItemsEditor";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; clientId?: string }>;
}) {
  const membership = await requireMembership();
  const { error, clientId } = await searchParams;
  const supabase = await createClient();

  const [{ data: clients }, { data: members }, { data: templates }, { data: branding }] = await Promise.all([
    supabase.from("clients").select("id, name").eq("workspace_id", membership.workspaceId).order("name"),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .not("joined_at", "is", null),
    supabase.from("line_item_templates").select("*").eq("workspace_id", membership.workspaceId).order("label"),
    supabase
      .from("workspace_branding")
      .select("default_tax_percent")
      .eq("workspace_id", membership.workspaceId)
      .maybeSingle(),
  ]);

  const selectedClient = clientId ? clients?.find((c) => c.id === clientId) : undefined;

  let openJobs: { id: string; title: string }[] = [];
  if (clientId) {
    const { data } = await supabase
      .from("jobs")
      .select("id, title")
      .eq("client_id", clientId)
      .eq("status", "active")
      .is("quote_id", null)
      .order("created_at", { ascending: false });
    openJobs = data ?? [];
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">New quote</h1>

      {error && <p className="alert-error">{error}</p>}

      {!clientId || !selectedClient ? (
        <form action="/app/quotes/new" className="flex flex-col gap-4">
          <label className="field-label">
            Client
            <select name="clientId" required defaultValue="" className="input">
              <option value="" disabled>
                Select a client
              </option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary w-fit">
            Continue
          </button>
        </form>
      ) : (
        <form action={createQuote} className="flex flex-col gap-4">
          <input type="hidden" name="client_id" value={selectedClient.id} />
          <div className="field-label">
            Client
            <p className="text-sm text-ink">{selectedClient.name}</p>
          </div>

          <div className="rounded-lg border border-line bg-bg-white p-4">
            <p className="text-sm font-semibold text-ink">Job</p>
            {openJobs.length > 0 ? (
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-sm text-ink-soft">
                  {selectedClient.name} has an open job. Add this quote to it, or start a new one.
                </p>
                {openJobs.map((job, i) => (
                  <label key={job.id} className="flex items-center gap-2 text-sm text-ink">
                    <input type="radio" name="job_choice" value={job.id} defaultChecked={i === 0} />
                    Add to &quot;{job.title}&quot;
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="radio" name="job_choice" value="new" />
                  Start a new job
                </label>
              </div>
            ) : (
              <p className="mt-1 text-sm text-ink-soft">
                No open job for {selectedClient.name} yet — one will be created automatically for this quote.
              </p>
            )}
          </div>

          <label className="field-label">
            Assign to
            <select name="assigned_to" defaultValue={membership.userId} className="input">
              <option value="">Unassigned</option>
              {members?.map((m) => (
                <option key={m.user_id} value={m.user_id ?? ""}>
                  {m.invited_email}
                </option>
              ))}
            </select>
          </label>

          <LineItemsEditor
            templates={templates ?? []}
            initialTaxRate={(branding?.default_tax_percent ?? 0) / 100}
          />

          <label className="field-label">
            Notes
            <textarea name="notes" className="input" />
          </label>

          <label className="field-label">
            Exclusions / What&apos;s not included
            <textarea
              name="exclusions"
              className="input"
              placeholder="e.g. Permits, drywall repair, paint touch-up"
            />
            <span className="text-xs font-normal text-ink-faint">
              Optional. Shown to the client as &quot;Not included&quot;, separate from your notes above.
            </span>
          </label>

          <button type="submit" className="btn-primary mt-2 w-fit">
            Save quote
          </button>
        </form>
      )}
    </div>
  );
}
