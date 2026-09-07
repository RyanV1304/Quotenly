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

export async function deleteClientRecord(clientId: string) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/clients?error=" + encodeURIComponent("Only the workspace owner can delete clients."));
  }
  const supabase = await createClient();

  const [{ count: quoteCount }, { count: invoiceCount }, { count: jobCount }] = await Promise.all([
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("client_id", clientId),
    supabase.from("invoices").select("id", { count: "exact", head: true }).eq("client_id", clientId),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("client_id", clientId),
  ]);

  if ((quoteCount ?? 0) > 0 || (invoiceCount ?? 0) > 0 || (jobCount ?? 0) > 0) {
    redirect(
      `/app/clients/${clientId}?error=${encodeURIComponent(
        "This client has quotes, invoices, or jobs on record. Delete those first before deleting the client."
      )}`
    );
  }

  await supabase.from("client_notes").delete().eq("client_id", clientId);
  await supabase.from("clients").delete().eq("id", clientId).eq("workspace_id", membership.workspaceId);

  revalidatePath("/app/clients");
  redirect("/app/clients");
}

export async function addClientNote(clientId: string, formData: FormData) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const noteText = String(formData.get("note_text") || "").trim();
  if (!noteText) {
    redirect(`/app/clients/${clientId}?error=${encodeURIComponent("Note can't be empty.")}`);
  }

  await supabase.from("client_notes").insert({
    client_id: clientId,
    author_user_id: membership.userId,
    note_text: noteText,
  });

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}

export async function deleteClientNote(clientId: string, noteId: string) {
  await requireMembership();
  const supabase = await createClient();

  await supabase.from("client_notes").delete().eq("id", noteId);

  revalidatePath(`/app/clients/${clientId}`);
  redirect(`/app/clients/${clientId}`);
}
