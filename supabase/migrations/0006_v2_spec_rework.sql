-- Drop workspace join-code feature (removed per user decision)
drop table if exists pending_joins;
alter table workspaces drop column if exists join_code;
alter table workspaces drop column if exists join_password_hash;
alter table workspaces drop column if exists join_enabled;

-- User profile table
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  email_verified boolean not null default false,
  verification_token uuid default gen_random_uuid(),
  verification_sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table users enable row level security;

create policy "user manages own profile" on users
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "workspace members can view teammate profiles" on users
  for select using (
    exists (
      select 1 from workspace_members wm1
      join workspace_members wm2 on wm1.workspace_id = wm2.workspace_id
      where wm1.user_id = auth.uid()
        and wm2.user_id = users.id
        and wm1.joined_at is not null
        and wm2.joined_at is not null
    )
  );

-- Invites table (replaces pending workspace_members rows)
create table invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email text not null,
  token uuid not null default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  last_resent_at timestamptz
);
alter table invites enable row level security;
create index on invites (workspace_id);
create index on invites (token);

create policy "owner manages invites" on invites
  for all using (is_workspace_owner(workspace_id)) with check (is_workspace_owner(workspace_id));

-- Login attempt tracking (admin-client only, no policies)
create table login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);
alter table login_attempts enable row level security;
create index on login_attempts (email, created_at);

-- Quote status: add declined
alter type quote_status add value if not exists 'declined';

-- Quote tracking fields
alter table quotes add column if not exists viewed_at timestamptz;
alter table quotes add column if not exists sent_at timestamptz;

-- Invoice tracking fields
alter table invoices add column if not exists paid_at timestamptz;
alter table invoices add column if not exists paid_note text;
alter table invoices add column if not exists sent_at timestamptz;
