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
        <Link href="/app/settings" className="btn-link">
          &larr; Settings
        </Link>
        <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-ink">Team</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Invite as many teammates as you need. Teammates only see jobs assigned to them.
        </p>
      </div>

      {error && <p className="alert-error">{error}</p>}

      <form action={sendInvite} className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="teammate@email.com"
          className="input w-64"
        />
        <button type="submit" className="btn-primary">
          Send invite
        </button>
      </form>

      {pendingInvites && pendingInvites.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Pending invites</h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-line">
                {pendingInvites.map((inv) => (
                  <tr key={inv.id} className="bg-white">
                    <td className="px-4 py-2.5 text-ink">{inv.email}</td>
                    <td className="px-4 py-2.5 text-ink-faint">Sent {formatDate(inv.created_at)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <form action={resendInvite.bind(null, inv.id)} className="inline">
                        <button type="submit" className="btn-link mr-3">
                          Resend
                        </button>
                      </form>
                      <form action={cancelInvite.bind(null, inv.id)} className="inline">
                        <button type="submit" className="btn-link-danger">
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-white text-xs uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Email</th>
              <th className="px-4 py-2.5 font-semibold">Role</th>
              <th className="px-4 py-2.5 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members?.map((m) => {
              const name = m.user_id ? nameByUserId.get(m.user_id) : undefined;
              return (
                <tr key={m.id} className="bg-white">
                  <td className="px-4 py-2.5 text-ink">{name || "-"}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{m.invited_email}</td>
                  <td className="px-4 py-2.5 capitalize text-ink-soft">{m.role}</td>
                  <td className="px-4 py-2.5 text-right">
                    {m.role !== "owner" && (
                      <form action={removeTeammate.bind(null, m.id)}>
                        <button type="submit" className="btn-link-danger">
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
    </div>
  );
}
