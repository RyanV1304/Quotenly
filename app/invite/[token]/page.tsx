import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/auth";
import AuthShell from "@/components/AuthShell";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: members } = await supabase.rpc("get_invite_by_token", { p_token: token });
  const invite = members?.[0];

  const acceptWithToken = acceptInvite.bind(null, token);

  if (!invite) {
    return (
      <AuthShell title="Invite not found">
        <p className="text-sm text-black/60">
          This invite link is invalid or has already been used. Ask your workspace owner to
          resend it.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="You're invited"
      title="Join your team on Quotenly"
      subtitle={`Set a password for ${invite.invited_email} to finish joining.`}
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <form action={acceptWithToken} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Join workspace
        </button>
      </form>
    </AuthShell>
  );
}
