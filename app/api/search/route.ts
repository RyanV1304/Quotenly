import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  href: string;
}

export async function GET(req: NextRequest) {
  const membership = await requireMembership();
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ clients: [], quotes: [], invoices: [] });
  }

  const supabase = await createClient();
  const like = `%${q}%`;
  const isTeammate = membership.role === "teammate";

  let clientIdScope: string[] | null = null;
  if (isTeammate) {
    const [{ data: assignedQuotes }, { data: assignedInvoices }] = await Promise.all([
      supabase.from("quotes").select("client_id").eq("assigned_to", membership.userId),
      supabase.from("invoices").select("client_id").eq("assigned_to", membership.userId),
    ]);
    clientIdScope = Array.from(
      new Set(
        [...(assignedQuotes ?? []), ...(assignedInvoices ?? [])]
          .map((r) => r.client_id)
          .filter((id): id is string => !!id)
      )
    );
    if (clientIdScope.length === 0) {
      return NextResponse.json({ clients: [], quotes: [], invoices: [] });
    }
  }

  let clientsQuery = supabase
    .from("clients")
    .select("id, name, contact_email, contact_phone, job_address")
    .eq("workspace_id", membership.workspaceId)
    .or(`name.ilike.${like},contact_email.ilike.${like},contact_phone.ilike.${like},job_address.ilike.${like}`)
    .limit(6);
  if (clientIdScope) clientsQuery = clientsQuery.in("id", clientIdScope);

  const [{ data: clientMatches }, { data: quoteLineMatches }, { data: invoiceLineMatches }] = await Promise.all([
    clientsQuery,
    supabase.from("quote_line_items").select("quote_id").ilike("description", like).limit(20),
    supabase.from("invoice_line_items").select("invoice_id").ilike("description", like).limit(20),
  ]);

  const clientIds = (clientMatches ?? []).map((c) => c.id);
  const quoteIdsFromLineItems = Array.from(new Set((quoteLineMatches ?? []).map((r) => r.quote_id)));
  const invoiceIdsFromLineItems = Array.from(new Set((invoiceLineMatches ?? []).map((r) => r.invoice_id)));

  const quoteFilters: string[] = [];
  if (clientIds.length > 0) quoteFilters.push(`client_id.in.(${clientIds.join(",")})`);
  if (quoteIdsFromLineItems.length > 0) quoteFilters.push(`id.in.(${quoteIdsFromLineItems.join(",")})`);

  const invoiceFilters: string[] = [];
  if (clientIds.length > 0) invoiceFilters.push(`client_id.in.(${clientIds.join(",")})`);
  if (invoiceIdsFromLineItems.length > 0) invoiceFilters.push(`id.in.(${invoiceIdsFromLineItems.join(",")})`);

  let quoteMatches: { id: string; status: string; total: number; clients: { name: string } | { name: string }[] | null }[] = [];
  let invoiceMatches: { id: string; status: string; total: number; clients: { name: string } | { name: string }[] | null }[] = [];

  if (quoteFilters.length > 0) {
    let quotesQuery = supabase
      .from("quotes")
      .select("id, status, total, clients(name)")
      .or(quoteFilters.join(","))
      .limit(6);
    if (isTeammate) quotesQuery = quotesQuery.eq("assigned_to", membership.userId);
    const { data } = await quotesQuery;
    quoteMatches = data ?? [];
  }

  if (invoiceFilters.length > 0) {
    let invoicesQuery = supabase
      .from("invoices")
      .select("id, status, total, clients(name)")
      .or(invoiceFilters.join(","))
      .limit(6);
    if (isTeammate) invoicesQuery = invoicesQuery.eq("assigned_to", membership.userId);
    const { data } = await invoicesQuery;
    invoiceMatches = data ?? [];
  }

  const clients: SearchResult[] = (clientMatches ?? []).map((c) => ({
    id: c.id,
    label: c.name,
    sublabel: c.contact_email || c.contact_phone || c.job_address || "",
    href: `/app/clients/${c.id}`,
  }));

  const quotes: SearchResult[] = quoteMatches.map((q) => {
    const client = Array.isArray(q.clients) ? q.clients[0] : q.clients;
    return {
      id: q.id,
      label: client?.name ?? "Unknown client",
      sublabel: `${q.status} · $${Number(q.total).toFixed(2)}`,
      href: `/app/quotes/${q.id}`,
    };
  });

  const invoices: SearchResult[] = invoiceMatches.map((i) => {
    const client = Array.isArray(i.clients) ? i.clients[0] : i.clients;
    return {
      id: i.id,
      label: client?.name ?? "Unknown client",
      sublabel: `${i.status} · $${Number(i.total).toFixed(2)}`,
      href: `/app/invoices/${i.id}`,
    };
  });

  return NextResponse.json({ clients, quotes, invoices });
}
