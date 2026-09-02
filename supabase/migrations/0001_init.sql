-- Krewbill initial schema
create extension if not exists "pgcrypto";

create type member_role as enum ('owner', 'teammate');
create type quote_status as enum ('draft', 'sent', 'approved');
create type invoice_status as enum ('draft', 'sent', 'viewed', 'paid', 'overdue');
create type line_item_type as enum ('labor', 'materials', 'flat_fee');

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role member_role not null default 'teammate',
  invited_email text not null,
  invite_token uuid not null default gen_random_uuid(),
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  unique (workspace_id, invited_email)
);

create table workspace_branding (
  workspace_id uuid primary key references workspaces(id) on delete cascade,
  business_name text,
  logo_url text,
  address text,
  phone text,
  email text
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  contact_email text,
  contact_phone text,
  job_address text,
  notes text,
  created_at timestamptz not null default now()
);

create table line_item_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  label text not null,
  type line_item_type not null,
  default_rate numeric(12,2) not null default 0
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  assigned_to uuid references auth.users(id) on delete set null,
  status quote_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  tax_rate numeric(5,4) not null default 0,
  total numeric(12,2) not null default 0,
  share_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  description text not null,
  type line_item_type not null,
  quantity numeric(12,2) not null default 1,
  rate numeric(12,2) not null default 0,
  amount numeric(12,2) not null default 0,
  sort_order int not null default 0
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  quote_id uuid references quotes(id) on delete set null,
  client_id uuid not null references clients(id) on delete restrict,
  assigned_to uuid references auth.users(id) on delete set null,
  status invoice_status not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  tax_rate numeric(5,4) not null default 0,
  total numeric(12,2) not null default 0,
  due_date date,
  payment_instructions text,
  share_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  type line_item_type not null,
  quantity numeric(12,2) not null default 1,
  rate numeric(12,2) not null default 0,
  amount numeric(12,2) not null default 0,
  sort_order int not null default 0
);

create table invoice_reminders_log (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  sent_at timestamptz not null default now()
);

create index on workspace_members (workspace_id);
create index on workspace_members (user_id);
create index on clients (workspace_id);
create index on quotes (workspace_id);
create index on quotes (assigned_to);
create index on invoices (workspace_id);
create index on invoices (assigned_to);
create index on invoices (status);
create index on invoice_reminders_log (invoice_id);

-- Helper: is the current user a member of a workspace, and with which role
create or replace function is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = ws_id and user_id = auth.uid() and joined_at is not null
  );
$$;

create or replace function is_workspace_owner(ws_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = ws_id and user_id = auth.uid() and role = 'owner' and joined_at is not null
  );
$$;

alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table workspace_branding enable row level security;
alter table clients enable row level security;
alter table line_item_templates enable row level security;
alter table quotes enable row level security;
alter table quote_line_items enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table invoice_reminders_log enable row level security;

-- workspaces
create policy "members can view workspace" on workspaces
  for select using (is_workspace_member(id));
create policy "owner can update workspace" on workspaces
  for update using (is_workspace_owner(id));

-- workspace_members
create policy "members can view membership list" on workspace_members
  for select using (is_workspace_member(workspace_id));
create policy "owner manages membership" on workspace_members
  for all using (is_workspace_owner(workspace_id))
  with check (is_workspace_owner(workspace_id));
create policy "invitee can accept own invite" on workspace_members
  for update using (invited_email = (select email from auth.users where id = auth.uid()))
  with check (invited_email = (select email from auth.users where id = auth.uid()));

-- workspace_branding
create policy "members can view branding" on workspace_branding
  for select using (is_workspace_member(workspace_id));
create policy "owner manages branding" on workspace_branding
  for all using (is_workspace_owner(workspace_id))
  with check (is_workspace_owner(workspace_id));

-- clients (full visibility to all members)
create policy "members can view clients" on clients
  for select using (is_workspace_member(workspace_id));
create policy "members can manage clients" on clients
  for all using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

-- line_item_templates
create policy "members can view templates" on line_item_templates
  for select using (is_workspace_member(workspace_id));
create policy "members can manage templates" on line_item_templates
  for all using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

-- quotes: owner sees all, teammate only assigned
create policy "owner views all quotes" on quotes
  for select using (is_workspace_owner(workspace_id));
create policy "teammate views assigned quotes" on quotes
  for select using (assigned_to = auth.uid());
create policy "owner manages quotes" on quotes
  for all using (is_workspace_owner(workspace_id))
  with check (is_workspace_owner(workspace_id));
create policy "teammate updates assigned quotes" on quotes
  for update using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

-- quote_line_items follow parent quote visibility
create policy "view line items via quote" on quote_line_items
  for select using (
    exists (
      select 1 from quotes q
      where q.id = quote_id
        and (is_workspace_owner(q.workspace_id) or q.assigned_to = auth.uid())
    )
  );
create policy "manage line items via quote" on quote_line_items
  for all using (
    exists (
      select 1 from quotes q
      where q.id = quote_id
        and (is_workspace_owner(q.workspace_id) or q.assigned_to = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from quotes q
      where q.id = quote_id
        and (is_workspace_owner(q.workspace_id) or q.assigned_to = auth.uid())
    )
  );

-- invoices: same owner/teammate split
create policy "owner views all invoices" on invoices
  for select using (is_workspace_owner(workspace_id));
create policy "teammate views assigned invoices" on invoices
  for select using (assigned_to = auth.uid());
create policy "owner manages invoices" on invoices
  for all using (is_workspace_owner(workspace_id))
  with check (is_workspace_owner(workspace_id));
create policy "teammate updates assigned invoices" on invoices
  for update using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy "view invoice line items via invoice" on invoice_line_items
  for select using (
    exists (
      select 1 from invoices i
      where i.id = invoice_id
        and (is_workspace_owner(i.workspace_id) or i.assigned_to = auth.uid())
    )
  );
create policy "manage invoice line items via invoice" on invoice_line_items
  for all using (
    exists (
      select 1 from invoices i
      where i.id = invoice_id
        and (is_workspace_owner(i.workspace_id) or i.assigned_to = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from invoices i
      where i.id = invoice_id
        and (is_workspace_owner(i.workspace_id) or i.assigned_to = auth.uid())
    )
  );

create policy "view reminders via invoice" on invoice_reminders_log
  for select using (
    exists (
      select 1 from invoices i
      where i.id = invoice_id and is_workspace_owner(i.workspace_id)
    )
  );
