import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMembership } from "@/lib/workspace";
import { updateWorkspaceSettings, transferOwnership } from "@/app/actions/settings";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import FileUploadSquare from "@/components/FileUploadSquare";

const FEATURE_GUIDE: { title: string; body: string }[] = [
  {
    title: "Clients",
    body: "Add a client's name, contact info, and job address. Every quote and invoice you create is linked to a client, and their page shows the full history of jobs you've done for them.",
  },
  {
    title: "Quotes",
    body: "Build a quote with line items (labor, materials, or a flat fee), then send it. The client gets a public link — no login needed — where they draw a signature and Approve, or Decline. Once approved, click \"Convert to invoice\" to turn it into a real invoice with one click.",
  },
  {
    title: "Jobs",
    body: "A job groups the photos, actual expenses, and profit tracking for a piece of work, separate from the quote/invoice paper trail. Optionally link a job to a quote to compare what you quoted against what it actually cost.",
  },
  {
    title: "Invoices",
    body: "Invoices track payment status: draft, sent, viewed, overdue, or paid. Clients view them at a public link and see your payment instructions — Quotenly doesn't collect payment itself, so mark an invoice \"Paid\" yourself once you've been paid. You can edit a sent invoice's line items later; the client is automatically re-notified and the \"viewed\" status resets.",
  },
  {
    title: "Copy link",
    body: "Every quote and invoice has a \"Copy link\" button next to the public link. Use it to grab the share URL and send it yourself (text, WhatsApp, email) any time automatic email delivery isn't an option.",
  },
  {
    title: "Global search",
    body: "The search bar in the top navigation searches across clients, quote and invoice line items, and client contact info. Results are grouped by type — click one to jump straight to that page.",
  },
  {
    title: "Team & roles",
    body: "A workspace has one Owner and any number of Teammates. The Owner sees and manages everything. Teammates only see quotes and invoices assigned to them. Invite teammates from \"Manage team\" below — only the Owner can invite, remove, or manage teammates.",
  },
  {
    title: "Transfer ownership",
    body: "The current Owner can hand ownership to an existing teammate from this page. You'll become a Teammate yourself immediately, and only the new Owner can transfer it back.",
  },
  {
    title: "Dashboard",
    body: "Owners see total outstanding balance, amount paid this month, and a per-teammate breakdown of quotes and invoices. Teammates see just their own assigned jobs.",
  },
  {
    title: "Invoice numbers",
    body: "Every invoice gets a sequential number (INV-1001, INV-1002, ...) shown on the invoice, the invoice list, and the PDF — useful for bookkeeping and taxes. Set a starting number in Business Profile before you create your first invoice.",
  },
  {
    title: "Review requests",
    body: "Add your Google Business (or any) review link and turn on review requests, and Quotenly will automatically email the client a few days after you mark an invoice paid, asking them to leave a review.",
  },
  {
    title: "Client notes",
    body: "Each client page has a timestamped notes feed — separate from the single contact-notes field — so you can log things like \"Called 8/15 — prefers afternoon appointments\" over time instead of overwriting a single note.",
  },
  {
    title: "CSV export",
    body: "The Invoices and Jobs pages each have an Export CSV button that downloads the current list in accountant-friendly columns — handy for handing off to a bookkeeper or your own tax records.",
  },
  {
    title: "Activity log (owner only)",
    body: "The Activity page lists key events across the workspace — quotes created/sent/approved/declined, invoices created/paid, teammates invited/removed — with who did it and when.",
  },
];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; transferTo?: string }>;
}) {
  const membership = await requireMembership();
  if (membership.role !== "owner") {
    redirect("/app/dashboard");
  }
  const { error, success, transferTo } = await searchParams;

  const supabase = await createClient();
  const [{ data: branding }, { data: teammates }] = await Promise.all([
    supabase.from("workspace_branding").select("*").eq("workspace_id", membership.workspaceId).single(),
    supabase
      .from("workspace_members")
      .select("user_id, invited_email")
      .eq("workspace_id", membership.workspaceId)
      .eq("role", "teammate")
      .not("joined_at", "is", null),
  ]);

  let selectedTeammateName: string | null = null;
  if (transferTo) {
    const { data: profile } = await supabase.from("users").select("name").eq("id", transferTo).maybeSingle();
    selectedTeammateName =
      profile?.name || teammates?.find((t) => t.user_id === transferTo)?.invited_email || "this teammate";
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Settings</h1>
        <Link href="/app/settings/team" className="btn-link">
          Manage team &rarr;
        </Link>
      </div>

      {error && <p className="alert-error">{error}</p>}
      {success && <p className="alert-success">Settings saved.</p>}

      <section className="rounded-lg border border-line bg-bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Business profile</h2>
        <p className="mt-1 text-sm text-ink-soft">
          This appears on your quotes, invoices, and the branded PDFs your clients see.
        </p>
        <form action={updateWorkspaceSettings} className="mt-4 flex flex-col gap-4">
          <label className="field-label">
            Business name
            <input name="businessName" defaultValue={membership.workspaceName} className="input" />
          </label>

          <div className="field-label">
            Logo
            <div className="flex items-center gap-3">
              {branding?.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={branding.logo_url} alt="Current logo" className="h-16 w-16 rounded-lg border border-line object-contain bg-bg-white p-1" />
              )}
              <FileUploadSquare name="logo" accept="image/*" label="Click to upload" />
            </div>
          </div>

          <label className="field-label">
            Business address
            <input name="address" defaultValue={branding?.address ?? ""} placeholder="123 Main St, Springfield" className="input" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="field-label">
              Business phone
              <input name="phone" defaultValue={branding?.phone ?? ""} placeholder="(555) 123-4567" className="input" />
            </label>
            <label className="field-label">
              Business email
              <input
                name="businessEmail"
                type="email"
                defaultValue={branding?.email ?? ""}
                placeholder="hello@yourbusiness.com"
                className="input"
              />
            </label>
          </div>

          <div className="my-1 h-px bg-line" />

          <h3 className="text-sm font-semibold text-ink">Quote &amp; invoice defaults</h3>

          <label className="field-label">
            Default tax %
            <input
              name="defaultTaxPercent"
              type="number"
              step="0.01"
              defaultValue={branding?.default_tax_percent ?? 0}
              className="input w-32"
            />
          </label>

          <label className="field-label">
            Default payment instructions
            <textarea
              name="paymentInstructions"
              defaultValue={branding?.payment_instructions ?? ""}
              placeholder="Pay via check, cash, or Zelle to..."
              className="input"
            />
          </label>

          <label className="field-label">
            Starting invoice number
            <input
              name="invoiceNumberStart"
              type="number"
              min={1}
              defaultValue={branding?.invoice_number_start ?? 1001}
              className="input w-32"
            />
            <span className="text-xs font-normal text-ink-faint">
              Only takes effect if it&apos;s higher than any invoice number already in use.
            </span>
          </label>

          <div className="my-1 h-px bg-line" />

          <h3 className="text-sm font-semibold text-ink">Review requests</h3>

          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              name="reviewRequestsEnabled"
              defaultChecked={branding?.review_requests_enabled ?? false}
              className="rounded"
            />
            Automatically ask clients for a review a few days after an invoice is paid
          </label>

          <label className="field-label">
            Review link
            <input
              name="reviewLink"
              type="url"
              defaultValue={branding?.review_link ?? ""}
              placeholder="https://g.page/r/your-business/review"
              className="input"
            />
          </label>

          <button type="submit" className="btn-primary w-fit">
            Save settings
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-line bg-bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Appearance</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose how the app looks on this device. This only affects your own view, not what clients see.
        </p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </section>

      {teammates && teammates.length > 0 && (
        <section className="rounded-lg border border-line bg-bg-white p-5">
          <p className="text-sm font-semibold text-ink">Transfer ownership</p>
          <p className="mt-1 text-sm text-ink-soft">
            Move ownership of this workspace to an existing teammate. You&apos;ll become a teammate yourself.
          </p>

          {transferTo && selectedTeammateName ? (
            <div className="mt-4 flex flex-col gap-3">
              <p className="alert-warning">
                Transfer ownership to <strong>{selectedTeammateName}</strong>? You will become a Teammate and lose
                owner access. This can&apos;t be undone by you &mdash; only the new owner can transfer it back.
              </p>
              <div className="flex gap-2">
                <form action={transferOwnership}>
                  <input type="hidden" name="newOwnerUserId" value={transferTo} />
                  <button type="submit" className="btn-primary">
                    Confirm transfer
                  </button>
                </form>
                <Link href="/app/settings" className="btn-secondary">
                  Cancel
                </Link>
              </div>
            </div>
          ) : (
            <form action="/app/settings" className="mt-4 flex gap-2">
              <select name="transferTo" required className="input w-64">
                <option value="" disabled selected>
                  Select a teammate
                </option>
                {teammates.map((t) => (
                  <option key={t.user_id} value={t.user_id ?? ""}>
                    {t.invited_email}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-secondary">
                Review transfer
              </button>
            </form>
          )}
        </section>
      )}

      <section className="rounded-lg border border-line bg-bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Feature guide</h2>
        <p className="mt-1 text-sm text-ink-soft">Stuck on something? A quick rundown of what each part of Quotenly does.</p>
        <div className="mt-4 flex flex-col divide-y divide-line">
          {FEATURE_GUIDE.map((item) => (
            <details key={item.title} className="group py-2.5 first:pt-0 last:pb-0">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-ink-faint transition-transform group-open:rotate-90"
                  >
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item.title}
                </span>
              </summary>
              <p className="mt-2 pl-6 text-sm text-ink-soft">{item.body}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
