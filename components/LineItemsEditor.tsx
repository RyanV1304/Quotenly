"use client";

import { useMemo, useState } from "react";
import type { LineItemType } from "@/lib/types";
import { saveLineItemAsTemplate } from "@/app/actions/templates";

interface Row {
  description: string;
  type: LineItemType;
  quantity: number;
  rate: number;
}

export interface TemplateOption {
  id: string;
  label: string;
  type: LineItemType;
  default_rate: number;
}

export default function LineItemsEditor({
  initialItems,
  initialTaxRate,
  templates,
}: {
  initialItems?: Row[];
  initialTaxRate?: number;
  templates: TemplateOption[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initialItems && initialItems.length > 0
      ? initialItems
      : [{ description: "", type: "labor", quantity: 1, rate: 0 }]
  );
  const [taxRatePct, setTaxRatePct] = useState<number>((initialTaxRate ?? 0) * 100);

  const subtotal = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.rate) || 0), 0),
    [rows]
  );
  const total = subtotal * (1 + taxRatePct / 100);

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { description: "", type: "labor", quantity: 1, rate: 0 }]);
  }

  function addFromTemplate(templateId: string) {
    const t = templates.find((t) => t.id === templateId);
    if (!t) return;
    setRows((prev) => [...prev, { description: t.label, type: t.type, quantity: 1, rate: t.default_rate }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  async function saveAsTemplate(index: number) {
    const row = rows[index];
    if (!row.description.trim()) return;
    await saveLineItemAsTemplate(row);
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="items" value={JSON.stringify(rows)} />
      <input type="hidden" name="tax_rate" value={(taxRatePct / 100).toString()} />

      {templates.length > 0 && (
        <select
          onChange={(e) => {
            if (e.target.value) addFromTemplate(e.target.value);
            e.target.value = "";
          }}
          className="w-64 rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/20"
          defaultValue=""
        >
          <option value="" disabled>
            Add from template...
          </option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} ({t.type})
            </option>
          ))}
        </select>
      )}

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-12 items-center gap-2">
            <input
              value={row.description}
              onChange={(e) => updateRow(i, { description: e.target.value })}
              placeholder="Description"
              className="col-span-5 rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/20"
            />
            <select
              value={row.type}
              onChange={(e) => updateRow(i, { type: e.target.value as LineItemType })}
              className="col-span-2 rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/20"
            >
              <option value="labor">Labor</option>
              <option value="materials">Materials</option>
              <option value="flat_fee">Flat fee</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={row.quantity}
              onChange={(e) => updateRow(i, { quantity: Number(e.target.value) })}
              className="col-span-2 rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/20"
            />
            <input
              type="number"
              step="0.01"
              value={row.rate}
              onChange={(e) => updateRow(i, { rate: Number(e.target.value) })}
              className="col-span-2 rounded-md border border-black/15 px-2 py-1.5 text-sm dark:border-white/20"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="col-span-1 text-red-600 dark:text-red-400"
            >
              &times;
            </button>
            <button
              type="button"
              onClick={() => saveAsTemplate(i)}
              className="col-span-12 w-fit text-xs text-black/40 underline dark:text-white/40"
            >
              {savedIndex === i ? "Saved as template" : "Save as template"}
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addRow} className="w-fit text-sm underline">
        + Add line item
      </button>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <label htmlFor="taxRatePct">Tax rate (%)</label>
        <input
          id="taxRatePct"
          type="number"
          step="0.01"
          value={taxRatePct}
          onChange={(e) => setTaxRatePct(Number(e.target.value))}
          className="w-24 rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20"
        />
      </div>

      <div className="mt-2 flex flex-col items-end gap-1 text-sm">
        <div>Subtotal: {subtotal.toFixed(2)}</div>
        <div className="font-semibold">Total: {total.toFixed(2)}</div>
      </div>
    </div>
  );
}
