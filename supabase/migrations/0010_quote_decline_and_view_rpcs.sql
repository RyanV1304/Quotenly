drop function if exists get_quote_by_token(uuid);

create function get_quote_by_token(p_token uuid)
returns table (
  id uuid, workspace_id uuid, client_id uuid, status quote_status,
  subtotal numeric, tax_rate numeric, total numeric, notes text,
  viewed_at timestamptz, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select id, workspace_id, client_id, status, subtotal, tax_rate, total, notes, viewed_at, created_at
  from quotes
  where share_token = p_token;
$$;

grant execute on function get_quote_by_token(uuid) to anon, authenticated;

create or replace function mark_quote_viewed_by_token(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update quotes set viewed_at = now() where share_token = p_token and viewed_at is null;
$$;

create or replace function decline_quote_by_token(p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update quotes set status = 'declined' where share_token = p_token and status = 'sent';
$$;

grant execute on function mark_quote_viewed_by_token(uuid) to anon, authenticated;
grant execute on function decline_quote_by_token(uuid) to anon, authenticated;
