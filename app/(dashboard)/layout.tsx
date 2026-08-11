import Link from "next/link";
import { requireMembership } from "@/lib/workspace";
import { signOut } from "@/app/actions/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const membership = await requireMembership();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/clients", label: "Clients" },
    { href: "/quotes", label: "Quotes" },
    { href: "/invoices", label: "Invoices" },
    { href: "/templates", label: "Templates" },
    ...(membership.role === "owner" ? [{ href: "/team", label: "Team" }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold">Quotenly</span>
            <nav className="flex gap-4 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-black/60 dark:text-white/60">
              {membership.workspaceName} &middot; {membership.role}
            </span>
            <form action={signOut}>
              <button type="submit" className="underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
