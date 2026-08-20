import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { formatDateTime } from "@/lib/format";
import type { ActivityAction } from "@/lib/activity";

const ACTION_LABELS: Record<ActivityAction, string> = {
  quote_created: "created a quote",
  quote_sent: "sent a quote to the client",
  quote_approved: "Client approved a quote",
  quote_declined: "Client declined a quote",
  invoice_created: "created an invoice",
  invoice_marked_paid: "marked an invoice as paid",
  teammate_invited: "invited a teammate",
  teammate_removed: "removed a teammate",
};

const ACTION_LINK: Partial<Record<ActivityAction, (id: string) => string>> = {
  quote_created: (id) => `/app/quotes/${id}`,
  quote_sent: (id) => `/app/quotes/${id}`,
  quote_approved: (id) => `/app/quotes/${id}`,
  quote_declined: (id) => `/app/quotes/${id}`,
  invoice_created: (id) => `/app/invoices/${id}`,
  invoice_marked_paid: (id) => `/app/invoices/${id}`,
};

export default async function ActivityPage() {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("activity_log")
    .select("*")
    .eq("workspace_id", membership.workspaceId)
    .order("created_at", { ascending: false })
    .limit(200);

  const userIds = Array.from(new Set((events ?? []).map((e) => e.user_id).filter((v): v is string => !!v)));
  const { data: users } = userIds.length
    ? await supabase.from("users").select("id, name").in("id", userIds)
    : { data: [] as { id: string; name: string }[] };
  const nameByUserId = new Map((users ?? []).map((u) => [u.id, u.name]));

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Activity</h1>
      <p className="-mt-4 text-sm text-ink-soft">A chronological log of key actions across your workspace.</p>

      {events && events.length > 0 ? (
        <div className="flex flex-col divide-y divide-line rounded-lg border border-line bg-bg-white">
          {events.map((e) => {
            const actionType = e.action_type as ActivityAction;
            const actorName = e.user_id ? nameByUserId.get(e.user_id) ?? "Someone" : "Client";
            const label = ACTION_LABELS[actionType] ?? actionType;
            const href = e.related_id ? ACTION_LINK[actionType]?.(e.related_id) : undefined;
            const content = (
              <>
                <span className="font-medium text-ink">{actorName}</span> {label}
              </>
            );
            return (
              <div key={e.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                {href ? (
                  <Link href={href} className="text-ink-soft hover:underline">
                    {content}
                  </Link>
                ) : (
                  <span className="text-ink-soft">{content}</span>
                )}
                <span className="shrink-0 text-xs text-ink-faint">{formatDateTime(e.created_at)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-ink-faint">No activity logged yet.</p>
      )}
    </div>
  );
}
