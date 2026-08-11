import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Create your workspace</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Free during early access. Invite your team once you&apos;re in.
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="mt-6">
        <GoogleSignInButton />
      </div>
      <div className="my-4 flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        or
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>
      <form action={signUp} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Business name
          <input
            name="businessName"
            required
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            placeholder="Acme Handyman Co."
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Create workspace
        </button>
      </form>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href="/sign-in" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
