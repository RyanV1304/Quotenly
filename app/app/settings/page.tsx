import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateWorkspaceSettings } from "@/app/actions/settings";
import Link from "next/link";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }
  const { error, success } = await searchParams;

  const supabase = await createClient();
  const { data: branding } = await supabase
    .from("workspace_branding")
    .select("*")
    .eq("workspace_id", membership.workspaceId)
    .single();

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

      <form action={updateWorkspaceSettings} className="flex flex-col gap-4" encType="multipart/form-data">
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
    </div>
  );
}
