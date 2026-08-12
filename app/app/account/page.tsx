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

  const { data: profile } = await supabase
    .from("users")
    .select("name, email_verified")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex max-w-md flex-col gap-8">
      <h1 className="text-xl font-semibold">Account</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {success === "1" && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Name updated.
        </p>
      )}
      {success === "password" && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Password changed.
        </p>
      )}

      <div>
        <p className="text-sm text-black/60 dark:text-white/60">Email</p>
        <p className="text-sm font-medium">
          {user.email}{" "}
          {profile?.email_verified ? (
            <span className="text-green-600 dark:text-green-400">(verified)</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">(unverified)</span>
          )}
        </p>
        {!profile?.email_verified && (
          <form action={resendVerificationEmail} className="mt-1">
            <button type="submit" className="text-sm underline">
              Resend verification email
            </button>
          </form>
        )}
      </div>

      <form action={updateAccount} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            defaultValue={profile?.name ?? ""}
            required
            minLength={2}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30"
        >
          Save name
        </button>
      </form>

      <form action={changePassword} className="flex flex-col gap-3">
        <p className="text-sm font-medium">Change password</p>
        <label className="flex flex-col gap-1 text-sm">
          Current password
          <input
            name="currentPassword"
            type="password"
            required
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          New password
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Confirm new password
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-md border border-black/20 px-4 py-2 text-sm font-medium dark:border-white/30"
        >
          Update password
        </button>
      </form>

      <form action={signOut}>
        <button type="submit" className="text-sm text-red-600 underline dark:text-red-400">
          Log out
        </button>
      </form>
    </div>
  );
}
