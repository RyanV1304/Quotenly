-- Public (anon-safe) lookup for invite acceptance
create or replace function get_invite_by_token(p_token uuid)
returns table (id uuid, workspace_id uuid, invited_email text, role member_role)
language sql
security definer
set search_path = public
stable
as $$
  select id, workspace_id, invited_email, role
  from workspace_members
  where invite_token = p_token and joined_at is null;
$$;

-- Public (anon-safe) quote view by share token
create or replace function get_quote_by_token(p_token uuid)
returns table (
  id uuid, workspace_id uuid, client_id uuid, status quote_status,
  subtotal numeric, tax_rate numeric, total numeric, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, workspace_id, client_id, status, subtotal, tax_rate, total, created_at
  from quotes
  where share_token = p_token;
$$;

create or replace function get_quote_line_items_by_token(p_token uuid)
returns setof quote_line_items
language sql
security definer
set search_path = public
stable
as $$
  select qli.* from quote_line_items qli
  join quotes q on q.id = qli.quote_id
  where q.share_token = p_token
  order by qli.sort_order;
$$;

create or replace function approve_quote_by_token(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update quotes set status = 'approved' where share_token = p_token and status = 'sent';
$$;

-- Public (anon-safe) invoice view by share token
create or replace function get_invoice_by_token(p_token uuid)
returns table (
  id uuid, workspace_id uuid, client_id uuid, status invoice_status,
  subtotal numeric, tax_rate numeric, total numeric, due_date date,
  payment_instructions text, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, workspace_id, client_id, status, subtotal, tax_rate, total, due_date, payment_instructions, created_at
  from invoices
  where share_token = p_token;
$$;

create or replace function get_invoice_line_items_by_token(p_token uuid)
returns setof invoice_line_items
language sql
security definer
set search_path = public
stable
as $$
  select ili.* from invoice_line_items ili
  join invoices i on i.id = ili.invoice_id
  where i.share_token = p_token
  order by ili.sort_order;
$$;

create or replace function mark_invoice_viewed_by_token(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update invoices set status = 'viewed' where share_token = p_token and status = 'sent';
$$;

-- client + branding info needed on public pages (name only, no notes)
create or replace function get_client_public_info(p_client_id uuid)
returns table (name text, job_address text)
language sql
security definer
set search_path = public
stable
as $$
  select name, job_address from clients where id = p_client_id;
$$;

create or replace function get_branding_public_info(p_workspace_id uuid)
returns table (business_name text, logo_url text, address text, phone text, email text)
language sql
security definer
set search_path = public
stable
as $$
  select business_name, logo_url, address, phone, email
  from workspace_branding where workspace_id = p_workspace_id;
$$;

revoke execute on function get_invite_by_token(uuid) from public;
grant execute on function get_invite_by_token(uuid) to anon, authenticated;
revoke execute on function get_quote_by_token(uuid) from public;
grant execute on function get_quote_by_token(uuid) to anon, authenticated;
revoke execute on function get_quote_line_items_by_token(uuid) from public;
grant execute on function get_quote_line_items_by_token(uuid) to anon, authenticated;
revoke execute on function approve_quote_by_token(uuid) from public;
grant execute on function approve_quote_by_token(uuid) to anon, authenticated;
revoke execute on function get_invoice_by_token(uuid) from public;
grant execute on function get_invoice_by_token(uuid) to anon, authenticated;
revoke execute on function get_invoice_line_items_by_token(uuid) from public;
grant execute on function get_invoice_line_items_by_token(uuid) to anon, authenticated;
revoke execute on function mark_invoice_viewed_by_token(uuid) from public;
grant execute on function mark_invoice_viewed_by_token(uuid) to anon, authenticated;
revoke execute on function get_client_public_info(uuid) from public;
grant execute on function get_client_public_info(uuid) to anon, authenticated;
revoke execute on function get_branding_public_info(uuid) from public;
grant execute on function get_branding_public_info(uuid) to anon, authenticated;
