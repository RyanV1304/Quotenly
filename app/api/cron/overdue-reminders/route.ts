import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getResend, FROM_EMAIL } from "@/lib/resend";

// Uses the anon key with RLS bypassed via the security-definer style is not needed here since
// this route only touches invoices/clients data server-side with the service context provided
// by SUPABASE_URL + ANON key is insufficient for cross-workspace reads, so this route requires
// SUPABASE_SERVICE_ROLE_KEY to be set for the daily cron to see every workspace's invoices.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 500 });
  }

  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  const today = new Date().toISOString().slice(0, 10);
  const { data: overdueInvoices } = await supabase
    .from("invoices")
    .select("id, share_token, due_date, workspace_id, clients(name, contact_email)")
    .in("status", ["sent", "viewed", "overdue"])
    .lt("due_date", today);

  if (!overdueInvoices || overdueInvoices.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let sentCount = 0;

  for (const invoice of overdueInvoices) {
    await supabase.from("invoices").update({ status: "overdue" }).eq("id", invoice.id);

    const { data: recentReminders } = await supabase
      .from("invoice_reminders_log")
      .select("id")
      .eq("invoice_id", invoice.id)
      .gte("sent_at", sevenDaysAgo)
      .limit(1);

    if (recentReminders && recentReminders.length > 0) continue;

    const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;
    if (!client?.contact_email) continue;

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.share_token}`;

    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: client.contact_email,
        subject: `Payment reminder: invoice overdue`,
        html: `<p>This is a reminder that your invoice (due ${invoice.due_date}) is now overdue.</p><p><a href="${shareUrl}">View your invoice</a></p>`,
      });
      await supabase.from("invoice_reminders_log").insert({ invoice_id: invoice.id });
      sentCount += 1;
    } catch {
      // skip logging on send failure so it retries next run
    }
  }

  return NextResponse.json({ sent: sentCount, checked: overdueInvoices.length });
}
