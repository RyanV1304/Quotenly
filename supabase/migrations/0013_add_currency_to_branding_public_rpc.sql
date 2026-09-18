drop function if exists get_branding_public_info(uuid);

create function get_branding_public_info(p_workspace_id uuid)
returns table (business_name text, logo_url text, address text, phone text, email text, currency text)
language sql
security definer
set search_path = public
stable
as $$
  select business_name, logo_url, address, phone, email, currency
  from workspace_branding where workspace_id = p_workspace_id;
$$;

revoke execute on function get_branding_public_info(uuid) from public;
grant execute on function get_branding_public_info(uuid) to anon, authenticated;
