-- SECURITY-REVIEW-REQUIRED: customers (REFERENCE MODULE) — tenant isolation + customer-role
-- narrowing + permission-checked writes. PRD: docs/prd/01-customers.md

create table customer (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant (id),
  name            text not null check (length(btrim(name)) between 1 and 200),
  account_number  text,
  email           text,
  phone           text,
  billing_line1   text,
  billing_line2   text,
  billing_city    text,
  billing_postcode text,
  notes           text,
  status          text not null default 'active' check (status in ('active', 'archived')),
  version         bigint not null default 0,
  created_by      uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (tenant_id, id)
);
create index customer_tenant_name_idx on customer (tenant_id, lower(name));
create index customer_tenant_status_idx on customer (tenant_id, status);
create unique index customer_tenant_account_uq on customer (tenant_id, account_number)
  where account_number is not null;

alter table customer enable row level security;
alter table customer force row level security;
-- Customer-role users see only their own customer record.
create policy customer_select on customer for select
  using (tenant_id = app_current_tenant()
         and (app_current_role() is distinct from 'customer' or id = app_current_customer()));
create policy customer_insert on customer for insert
  with check (tenant_id = app_current_tenant() and app_has_permission('customers:create'));
create policy customer_update on customer for update
  using (tenant_id = app_current_tenant()
         and (app_has_permission('customers:update') or app_has_permission('customers:archive')))
  with check (tenant_id = app_current_tenant());
-- No delete policy/grant: customers are archived, never deleted (history, compliance records).
grant select, insert, update on customer to trackdesk_app;

-- Customer portal users and customer invitations point at a customer in the SAME tenant.
alter table app_user
  add constraint app_user_customer_fk foreign key (tenant_id, customer_id) references customer (tenant_id, id);
alter table invitation
  add constraint invitation_customer_fk foreign key (tenant_id, customer_id) references customer (tenant_id, id);
