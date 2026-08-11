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
      <Nav />
      <Hero />
      <Wedge />
      <ThreeSteps />
      <NoBloat />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-extrabold tracking-tight text-black">Quotenly</span>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/sign-in" className="font-medium text-black/70 hover:text-black">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <CheckmarkTrailMotif className="pointer-events-none absolute -right-24 top-10 h-72 w-72 text-brand-blue/10 sm:right-0" />

      <div className="relative mx-auto max-w-4xl px-6 pb-40 pt-16 text-center sm:pb-56 sm:pt-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-6xl">
          Quote it. Send it. Get paid.
          <br />
          Nothing else to learn.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-black/60">
          Quotenly is quoting and invoicing for small trade crews &mdash; one flat price, no
          per-seat billing, no bloat.
        </p>
        <div className="mt-9">
          <Link
            href="/sign-up"
            className="inline-block rounded-md bg-brand-blue px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-blue/90"
          >
            Start free
          </Link>
        </div>
        <p className="mt-6 text-sm text-black/40">
          Built for handyman, electrical, plumbing, cleaning, and landscaping crews.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-64 sm:block">
        <div className="mx-auto h-full max-w-4xl">
          <NotificationCard
            className="animate-float-a absolute left-2 top-2 -rotate-2 sm:left-10"
            eyebrow="Quote approved"
            title="Jane Homeowner approved your quote"
            detail="$420.00"
            tone="amber"
          />
          <NotificationCard
            className="animate-float-b absolute right-4 top-16 rotate-1 sm:right-16"
            eyebrow="Invoice paid"
            title="Invoice #1042 marked paid"
            detail="$650.00"
            tone="blue"
          />
          <NotificationCard
            className="animate-float-c absolute left-1/2 top-36 -translate-x-1/2 -rotate-1"
            eyebrow="Job assigned"
            title="Kitchen sink repair assigned to Marcus"
            tone="neutral"
          />
        </div>
      </div>
    </section>
  );
}

function NotificationCard({
  className,
  eyebrow,
  title,
  detail,
  tone,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  detail?: string;
  tone: "amber" | "blue" | "neutral";
}) {
  const dot =
    tone === "amber" ? "bg-brand-amber" : tone === "blue" ? "bg-brand-blue" : "bg-black/20";

  return (
    <div
      className={`w-64 rounded-xl border border-black/10 bg-white p-4 text-left shadow-lg shadow-black/10 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-xs font-medium uppercase tracking-wide text-black/40">
          {eyebrow}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-black">{title}</p>
      {detail && <p className="mt-1 text-sm font-semibold text-brand-blue">{detail}</p>}
    </div>
  );
}

function Wedge() {
  return (
    <section className="bg-brand-dark px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Jobber charges per person. We don&apos;t.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Per-seat pricing means every teammate you add makes your software bill bigger, too.
          Quotenly is one flat price for your whole crew &mdash; hire your fifth person or your
          fifteenth, your bill doesn&apos;t move.
        </p>
      </div>
    </section>
  );
}

function ThreeSteps() {
  const steps = [
    {
      label: "Quote",
      title: "Build it in minutes",
      body: "Line items for labor, materials, and flat fees, from reusable templates.",
    },
    {
      label: "Send",
      title: "Client approves online",
      body: "No account needed. They open a link, review, and approve.",
    },
    {
      label: "Paid",
      title: "Invoice, tracked automatically",
      body: "One click turns an approved quote into a branded invoice.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
          From quote to paid, in three taps
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.label} className="relative">
              <div className="rounded-xl border border-black/10 bg-white p-6 text-left shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-blue">
                  {step.label}
                </p>
                <h3 className="mt-1 font-semibold text-black">{step.title}</h3>
                <p className="mt-2 text-sm text-black/60">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoBloat() {
  const skipped = ["Dispatch boards", "Route planners", "Fleet tracking software"];

  return (
    <section className="bg-brand-dark px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          No dispatch boards. No route planners.
          <br />
          No fleet software you&apos;ll never touch.
        </h2>
        <p className="mt-4 text-lg text-white/60">Just quotes and invoices, done right.</p>
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left">
          {skipped.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
              <span className="text-sm text-white/70">{item} &mdash; not here, on purpose</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-6 py-28 text-center text-white">
      <CheckmarkTrailMotif className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 text-white/5" />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Built for crews who&apos;d rather be working than managing software.
        </h2>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-block rounded-md bg-white px-8 py-3.5 text-base font-semibold text-brand-dark hover:bg-white/90"
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white px-4 py-8 text-center text-sm text-black/40">
      Quotenly &mdash; free during early access.
    </footer>
  );
}

function CheckmarkTrailMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 150 C 40 120, 40 90, 70 70" strokeDasharray="4 5" />
      <circle cx="70" cy="70" r="10" />
      <path d="M65 70 l4 4 l7 -9" strokeWidth="2" />
      <path d="M80 65 C 100 55, 110 40, 130 35" strokeDasharray="4 5" />
      <circle cx="130" cy="35" r="10" />
      <path d="M125 35 l4 4 l7 -9" strokeWidth="2" />
      <path d="M140 40 C 155 55, 160 75, 175 90" strokeDasharray="4 5" />
      <circle cx="178" cy="95" r="8" />
    </svg>
  );
}
