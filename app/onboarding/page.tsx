import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeOnboarding } from "@/app/actions/onboarding";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">One more step</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        What&apos;s your business called? This creates your workspace.
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <form action={completeOnboarding} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Business name
          <input
            name="businessName"
            required
            autoFocus
            className="rounded-md border border-black/15 px-3 py-2 dark:border-white/20"
            placeholder="Acme Handyman Co."
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Create workspace
        </button>
      </form>
    </div>
  );
}
