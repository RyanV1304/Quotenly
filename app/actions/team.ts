"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { hashPassword, generateJoinCode } from "@/lib/password";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function inviteTeammate(formData: FormData) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/team?error=" + encodeURIComponent("Only the workspace owner can invite teammates."));
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) {
    redirect("/team?error=" + encodeURIComponent("Email is required."));
  }

  const supabase = await createClient();
  const { data: invite, error } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: membership.workspaceId,
      invited_email: email,
      role: "teammate",
    })
    .select("invite_token")
    .single();

  if (error || !invite) {
    redirect("/team?error=" + encodeURIComponent(error?.message || "Could not create invite."));
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.invite_token}`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You've been invited to join ${membership.workspaceName} on Quotenly`,
      html: `<p>${membership.email} invited you to join <strong>${membership.workspaceName}</strong> on Quotenly.</p><p><a href="${inviteUrl}">Accept your invite</a></p>`,
    });
  } catch {
    // invite row is created regardless; owner can resend/share the link manually if email fails
  }

  revalidatePath("/team");
}

export async function setupJoinCode(formData: FormData) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/team?error=" + encodeURIComponent("Only the workspace owner can manage the join code."));
  }

  const password = String(formData.get("joinPassword") || "");
  if (password.length < 8) {
    redirect("/team?error=" + encodeURIComponent("Join password must be at least 8 characters."));
  }

  const supabase = await createClient();

  const { data: current } = await supabase
    .from("workspaces")
    .select("join_code")
    .eq("id", membership.workspaceId)
    .single();

  const joinCode = current?.join_code || generateJoinCode();

  const { error } = await supabase
    .from("workspaces")
    .update({
      join_code: joinCode,
      join_password_hash: hashPassword(password),
      join_enabled: true,
    })
    .eq("id", membership.workspaceId);

  if (error) {
    redirect("/team?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/team");
}

export async function regenerateJoinCode() {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/team?error=" + encodeURIComponent("Only the workspace owner can manage the join code."));
  }

  const supabase = await createClient();
  await supabase
    .from("workspaces")
    .update({ join_code: generateJoinCode() })
    .eq("id", membership.workspaceId);

  revalidatePath("/team");
}

export async function disableJoinCode() {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/team?error=" + encodeURIComponent("Only the workspace owner can manage the join code."));
  }

  const supabase = await createClient();
  await supabase
    .from("workspaces")
    .update({ join_enabled: false })
    .eq("id", membership.workspaceId);

  revalidatePath("/team");
}

export async function removeTeammate(memberId: string) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/team?error=" + encodeURIComponent("Only the workspace owner can remove teammates."));
  }

  const supabase = await createClient();
  await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", membership.workspaceId);

  revalidatePath("/team");
}
