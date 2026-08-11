import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const origin = req.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent("Google sign-in failed.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent("Google sign-in failed.")}`);
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("user_id", data.user.id)
    .not("joined_at", "is", null)
    .maybeSingle();

  if (membership) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  const email = data.user.email;
  if (email) {
    const admin = createAdminClient();
    const { data: pendingInvite } = await admin
      .from("workspace_members")
      .select("id")
      .eq("invited_email", email)
      .is("joined_at", null)
      .maybeSingle();

    if (pendingInvite) {
      await admin
        .from("workspace_members")
        .update({ user_id: data.user.id, joined_at: new Date().toISOString() })
        .eq("id", pendingInvite.id);
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/onboarding`);
}
