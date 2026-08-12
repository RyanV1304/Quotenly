import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { submitNewPassword } from "@/app/actions/password-reset";
import AuthShell from "@/components/AuthShell";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const { code, error } = await searchParams;
  const supabase = await createClient();

  let sessionEstablished = false;
  let exchangeError: string | null = null;

  if (code) {
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeErr) {
      exchangeError = exchangeErr.message;
    } else {
      sessionEstablished = true;
    }
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    sessionEstablished = !!user;
  }

  if (!sessionEstablished) {
    return (
      <AuthShell
        title="Link expired"
        footer={
          <Link href="/forgot-password" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-black/60">
          {exchangeError || "This reset link is invalid or has expired."}
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password">
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <form action={submitNewPassword} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          New password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Set new password
        </button>
      </form>
    </AuthShell>
  );
}
