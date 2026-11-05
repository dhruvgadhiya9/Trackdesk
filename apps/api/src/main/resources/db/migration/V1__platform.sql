-- SECURITY-REVIEW-REQUIRED: tenancy foundation — RLS helper functions and platform tables.
-- Runs as trackdesk_owner (table owner). Every tenant table: tenant_id, unique (tenant_id, id),
-- index leading with tenant_id, ENABLE + FORCE RLS, explicit policies, explicit grants.

-- ---------------------------------------------------------------------------------------------
-- RLS helpers. Values come from per-transaction settings written by the API
-- (TenantAwareJpaTransactionManager: set_config(..., true)) or, for Supabase Realtime/PostgREST,
-- from the verified JWT claims. No setting => NULL => no rows (fail closed).
-- ---------------------------------------------------------------------------------------------
create or replace function app_jwt_claims() returns jsonb
  language sql stable
as $$ select nullif(current_setting('request.jwt.claims', true), '')::jsonb $$;

create or replace function app_current_tenant() returns uuid
  language sql stable
as $$
  select coalesce(
    nullif(current_setting('app.tenant_id', true), ''),
    app_jwt_claims() -> 'app_metadata' ->> 'tenant_id'
  )::uuid
$$;

create or replace function app_current_user() returns uuid
  language sql stable
as $$
  select coalesce(nullif(current_setting('app.user_id', true), ''), app_jwt_claims() ->> 'sub')::uuid
$$;

create or replace function app_current_role() returns text
  language sql stable
as $$
  select coalesce(
    nullif(current_setting('app.role', true), ''),
    app_jwt_claims() -> 'app_metadata' ->> 'role'
  )
$$;

create or replace function app_current_customer() returns uuid
  language sql stable
as $$
  select coalesce(
    nullif(current_setting('app.customer_id', true), ''),
    app_jwt_claims() -> 'app_metadata' ->> 'customer_id'
  )::uuid
$$;

-- ---------------------------------------------------------------------------------------------
-- role_permission: global (not tenant data), seeded by R__role_permissions.sql from
-- packages/contracts/permissions.yaml. Read-only for the app.
-- ---------------------------------------------------------------------------------------------
create table role_permission (
  role       text not null,
  permission text not null,
  primary key (role, permission)
);
alter table role_permission enable row level security;
alter table role_permission force row level security;
create policy role_permission_read on role_permission for select using (true);
create policy role_permission_owner_write on role_permission for all to trackdesk_owner
  using (true) with check (true);
grant select on role_permission to trackdesk_app;

create or replace function app_has_permission(p text) returns boolean
  language sql stable
as $$
  select exists (select 1 from role_permission rp where rp.role = app_current_role() and rp.permission = p)
$$;

-- ---------------------------------------------------------------------------------------------
-- tenant
-- ---------------------------------------------------------------------------------------------
create table tenant (
  id           uuid primary key,
  name         text not null check (length(name) between 2 and 200),
  slug         text not null unique,
  country_code text not null default 'GB' check (country_code = 'GB'),
  status       text not null default 'active' check (status in ('active', 'suspended')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table tenant enable row level security;
alter table tenant force row level security;
-- Own tenant only; portal_owner (platform admin) may list tenants (no tenant data).
create policy tenant_select on tenant for select
  using (id = app_current_tenant() or app_current_role() = 'portal_owner');
-- Onboarding: the API sets app.tenant_id to the new id before inserting.
create policy tenant_insert on tenant for insert with check (id = app_current_tenant());
grant select, insert on tenant to trackdesk_app;

-- ---------------------------------------------------------------------------------------------
-- app_user (id = Supabase auth user id; one tenant per user in v1, see DECISIONS D-004)
-- ---------------------------------------------------------------------------------------------
create table app_user (
  id          uuid primary key,
  tenant_id   uuid not null references tenant (id),
  email       text not null,
  full_name   text,
  phone       text,
  role        text not null check (role in ('company_owner', 'ops_manager', 'field_worker', 'customer')),
  status      text not null default 'active' check (status in ('active', 'disabled')),
  customer_id uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (tenant_id, id),
  check (role <> 'customer' or customer_id is not null)
);
create unique index app_user_tenant_email_uq on app_user (tenant_id, lower(email));

-- ---------------------------------------------------------------------------------------------
-- invitation (only the SHA-256 hash of the token is stored)
-- ---------------------------------------------------------------------------------------------
create table invitation (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references tenant (id),
  email            text not null,
  role             text not null check (role in ('company_owner', 'ops_manager', 'field_worker', 'customer')),
  customer_id      uuid,
  token_hash       text not null unique,
  invited_by       uuid not null,
  expires_at       timestamptz not null,
  accepted_at      timestamptz,
  accepted_user_id uuid,
  revoked_at       timestamptz,
  created_at       timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, invited_by) references app_user (tenant_id, id)
);
create index invitation_tenant_email_idx on invitation (tenant_id, lower(email));

alter table invitation enable row level security;
alter table invitation force row level security;
-- Capability-based lookup: an invitee without a tenant can read ONLY the invitation whose token
-- hash they present (app.invite_token_hash). 256-bit tokens make this unguessable.
create policy invitation_select on invitation for select
  using (tenant_id = app_current_tenant()
         or token_hash = nullif(current_setting('app.invite_token_hash', true), ''));
create policy invitation_insert on invitation for insert
  with check (tenant_id = app_current_tenant() and app_has_permission('users:invite'));
create policy invitation_update on invitation for update
  using (tenant_id = app_current_tenant()
         and (app_has_permission('users:invite')
              or token_hash = nullif(current_setting('app.invite_token_hash', true), '')))
  with check (tenant_id = app_current_tenant());
grant select, insert, update on invitation to trackdesk_app;

alter table app_user enable row level security;
alter table app_user force row level security;
create policy app_user_select on app_user for select using (tenant_id = app_current_tenant());
-- Insert: user managers, or a user inserting THEMSELVES with a matching, valid invitation.
create policy app_user_insert on app_user for insert
  with check (
    tenant_id = app_current_tenant()
    and (
      app_has_permission('users:invite')
      or (
        id = app_current_user()
        and exists (
          select 1 from invitation i
          where i.tenant_id = app_user.tenant_id
            and i.token_hash = nullif(current_setting('app.invite_token_hash', true), '')
            and i.role = app_user.role
            and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
        )
      )
    )
  );
create policy app_user_update on app_user for update
  using (tenant_id = app_current_tenant() and (app_has_permission('users:manage') or id = app_current_user()))
  with check (tenant_id = app_current_tenant());
grant select, insert, update on app_user to trackdesk_app;

-- ---------------------------------------------------------------------------------------------
-- audit_event — APPEND-ONLY (no update/delete grant + trigger guard)
-- ---------------------------------------------------------------------------------------------
create table audit_event (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenant (id),
  occurred_at   timestamptz not null default now(),
  actor_user_id uuid,
  actor_role    text,
  action        text not null,
  entity_type   text not null,
  entity_id     uuid,
  request_id    text,
  details       jsonb not null default '{}'::jsonb,
  unique (tenant_id, id)
);
create index audit_event_tenant_time_idx on audit_event (tenant_id, occurred_at desc);
create index audit_event_tenant_entity_idx on audit_event (tenant_id, entity_type, entity_id);
alter table audit_event enable row level security;
alter table audit_event force row level security;
create policy audit_event_select on audit_event for select using (tenant_id = app_current_tenant());
create policy audit_event_insert on audit_event for insert with check (tenant_id = app_current_tenant());
grant select, insert on audit_event to trackdesk_app;

create or replace function audit_event_immutable() returns trigger language plpgsql as $$
begin
  raise exception 'audit_event is append-only' using errcode = '42501';
end
$$;
create trigger audit_event_no_update before update or delete on audit_event
  for each row execute function audit_event_immutable();

-- ---------------------------------------------------------------------------------------------
-- feature flags (global definitions + per-tenant overrides)
-- ---------------------------------------------------------------------------------------------
create table feature_flag (
  key             text primary key,
  description     text not null,
  default_enabled boolean not null default false
);
alter table feature_flag enable row level security;
alter table feature_flag force row level security;
create policy feature_flag_read on feature_flag for select using (true);
create policy feature_flag_owner_write on feature_flag for all to trackdesk_owner using (true) with check (true);
grant select on feature_flag to trackdesk_app;

insert into feature_flag (key, description, default_enabled) values
  ('dispatch_board_v1', 'Sprint 3 dispatch board', false),
  ('mobile_background_location', 'Background location tracking (requires DPIA sign-off)', false),
  ('happy_code', 'Happy Code OTP verification', false),
  ('payments', 'Online payments', false);

create table tenant_feature_flag (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenant (id),
  flag_key   text not null references feature_flag (key),
  enabled    boolean not null,
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, flag_key)
);
alter table tenant_feature_flag enable row level security;
alter table tenant_feature_flag force row level security;
create policy tenant_feature_flag_select on tenant_feature_flag for select using (tenant_id = app_current_tenant());
create policy tenant_feature_flag_write on tenant_feature_flag for all
  using (tenant_id = app_current_tenant() and app_has_permission('featureflags:manage'))
  with check (tenant_id = app_current_tenant() and app_has_permission('featureflags:manage'));
grant select, insert, update, delete on tenant_feature_flag to trackdesk_app;

-- ---------------------------------------------------------------------------------------------
-- idempotency_record (offline sync replays)
-- ---------------------------------------------------------------------------------------------
create table idempotency_record (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenant (id),
  user_id         uuid not null,
  idempotency_key text not null,
  request_hash    text not null,
  response_status int not null,
  response_body   jsonb,
  created_at      timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, idempotency_key),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)
);
alter table idempotency_record enable row level security;
alter table idempotency_record force row level security;
create policy idempotency_record_select on idempotency_record for select
  using (tenant_id = app_current_tenant() and user_id = app_current_user());
create policy idempotency_record_insert on idempotency_record for insert
  with check (tenant_id = app_current_tenant() and user_id = app_current_user());
grant select, insert on idempotency_record to trackdesk_app;

-- ---------------------------------------------------------------------------------------------
-- shedlock (global; scheduler coordination only, no tenant data)
-- ---------------------------------------------------------------------------------------------
create table shedlock (
  name       varchar(64) primary key,
  lock_until timestamptz not null,
  locked_at  timestamptz not null,
  locked_by  varchar(255) not null
);
alter table shedlock enable row level security;
alter table shedlock force row level security;
create policy shedlock_all on shedlock for all using (true) with check (true);
grant select, insert, update on shedlock to trackdesk_app;
