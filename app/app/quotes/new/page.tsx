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

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">New quote</h1>

      {error && <p className="alert-error">{error}</p>}

      <form action={createQuote} className="flex flex-col gap-4">
        <label className="field-label">
          Client
          <select name="client_id" required defaultValue={clientId ?? ""} className="input">
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

        <button type="submit" className="btn-primary mt-2 w-fit">
          Save quote
        </button>
      </form>
    </div>
  );
}
