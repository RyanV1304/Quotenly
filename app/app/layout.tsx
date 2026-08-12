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
    ...(membership.role === "owner" ? [{ href: "/app/settings", label: "Settings" }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <div className="bg-brand-gradient h-1 w-full" />
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/app/dashboard" className="font-display text-base font-bold tracking-tight text-ink">
              Quotenly
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-ink-soft transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-faint">
              {membership.workspaceName} &middot; <span className="capitalize">{membership.role}</span>
            </span>
            <Link href="/app/account" className="font-medium text-ink-soft transition-colors hover:text-ink">
              Account
            </Link>
            <form action={signOut}>
              <button type="submit" className="font-medium text-ink-soft transition-colors hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
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
