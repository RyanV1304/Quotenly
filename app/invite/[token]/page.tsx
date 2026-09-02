import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  acceptInviteNewAccount,
  acceptInviteExistingAccount,
  confirmWorkspaceSwitch,
} from "@/app/actions/invites";
import AuthShell from "@/components/AuthShell";
import GoogleSignInButton from "@/components/GoogleSignInButton";

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
        <p className="text-sm text-ink-soft">
          This invite link isn&apos;t valid. Ask whoever invited you to send a new one.
        </p>
      </AuthShell>
    );
  }

  if (invite.status === "cancelled") {
    return (
      <AuthShell title="Invite cancelled">
        <p className="text-sm text-ink-soft">This invite has been cancelled by the workspace owner.</p>
      </AuthShell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <AuthShell
        title="Already used"
        footer={
          <a href="/login" className="font-semibold text-brand hover:text-brand-dark">
            Log in
          </a>
        }
      >
        <p className="text-sm text-ink-soft">This invite has already been used.</p>
      </AuthShell>
    );
  }

  if (new Date(invite.expires_at) < new Date()) {
    return (
      <AuthShell title="Invite expired">
        <p className="text-sm text-ink-soft">
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
          <p className="text-sm text-ink-soft">Please log in again to continue.</p>
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
        <p className="text-sm text-ink-soft">
          You&apos;re currently part of <strong>{oldWorkspaceName ?? "another workspace"}</strong>.
          Joining <strong>{workspaceName}</strong> will remove your access to{" "}
          {oldWorkspaceName ?? "that workspace"}. Continue?
        </p>
        <div className="mt-5 flex gap-3">
          <form action={confirmAction}>
            <button type="submit" className="btn-primary">
              Switch workspaces
            </button>
          </form>
          <a href="/app/dashboard" className="btn-secondary">
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
      title={`Join ${workspaceName ?? "your team"} on Krewbill`}
      subtitle={
        isExistingAccountFlow
          ? `Log in as ${invite.email} to accept.`
          : `Create your account for ${invite.email} to finish joining.`
      }
    >
      {error && <p className="alert-error mb-4">{error}</p>}

      {isExistingAccountFlow ? (
        <form action={acceptExisting} className="flex flex-col gap-3.5">
          <label className="field-label">
            Password
            <input name="password" type="password" required className="input" />
          </label>
          <button type="submit" className="btn-primary mt-1">
            Log in and join
          </button>
        </form>
      ) : (
        <>
          <GoogleSignInButton />
          <p className="mt-2 text-center text-xs text-ink-faint">
            Use the Google account for {invite.email}
          </p>
          <div className="my-5 flex items-center gap-3 text-xs font-medium text-ink-faint">
            <div className="h-px flex-1 bg-line" />
            or
            <div className="h-px flex-1 bg-line" />
          </div>
          <form action={acceptNew} className="flex flex-col gap-3.5">
            <label className="field-label">
              Name
              <input name="name" required minLength={2} className="input" />
            </label>
            <label className="field-label">
              Password
              <input name="password" type="password" required minLength={8} className="input" />
            </label>
            <label className="field-label">
              Confirm password
              <input name="confirmPassword" type="password" required minLength={8} className="input" />
            </label>
            <button type="submit" className="btn-primary mt-1">
              Join workspace
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
