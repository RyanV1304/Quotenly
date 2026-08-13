"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireMembership } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function qs(params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) usp.set(k, v);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export async function updateWorkspaceSettings(formData: FormData) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }

  const businessName = String(formData.get("businessName") || "").trim();
  const defaultTaxPercent = Number(formData.get("defaultTaxPercent") || 0);
  const paymentInstructions = String(formData.get("paymentInstructions") || "").trim();
  const logoFile = formData.get("logo") as File | null;

  const admin = createAdminClient();
  let logoUrl: string | undefined;

  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop() || "png";
    const path = `${membership.workspaceId}/logo.${ext}`;
    const { error: uploadError } = await admin.storage.from("logos").upload(path, logoFile, {
      upsert: true,
      contentType: logoFile.type || undefined,
    });

    if (!uploadError) {
      const { data: pub } = admin.storage.from("logos").getPublicUrl(path);
      logoUrl = `${pub.publicUrl}?t=${Date.now()}`;
    }
  }

  const supabase = await createClient();

  if (businessName) {
    await supabase.from("workspaces").update({ name: businessName }).eq("id", membership.workspaceId);
  }

  const updatePayload: Record<string, unknown> = {
    business_name: businessName || membership.workspaceName,
    default_tax_percent: defaultTaxPercent,
    payment_instructions: paymentInstructions || null,
  };
  if (logoUrl) updatePayload.logo_url = logoUrl;

  const { error } = await supabase
    .from("workspace_branding")
    .update(updatePayload)
    .eq("workspace_id", membership.workspaceId);

  if (error) {
    redirect("/app/settings" + qs({ error: error.message }));
  }

  revalidatePath("/app/settings");
  redirect("/app/settings" + qs({ success: "1" }));
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) {
    redirect("/app/account" + qs({ error: "Name must be at least 2 characters." }));
  }

  await supabase.from("users").update({ name }).eq("id", user!.id);

  revalidatePath("/app/account");
  redirect("/app/account" + qs({ success: "1" }));
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword !== confirmPassword) {
    redirect("/app/account" + qs({ error: "New passwords don't match." }));
  }

  const { data: googleOnly } = await supabase.rpc("email_uses_google_only", { p_email: user!.email! });

  if (!googleOnly) {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    });
    if (verifyError) {
      redirect("/app/account" + qs({ error: "Current password is incorrect." }));
    }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    redirect("/app/account" + qs({ error: error.message }));
  }

  redirect("/app/account" + qs({ success: "password" }));
}
