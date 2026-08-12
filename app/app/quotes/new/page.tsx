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
      <h1 className="text-xl font-semibold">New quote</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <form action={createQuote} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Client
          <select name="client_id" required defaultValue={clientId ?? ""} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20">
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

        <label className="flex flex-col gap-1 text-sm">
          Assign to
          <select name="assigned_to" defaultValue={membership.userId} className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20">
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

        <label className="flex flex-col gap-1 text-sm">
          Notes
          <textarea name="notes" className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20" />
        </label>

        <button type="submit" className="mt-2 w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
          Save quote
        </button>
      </form>
    </div>
  );
}
