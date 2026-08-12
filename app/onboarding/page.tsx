import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeOnboarding } from "@/app/actions/onboarding";
import AuthShell from "@/components/AuthShell";

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
    redirect("/login");
  }

  return (
    <AuthShell eyebrow="Step 2 of 2" title="One more step" subtitle="What's your business called? This creates your workspace.">
      <div className="animate-pop-in mb-6 flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Signed in
        </div>
        <div className="h-px flex-1 bg-brand-blue/30" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-pale text-brand-blue-deep">
            2
          </span>
          Business name
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={completeOnboarding} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-black/70">
          Business name
          <input
            name="businessName"
            required
            autoFocus
            className="rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            placeholder="Acme Handyman Co."
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:bg-brand-blue-deep active:translate-y-0"
        >
          Create workspace
        </button>
      </form>
    </AuthShell>
  );
}
