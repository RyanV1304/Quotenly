import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/AuthShell";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

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
          <Link href="/signup" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
            Sign up
          </Link>
        </>
      }
    >
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <GoogleSignInButton />

      <div className="my-5 flex items-center gap-3 text-xs font-medium text-black/30">
        <div className="h-px flex-1 bg-black/10" />
        or
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <form action={signIn} className="flex flex-col gap-3.5">
        <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Email
          <input name="email" type="email" required defaultValue={email ?? ""} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Password
          <input name="password" type="password" required className={fieldClass} />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-black/60">
            <input type="checkbox" name="rememberMe" defaultChecked className="rounded" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-brand-blue hover:text-brand-blue-deep">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
