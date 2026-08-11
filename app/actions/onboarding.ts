"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const businessName = String(formData.get("businessName") || "").trim();
  if (!businessName) {
    redirect(`/onboarding?error=${encodeURIComponent("Business name is required.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const admin = createAdminClient();

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

  redirect("/dashboard");
}
