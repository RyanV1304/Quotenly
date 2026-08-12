"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePassword } from "@/lib/validation";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;

function qs(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email for Quotenly",
      html: `<p>Hi ${name || ""},</p><p>Confirm your email address to finish setting up Quotenly.</p><p><a href="${url}">Verify my email</a></p>`,
    });
  } catch {
    // non-blocking; user can resend from the in-app banner
  }
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const businessName = String(formData.get("businessName") || "").trim();

  const back = (error: string) =>
    redirect(`/signup${qs({ name, email, businessName, error })}`);

  if (name.length < 2) back("Name must be at least 2 characters.");
  if (!email) back("Email is required.");
  if (businessName.length < 2) back("Business name must be at least 2 characters.");
  if (password !== confirmPassword) back("Passwords don't match.");
  const passwordError = validatePassword(password);
  if (passwordError) back(passwordError);

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    const msg = (createError?.message || "").toLowerCase();
    if (msg.includes("already") && msg.includes("registered")) {
      redirect(`/login${qs({ email, error: "An account already exists with this email." })}`);
    }
    back(createError?.message || "Could not create account.");
    return;
  }

  const { data: workspace, error: wsError } = await admin
    .from("workspaces")
    .insert({ name: businessName, owner_id: created.user.id })
    .select()
    .single();

  if (wsError || !workspace) back(wsError?.message || "Could not create workspace.");

  await admin.from("workspace_members").insert({
    workspace_id: workspace!.id,
    user_id: created.user.id,
    role: "owner",
    invited_email: email,
    joined_at: new Date().toISOString(),
  });

  await admin.from("workspace_branding").insert({
    workspace_id: workspace!.id,
    business_name: businessName,
    email,
  });

  const { data: profile } = await admin
    .from("users")
    .insert({ id: created.user.id, email, name })
    .select("verification_token")
    .single();

  if (profile?.verification_token) {
    await sendVerificationEmail(email, name, profile.verification_token);
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    redirect(`/login${qs({ email, error: "Account created — please sign in." })}`);
  }

  redirect("/app/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const rememberMe = formData.get("rememberMe") === "on";
  const redirectTo = String(formData.get("redirectTo") || "") || "/app/dashboard";

  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { data: recentAttempts } = await admin
    .from("login_attempts")
    .select("id")
    .eq("email", email)
    .gte("created_at", windowStart);

  if ((recentAttempts?.length ?? 0) >= MAX_ATTEMPTS) {
    redirect(`/login${qs({ email, error: "Too many attempts. Try again in a few minutes." })}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await admin.from("login_attempts").insert({ email });
    redirect(`/login${qs({ email, error: "Incorrect email or password" })}`);
  }

  if (!rememberMe) {
    const cookieStore = await cookies();
    const sessionCookies = cookieStore.getAll().filter((c) => c.name.startsWith("sb-"));
    for (const c of sessionCookies) {
      cookieStore.set(c.name, c.value, { path: "/" });
    }
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resendVerificationEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .update({ verification_token: crypto.randomUUID(), verification_sent_at: new Date().toISOString() })
    .eq("id", user!.id)
    .select("verification_token, name, email")
    .single();

  if (profile?.verification_token) {
    await sendVerificationEmail(profile.email, profile.name, profile.verification_token);
  }

  redirect("/app/dashboard");
}
