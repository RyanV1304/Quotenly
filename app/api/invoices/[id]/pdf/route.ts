import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import InvoicePdf from "@/components/InvoicePdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, job_address)")
    .eq("id", id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: lineItems } = await supabase
    .from("invoice_line_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order");

  const { data: branding } = await supabase
    .from("workspace_branding")
    .select("*")
    .eq("workspace_id", invoice.workspace_id)
    .single();

  const client = Array.isArray(invoice.clients) ? invoice.clients[0] : invoice.clients;

  const buffer = await renderToBuffer(
    InvoicePdf({
      invoice,
      lineItems: lineItems ?? [],
      client: client ?? { name: "", job_address: null },
      branding: branding ?? null,
    })
  );

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${id.slice(0, 8)}.pdf"`,
    },
  });
}
