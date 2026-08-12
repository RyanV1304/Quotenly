import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AuthShell from "@/components/AuthShell";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("id, email_verified")
    .eq("verification_token", token)
    .maybeSingle();

  if (!profile) {
    return (
      <AuthShell title="Link invalid">
        <p className="text-sm text-black/60">
          This verification link isn&apos;t valid or has already been used.
        </p>
      </AuthShell>
    );
  }

  if (!profile.email_verified) {
    await admin.from("users").update({ email_verified: true }).eq("id", profile.id);
  }

  return (
    <AuthShell
      title="Email verified"
      footer={
        <Link href="/app/dashboard" className="font-semibold text-brand-blue hover:text-brand-blue-deep">
          Go to dashboard
        </Link>
      }
    >
      <p className="text-sm text-black/60">Your email address has been confirmed.</p>
    </AuthShell>
  );
}
