import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const DELAY_DAYS = 2;

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

  const cutoff = new Date(Date.now() - DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: candidates } = await supabase
    .from("invoices")
    .select("id, workspace_id, paid_at, clients(name, contact_email)")
    .eq("status", "paid")
    .eq("review_request_sent", false)
    .lte("paid_at", cutoff.slice(0, 10));

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const workspaceIds = Array.from(new Set(candidates.map((inv) => inv.workspace_id)));
  const { data: brandings } = await supabase
    .from("workspace_branding")
    .select("workspace_id, review_link, review_requests_enabled, business_name")
    .in("workspace_id", workspaceIds);
  const brandingByWorkspaceId = new Map((brandings ?? []).map((b) => [b.workspace_id, b]));

  let sentCount = 0;

  for (const invoice of candidates) {
    const branding = brandingByWorkspaceId.get(invoice.workspace_id);
    const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;

    if (!branding?.review_requests_enabled || !branding?.review_link || !client?.contact_email) {
      continue;
    }

    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: client.contact_email,
        subject: `How did we do?`,
        html: `<p>Thanks for choosing ${branding.business_name ?? "us"} — we'd really appreciate it if you took a minute to leave us a review.</p><p><a href="${branding.review_link}">Leave a review</a></p>`,
      });
      await supabase.from("invoices").update({ review_request_sent: true }).eq("id", invoice.id);
      sentCount += 1;
    } catch {
      // leave review_request_sent false so it retries next run
    }
  }

  return NextResponse.json({ sent: sentCount, checked: candidates.length });
}
