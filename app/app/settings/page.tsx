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
        <h1 className="text-xl font-semibold">Settings</h1>
        <Link href="/app/settings/team" className="text-sm underline">
          Manage team &rarr;
        </Link>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Settings saved.
        </p>
      )}

      <form action={updateWorkspaceSettings} className="flex flex-col gap-4" encType="multipart/form-data">
        <label className="flex flex-col gap-1 text-sm">
          Business name
          <input
            name="businessName"
            defaultValue={membership.workspaceName}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Logo
          {branding?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo_url} alt="Current logo" className="mb-1 h-12 w-auto" />
          )}
          <input name="logo" type="file" accept="image/*" className="text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Default tax %
          <input
            name="defaultTaxPercent"
            type="number"
            step="0.01"
            defaultValue={branding?.default_tax_percent ?? 0}
            className="w-32 rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Default payment instructions
          <textarea
            name="paymentInstructions"
            defaultValue={branding?.payment_instructions ?? ""}
            placeholder="Pay via check, cash, or Zelle to..."
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>

        <button
          type="submit"
          className="w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
