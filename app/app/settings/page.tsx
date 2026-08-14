import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateWorkspaceSettings, transferOwnership } from "@/app/actions/settings";
import Link from "next/link";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; transferTo?: string }>;
}) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }
  const { error, success, transferTo } = await searchParams;

  const supabase = await createClient();
  const [{ data: branding }, { data: teammates }] = await Promise.all([
    supabase.from("workspace_branding").select("*").eq("workspace_id", membership.workspaceId).single(),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .eq("role", "teammate")
      .not("joined_at", "is", null),
  ]);

  let selectedTeammateName: string | null = null;
  if (transferTo) {
    const { data: profile } = await supabase.from("users").select("name").eq("id", transferTo).maybeSingle();
    selectedTeammateName =
      profile?.name || teammates?.find((t) => t.user_id === transferTo)?.invited_email || "this teammate";
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <Link href="/app/settings/team" className="btn-link">
          Manage team &rarr;
        </Link>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {success && <p className="alert-success">Settings saved.</p>}

      <form action={updateWorkspaceSettings} className="flex flex-col gap-4">
        <label className="field-label">
          Business name
          <input name="businessName" defaultValue={membership.workspaceName} className="input" />
        </label>

        <label className="field-label">
          Logo
          {branding?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo_url} alt="Current logo" className="mb-1 h-12 w-auto" />
          )}
          <input name="logo" type="file" accept="image/*" className="text-sm text-ink-soft" />
        </label>

        <label className="field-label">
          Default tax %
          <input
            name="defaultTaxPercent"
            type="number"
            step="0.01"
            defaultValue={branding?.default_tax_percent ?? 0}
            className="input w-32"
          />
        </label>

        <label className="field-label">
          Default payment instructions
          <textarea
            name="paymentInstructions"
            defaultValue={branding?.payment_instructions ?? ""}
            placeholder="Pay via check, cash, or Zelle to..."
            className="input"
          />
        </label>

        <button type="submit" className="btn-primary w-fit">
          Save settings
        </button>
      </form>

      {teammates && teammates.length > 0 && (
        <div className="rounded-lg border border-line bg-white p-5">
          <p className="text-sm font-semibold text-ink">Transfer ownership</p>
          <p className="mt-1 text-sm text-ink-soft">
            Move ownership of this workspace to an existing teammate. You&apos;ll become a teammate yourself.
          </p>

          {transferTo && selectedTeammateName ? (
            <div className="mt-4 flex flex-col gap-3">
              <p className="alert-warning">
                Transfer ownership to <strong>{selectedTeammateName}</strong>? You will become a Teammate and lose
                owner access. This can&apos;t be undone by you &mdash; only the new owner can transfer it back.
              </p>
              <div className="flex gap-2">
                <form action={transferOwnership}>
                  <input type="hidden" name="newOwnerUserId" value={transferTo} />
                  <button type="submit" className="btn-primary">
                    Confirm transfer
                  </button>
                </form>
                <Link href="/app/settings" className="btn-secondary">
                  Cancel
                </Link>
              </div>
            </div>
          ) : (
            <form action="/app/settings" className="mt-4 flex gap-2">
              <select name="transferTo" required className="input w-64">
                <option value="" disabled selected>
                  Select a teammate
                </option>
                {teammates.map((t) => (
                  <option key={t.user_id} value={t.user_id ?? ""}>
                    {t.invited_email}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-secondary">
                Review transfer
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
