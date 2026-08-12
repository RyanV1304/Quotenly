import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <Nav />
      <Hero />
      <StatBar />
      <ProductShowcase />
      <Wedge />
      <ThreeSteps />
      <NoBloat />
      <UseCases />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
      {children}
    </span>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
          Quotenly
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 sm:flex">
          <a href="#product" className="transition-colors hover:text-white">
            Product
          </a>
          <a href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/login" className="hidden font-medium text-white/75 transition-colors hover:text-white sm:block">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-technician.webp"
          alt="Trade technician working on-site"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/80" />

        <div className="relative mx-auto flex min-h-[38rem] max-w-4xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center sm:min-h-[44rem]">
          <EyebrowBadge>Free during launch</EyebrowBadge>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-6xl">
            Quote it. Send it. Get paid. Nothing else to learn.
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-white/70">
            Quotenly is quoting and invoicing built for small trade crews &mdash; one flat price, no
            per-seat billing, no bloat.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary px-7 py-3 text-base">
              Start free
            </Link>
            <a href="#product" className="btn-secondary-inverse px-7 py-3 text-base">
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBar() {
  const stats = [
    { value: "$0", label: "Per-seat fees, ever" },
    { value: "100%", label: "Free during launch" },
    { value: "5 min", label: "To send your first quote" },
    { value: "0", label: "Dispatch boards you'll never touch" },
  ];
  return (
    <section className="border-b border-line bg-bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold text-brand">{s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-faint">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
      {children}
    </span>
  );
}

function ProductShowcase() {
  return (
    <section id="product" className="bg-bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Product</SectionEyebrow>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            Everything a quote-to-cash workflow needs.
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
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">{eyebrow}</p>
        <h3 className="font-display mt-3 text-2xl font-bold tracking-[-0.02em] text-ink">{title}</h3>
        <p className="mt-4 leading-relaxed text-ink-soft">{body}</p>
      </div>
      <div>{mockup}</div>
    </div>
  );
}

function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-line bg-white"
      style={{ boxShadow: "0 8px 24px rgba(11,15,25,0.08)" }}
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-bg-white px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function QuoteMockup() {
  const items = [
    { d: "Kitchen sink repair", r: "$150.00" },
    { d: "Replacement parts", r: "$45.00" },
  ];
  return (
    <BrowserChrome>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
        Quote for Jane Homeowner
      </p>
      <div className="mt-3 divide-y divide-line rounded-lg border border-line">
        {items.map((item) => (
          <div key={item.d} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="text-ink-soft">{item.d}</span>
            <span className="font-mono font-medium text-ink">{item.r}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-ink">Total: $195.00</span>
        <span className="btn-primary px-3.5 py-1.5 text-xs">Approve quote</span>
      </div>
    </BrowserChrome>
  );
}

function InvoiceMockup() {
  const statuses = [
    { label: "Draft", tone: "bg-line text-ink-soft" },
    { label: "Sent", tone: "bg-warning-tint text-warning" },
    { label: "Viewed", tone: "bg-warning-tint text-warning" },
    { label: "Paid", tone: "bg-success-tint text-success" },
  ];
  return (
    <BrowserChrome>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Invoice #1042</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <span key={s.label} className={`rounded-full px-3 py-1 text-xs font-medium ${s.tone}`}>
            {s.label}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-line bg-bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[10px] font-bold text-white">
            PDF
          </span>
          <span className="text-sm text-ink-soft">invoice-1042.pdf</span>
        </div>
        <span className="font-mono text-sm font-bold text-ink">$650.00</span>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Team</p>
      <div className="mt-3 flex flex-col gap-2">
        {members.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                {m.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{m.name}</p>
                <p className="text-xs text-ink-faint">{m.access}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                m.role === "Owner" ? "bg-brand text-white" : "bg-line text-ink-soft"
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
    <section id="pricing" className="bg-bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
          Jobber charges per person. We don&apos;t.
        </h2>
        <p className="mx-auto mt-5 max-w-[55ch] leading-relaxed text-ink-soft">
          Per-seat pricing means every teammate you add makes your software bill bigger, too.
          Quotenly is one flat price for your whole crew &mdash; hire your fifth person or your
          fifteenth, your bill doesn&apos;t move.
        </p>
        <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Typical per-seat tool</p>
            <p className="font-display mt-2 text-2xl font-bold text-ink">Price &times; team size</p>
            <p className="mt-1 text-sm text-ink-soft">Bill grows every time you hire.</p>
          </div>
          <div className="rounded-lg border border-brand bg-brand-tint p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Quotenly</p>
            <p className="font-display mt-2 text-2xl font-bold text-brand">One flat price</p>
            <p className="mt-1 text-sm text-ink-soft">Unlimited teammates, always.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreeSteps() {
  const steps = [
    { label: "Quote", title: "Build it in minutes", mockup: <MiniCard title="Quote sent" detail="$195.00" /> },
    { label: "Send", title: "Client approves online", mockup: <MiniCard title="Quote Approved" detail="Jane Homeowner" /> },
    { label: "Paid", title: "Invoice, tracked automatically", mockup: <MiniCard title="Invoice Paid" detail="$650.00" /> },
  ];

  return (
    <section className="bg-navy-950 px-6 py-24">
      <div className="relative mx-auto max-w-5xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          From quote to paid, in three steps
        </h2>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-3">
          <StepPath className="pointer-events-none absolute inset-x-0 top-8 hidden h-px sm:block" />
          {steps.map((step, i) => (
            <div key={step.label} className="relative flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="mt-6">{step.mockup}</div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-light">{step.label}</p>
              <p className="mt-1 text-sm text-paper-soft">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      className="w-44 rounded-lg border border-line bg-white p-3 text-left"
      style={{ boxShadow: "0 8px 24px rgba(11,15,25,0.24)" }}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="text-[11px] font-semibold text-ink">{title}</span>
      </div>
      <p className="mt-1 text-[11px] text-ink-soft">{detail}</p>
    </div>
  );
}

function StepPath({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 2" fill="none" aria-hidden="true">
      <line x1="0" y1="1" x2="600" y2="1" stroke="#4d7dff" strokeWidth="1.5" strokeDasharray="1 8" strokeLinecap="round" />
    </svg>
  );
}

function NoBloat() {
  return (
    <section className="bg-bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
          No dispatch boards. No route planners. No fleet software you&apos;ll never touch.
        </h2>
        <p className="mt-4 text-lg text-ink-soft">Just quotes and invoices, done right.</p>
      </div>
    </section>
  );
}

function UseCases() {
  const trades = ["Handyman", "Electrical", "Plumbing", "Cleaning", "Landscaping", "Painting"];

  return (
    <section className="bg-navy-950 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Whatever the job, the workflow&apos;s the same
        </h2>
        <p className="mx-auto mt-4 max-w-[55ch] text-paper-soft">
          Any crew that quotes a job and invoices for it fits.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {trades.map((trade) => (
            <span
              key={trade}
              className="rounded-lg border border-line-dark bg-bg-dark-alt px-4 py-2 text-sm font-medium text-paper-ink"
            >
              {trade}
            </span>
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
      a: "Yes, fully free with no feature caps, no usage limits, and no payment collection required during our launch period. No credit card needed to start.",
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
      a: "Not yet. Invoices show your payment instructions and track status manually. Online payment collection is on the roadmap.",
    },
    {
      q: "What can teammates see versus the owner?",
      a: "The owner sees every quote, invoice, and client in the workspace. Teammates only see the jobs assigned to them.",
    },
  ];

  return (
    <section id="faq" className="bg-bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <div className="mt-12 flex flex-col divide-y divide-line rounded-lg border border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {item.q}
                <span className="text-brand transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-navy-950 px-6 py-28 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Built for crews who&apos;d rather be working than managing software.
        </h2>
        <div className="mt-8">
          <Link href="/signup" className="btn-primary px-7 py-3 text-base">
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-bg-white px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-lg font-bold tracking-tight text-ink">Quotenly</span>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Quoting and invoicing for small trade crews. Free during our launch period.
          </p>
        </div>
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-ink">Product</span>
            <a href="#product" className="text-ink-soft hover:text-ink">
              Features
            </a>
            <a href="#pricing" className="text-ink-soft hover:text-ink">
              Pricing
            </a>
            <a href="#faq" className="text-ink-soft hover:text-ink">
              FAQ
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-ink">Account</span>
            <Link href="/login" className="text-ink-soft hover:text-ink">
              Log in
            </Link>
            <Link href="/signup" className="text-ink-soft hover:text-ink">
              Start free
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-line pt-6 text-center text-xs text-ink-faint">
        &copy; {new Date().getFullYear()} Quotenly. All rights reserved.
      </div>
    </footer>
  );
}
