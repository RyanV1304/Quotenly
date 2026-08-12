"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function sendInvoiceEmail(
  to: string,
  workspaceName: string,
  shareUrl: string,
  subject: string,
  intro: string
) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `<p>${intro}</p><p><a href="${shareUrl}">View your invoice</a></p>`,
    });
  } catch {
    // best-effort; owner can share the link manually
  }
}

export async function updateInvoiceDetails(invoiceId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();

  const dueDate = String(formData.get("due_date") || "") || null;
  const paymentInstructions = String(formData.get("payment_instructions") || "").trim() || null;
  const assignedTo = String(formData.get("assigned_to") || "") || null;

  await supabase
    .from("invoices")
    .update({ due_date: dueDate, payment_instructions: paymentInstructions, assigned_to: assignedTo })
    .eq("id", invoiceId);

  revalidatePath(`/app/invoices/${invoiceId}`);
  redirect(`/app/invoices/${invoiceId}`);
}

export async function sendInvoice(invoiceId: string) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) redirect("/app/invoices");

  await supabase
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", invoiceId);

  const client = Array.isArray(invoice!.clients) ? invoice!.clients[0] : invoice!.clients;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice!.share_token}`;

  if (client?.contact_email) {
    await sendInvoiceEmail(
      client.contact_email,
      membership.workspaceName,
      shareUrl,
      `Invoice from ${membership.workspaceName}`,
      `${membership.workspaceName} sent you an invoice.`
    );
  }

  revalidatePath(`/app/invoices/${invoiceId}`);
}

export async function sendReminderNow(invoiceId: string) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) redirect("/app/invoices");

  const client = Array.isArray(invoice!.clients) ? invoice!.clients[0] : invoice!.clients;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice!.share_token}`;

  if (client?.contact_email) {
    await sendInvoiceEmail(
      client.contact_email,
      membership.workspaceName,
      shareUrl,
      "Payment reminder: invoice due",
      `This is a reminder that your invoice from ${membership.workspaceName} is due.`
    );
    await supabase.from("invoice_reminders_log").insert({ invoice_id: invoiceId });
  }

  revalidatePath(`/app/invoices/${invoiceId}`);
}

export async function markInvoicePaid(invoiceId: string, formData: FormData) {
  await requireMembership();
  const supabase = await createClient();

  const paidDate = String(formData.get("paidDate") || "") || new Date().toISOString().slice(0, 10);
  const paidNote = String(formData.get("paidNote") || "").trim() || null;

  await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: paidDate, paid_note: paidNote })
    .eq("id", invoiceId);

  revalidatePath(`/app/invoices/${invoiceId}`);
}
