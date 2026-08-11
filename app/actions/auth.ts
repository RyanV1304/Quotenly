"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const businessName = String(formData.get("businessName") || "").trim();

  if (!email || !password || !businessName) {
    redirect(`/sign-up?error=${encodeURIComponent("All fields are required.")}`);
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    redirect(`/sign-up?error=${encodeURIComponent(createError?.message || "Could not create account.")}`);
  }

  const { data: workspace, error: wsError } = await admin
    .from("workspaces")
    .insert({ name: businessName, owner_id: created.user.id })
    .select()
    .single();

  if (wsError || !workspace) {
    redirect(`/sign-up?error=${encodeURIComponent(wsError?.message || "Could not create workspace.")}`);
  }

  const { error: memberError } = await admin.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: created.user.id,
    role: "owner",
    invited_email: email,
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    redirect(`/sign-up?error=${encodeURIComponent(memberError.message)}`);
  }

  await admin.from("workspace_branding").insert({
    workspace_id: workspace.id,
    business_name: businessName,
    email,
  });

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    redirect(`/sign-in?error=${encodeURIComponent("Account created — please sign in.")}`);
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function acceptInvite(token: string, formData: FormData) {
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  const { data: members, error: memberLookupError } = await supabase.rpc(
    "get_invite_by_token",
    { p_token: token }
  );
  const member = members?.[0];

  if (memberLookupError || !member) {
    redirect(`/invite/${token}?error=${encodeURIComponent("This invite link is invalid or has already been used.")}`);
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: member.invited_email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    redirect(`/invite/${token}?error=${encodeURIComponent(createError?.message || "Could not create account.")}`);
  }

  const { error: updateError } = await admin
    .from("workspace_members")
    .update({ user_id: created.user.id, joined_at: new Date().toISOString() })
    .eq("id", member.id);

  if (updateError) {
    redirect(`/invite/${token}?error=${encodeURIComponent(updateError.message)}`);
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: member.invited_email,
    password,
  });
  if (signInError) {
    redirect(`/sign-in?error=${encodeURIComponent("Account created — please sign in.")}`);
  }

  redirect("/dashboard");
}
