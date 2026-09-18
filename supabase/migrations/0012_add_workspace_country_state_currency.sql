alter table public.workspaces
  add column country text,
  add column state_region text;

alter table public.workspace_branding
  add column currency text not null default 'USD';
