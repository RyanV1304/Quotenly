import type { Metadata } from "next";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Quotenly collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Legal</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-[-0.02em] text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated: August 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">1. What this covers</h2>
            <p className="mt-2">
              This policy explains what information Quotenly (&quot;we&quot;, &quot;us&quot;) collects when you use
              our quoting and invoicing service, how we use it, and the choices you have. It applies to workspace
              owners and teammates who create an account, and to the clients who view a quote or invoice through a
              link we send them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">2. Information we collect</h2>
            <p className="mt-2">When you create an account, we collect:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Your name, email address, and business name</li>
              <li>Authentication data (a securely hashed password, or your Google account identifier if you sign in with Google)</li>
              <li>Any client, quote, and invoice information you enter — client names, contact details, job addresses, line items, and amounts</li>
              <li>Basic usage data such as when a quote or invoice was viewed or approved</li>
            </ul>
            <p className="mt-2">
              If you upload a business logo, we store that file. We do not collect payment card information —
              Quotenly does not process payments.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">3. How we use your information</h2>
            <p className="mt-2">We use the information you provide to:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Operate your account and workspace, including team invitations and role-based access</li>
              <li>Generate and send quotes and invoices on your behalf, including the public links your clients use to view and approve them</li>
              <li>Send transactional emails — account verification, password resets, team invites, and payment reminders</li>
              <li>Maintain the security of your account, including rate-limiting login attempts</li>
            </ul>
            <p className="mt-2">
              We do not sell your data, and we do not use your client information for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">4. Who can see your data</h2>
            <p className="mt-2">
              Within a workspace, the owner can see all quotes, invoices, and clients. Teammates can only see the
              jobs assigned to them. A client who receives a quote or invoice link can view that specific document
              without creating an account — they cannot see anything else in your workspace.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">5. Where your data is stored</h2>
            <p className="mt-2">
              Your data is stored using Supabase (a hosted PostgreSQL database and authentication provider) and
              transactional emails are sent via Resend. Both providers process data on our behalf under their own
              security and privacy commitments.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">6. Your choices</h2>
            <p className="mt-2">
              You can update or delete your account name and password at any time from your Account settings. To
              delete your workspace or export your data, contact us at the address below and we will handle the
              request directly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">7. Changes to this policy</h2>
            <p className="mt-2">
              We may update this policy as the product changes. If we make material changes, we&apos;ll update the
              date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">8. Contact</h2>
            <p className="mt-2">
              Questions about this policy or your data? Reach out to us at{" "}
              <a href="mailto:support@quotenly.com" className="text-brand hover:underline">
                support@quotenly.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
