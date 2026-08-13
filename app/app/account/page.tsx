import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAccount, changePassword } from "@/app/actions/settings";
import { signOut, resendVerificationEmail } from "@/app/actions/auth";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: googleOnly }] = await Promise.all([
    supabase.from("users").select("name, email_verified").eq("id", user.id).maybeSingle(),
    supabase.rpc("email_uses_google_only", { p_email: user.email! }),
  ]);

  return (
    <div className="flex max-w-md flex-col gap-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Account</h1>

      {error && <p className="alert-error">{error}</p>}
      {success === "1" && <p className="alert-success">Name updated.</p>}
      {success === "password" && <p className="alert-success">Password changed.</p>}

      <div>
        <p className="text-sm text-ink-soft">Email</p>
        <p className="mt-1 text-sm font-medium text-ink">
          {user.email}{" "}
          {profile?.email_verified ? (
            <span className="text-success">(verified)</span>
          ) : (
            <span className="text-warning">(unverified)</span>
          )}
        </p>
        {!profile?.email_verified && (
          <form action={resendVerificationEmail} className="mt-1">
            <button type="submit" className="btn-link">
              Resend verification email
            </button>
          </form>
        )}
      </div>

      <form action={updateAccount} className="flex flex-col gap-3">
        <label className="field-label">
          Name
          <input name="name" defaultValue={profile?.name ?? ""} required minLength={2} className="input" />
        </label>
        <button type="submit" className="btn-secondary w-fit">
          Save name
        </button>
      </form>

      <form action={changePassword} className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{googleOnly ? "Set a password" : "Change password"}</p>
          {googleOnly && (
            <p className="mt-1 text-sm text-ink-soft">
              You signed up with Google, so there&apos;s no password yet. Set one here if you&apos;d also like to be
              able to log in with your email and password.
            </p>
          )}
        </div>
        {!googleOnly && (
          <label className="field-label">
            Current password
            <input name="currentPassword" type="password" required className="input" />
          </label>
        )}
        <label className="field-label">
          New password
          <input name="newPassword" type="password" required minLength={8} className="input" />
        </label>
        <label className="field-label">
          Confirm new password
          <input name="confirmPassword" type="password" required minLength={8} className="input" />
        </label>
        <button type="submit" className="btn-secondary w-fit">
          {googleOnly ? "Set password" : "Update password"}
        </button>
      </form>

      <form action={signOut}>
        <button type="submit" className="btn-link-danger">
          Log out
        </button>
      </form>
    </div>
  );
}
