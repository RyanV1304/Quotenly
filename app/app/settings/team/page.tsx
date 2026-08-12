import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { sendInvite, resendInvite, cancelInvite, removeTeammate } from "@/app/actions/invites";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/format";
import Link from "next/link";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }
  const { error } = await searchParams;

  const supabase = await createClient();
  const [{ data: members }, { data: pendingInvites }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", membership.workspaceId)
      .order("joined_at", { ascending: true }),
    supabase
      .from("invites")
      .select("*")
      .eq("workspace_id", membership.workspaceId)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  const memberUserIds = (members ?? []).map((m) => m.user_id).filter((id): id is string => !!id);
  const { data: profiles } = memberUserIds.length
    ? await supabase.from("users").select("id, name").in("id", memberUserIds)
    : { data: [] as { id: string; name: string }[] };
  const nameByUserId = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/app/settings" className="text-sm underline">
          &larr; Settings
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Team</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Invite as many teammates as you need. Teammates only see jobs assigned to them.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <form action={sendInvite} className="flex gap-2">
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

      {pendingInvites && pendingInvites.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Pending invites</h2>
          <table className="mt-2 w-full text-left text-sm">
            <tbody>
              {pendingInvites.map((inv) => (
                <tr key={inv.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2">{inv.email}</td>
                  <td className="py-2 text-black/50 dark:text-white/50">
                    Sent {formatDate(inv.created_at)}
                  </td>
                  <td className="py-2 text-right">
                    <form action={resendInvite.bind(null, inv.id)} className="inline">
                      <button type="submit" className="mr-3 underline">
                        Resend
                      </button>
                    </form>
                    <form action={cancelInvite.bind(null, inv.id)} className="inline">
                      <button type="submit" className="text-red-600 underline dark:text-red-400">
                        Cancel
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 text-black/60 dark:border-white/10 dark:text-white/60">
          <tr>
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members?.map((m) => {
            const name = m.user_id ? nameByUserId.get(m.user_id) : undefined;
            return (
              <tr key={m.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2">{name || "-"}</td>
                <td className="py-2">{m.invited_email}</td>
                <td className="py-2 capitalize">{m.role}</td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
