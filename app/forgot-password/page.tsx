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
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-ink-soft">
          If an account exists for this email, we&apos;ve sent a reset link.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-3.5">
          <label className="field-label">
            Email
            <input name="email" type="email" required className="input" />
          </label>
          <button type="submit" className="btn-primary mt-1">
            Send reset link
          </button>
        </form>
      )}
    </AuthShell>
  );
}
