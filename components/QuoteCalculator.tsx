"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeTotals } from "@/lib/calc";
import { formatCurrency } from "@/lib/format";

interface Row {
  description: string;
  quantity: number;
  rate: number;
}

export default function QuoteCalculator() {
  const [jobDescription, setJobDescription] = useState("");
  const [rows, setRows] = useState<Row[]>([{ description: "", quantity: 1, rate: 0 }]);
  const [taxRatePct, setTaxRatePct] = useState(0);

  const { subtotal, total } = useMemo(
    () =>
      computeTotals(
        rows.map((r) => ({ description: r.description, type: "labor" as const, quantity: r.quantity, rate: r.rate })),
        taxRatePct / 100
      ),
    [rows, taxRatePct]
  );
  const taxAmount = Math.round((total - subtotal) * 100) / 100;

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-line bg-bg-white p-6 sm:p-8">
        <label className="field-label">
          Job description (optional)
          <input
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="e.g. Kitchen sink repair"
            className="input"
          />
        </label>

        <div className="mt-5 flex flex-col gap-2">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-line p-2.5">
              <input
                value={row.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                placeholder="Line item description"
                className="input col-span-6 py-1.5 sm:col-span-7"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={row.quantity}
                onChange={(e) => updateRow(i, { quantity: Number(e.target.value) })}
                placeholder="Qty"
                className="input col-span-3 py-1.5 sm:col-span-2"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={row.rate}
                onChange={(e) => updateRow(i, { rate: Number(e.target.value) })}
                placeholder="Rate"
                className="input col-span-2 py-1.5"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={rows.length === 1}
                className="col-span-1 text-lg font-medium text-danger transition-colors hover:text-danger disabled:opacity-30"
                aria-label="Remove line item"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addRow} className="btn-link mt-3 w-fit">
          + Add line item
        </button>

        <div className="mt-5 flex items-center gap-2 text-sm">
          <label htmlFor="calcTaxRate" className="font-medium text-ink">
            Tax rate (%)
          </label>
          <input
            id="calcTaxRate"
            type="number"
            step="0.01"
            min="0"
            value={taxRatePct}
            onChange={(e) => setTaxRatePct(Number(e.target.value))}
            className="input w-24 py-1.5"
          />
        </div>

        <div className="mt-6 flex flex-col gap-1.5 border-t border-line pt-5 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-brand-tint p-5 text-center text-sm text-ink-soft">
        Want to send this as a real quote your client can approve and pay?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Try Krewbill free &mdash; no card required
        </Link>
      </div>
    </div>
  );
}
