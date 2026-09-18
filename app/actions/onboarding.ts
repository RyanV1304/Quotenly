"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrencyForCountry } from "@/lib/countries";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const businessName = String(formData.get("businessName") || "").trim();
  const signupSource = String(formData.get("signupSource") || "").trim() || null;
  const country = String(formData.get("country") || "").trim();
  const stateRegion = String(formData.get("stateRegion") || "").trim() || null;
  const acceptedTerms = formData.get("acceptedTerms") === "on";

  if (!businessName) {
    redirect(`/onboarding?error=${encodeURIComponent("Business name is required.")}`);
  }
  if (!signupSource) {
    redirect(`/onboarding?error=${encodeURIComponent("Please let us know how you heard about us.")}`);
  }
  if (!country) {
    redirect(`/onboarding?error=${encodeURIComponent("Please select your country.")}`);
  }
  if (country === "US" && !stateRegion) {
    redirect(`/onboarding?error=${encodeURIComponent("State is required for US businesses.")}`);
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
    .insert({
      name: businessName,
      owner_id: user.id,
      signup_source: signupSource,
      country,
      state_region: stateRegion,
    })
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
    currency: getCurrencyForCountry(country),
  });

  redirect("/app/dashboard");
}
