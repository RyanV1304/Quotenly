"use client";

import { useId, useState } from "react";

export default function FileUploadSquare({
  name,
  accept,
  required,
  label = "Click to upload",
}: {
  name: string;
  accept?: string;
  required?: boolean;
  label?: string;
}) {
  const inputId = useId();
  const [fileName, setFileName] = useState("");

  return (
    <label
      htmlFor={inputId}
      className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line bg-bg-white p-2 text-center transition-colors hover:border-brand hover:bg-brand-tint"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-faint">
        <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="line-clamp-2 text-xs font-medium text-ink-soft">{fileName || label}</span>
      <input
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}
