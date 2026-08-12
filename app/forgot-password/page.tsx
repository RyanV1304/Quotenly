import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password-reset";
import AuthShell from "@/components/AuthShell";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link href="/login" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-black/60">
          If an account exists for this email, we&apos;ve sent a reset link.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            />
          </label>
          <button
            type="submit"
            className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
          >
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
