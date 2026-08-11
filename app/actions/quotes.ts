"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { computeTotals, parseLineItems } from "@/lib/calc";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuote(formData: FormData) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") || "");
  const assignedTo = String(formData.get("assigned_to") || "") || null;
  const taxRate = Number(formData.get("tax_rate") || 0);
  const items = parseLineItems(String(formData.get("items") || "[]"));

  if (!clientId || items.length === 0) {
    redirect("/quotes/new?error=" + encodeURIComponent("Pick a client and add at least one line item."));
  }

  const { subtotal, total } = computeTotals(items, taxRate);

  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      workspace_id: membership.workspaceId,
      client_id: clientId,
      assigned_to: assignedTo,
      subtotal,
      tax_rate: taxRate,
      total,
    })
    .select("id")
    .single();

  if (error || !quote) {
    redirect("/quotes/new?error=" + encodeURIComponent(error?.message || "Could not create quote."));
  }

  await supabase.from("quote_line_items").insert(
    items.map((item, i) => ({
      quote_id: quote.id,
      description: item.description,
      type: item.type,
      quantity: item.quantity,
      rate: item.rate,
      amount: Math.round(item.quantity * item.rate * 100) / 100,
      sort_order: i,
    }))
  );

  redirect(`/quotes/${quote.id}`);
}

export async function updateQuote(quoteId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();

  const assignedTo = String(formData.get("assigned_to") || "") || null;
  const taxRate = Number(formData.get("tax_rate") || 0);
  const items = parseLineItems(String(formData.get("items") || "[]"));
  const { subtotal, total } = computeTotals(items, taxRate);

  await supabase
    .from("quotes")
    .update({ assigned_to: assignedTo, tax_rate: taxRate, subtotal, total })
    .eq("id", quoteId);

  await supabase.from("quote_line_items").delete().eq("quote_id", quoteId);
  await supabase.from("quote_line_items").insert(
    items.map((item, i) => ({
      quote_id: quoteId,
      description: item.description,
      type: item.type,
      quantity: item.quantity,
      rate: item.rate,
      amount: Math.round(item.quantity * item.rate * 100) / 100,
      sort_order: i,
    }))
  );

  revalidatePath(`/quotes/${quoteId}`);
  redirect(`/quotes/${quoteId}`);
}

export async function sendQuote(quoteId: string) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(name, contact_email)")
    .eq("id", quoteId)
    .single();

  if (!quote) redirect("/quotes");

  await supabase.from("quotes").update({ status: "sent" }).eq("id", quoteId);

  const client = Array.isArray(quote.clients) ? quote.clients[0] : quote.clients;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/quote/${quote.share_token}`;

  if (client?.contact_email) {
    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: client.contact_email,
        subject: `Quote from ${membership.workspaceName}`,
        html: `<p>${membership.workspaceName} sent you a quote.</p><p><a href="${shareUrl}">View and approve your quote</a></p>`,
      });
    } catch {
      // status is already updated; owner can share the link manually if email fails
    }
  }

  revalidatePath(`/quotes/${quoteId}`);
}

export async function convertToInvoice(quoteId: string) {
  await requireMembership();
  const supabase = await createClient();

  const { data: quote } = await supabase.from("quotes").select("*").eq("id", quoteId).single();
  if (!quote) redirect("/quotes");

  const { data: lineItems } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("quote_id", quoteId)
    .order("sort_order");

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      workspace_id: quote.workspace_id,
      quote_id: quote.id,
      client_id: quote.client_id,
      assigned_to: quote.assigned_to,
      subtotal: quote.subtotal,
      tax_rate: quote.tax_rate,
      total: quote.total,
      payment_instructions: "Pay via check, cash, or Zelle. Contact us with questions.",
    })
    .select("id")
    .single();

  if (error || !invoice) {
    redirect(`/quotes/${quoteId}?error=${encodeURIComponent(error?.message || "Could not convert to invoice.")}`);
  }

  if (lineItems && lineItems.length > 0) {
    await supabase.from("invoice_line_items").insert(
      lineItems.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        type: item.type,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        sort_order: item.sort_order,
      }))
    );
  }

  redirect(`/invoices/${invoice.id}`);
}
