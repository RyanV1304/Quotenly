import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import {
  inviteTeammate,
  removeTeammate,
  setupJoinCode,
  regenerateJoinCode,
  disableJoinCode,
} from "@/app/actions/team";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/format";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/dashboard");
  }
  const { error } = await searchParams;

  const supabase = await createClient();
  const [{ data: members }, { data: workspace }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", membership.workspaceId)
      .order("invited_at", { ascending: true }),
    supabase
      .from("workspaces")
      .select("join_code, join_enabled")
      .eq("id", membership.workspaceId)
      .single(),
  ]);

  const joinUrl = workspace?.join_code
    ? `${process.env.NEXT_PUBLIC_APP_URL}/join?code=${workspace.join_code}`
    : null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-xl font-semibold">Team</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Invite as many teammates as you need. Teammates only see jobs assigned to them.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <div>
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Invite by email</h2>
        <form action={inviteTeammate} className="mt-2 flex gap-2">
          <input
            name="email"
            type="email"
            required
            placeholder="teammate@email.com"
            className="w-64 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Send invite
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Join code</h2>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          Anyone with the code and password can join as a teammate &mdash; useful for onboarding
          a known crew without emailing each person individually.
        </p>

        {workspace?.join_enabled && workspace.join_code ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-black/5 px-3 py-1.5 font-mono text-sm dark:bg-white/10">
                {workspace.join_code}
              </span>
              <form action={regenerateJoinCode}>
                <button type="submit" className="text-sm underline">
                  Regenerate code
                </button>
              </form>
              <form action={disableJoinCode}>
                <button type="submit" className="text-sm text-red-600 underline dark:text-red-400">
                  Disable
                </button>
              </form>
            </div>
            {joinUrl && (
              <p className="text-sm text-black/50 dark:text-white/50">
                Share: <span className="break-all font-mono text-xs">{joinUrl}</span>
              </p>
            )}
            <details className="text-sm">
              <summary className="cursor-pointer text-black/60 dark:text-white/60">
                Change join password
              </summary>
              <form action={setupJoinCode} className="mt-2 flex gap-2">
                <input
                  name="joinPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="New join password"
                  className="w-56 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
                />
                <button
                  type="submit"
                  className="rounded-md border border-black/20 px-3 py-2 text-sm font-medium dark:border-white/30"
                >
                  Update
                </button>
              </form>
            </details>
          </div>
        ) : (
          <form action={setupJoinCode} className="mt-4 flex gap-2">
            <input
              name="joinPassword"
              type="password"
              required
              minLength={8}
              placeholder="Set a join password"
              className="w-56 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
            />
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              Enable join code
            </button>
          </form>
        )}
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 font-medium">Invited</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members?.map((m) => (
            <tr key={m.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2">{m.invited_email}</td>
              <td className="py-2 capitalize">{m.role}</td>
              <td className="py-2">{m.joined_at ? "Joined" : "Pending"}</td>
              <td className="py-2">{formatDate(m.invited_at)}</td>
              <td className="py-2 text-right">
                {m.role !== "owner" && (
                  <form action={removeTeammate.bind(null, m.id)}>
                    <button type="submit" className="text-red-600 underline dark:text-red-400">
                      Remove
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
