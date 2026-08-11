"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { revalidatePath } from "next/cache";

export async function createTemplate(formData: FormData) {
  const membership = await requireMembership();
  const supabase = await createClient();

  await supabase.from("line_item_templates").insert({
    workspace_id: membership.workspaceId,
    label: String(formData.get("label") || "").trim(),
    type: String(formData.get("type") || "labor"),
    default_rate: Number(formData.get("default_rate") || 0),
  });

  revalidatePath("/templates");
}

export async function deleteTemplate(templateId: string) {
  await requireMembership();
  const supabase = await createClient();
  await supabase.from("line_item_templates").delete().eq("id", templateId);
  revalidatePath("/templates");
}
