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
    <header className="relative z-10 bg-brand-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-extrabold tracking-tight text-black">Quotenly</span>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/sign-in" className="font-medium text-black/70 hover:text-black">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
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
    <section className="bg-wash bg-dot-grid relative overflow-hidden bg-brand-cream">
      <div className="relative mx-auto max-w-4xl px-6 pb-44 pt-16 text-center sm:pb-60 sm:pt-24">
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-6xl">
          Quote it. Send it. Get paid.
          <br />
          <span className="font-serif italic font-normal text-brand-blue-deep">
            Nothing else to learn.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-black/60">
          Quotenly is quoting and invoicing for small trade crews &mdash; one flat price, no
          per-seat billing, no bloat.
        </p>
        <div className="mt-9">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
          >
            Start free
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {["Handyman", "Electrical", "Plumbing", "Cleaning", "Landscaping", "Painting"].map(
            (trade) => (
              <span
                key={trade}
                className="rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-black/60 backdrop-blur-sm"
              >
                {trade}
              </span>
            )
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-64 sm:block">
        <div className="mx-auto h-full max-w-4xl">
          <NotificationCard
            className="animate-float-a absolute left-2 top-2 -rotate-2 sm:left-6"
            eyebrow="Quote approved"
            title="Jane Homeowner approved your quote"
            detail="$420.00"
            tone="amber"
          />
          <NotificationCard
            className="animate-float-b absolute right-4 top-16 rotate-1 sm:right-10"
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
  const iconBg =
    tone === "amber" ? "bg-brand-amber/15 text-brand-amber" : tone === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-black/5 text-black/40";

  return (
    <div
      className={`w-64 rounded-2xl border border-black/5 bg-white p-4 text-left shadow-xl shadow-black/10 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
          <ToneIcon tone={tone} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-black/40">
          {eyebrow}
        </span>
      </div>
      <p className="mt-2.5 text-sm font-medium leading-snug text-black">{title}</p>
      {detail && <p className="mt-1 text-sm font-bold text-brand-blue-deep">{detail}</p>}
    </div>
  );
}

function ToneIcon({ tone }: { tone: "amber" | "blue" | "neutral" }) {
  if (tone === "neutral") {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wedge() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-6 py-24 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(42, 92, 219, 0.25), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Jobber charges <span className="font-serif italic font-normal text-brand-amber">per person.</span>{" "}
          We don&apos;t.
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
          From quote to{" "}
          <span className="font-serif italic font-normal text-brand-blue-deep">paid</span>, in
          three taps
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="relative rounded-2xl border border-black/5 bg-brand-cream p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute left-0 top-6 h-8 w-1 rounded-r-full bg-brand-blue" />
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">
                {step.label}
              </p>
              <h3 className="mt-1 font-semibold text-black">{step.title}</h3>
              <p className="mt-2 text-sm text-black/60">{step.body}</p>
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
    <section className="relative overflow-hidden bg-brand-dark px-6 py-24 text-white">
      <InvoiceStackMotif className="pointer-events-none absolute -right-16 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-white/[0.07] sm:block" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          No dispatch boards. No route planners.
          <br />
          No fleet software you&apos;ll never touch.
        </h2>
        <p className="mt-4 font-serif text-xl italic text-brand-amber">
          Just quotes and invoices, done right.
        </p>
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left">
          {skipped.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
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
    <section className="bg-dot-grid relative overflow-hidden bg-brand-dark px-6 py-28 text-center text-white">
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Built for crews who&apos;d rather be{" "}
          <span className="font-serif italic font-normal text-brand-amber">working</span> than
          managing software.
        </h2>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-dark shadow-lg transition hover:bg-white/90"
          >
            Start free
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-cream px-4 py-8 text-center text-sm text-black/40">
      Quotenly &mdash; free during early access.
    </footer>
  );
}

function InvoiceStackMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(40 60)">
        <path d="M20 40 L120 0 L220 40 L120 80 Z" />
        <path d="M20 40 L20 80 L120 120 L120 80" />
        <path d="M220 40 L220 80 L120 120" />

        <path d="M40 30 L100 8" strokeDasharray="2 4" />
        <path d="M40 40 L95 20" strokeDasharray="2 4" />

        <path d="M20 90 L120 130 L220 90 L220 130 L120 170 L20 130 Z" opacity="0.6" />

        <circle cx="120" cy="150" r="14" opacity="0.8" />
        <path d="M113 150 l5 5 l9 -11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M120 164 L120 210" strokeDasharray="2 5" />
        <circle cx="120" cy="220" r="9" />
        <path d="M115 220 l3.5 3.5 l7 -8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
