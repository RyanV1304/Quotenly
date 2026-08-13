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

  if (code) {
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
    sessionEstablished = !exchangeErr;
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
          <Link href="/forgot-password" className="font-semibold text-brand hover:text-brand-dark">
            Request a new link
          </Link>
        }
      >
        <p className="text-sm text-ink-soft">This reset link is invalid or has expired.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password">
      {error && <p className="alert-error mb-4">{error}</p>}
      <form action={submitNewPassword} className="flex flex-col gap-3.5">
        <label className="field-label">
          New password
          <input name="password" type="password" required minLength={8} className="input" />
        </label>
        <label className="field-label">
          Confirm password
          <input name="confirmPassword" type="password" required minLength={8} className="input" />
        </label>
        <button type="submit" className="btn-primary mt-1">
          Set new password
        </button>
      </form>
    </AuthShell>
  );
}
