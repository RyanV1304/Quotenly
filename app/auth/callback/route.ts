import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const origin = req.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent("Google sign-in failed.")}`);
  }

  let cookieResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          cookieResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent("Google sign-in failed.")}`);
  }

  let target = "/onboarding";

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("user_id", data.user.id)
    .not("joined_at", "is", null)
    .maybeSingle();

  if (membership) {
    target = "/dashboard";
  } else if (data.user.email) {
    const admin = createAdminClient();
    const { data: pendingInvite } = await admin
      .from("workspace_members")
      .select("id")
      .eq("invited_email", data.user.email)
      .is("joined_at", null)
      .maybeSingle();

    if (pendingInvite) {
      await admin
        .from("workspace_members")
        .update({ user_id: data.user.id, joined_at: new Date().toISOString() })
        .eq("id", pendingInvite.id);
      target = "/dashboard";
    }
  }

  const redirectResponse = NextResponse.redirect(`${origin}${target}`);
  cookieResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}
