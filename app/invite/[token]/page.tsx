import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "@/app/actions/auth";

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
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
        <h1 className="text-2xl font-semibold">Invite not found</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          This invite link is invalid or has already been used. Ask your workspace owner to
          resend it.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Join your team on Quotenly</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Set a password for {invite.invited_email} to finish joining.
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <form action={acceptWithToken} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Join workspace
        </button>
      </form>
    </div>
  );
}
