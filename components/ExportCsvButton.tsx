"use client";

function toCsvValue(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function ExportCsvButton({
  filename,
  columns,
  rows,
}: {
  filename: string;
  columns: string[];
  rows: (string | number | null | undefined)[][];
}) {
  function handleExport() {
    const lines = [columns.map(toCsvValue).join(",")];
    for (const row of rows) {
      lines.push(row.map(toCsvValue).join(","));
    }
    const csv = lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={handleExport} className="btn-secondary">
      Export CSV
    </button>
  );
}
