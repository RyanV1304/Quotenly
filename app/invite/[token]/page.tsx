import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  acceptInviteNewAccount,
  acceptInviteExistingAccount,
  confirmWorkspaceSwitch,
} from "@/app/actions/invites";
import AuthShell from "@/components/AuthShell";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string; confirmSwitch?: string }>;
}) {
  const { token } = await params;
  const { error, confirmSwitch } = await searchParams;

  const admin = createAdminClient();
  const { data: invite } = await admin
    .from("invites")
    .select("*, workspaces(name)")
    .eq("token", token)
    .maybeSingle();

  const workspaceName = Array.isArray(invite?.workspaces)
    ? invite?.workspaces[0]?.name
    : invite?.workspaces?.name;

  if (!invite) {
    return (
      <AuthShell title="Invite not found">
        <p className="text-sm text-black/60">
          This invite link isn&apos;t valid. Ask whoever invited you to send a new one.
        </p>
      </AuthShell>
    );
  }

  if (invite.status === "cancelled") {
    return (
      <AuthShell title="Invite cancelled">
        <p className="text-sm text-black/60">This invite has been cancelled by the workspace owner.</p>
      </AuthShell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <AuthShell
        title="Already used"
        footer={
          <a href="/login" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
            Log in
          </a>
        }
      >
        <p className="text-sm text-black/60">This invite has already been used.</p>
      </AuthShell>
    );
  }

  if (new Date(invite.expires_at) < new Date()) {
    return (
      <AuthShell title="Invite expired">
        <p className="text-sm text-black/60">
          This invite has expired. Ask {workspaceName ?? "the workspace"}&apos;s owner to send a
          new one.
        </p>
      </AuthShell>
    );
  }

  // Valid, pending invite from here on.
  if (confirmSwitch) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return (
        <AuthShell title="Session expired">
          <p className="text-sm text-black/60">Please log in again to continue.</p>
        </AuthShell>
      );
    }

    const { data: currentMembership } = await admin
      .from("workspace_members")
      .select("workspace_id, workspaces(name)")
      .eq("user_id", user.id)
      .not("joined_at", "is", null)
      .maybeSingle();

    const currentWorkspaces = currentMembership?.workspaces as
      | { name: string }
      | { name: string }[]
      | null
      | undefined;
    const oldWorkspaceName = Array.isArray(currentWorkspaces)
      ? currentWorkspaces[0]?.name
      : currentWorkspaces?.name;

    const confirmAction = confirmWorkspaceSwitch.bind(null, token);

    return (
      <AuthShell eyebrow="Confirm switch" title="Switch workspaces?">
        <p className="text-sm text-black/60">
          You&apos;re currently part of <strong>{oldWorkspaceName ?? "another workspace"}</strong>.
          Joining <strong>{workspaceName}</strong> will remove your access to{" "}
          {oldWorkspaceName ?? "that workspace"}. Continue?
        </p>
        <div className="mt-5 flex gap-3">
          <form action={confirmAction}>
            <button
              type="submit"
              className="rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
            >
              Switch workspaces
            </button>
          </form>
          <a
            href="/app/dashboard"
            className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black/20"
          >
            Cancel
          </a>
        </div>
      </AuthShell>
    );
  }

  const acceptNew = acceptInviteNewAccount.bind(null, token);
  const acceptExisting = acceptInviteExistingAccount.bind(null, token);
  const isExistingAccountFlow = error?.includes("already have an account") || error === "Incorrect email or password";

  return (
    <AuthShell
      eyebrow="You're invited"
      title={`Join ${workspaceName ?? "your team"} on Quotenly`}
      subtitle={
        isExistingAccountFlow
          ? `Log in as ${invite.email} to accept.`
          : `Create your account for ${invite.email} to finish joining.`
      }
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {isExistingAccountFlow ? (
        <form action={acceptExisting} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
            Password
            <input name="password" type="password" required className={fieldClass} />
          </label>
          <button
            type="submit"
            className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
          >
            Log in and join
          </button>
        </form>
      ) : (
        <>
          <GoogleSignInButton />
          <p className="mt-2 text-center text-xs text-black/40">
            Use the Google account for {invite.email}
          </p>
          <div className="my-5 flex items-center gap-3 text-xs font-medium text-black/30">
            <div className="h-px flex-1 bg-black/10" />
            or
            <div className="h-px flex-1 bg-black/10" />
          </div>
          <form action={acceptNew} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
              Name
              <input name="name" required minLength={2} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
              Password
              <input name="password" type="password" required minLength={8} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
              Confirm password
              <input name="confirmPassword" type="password" required minLength={8} className={fieldClass} />
            </label>
            <button
              type="submit"
              className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
            >
              Join workspace
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
