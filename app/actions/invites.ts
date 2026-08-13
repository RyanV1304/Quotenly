"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMembership } from "@/lib/workspace";
import { validatePassword } from "@/lib/validation";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function qs(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function sendInviteEmail(email: string, workspaceName: string, inviterEmail: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You've been invited to join ${workspaceName} on Quotenly`,
      html: `<p>${inviterEmail} invited you to join <strong>${workspaceName}</strong> on Quotenly.</p><p><a href="${url}">Accept your invite</a></p>`,
    });
  } catch {
    // invite row exists regardless; owner can resend if email delivery failed
  }
}

export async function sendInvite(formData: FormData) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/settings/team" + qs({ error: "Only the workspace owner can invite teammates." }));
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    redirect("/app/settings/team" + qs({ error: "Enter a valid email." }));
  }

  const supabase = await createClient();

  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", membership.workspaceId)
    .eq("invited_email", email)
    .maybeSingle();

  if (existingMember) {
    redirect("/app/settings/team" + qs({ error: "This person is already on your team." }));
  }

  const { data: existingInvite } = await supabase
    .from("invites")
    .select("id")
    .eq("workspace_id", membership.workspaceId)
    .eq("email", email)
    .eq("status", "pending")
    .maybeSingle();

  if (existingInvite) {
    redirect("/app/settings/team" + qs({ error: "An invite is already pending for this email." }));
  }

  const { data: invite, error } = await supabase
    .from("invites")
    .insert({ workspace_id: membership.workspaceId, email })
    .select("token")
    .single();

  if (error || !invite) {
    redirect("/app/settings/team" + qs({ error: error?.message || "Could not create invite." }));
  }

  await sendInviteEmail(email, membership.workspaceName, membership.email, invite!.token);
  revalidatePath("/app/settings/team");
  redirect("/app/settings/team");
}

export async function resendInvite(inviteId: string) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/settings/team" + qs({ error: "Only the workspace owner can manage invites." }));
  }

  const supabase = await createClient();
  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("id", inviteId)
    .eq("workspace_id", membership.workspaceId)
    .single();

  if (!invite) redirect("/app/settings/team");

  if (invite!.last_resent_at && Date.now() - new Date(invite!.last_resent_at).getTime() < 60_000) {
    redirect("/app/settings/team" + qs({ error: "Please wait a minute before resending this invite again." }));
  }

  const { data: updated } = await supabase
    .from("invites")
    .update({
      token: crypto.randomUUID(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_resent_at: new Date().toISOString(),
      status: "pending",
    })
    .eq("id", inviteId)
    .select("token")
    .single();

  if (updated) {
    await sendInviteEmail(invite!.email, membership.workspaceName, membership.email, updated.token);
  }

  revalidatePath("/app/settings/team");
  redirect("/app/settings/team");
}

export async function cancelInvite(inviteId: string) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/settings/team" + qs({ error: "Only the workspace owner can manage invites." }));
  }

  const supabase = await createClient();
  await supabase
    .from("invites")
    .update({ status: "cancelled" })
    .eq("id", inviteId)
    .eq("workspace_id", membership.workspaceId);

  revalidatePath("/app/settings/team");
  redirect("/app/settings/team");
}

export async function removeTeammate(memberId: string) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/settings/team" + qs({ error: "Only the workspace owner can remove teammates." }));
  }

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("id", memberId)
    .eq("workspace_id", membership.workspaceId)
    .single();

  await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", membership.workspaceId);

  if (member?.user_id) {
    await Promise.all([
      supabase
        .from("quotes")
        .update({ assigned_to: null })
        .eq("workspace_id", membership.workspaceId)
        .eq("assigned_to", member.user_id),
      supabase
        .from("invoices")
        .update({ assigned_to: null })
        .eq("workspace_id", membership.workspaceId)
        .eq("assigned_to", member.user_id),
    ]);
  }

  revalidatePath("/app/settings/team");
  redirect("/app/settings/team");
}

export async function acceptInviteNewAccount(token: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const back = (error: string) => redirect(`/invite/${token}${qs({ error })}`);

  if (name.length < 2) back("Name must be at least 2 characters.");
  if (password !== confirmPassword) back("Passwords don't match.");
  const passwordError = validatePassword(password);
  if (passwordError) back(passwordError);

  const admin = createAdminClient();
  const { data: invite } = await admin.from("invites").select("*").eq("token", token).single();

  if (!invite || invite.status !== "pending" || new Date(invite.expires_at) < new Date()) {
    back("This invite is no longer valid.");
    return;
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const msg = (createError?.message || "").toLowerCase();
    if (msg.includes("already") && msg.includes("registered")) {
      redirect(`/invite/${token}${qs({ error: "You already have an account — log in below to accept this invite." })}`);
    }
    back(createError?.message || "Could not create account.");
    return;
  }

  await admin.from("users").insert({ id: created.user.id, email: invite.email, name });

  await admin.from("workspace_members").insert({
    workspace_id: invite.workspace_id,
    user_id: created.user.id,
    role: "teammate",
    invited_email: invite.email,
    joined_at: new Date().toISOString(),
  });

  await admin.from("invites").update({ status: "accepted" }).eq("id", invite.id);

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: invite.email, password });
  if (signInError) {
    redirect(`/login${qs({ email: invite.email, error: "Account created — please sign in." })}`);
  }

  redirect("/app/dashboard");
}

export async function acceptInviteExistingAccount(token: string, formData: FormData) {
  const password = String(formData.get("password") || "");

  const admin = createAdminClient();
  const { data: invite } = await admin.from("invites").select("*").eq("token", token).single();

  if (!invite || invite.status !== "pending" || new Date(invite.expires_at) < new Date()) {
    redirect(`/invite/${token}${qs({ error: "This invite is no longer valid." })}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: invite!.email, password });
  if (error) {
    redirect(`/invite/${token}${qs({ error: "Incorrect email or password" })}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentMembership } = await admin
    .from("workspace_members")
    .select("id, workspace_id, workspaces(name)")
    .eq("user_id", user!.id)
    .not("joined_at", "is", null)
    .maybeSingle();

  if (!currentMembership) {
    await admin.from("workspace_members").insert({
      workspace_id: invite!.workspace_id,
      user_id: user!.id,
      role: "teammate",
      invited_email: invite!.email,
      joined_at: new Date().toISOString(),
    });
    await admin.from("invites").update({ status: "accepted" }).eq("id", invite!.id);
    redirect("/app/dashboard");
  }

  if (currentMembership.workspace_id === invite!.workspace_id) {
    redirect("/app/dashboard");
  }

  redirect(`/invite/${token}?confirmSwitch=1`);
}

export async function confirmWorkspaceSwitch(token: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: invite } = await admin.from("invites").select("*").eq("token", token).single();

  if (!invite || invite.status !== "pending" || new Date(invite.expires_at) < new Date()) {
    redirect(`/invite/${token}${qs({ error: "This invite is no longer valid." })}`);
  }

  await admin.from("workspace_members").delete().eq("user_id", user!.id);

  await admin.from("workspace_members").insert({
    workspace_id: invite!.workspace_id,
    user_id: user!.id,
    role: "teammate",
    invited_email: invite!.email,
    joined_at: new Date().toISOString(),
  });

  await admin.from("invites").update({ status: "accepted" }).eq("id", invite!.id);

  redirect("/app/dashboard");
}
