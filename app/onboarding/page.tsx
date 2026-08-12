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
      <div className="mb-6 flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Signed in
        </div>
        <div className="h-px flex-1 bg-brand-tint" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-tint text-brand-dark">
            2
          </span>
          Business name
        </div>
      </div>

      {error && <p className="alert-error mb-4">{error}</p>}

      <form action={completeOnboarding} className="flex flex-col gap-4">
        <label className="field-label">
          Business name
          <input name="businessName" required autoFocus className="input" placeholder="Acme Handyman Co." />
        </label>
        <button type="submit" className="btn-primary mt-1">
          Create workspace
        </button>
      </form>
    </AuthShell>
  );
}
