import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/AuthShell";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string; redirect?: string }>;
}) {
  const { error, email, redirect: redirectTo } = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to get back to your quotes and invoices."
      footer={
        <>
          Need a workspace?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:text-brand-dark">
            Sign up
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

      <form action={signIn} className="flex flex-col gap-3.5">
        <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
        <label className="field-label">
          Email
          <input name="email" type="email" required defaultValue={email ?? ""} className="input" />
        </label>
        <label className="field-label">
          Password
          <input name="password" type="password" required className="input" />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-soft">
            <input type="checkbox" name="rememberMe" defaultChecked className="rounded" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-brand hover:text-brand-dark">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-primary mt-1">
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
