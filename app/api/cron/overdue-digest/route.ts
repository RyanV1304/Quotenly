import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getResend, FROM_EMAIL } from "@/lib/resend";

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
    .select("id, workspace_id, total, due_date, clients(name)")
    .in("status", ["sent", "viewed", "overdue"])
    .lt("due_date", today);

  if (!overdueInvoices || overdueInvoices.length === 0) {
    return NextResponse.json({ digestsSent: 0 });
  }

  const workspaceIds = Array.from(new Set(overdueInvoices.map((inv) => inv.workspace_id)));

  const [{ data: brandings }, { data: workspaces }] = await Promise.all([
    supabase
      .from("workspace_branding")
      .select("workspace_id, overdue_digest_enabled, business_name")
      .in("workspace_id", workspaceIds),
    supabase.from("workspaces").select("id, owner_id").in("id", workspaceIds),
  ]);
  const brandingByWorkspaceId = new Map((brandings ?? []).map((b) => [b.workspace_id, b]));
  const ownerIdByWorkspaceId = new Map((workspaces ?? []).map((w) => [w.id, w.owner_id]));

  const ownerIds = Array.from(new Set(Array.from(ownerIdByWorkspaceId.values()).filter((id): id is string => !!id)));
  const { data: owners } = ownerIds.length
    ? await supabase.from("users").select("id, email").in("id", ownerIds)
    : { data: [] as { id: string; email: string }[] };
  const emailByOwnerId = new Map((owners ?? []).map((o) => [o.id, o.email]));

  const invoicesByWorkspace = new Map<string, typeof overdueInvoices>();
  for (const invoice of overdueInvoices) {
    const list = invoicesByWorkspace.get(invoice.workspace_id) ?? [];
    list.push(invoice);
    invoicesByWorkspace.set(invoice.workspace_id, list);
  }

  let digestsSent = 0;

  for (const [workspaceId, invoices] of invoicesByWorkspace) {
    const branding = brandingByWorkspaceId.get(workspaceId);
    if (branding?.overdue_digest_enabled === false) continue;

    const ownerId = ownerIdByWorkspaceId.get(workspaceId);
    const ownerEmail = ownerId ? emailByOwnerId.get(ownerId) : undefined;
    if (!ownerEmail) continue;

    const withDaysOverdue = invoices.map((inv) => {
      const client = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
      const daysOverdue = Math.floor((Date.now() - new Date(inv.due_date!).getTime()) / (24 * 60 * 60 * 1000));
      return { clientName: client?.name ?? "Unknown client", total: inv.total, daysOverdue };
    });
    withDaysOverdue.sort((a, b) => b.daysOverdue - a.daysOverdue);

    const totalAmount = withDaysOverdue.reduce((sum, i) => sum + i.total, 0);
    const rows = withDaysOverdue
      .slice(0, 10)
      .map(
        (i) =>
          `<tr><td style="padding:4px 12px 4px 0;">${i.clientName}</td><td style="padding:4px 12px;">$${i.total.toFixed(
            2
          )}</td><td style="padding:4px 0;">${i.daysOverdue} day${i.daysOverdue === 1 ? "" : "s"} overdue</td></tr>`
      )
      .join("");

    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: ownerEmail,
        subject: `${withDaysOverdue.length} overdue invoice${withDaysOverdue.length === 1 ? "" : "s"} — $${totalAmount.toFixed(2)} total`,
        html: `<p>${branding?.business_name ?? "Your workspace"} has <strong>${withDaysOverdue.length}</strong> overdue invoice${
          withDaysOverdue.length === 1 ? "" : "s"
        } totaling <strong>$${totalAmount.toFixed(2)}</strong>.</p><table>${rows}</table>${
          withDaysOverdue.length > 10 ? `<p>...and ${withDaysOverdue.length - 10} more.</p>` : ""
        }<p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/invoices">View invoices</a></p>`,
      });
      digestsSent += 1;
    } catch {
      // best-effort; try again next week
    }
  }

  return NextResponse.json({ digestsSent, workspacesChecked: invoicesByWorkspace.size });
}
