"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClientRecord(formData: FormData) {
  const membership = await requireMembership();
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    redirect("/app/clients?error=" + encodeURIComponent("Client name is required."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      workspace_id: membership.workspaceId,
      name,
      contact_email: String(formData.get("contact_email") || "").trim() || null,
      contact_phone: String(formData.get("contact_phone") || "").trim() || null,
      job_address: String(formData.get("job_address") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/app/clients?error=" + encodeURIComponent(error?.message || "Could not create client."));
  }

  redirect(`/app/clients/${data.id}`);
}

export async function updateClientRecord(clientId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name: String(formData.get("name") || "").trim(),
      contact_email: String(formData.get("contact_email") || "").trim() || null,
      contact_phone: String(formData.get("contact_phone") || "").trim() || null,
      job_address: String(formData.get("job_address") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
    })
    .eq("id", clientId);

  if (error) {
    redirect(`/app/clients/${clientId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}
