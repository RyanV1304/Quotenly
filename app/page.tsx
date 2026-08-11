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
      <ProductShowcase />
      <Wedge />
      <ThreeSteps />
      <UseCases />
      <NoBloat />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-lg font-extrabold tracking-tight text-black">Quotenly</span>
        <nav className="hidden items-center gap-8 text-sm font-medium text-black/60 sm:flex">
          <a href="#product" className="hover:text-black">
            Product
          </a>
          <a href="#pricing" className="hover:text-black">
            Pricing
          </a>
          <a href="#faq" className="hover:text-black">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/sign-in" className="hidden font-medium text-black/70 hover:text-black sm:block">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-wash bg-dot-grid relative overflow-hidden bg-white">
      <div className="relative mx-auto max-w-4xl px-6 pb-44 pt-16 text-center sm:pb-60 sm:pt-24">
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-6xl">
          Quote it. Send it. Get paid.
          <br />
          <span className="font-serif italic font-normal text-brand-blue">
            Nothing else to learn.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-black/60">
          Quotenly is quoting and invoicing for small trade crews &mdash; one flat price, no
          per-seat billing, no bloat.
        </p>
        <div className="mt-9 flex items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:bg-brand-blue-deep"
          >
            Start free
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <a
            href="#product"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-8 py-3.5 text-base font-semibold text-black transition hover:border-black/20"
          >
            See how it works
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {["Handyman", "Electrical", "Plumbing", "Cleaning", "Landscaping", "Painting"].map(
            (trade) => (
              <span
                key={trade}
                className="rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-black/60 backdrop-blur-sm"
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
          />
          <NotificationCard
            className="animate-float-b absolute right-4 top-16 rotate-1 sm:right-10"
            eyebrow="Invoice paid"
            title="Invoice #1042 marked paid"
            detail="$650.00"
          />
          <NotificationCard
            className="animate-float-c absolute left-1/2 top-36 -translate-x-1/2 -rotate-1"
            eyebrow="Job assigned"
            title="Kitchen sink repair assigned to Marcus"
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
}: {
  className?: string;
  eyebrow: string;
  title: string;
  detail?: string;
}) {
  return (
    <div
      className={`w-64 rounded-2xl border border-black/5 bg-white p-4 text-left shadow-xl shadow-black/10 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue-pale text-brand-blue">
          <CheckIcon />
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

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-blue-pale px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-blue-deep">
      {children}
    </span>
  );
}

function ProductShowcase() {
  return (
    <section id="product" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Product</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Everything a quote-to-cash workflow needs.{" "}
            <span className="font-serif italic font-normal text-brand-blue">Nothing it doesn&apos;t.</span>
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-24">
          <ShowcaseRow
            eyebrow="Quoting"
            title="Quotes your clients approve without a phone call"
            body="Add line items for labor, materials, and flat fees, pull from reusable templates for repeat jobs, and send a link your client can open, review, and approve online &mdash; no account required."
            mockup={<QuoteMockup />}
          />
          <ShowcaseRow
            eyebrow="Invoicing"
            title="One click turns an approved quote into an invoice"
            body="Branded PDF invoices with live status tracking &mdash; draft, sent, viewed, paid, overdue &mdash; and automatic reminder emails once a payment is late, so you're not the one chasing it."
            mockup={<InvoiceMockup />}
            reverse
          />
          <ShowcaseRow
            eyebrow="Team"
            title="Invite your whole crew, no per-seat surprises"
            body="Owners see every quote, invoice, and client across the workspace. Teammates only see the jobs assigned to them. Add as many people as you need &mdash; the price doesn't change."
            mockup={<TeamMockup />}
          />
        </div>
      </div>
    </section>
  );
}

function ShowcaseRow({
  eyebrow,
  title,
  body,
  mockup,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  mockup: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-10 sm:grid-cols-2 sm:gap-16 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{eyebrow}</p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-black">{title}</h3>
        <p className="mt-4 text-black/60">{body}</p>
      </div>
      <div>{mockup}</div>
    </div>
  );
}

function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl shadow-black/10">
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-black/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function QuoteMockup() {
  const items = [
    { d: "Kitchen sink repair", q: "2 hrs", r: "$150.00" },
    { d: "Replacement parts", q: "1", r: "$45.00" },
  ];
  return (
    <BrowserChrome>
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
        Quote for Jane Homeowner
      </p>
      <div className="mt-3 divide-y divide-black/5 rounded-lg border border-black/5">
        {items.map((item) => (
          <div key={item.d} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="text-black/70">{item.d}</span>
            <span className="font-medium text-black">{item.r}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-black">Total: $195.00</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-3.5 py-1.5 text-xs font-semibold text-white">
          Approve quote
        </span>
      </div>
    </BrowserChrome>
  );
}

function InvoiceMockup() {
  const statuses = [
    { label: "Draft", active: false },
    { label: "Sent", active: false },
    { label: "Viewed", active: false },
    { label: "Paid", active: true },
  ];
  return (
    <BrowserChrome>
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Invoice #1042</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <span
            key={s.label}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              s.active ? "bg-brand-blue text-white" : "bg-black/5 text-black/40"
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-black/5 bg-brand-blue-pale/60 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-[10px] font-bold text-brand-blue">
            PDF
          </span>
          <span className="text-sm text-black/70">invoice-1042.pdf</span>
        </div>
        <span className="text-sm font-bold text-brand-blue-deep">$650.00</span>
      </div>
    </BrowserChrome>
  );
}

function TeamMockup() {
  const members = [
    { name: "You", role: "Owner", access: "Sees everything" },
    { name: "Marcus R.", role: "Teammate", access: "Assigned jobs only" },
    { name: "Priya S.", role: "Teammate", access: "Assigned jobs only" },
  ];
  return (
    <BrowserChrome>
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Team</p>
      <div className="mt-3 flex flex-col gap-2">
        {members.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg border border-black/5 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue-pale text-[11px] font-bold text-brand-blue-deep">
                {m.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium text-black">{m.name}</p>
                <p className="text-xs text-black/40">{m.access}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                m.role === "Owner" ? "bg-brand-blue text-white" : "bg-black/5 text-black/50"
              }`}
            >
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </BrowserChrome>
  );
}

function Wedge() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-brand-dark px-6 py-24 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(42, 92, 219, 0.28), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Jobber charges <span className="font-serif italic font-normal text-white">per person.</span>{" "}
          We don&apos;t.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Per-seat pricing means every teammate you add makes your software bill bigger, too.
          Quotenly is one flat price for your whole crew &mdash; hire your fifth person or your
          fifteenth, your bill doesn&apos;t move.
        </p>
        <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Typical per-seat tool</p>
            <p className="mt-2 text-2xl font-extrabold">Price &times; team size</p>
            <p className="mt-1 text-sm text-white/50">Bill grows every time you hire.</p>
          </div>
          <div className="rounded-xl border border-brand-blue/40 bg-brand-blue/10 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Quotenly</p>
            <p className="mt-2 text-2xl font-extrabold">One flat price</p>
            <p className="mt-1 text-sm text-white/50">Unlimited teammates, always.</p>
          </div>
        </div>
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
          <span className="font-serif italic font-normal text-brand-blue">paid</span>, in three
          taps
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="relative rounded-2xl border border-black/5 bg-brand-blue-pale/60 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

function UseCases() {
  const trades: { name: string; icon: React.ReactNode }[] = [
    { name: "Handyman", icon: <WrenchIcon /> },
    { name: "Electrical", icon: <BoltIcon /> },
    { name: "Plumbing", icon: <DropIcon /> },
    { name: "Cleaning", icon: <SparkleIcon /> },
    { name: "Landscaping", icon: <LeafIcon /> },
    { name: "Painting", icon: <RollerIcon /> },
  ];

  return (
    <section className="bg-brand-blue-pale/50 px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <SectionEyebrow>Built for the trades</SectionEyebrow>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
          Whatever the job, the workflow&apos;s the same
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-black/60">
          Any crew that quotes a job and invoices for it fits &mdash; here&apos;s who&apos;s already
          using Quotenly to do exactly that.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {trades.map((trade) => (
            <div
              key={trade.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue-pale text-brand-blue">
                {trade.icon}
              </span>
              <span className="text-sm font-semibold text-black">{trade.name}</span>
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
        <p className="mt-4 font-serif text-xl italic text-white/70">
          Just quotes and invoices, done right.
        </p>
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left">
          {skipped.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
              <span className="text-sm text-white/70">{item} &mdash; not here, on purpose</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    {
      q: "Is Quotenly really free?",
      a: "Yes, fully free with no feature caps, no usage limits, and no payment collection required during our early-access phase. No credit card needed to start.",
    },
    {
      q: "How many teammates can I invite?",
      a: "As many as you need. Quotenly doesn't charge per seat &mdash; invite your entire crew at no extra cost.",
    },
    {
      q: "Do my clients need to create an account?",
      a: "No. Clients open a link to view and approve a quote or view an invoice &mdash; no sign-up required on their end.",
    },
    {
      q: "Can I take payments through Quotenly?",
      a: "Not yet. Invoices show your payment instructions (check, cash, Zelle, etc.) and track status manually. Online payment collection is on the roadmap.",
    },
    {
      q: "What can teammates see versus the owner?",
      a: "The owner sees every quote, invoice, and client in the workspace. Teammates only see the jobs assigned to them.",
    },
  ];

  return (
    <section id="faq" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <div className="mt-12 flex flex-col divide-y divide-black/5 rounded-2xl border border-black/5">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-black">
                {item.q}
                <span className="text-brand-blue transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-black/60">{item.a}</p>
            </details>
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
          <span className="font-serif italic font-normal text-white">working</span> than managing
          software.
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
    <footer className="border-t border-black/5 bg-white px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <span className="text-lg font-extrabold tracking-tight text-black">Quotenly</span>
          <p className="mt-3 max-w-xs text-sm text-black/50">
            Quoting and invoicing for small trade crews. Free during early access.
          </p>
        </div>
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-black">Product</span>
            <a href="#product" className="text-black/50 hover:text-black">
              Features
            </a>
            <a href="#pricing" className="text-black/50 hover:text-black">
              Pricing
            </a>
            <a href="#faq" className="text-black/50 hover:text-black">
              FAQ
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-black">Account</span>
            <Link href="/sign-in" className="text-black/50 hover:text-black">
              Sign in
            </Link>
            <Link href="/sign-up" className="text-black/50 hover:text-black">
              Start free
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-black/5 pt-6 text-center text-xs text-black/40">
        &copy; {new Date().getFullYear()} Quotenly. All rights reserved.
      </div>
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

function iconProps() {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
}

function WrenchIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 2s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20 4C10 4 4 10 4 18c0 1 0 2 .5 2S6 19 8 17c6-6 12-7 12-13z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 19.5 12 12" strokeLinecap="round" />
    </svg>
  );
}

function RollerIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="4" y="4" width="14" height="7" rx="1.5" />
      <path d="M9 11v4M9 19v-4M6 15h6v4H6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
