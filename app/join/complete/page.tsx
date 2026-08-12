import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { completeJoinWithEmail } from "@/app/actions/join";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/AuthShell";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

export default async function JoinCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("pending_join_token")?.value;

  if (!token) {
    redirect(`/join?error=${encodeURIComponent("Enter your join code to continue.")}`);
  }

  return (
    <AuthShell
      eyebrow="Code verified"
      title="Create your account"
      subtitle="Finish setting up to join the workspace."
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

      <form action={completeJoinWithEmail} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Email
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Password
          <input name="password" type="password" required minLength={8} className={fieldClass} />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Join workspace
        </button>
      </form>
    </AuthShell>
  );
}
