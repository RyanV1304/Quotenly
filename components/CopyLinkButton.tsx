"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; user can still select the link manually
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-link">
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
