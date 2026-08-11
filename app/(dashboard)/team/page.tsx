import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { inviteTeammate, removeTeammate } from "@/app/actions/team";
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
  const { data: members } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", membership.workspaceId)
    .order("invited_at", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
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

      <form action={inviteTeammate} className="flex gap-2">
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
