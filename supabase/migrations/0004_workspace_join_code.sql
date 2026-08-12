alter table workspaces add column join_code text unique;
alter table workspaces add column join_password_hash text;
alter table workspaces add column join_enabled boolean not null default false;
