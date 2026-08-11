import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/AuthShell";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      eyebrow="Free during early access"
      title="Create your workspace"
      subtitle="Invite your team once you're in — no per-seat cost, ever."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
            Sign in
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

      <form action={signUp} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Business name
          <input
            name="businessName"
            required
            className={fieldClass}
            placeholder="Acme Handyman Co."
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Email
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className={fieldClass}
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Create workspace
        </button>
      </form>
    </AuthShell>
  );
}
