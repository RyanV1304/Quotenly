import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { MemberRole } from "@/lib/types";

export interface CurrentMembership {
  userId: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  role: MemberRole;
}

export async function requireMembership(): Promise<CurrentMembership> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(name)")
    .eq("user_id", user.id)
    .not("joined_at", "is", null)
    .single();

  if (!member) {
    redirect("/sign-in");
  }

  const workspace = Array.isArray(member.workspaces) ? member.workspaces[0] : member.workspaces;

  return {
    userId: user.id,
    email: user.email!,
    workspaceId: member.workspace_id,
    workspaceName: workspace?.name ?? "Workspace",
    role: member.role,
  };
}
