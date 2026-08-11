import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { Invoice, LineItem, WorkspaceBranding, Client } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 24 },
  logo: { width: 120, marginBottom: 8 },
  businessName: { fontSize: 18, fontWeight: 700 },
  muted: { color: "#666666", marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  label: { color: "#666666", marginBottom: 2 },
  table: { marginTop: 12 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000000", paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#dddddd" },
  colDesc: { width: "40%" },
  colQty: { width: "15%" },
  colRate: { width: "20%" },
  colAmount: { width: "25%", textAlign: "right" },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalLine: { flexDirection: "row", gap: 8, marginBottom: 2 },
  totalLabel: { color: "#666666" },
  grandTotal: { fontSize: 14, fontWeight: 700, marginTop: 4 },
  payment: { marginTop: 24, padding: 12, borderWidth: 1, borderColor: "#dddddd" },
});

export default function InvoicePdf({
  invoice,
  lineItems,
  client,
  branding,
}: {
  invoice: Invoice;
  lineItems: LineItem[];
  client: Pick<Client, "name" | "job_address">;
  branding: WorkspaceBranding | null;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img */}
          {branding?.logo_url && <Image src={branding.logo_url} style={styles.logo} />}
          <Text style={styles.businessName}>{branding?.business_name ?? "Invoice"}</Text>
          {branding?.address && <Text style={styles.muted}>{branding.address}</Text>}
          {branding?.phone && <Text style={styles.muted}>{branding.phone}</Text>}
          {branding?.email && <Text style={styles.muted}>{branding.email}</Text>}
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Billed to</Text>
            <Text>{client.name}</Text>
            {client.job_address && <Text style={styles.muted}>{client.job_address}</Text>}
          </View>
          <View>
            <Text style={styles.label}>Due date</Text>
            <Text>{invoice.due_date ?? "-"}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {lineItems.map((li) => (
            <View key={li.id} style={styles.tableRow}>
              <Text style={styles.colDesc}>{li.description}</Text>
              <Text style={styles.colQty}>{li.quantity}</Text>
              <Text style={styles.colRate}>${li.rate.toFixed(2)}</Text>
              <Text style={styles.colAmount}>${li.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>${invoice.subtotal.toFixed(2)}</Text>
          </View>
          <Text style={styles.grandTotal}>Total: ${invoice.total.toFixed(2)}</Text>
        </View>

        {invoice.payment_instructions && (
          <View style={styles.payment}>
            <Text style={styles.label}>How to pay</Text>
            <Text>{invoice.payment_instructions}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
