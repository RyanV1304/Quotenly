import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/AuthShell";
import PasswordStrengthField from "@/components/PasswordStrengthField";

export const metadata: Metadata = {
  title: "Create your workspace",
  description: "Free during early access. No per-seat cost, ever — quoting and invoicing for small trade crews.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; name?: string; email?: string; businessName?: string }>;
}) {
  const { error, name, email, businessName } = await searchParams;

  return (
    <AuthShell
      eyebrow="Free during early access"
      title="Create your workspace"
      subtitle="Invite your team once you're in — no per-seat cost, ever."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
            Log in
          </Link>
        </>
      }
    >
      {error && <p className="alert-error mb-4">{error}</p>}

      <GoogleSignInButton />

      <div className="my-5 flex items-center gap-3 text-xs font-medium text-ink-faint">
        <div className="h-px flex-1 bg-line" />
        or
        <div className="h-px flex-1 bg-line" />
      </div>

      <form action={signUp} className="flex flex-col gap-3.5">
        <label className="field-label">
          Full name
          <input name="name" required minLength={2} defaultValue={name ?? ""} className="input" />
        </label>
        <label className="field-label">
          Business name
          <input
            name="businessName"
            required
            minLength={2}
            defaultValue={businessName ?? ""}
            className="input"
            placeholder="Acme Handyman Co."
          />
        </label>
        <label className="field-label">
          Email
          <input name="email" type="email" required defaultValue={email ?? ""} className="input" />
        </label>
        <label className="field-label">
          Password
          <PasswordStrengthField name="password" />
        </label>
        <label className="field-label">
          Confirm password
          <input name="confirmPassword" type="password" required minLength={8} className="input" />
        </label>
        <button type="submit" className="btn-primary mt-2">
          Create workspace
        </button>
      </form>
    </AuthShell>
  );
}
