import type { LineItemType } from "@/lib/types";

const LINE_ITEM_TYPE_LABELS: Record<LineItemType, string> = {
  labor: "Labor",
  materials: "Materials",
  flat_fee: "Flat fee",
};

export function lineItemTypeLabel(type: LineItemType): string {
  return LINE_ITEM_TYPE_LABELS[type] ?? type;
}

export interface LineItemInput {
  description: string;
  type: LineItemType;
  quantity: number;
  rate: number;
}

export function computeTotals(items: LineItemInput[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const total = subtotal * (1 + taxRate);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function parseLineItems(raw: string): LineItemInput[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.description === "string" && i.description.trim())
      .map((i) => ({
        description: String(i.description).trim(),
        type: (["labor", "materials", "flat_fee"].includes(i.type) ? i.type : "labor") as LineItemType,
        quantity: Number(i.quantity) || 0,
        rate: Number(i.rate) || 0,
      }));
  } catch {
    return [];
  }
}
