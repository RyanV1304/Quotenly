import { createAdminClient } from "@/lib/supabase/admin";

export type ActivityAction =
  | "quote_created"
  | "quote_sent"
  | "quote_approved"
  | "quote_declined"
  | "invoice_created"
  | "invoice_marked_paid"
  | "teammate_invited"
  | "teammate_removed";

export async function logActivity(
  workspaceId: string,
  userId: string | null,
  actionType: ActivityAction,
  relatedId?: string | null
) {
  const admin = createAdminClient();
  await admin.from("activity_log").insert({
    workspace_id: workspaceId,
    user_id: userId,
    action_type: actionType,
    related_id: relatedId ?? null,
  });
}
