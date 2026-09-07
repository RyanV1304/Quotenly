"use client";

import { useState } from "react";

export default function DeleteButton({
  action,
  itemLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  itemLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-danger-tint hover:text-danger"
        aria-label={`Delete ${itemLabel}`}
        title="Delete"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path
            d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m-6.5 0 .6 9.4A2 2 0 0 0 8.1 17.2h3.8a2 2 0 0 0 2-1.8L14.5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold text-ink">Delete {itemLabel}?</h2>
            <p className="mt-1 text-sm text-ink-soft">
              This can&apos;t be undone. Type <span className="font-mono font-semibold text-ink">DELETE</span> to
              confirm.
            </p>
            <input
              className="input mt-3 w-full"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <form action={action}>
                <button
                  type="submit"
                  disabled={!canDelete}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                  style={canDelete ? { background: "var(--danger)" } : undefined}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
