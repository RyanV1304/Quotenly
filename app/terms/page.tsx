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
        <p className="mt-2 text-sm text-ink-faint">Last updated: August 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">1. Agreement</h2>
            <p className="mt-2">
              By creating a Quotenly account or using our quoting and invoicing service, you agree to these terms.
              If you&apos;re creating a workspace on behalf of a business, you&apos;re confirming you have the
              authority to do so.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">2. What Quotenly is</h2>
            <p className="mt-2">
              Quotenly is a quoting and invoicing tool for small trade businesses. It lets you build quotes, send
              them to clients for online approval, convert approved quotes into invoices, and track payment status.
              Quotenly does not process payments — invoices display your own payment instructions, and marking an
              invoice paid is a manual action you take.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">3. Your account</h2>
            <p className="mt-2">
              You&apos;re responsible for keeping your login credentials secure and for all activity under your
              account. One workspace owner can invite any number of teammates at no extra cost; teammates only see
              the jobs assigned to them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">4. Your content</h2>
            <p className="mt-2">
              You retain ownership of the client, quote, and invoice data you enter into Quotenly. You&apos;re
              responsible for the accuracy of that data and for having the right to share any client information
              you enter, including sending quotes and invoices to them on our platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">5. Acceptable use</h2>
            <p className="mt-2">You agree not to use Quotenly to:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Send quotes, invoices, or messages that are fraudulent, abusive, or unlawful</li>
              <li>Attempt to access another workspace&apos;s data without authorization</li>
              <li>Interfere with or disrupt the service, including attempting to bypass rate limits or security controls</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">6. Availability during early access</h2>
            <p className="mt-2">
              Quotenly is free during our early-access period. We may introduce paid plans in the future; if we do,
              we&apos;ll give existing workspaces advance notice before any change affects them. We don&apos;t
              guarantee uninterrupted availability and may need to take the service down temporarily for maintenance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">7. Termination</h2>
            <p className="mt-2">
              You can stop using Quotenly and request deletion of your workspace at any time. We may suspend or
              terminate accounts that violate these terms or that we reasonably believe pose a security risk to the
              service or other users.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">8. Disclaimer</h2>
            <p className="mt-2">
              Quotenly is provided &quot;as is&quot; without warranties of any kind. We&apos;re not liable for
              disputes between you and your clients, or for losses arising from your use of the service, to the
              fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">9. Changes to these terms</h2>
            <p className="mt-2">
              We may update these terms as the product evolves. Continued use of Quotenly after a change means you
              accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">10. Contact</h2>
            <p className="mt-2">
              Questions about these terms? Reach out to us at{" "}
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
