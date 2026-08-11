import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold">Quotenly</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/sign-in" className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Quotes and invoices for trade businesses
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-black/60 dark:text-white/60">
            Send professional quotes, convert them to invoices, and track who&apos;s paid &mdash;
            built for handyman crews, electricians, plumbers, and cleaners. Free while we&apos;re
            in early access.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              Create your workspace
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md border border-black/20 px-6 py-3 text-sm font-medium dark:border-white/30"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="grid gap-8 sm:grid-cols-3">
            <Feature
              title="Quotes clients approve online"
              body="Line items for labor, materials, and flat fees. Clients view and approve with no account needed."
            />
            <Feature
              title="One-click invoicing"
              body="Turn an approved quote into a branded PDF invoice, with status tracking from draft to paid."
            />
            <Feature
              title="Your whole crew, one workspace"
              body="Invite unlimited teammates. Owners see everything; teammates see only their assigned jobs."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 px-4 py-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
        Quotenly &mdash; free during early access.
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-black/10 p-5 dark:border-white/10">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">{body}</p>
    </div>
  );
}
