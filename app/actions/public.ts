"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveQuote(token: string) {
  const supabase = await createClient();
  await supabase.rpc("approve_quote_by_token", { p_token: token });
  revalidatePath(`/quote/${token}`);
}

export async function markInvoiceViewed(token: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_invoice_viewed_by_token", { p_token: token });
}
