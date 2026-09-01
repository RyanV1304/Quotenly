"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const businessName = String(formData.get("businessName") || "").trim();
  const acceptedTerms = formData.get("acceptedTerms") === "on";

  if (!businessName) {
    redirect(`/onboarding?error=${encodeURIComponent("Business name is required.")}`);
  }
  if (!acceptedTerms) {
    redirect(`/onboarding?error=${encodeURIComponent("You must agree to the Terms of Service and Privacy Policy.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();

  await admin.from("users").update({ accepted_terms_at: new Date().toISOString() }).eq("id", user.id);

  const { data: workspace, error: wsError } = await admin
    .from("workspaces")
    .insert({ name: businessName, owner_id: user.id })
    .select()
    .single();

  if (wsError || !workspace) {
    redirect(`/onboarding?error=${encodeURIComponent(wsError?.message || "Could not create workspace.")}`);
  }

  const { error: memberError } = await admin.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
    invited_email: user.email,
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    redirect(`/onboarding?error=${encodeURIComponent(memberError.message)}`);
  }

  await admin.from("workspace_branding").insert({
    workspace_id: workspace.id,
    business_name: businessName,
    email: user.email,
  });

  redirect("/app/dashboard");
}
