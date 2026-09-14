alter table public.workspaces
  add column signup_source text;

alter table public.workspaces
  add constraint workspaces_signup_source_check
  check (
    signup_source is null or signup_source in (
      'Google Search',
      'Facebook Group',
      'Reddit',
      'LinkedIn',
      'X/Twitter',
      'Indie Hackers',
      'YouTube',
      'Referral from a friend/colleague',
      'Cold email',
      'Other'
    )
  );
