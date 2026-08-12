"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { revalidatePath } from "next/cache";

async function notifyQuoteDecision(token: string, decision: "approved" | "declined") {
  const admin = createAdminClient();

  const { data: quote } = await admin
    .from("quotes")
    .select("id, workspace_id, assigned_to, clients(name), workspaces(owner_id, name)")
    .eq("share_token", token)
    .maybeSingle();

  if (!quote) return;

  const client = Array.isArray(quote.clients) ? quote.clients[0] : quote.clients;
  const workspace = Array.isArray(quote.workspaces) ? quote.workspaces[0] : quote.workspaces;

  const recipientIds = Array.from(
    new Set([workspace?.owner_id, quote.assigned_to].filter((id): id is string => !!id))
  );
  if (recipientIds.length === 0) return;

  const { data: recipients } = await admin.from("users").select("email").in("id", recipientIds);
  const emails = (recipients ?? []).map((r) => r.email).filter(Boolean);
  if (emails.length === 0) return;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: emails,
      subject: `Quote ${decision} — ${client?.name ?? "your client"}`,
      html: `<p>${client?.name ?? "Your client"} has ${decision} the quote for <strong>${workspace?.name ?? "your workspace"}</strong>.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/quotes/${quote.id}">View the quote</a></p>`,
    });
  } catch {
    // non-blocking; status is already updated regardless of email delivery
  }
}

export async function approveQuote(token: string) {
  const supabase = await createClient();
  await supabase.rpc("approve_quote_by_token", { p_token: token });
  await notifyQuoteDecision(token, "approved");
  revalidatePath(`/quote/${token}`);
}

export async function declineQuote(token: string) {
  const supabase = await createClient();
  await supabase.rpc("decline_quote_by_token", { p_token: token });
  await notifyQuoteDecision(token, "declined");
  revalidatePath(`/quote/${token}`);
}

export async function markQuoteViewed(token: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_quote_viewed_by_token", { p_token: token });
}

export async function markInvoiceViewed(token: string) {
  const supabase = await createClient();
  await supabase.rpc("mark_invoice_viewed_by_token", { p_token: token });
}
