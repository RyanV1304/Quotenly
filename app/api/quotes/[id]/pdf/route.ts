import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import QuotePdf from "@/components/QuotePdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(name, job_address)")
    .eq("id", id)
    .single();

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: lineItems } = await supabase
    .from("quote_line_items")
    .select("*")
    .eq("quote_id", id)
    .order("sort_order");

  const { data: branding } = await supabase
    .from("workspace_branding")
    .select("*")
    .eq("workspace_id", quote.workspace_id)
    .single();

  const client = Array.isArray(quote.clients) ? quote.clients[0] : quote.clients;

  const buffer = await renderToBuffer(
    QuotePdf({
      quote,
      lineItems: lineItems ?? [],
      client: client ?? { name: "", job_address: null },
      branding: branding ?? null,
    })
  );

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="quote-${id.slice(0, 8)}.pdf"`,
    },
  });
}
