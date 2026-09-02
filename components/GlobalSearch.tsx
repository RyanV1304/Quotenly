"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  href: string;
}

interface SearchResponse {
  clients: SearchResult[];
  quotes: SearchResult[];
  invoices: SearchResult[];
}

const EMPTY: SearchResponse = { clients: [], quotes: [], invoices: [] };

function placeholderFor(pathname: string): string {
  if (pathname.startsWith("/app/clients")) return "Search clients...";
  if (pathname.startsWith("/app/quotes")) return "Search quotes...";
  if (pathname.startsWith("/app/invoices")) return "Search invoices...";
  return "Search clients, quotes, invoices...";
}

export default function GlobalSearch({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          setResults(await res.json());
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.clients.length > 0 || results.quotes.length > 0 || results.invoices.length > 0;
  const showDropdown = open && query.trim().length >= 2;

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={containerRef} className={`relative w-full max-w-xs ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
        placeholder={placeholderFor(pathname)}
        className="input h-9 w-full text-sm"
        aria-label="Search"
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 top-11 z-40 max-h-96 overflow-y-auto rounded-lg border border-line bg-bg-white p-2 shadow-lg">
          {loading && <p className="px-3 py-2 text-sm text-ink-faint">Searching...</p>}
          {!loading && !hasResults && <p className="px-3 py-2 text-sm text-ink-faint">No results for &quot;{query}&quot;</p>}
          {!loading && (
            <>
              <ResultGroup title="Clients" items={results.clients} onSelect={go} />
              <ResultGroup title="Quotes" items={results.quotes} onSelect={go} />
              <ResultGroup title="Invoices" items={results.invoices} onSelect={go} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: SearchResult[];
  onSelect: (href: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-1 last:mb-0">
      <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.href)}
          className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left text-sm hover:bg-brand-tint"
        >
          <span className="font-medium text-ink">{item.label}</span>
          {item.sublabel && <span className="text-xs text-ink-faint">{item.sublabel}</span>}
        </button>
      ))}
    </div>
  );
}
