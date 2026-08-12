"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import type { LineItemType } from "@/lib/types";

export async function saveLineItemAsTemplate(item: {
  description: string;
  type: LineItemType;
  rate: number;
}) {
  const membership = await requireMembership();
  const supabase = await createClient();

  if (!item.description.trim()) return;

  await supabase.from("line_item_templates").insert({
    workspace_id: membership.workspaceId,
    label: item.description.trim(),
    type: item.type,
    default_rate: item.rate,
  });
}
