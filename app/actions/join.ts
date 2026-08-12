"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "pending_join_token";

export async function verifyJoinCode(formData: FormData) {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const password = String(formData.get("password") || "");

  if (!code || !password) {
    redirect(`/join?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Enter the code and password.")}`);
  }

  const admin = createAdminClient();
  const { data: workspace } = await admin
    .from("workspaces")
    .select("id, join_enabled, join_password_hash")
    .eq("join_code", code)
    .maybeSingle();

  if (
    !workspace ||
    !workspace.join_enabled ||
    !workspace.join_password_hash ||
    !verifyPassword(password, workspace.join_password_hash)
  ) {
    redirect(`/join?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Invalid code or password.")}`);
  }

  const { data: pending, error } = await admin
    .from("pending_joins")
    .insert({ workspace_id: workspace.id })
    .select("token")
    .single();

  if (error || !pending) {
    redirect(`/join?code=${encodeURIComponent(code)}&error=${encodeURIComponent("Could not start join. Try again.")}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, pending.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 900,
    path: "/",
  });

  redirect("/join/complete");
}

export async function completeJoinWithEmail(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 8) {
    redirect(`/join/complete?error=${encodeURIComponent("Email and an 8+ character password are required.")}`);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect(`/join?error=${encodeURIComponent("Your join session expired. Enter the code again.")}`);
  }

  const admin = createAdminClient();
  const { data: pending } = await admin
    .from("pending_joins")
    .select("workspace_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!pending || new Date(pending.expires_at) < new Date()) {
    cookieStore.delete(COOKIE_NAME);
    redirect(`/join?error=${encodeURIComponent("Your join session expired. Enter the code again.")}`);
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    redirect(`/join/complete?error=${encodeURIComponent(createError?.message || "Could not create account.")}`);
  }

  const { error: memberError } = await admin.from("workspace_members").insert({
    workspace_id: pending.workspace_id,
    user_id: created.user.id,
    role: "teammate",
    invited_email: email,
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    redirect(`/join/complete?error=${encodeURIComponent(memberError.message)}`);
  }

  await admin.from("pending_joins").delete().eq("token", token);
  cookieStore.delete(COOKIE_NAME);

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    redirect(`/sign-in?error=${encodeURIComponent("Account created — please sign in.")}`);
  }

  redirect("/dashboard");
}
