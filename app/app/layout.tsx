import Link from "next/link";
import { requireMembership } from "@/lib/workspace";
import { signOut, resendVerificationEmail } from "@/app/actions/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const membership = await requireMembership();

  const navItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/clients", label: "Clients" },
    { href: "/app/quotes", label: "Quotes" },
    { href: "/app/invoices", label: "Invoices" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <div className="h-1 w-full bg-brand" />
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/app/dashboard" className="font-display text-base font-bold tracking-tight text-ink">
              Quotenly
            </Link>
            <nav className="hidden gap-6 text-sm font-medium md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-ink-soft transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-4 text-sm md:flex">
            <span className="text-ink-faint">
              {membership.workspaceName} &middot; <span className="capitalize">{membership.role}</span>
            </span>
            {membership.role === "owner" && (
              <Link
                href="/app/settings"
                title="Settings"
                aria-label="Settings"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
            <Link href="/app/account" className="font-medium text-ink-soft transition-colors hover:text-ink">
              Account
            </Link>
            <form action={signOut}>
              <button type="submit" className="font-medium text-ink-soft transition-colors hover:text-ink">
                Sign out
              </button>
            </form>
          </div>

          <details className="relative md:hidden">
            <summary className="flex h-9 w-9 list-none items-center justify-center rounded-lg border border-line text-ink [&::-webkit-details-marker]:hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-12 z-30 flex w-56 flex-col gap-1 rounded-lg border border-line bg-white p-2 text-sm font-medium text-ink shadow-lg">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 hover:bg-brand-tint">
                  {item.label}
                </Link>
              ))}
              {membership.role === "owner" && (
                <Link href="/app/settings" className="rounded-md px-3 py-2 hover:bg-brand-tint">
                  Settings
                </Link>
              )}
              <div className="my-1 h-px bg-line" />
              <span className="px-3 py-1 text-xs text-ink-faint">
                {membership.workspaceName} &middot; <span className="capitalize">{membership.role}</span>
              </span>
              <Link href="/app/account" className="rounded-md px-3 py-2 hover:bg-brand-tint">
                Account
              </Link>
              <form action={signOut}>
                <button type="submit" className="w-full rounded-md px-3 py-2 text-left hover:bg-brand-tint">
                  Sign out
                </button>
              </form>
            </div>
          </details>
        </div>
      </header>

      {!membership.emailVerified && (
        <div className="border-b border-line bg-warning-tint px-6 py-2 text-center text-sm text-warning">
          Please verify your email.{" "}
          <form action={resendVerificationEmail} className="inline">
            <button type="submit" className="font-semibold underline underline-offset-2">
              Resend verification link
            </button>
          </form>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
