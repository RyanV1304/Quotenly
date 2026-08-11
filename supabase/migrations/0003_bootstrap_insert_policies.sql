create policy "owner can create workspace" on workspaces
  for insert with check (owner_id = auth.uid());

create policy "bootstrap owner membership" on workspace_members
  for insert with check (
    role = 'owner'
    and user_id = auth.uid()
    and exists (select 1 from workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
  );
