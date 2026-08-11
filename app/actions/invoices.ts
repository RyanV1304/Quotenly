"use server";

import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  revalidatePath(`/invoices/${invoiceId}`);
  redirect(`/invoices/${invoiceId}`);
}

export async function sendInvoice(invoiceId: string) {
  const membership = await requireMembership();
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) redirect("/invoices");

  await supabase.from("invoices").update({ status: "sent" }).eq("id", invoiceId);

  const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.share_token}`;

  if (client?.contact_email) {
    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: client.contact_email,
        subject: `Invoice from ${membership.workspaceName}`,
        html: `<p>${membership.workspaceName} sent you an invoice.</p><p><a href="${shareUrl}">View your invoice</a></p>`,
      });
    } catch {
      // status is already updated; owner can share the link manually if email fails
    }
  }

  revalidatePath(`/invoices/${invoiceId}`);
}

export async function markInvoicePaid(invoiceId: string) {
  await requireMembership();
  const supabase = await createClient();
  await supabase.from("invoices").update({ status: "paid" }).eq("id", invoiceId);
  revalidatePath(`/invoices/${invoiceId}`);
}
