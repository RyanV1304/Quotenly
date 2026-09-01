import type { Metadata } from "next";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Quotenly.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-white">
      <MarketingNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Legal</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-[-0.02em] text-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated: September 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">1. Agreement to Terms</h2>
            <p className="mt-2">
              By creating an account or using Quotenly (&quot;the Service,&quot; &quot;we,&quot; &quot;us&quot;),
              you agree to these Terms of Service. If you don&apos;t agree, don&apos;t use Quotenly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">2. What Quotenly Is</h2>
            <p className="mt-2">
              Quotenly is quoting and invoicing software for small businesses. You use it to create quotes, send
              them to your clients, convert approved quotes into invoices, and track payment status.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">3. Governing Law and Jurisdiction</h2>
            <p className="mt-2 italic text-ink-faint">
              This section is pending finalization with legal counsel and will be added once Quotenly&apos;s
              governing jurisdiction is determined.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">4. Accounts and Workspaces</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>You must provide accurate information when creating an account.</li>
              <li>
                One person creates a workspace and may invite teammates. The workspace owner is responsible for
                managing who has access.
              </li>
              <li>
                You&apos;re responsible for keeping your login credentials secure and for all activity under your
                account.
              </li>
              <li>You must be at least 18 years old to use Quotenly.</li>
              <li>
                We may require identity or business verification at our discretion, particularly before enabling
                payment features in the future.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">5. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Use Quotenly for any illegal purpose, or to send fraudulent quotes or invoices</li>
              <li>Attempt to access another workspace&apos;s data without authorization</li>
              <li>Interfere with or disrupt the Service&apos;s operation</li>
              <li>
                Use the Service to harass, spam, or send unsolicited communications to people who haven&apos;t
                requested them
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">6. Your Content and Data</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>
                You retain ownership of the client information, quotes, invoices, and other business data you enter
                into Quotenly.
              </li>
              <li>
                By using the Service, you grant us permission to store and process this data solely to provide the
                Service to you.
              </li>
              <li>We do not sell your data or your clients&apos; data to third parties.</li>
              <li>
                If you delete your account, your data will be removed within 30 days, except where we&apos;re
                required to retain records by law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">7. Third-Party Data (Your Clients)</h2>
            <p className="mt-2">
              When you add a client&apos;s name, email, or address to Quotenly, you&apos;re entering another
              person&apos;s personal information into our system on their behalf. You confirm you have the right to
              store and share this information with them via Quotenly (e.g., sending them a quote link) and that
              doing so complies with any privacy obligations you have toward your own clients.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">8. Client-Facing Links</h2>
            <p className="mt-2">
              Quotenly generates shareable links so your clients can view and approve quotes or view invoices without
              creating an account. You&apos;re responsible for sending these links only to your actual clients and
              for the accuracy of what those links contain.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">9. Signatures and Approvals</h2>
            <p className="mt-2">
              When a client approves a quote through Quotenly, they do so by drawing a signature that is stored as
              part of the record. This is intended to reflect a genuine agreement between you and your client.
              Quotenly is not a party to that agreement and is not responsible for disputes arising from it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">10. Payments</h2>
            <p className="mt-2">
              During the current phase of service, Quotenly does not process payments. Any payment instructions you
              provide to clients (e.g., check, Zelle, cash) are handled entirely outside the Service. When online
              payment collection is introduced, updated terms covering that functionality will be provided.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">11. Refunds</h2>
            <p className="mt-2">Not applicable — Quotenly is currently free of charge.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">12. Pricing</h2>
            <p className="mt-2">
              Quotenly is currently provided free of charge. We reserve the right to introduce paid plans in the
              future. If we do, we&apos;ll provide advance notice before any changes affect your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">13. Termination</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>You may stop using Quotenly and delete your account at any time.</li>
              <li>
                We may suspend or terminate accounts that violate these Terms or that we reasonably believe are being
                used fraudulently or harmfully.
              </li>
              <li>
                Upon termination, you remain responsible for any obligations to your clients that existed before
                termination; Quotenly is not a party to those obligations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">14. Disclaimer of Warranties</h2>
            <p className="mt-2">
              Quotenly is provided &quot;as is.&quot; We do not guarantee the Service will be uninterrupted,
              error-free, or fit for any particular purpose. You use it at your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">15. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, Quotenly&apos;s total liability to you for any claim arising
              from your use of the Service is limited to the amount you paid us in the twelve months preceding the
              claim, or $100 if you&apos;re on a free plan. We are not liable for disputes between you and your
              clients, lost revenue, lost data, or business interruption.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">16. Indemnification</h2>
            <p className="mt-2">
              You agree to defend and hold Quotenly harmless from any claims arising from your use of the Service,
              your violation of these Terms, or your relationship with your clients.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">17. Changes to These Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of Quotenly after changes take effect
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">18. Contact</h2>
            <p className="mt-2 italic text-ink-faint">
              A support contact email will be added here once our domain is verified.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
