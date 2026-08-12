import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { MemberRole } from "@/lib/types";

export interface CurrentMembership {
  userId: string;
  email: string;
  name: string;
  emailVerified: boolean;
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
    redirect(`/login?redirect=${encodeURIComponent("/app/dashboard")}`);
  }

  const [{ data: member }, { data: profile }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("workspace_id, role, workspaces(name)")
      .eq("user_id", user.id)
      .not("joined_at", "is", null)
      .single(),
    supabase.from("users").select("name, email_verified").eq("id", user.id).maybeSingle(),
  ]);

  if (!member) {
    redirect("/login");
  }

  const workspace = Array.isArray(member.workspaces) ? member.workspaces[0] : member.workspaces;

  return {
    userId: user.id,
    email: user.email!,
    name: profile?.name || user.email!,
    emailVerified: profile?.email_verified ?? true,
    workspaceId: member.workspace_id,
    workspaceName: workspace?.name ?? "Workspace",
    role: member.role,
  };
}
