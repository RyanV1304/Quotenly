alter table workspace_branding add column if not exists default_tax_percent numeric(5,2) not null default 0;
alter table workspace_branding add column if not exists payment_instructions text;
