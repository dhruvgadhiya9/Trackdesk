#!/usr/bin/env node
// Authoring helper for V3__v1_module_scaffolds.sql. It writes EXPLICIT SQL (every policy spelled
// out) so reviewers read plain SQL; this script is not used at runtime.
// Usage: node apps/api/src/main/resources/apps/api/scripts/v3-scaffolds.mjs > apps/api/src/main/resources/db/migration/V3__v1_module_scaffolds.sql
// Never edit an applied migration: once V3 is applied anywhere, add V4+ instead.

const TENANT = 'tenant_id = app_current_tenant()';
const NOT_CUSTOMER_OR_OWN = (col = 'customer_id') =>
  `(app_current_role() is distinct from 'customer' or ${col} = app_current_customer())`;
const FIELD_OWN = (col) =>
  `(app_current_role() is distinct from 'field_worker' or ${col} = app_current_user())`;
const OPS = `app_current_role() in ('company_owner', 'ops_manager')`;
const perms = (...ps) => '(' + ps.map((p) => `app_has_permission('${p}')`).join(' or ') + ')';

/** @type {{sprint:number,name:string,cols:string,indexes?:string[],select?:string,write:string,grants?:string,noDelete?:boolean,comment?:string}[]} */
const tables = [
  // ---------------- Sprint 1 ----------------
  {
    sprint: 1, name: 'site', write: perms('sites:write'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `customer_id uuid not null,
  name text not null,
  address_line1 text, address_line2 text, city text, postcode text,
  location geography(Point, 4326),
  access_notes text,
  status text not null default 'active' check (status in ('active', 'archived')),
  version bigint not null default 0,
  foreign key (tenant_id, customer_id) references customer (tenant_id, id)`,
    indexes: ['(tenant_id, customer_id)', 'using gist (location)'],
    noDelete: true,
  },
  {
    sprint: 1, name: 'asset', write: perms('assets:write'),
    select: `(app_current_role() is distinct from 'customer' or exists (select 1 from site s where s.tenant_id = asset.tenant_id and s.id = asset.site_id and s.customer_id = app_current_customer()))`,
    cols: `site_id uuid not null,
  asset_type text not null check (asset_type in ('fire_alarm_panel','smoke_detector','heat_detector','call_point','sounder','beacon','emergency_light','exit_sign','central_battery','other')),
  standard text not null check (standard in ('BS5839','BS5266','OTHER')),
  manufacturer text, model text, serial_number text,
  location_description text,
  location geography(Point, 4326),
  installed_on date,
  status text not null default 'active' check (status in ('active', 'decommissioned')),
  version bigint not null default 0,
  foreign key (tenant_id, site_id) references site (tenant_id, id)`,
    indexes: ['(tenant_id, site_id)'],
    noDelete: true,
  },
  {
    sprint: 1, name: 'team', write: perms('teams:write'),
    cols: `name text not null`,
    indexes: ['(tenant_id, name)'],
  },
  {
    sprint: 1, name: 'team_member', write: perms('teams:write'),
    cols: `team_id uuid not null,
  user_id uuid not null,
  unique (tenant_id, team_id, user_id),
  foreign key (tenant_id, team_id) references team (tenant_id, id),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, user_id)'],
  },
  {
    sprint: 1, name: 'technician_skill', write: perms('teams:write'),
    cols: `user_id uuid not null,
  skill text not null,
  unique (tenant_id, user_id, skill),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, skill)'],
  },
  {
    sprint: 1, name: 'working_hours', write: perms('teams:write'),
    cols: `user_id uuid not null,
  day_of_week smallint not null check (day_of_week between 1 and 7),
  starts_at time not null,
  ends_at time not null check (ends_at > starts_at),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, user_id, day_of_week)'],
  },
  // ---------------- Sprint 2 ----------------
  {
    sprint: 2, name: 'work_order', write: perms('workorders:write'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `customer_id uuid not null,
  site_id uuid not null,
  reference text not null,
  title text not null,
  description text,
  priority text not null default 'normal' check (priority in ('low','normal','high','emergency')),
  status text not null default 'open' check (status in ('open','in_progress','completed','cancelled')),
  version bigint not null default 0,
  unique (tenant_id, reference),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, site_id) references site (tenant_id, id)`,
    indexes: ['(tenant_id, customer_id)', '(tenant_id, status)'],
    noDelete: true,
  },
  {
    sprint: 2, name: 'work_order_asset', write: perms('workorders:write'),
    cols: `work_order_id uuid not null,
  asset_id uuid not null,
  unique (tenant_id, work_order_id, asset_id),
  foreign key (tenant_id, work_order_id) references work_order (tenant_id, id),
  foreign key (tenant_id, asset_id) references asset (tenant_id, id)`,
    indexes: ['(tenant_id, asset_id)'],
  },
  {
    sprint: 2, name: 'maintenance_schedule', write: perms('maintenance:write'),
    select: `(app_current_role() is distinct from 'customer' or exists (select 1 from site s where s.tenant_id = maintenance_schedule.tenant_id and s.id = maintenance_schedule.site_id and s.customer_id = app_current_customer()))`,
    cols: `site_id uuid not null,
  standard text not null check (standard in ('BS5839','BS5266','OTHER')),
  title text not null,
  interval_months int not null check (interval_months between 1 and 60),
  next_due_on date not null,
  lead_days int not null default 14,
  sla_hours int,
  active boolean not null default true,
  version bigint not null default 0,
  foreign key (tenant_id, site_id) references site (tenant_id, id)`,
    indexes: ['(tenant_id, next_due_on) where active'],
  },
  {
    sprint: 2, name: 'job', write: perms('jobs:write', 'jobs:transition', 'dispatch:assign'),
    select: `${NOT_CUSTOMER_OR_OWN()} and ${FIELD_OWN('assigned_user_id')}`,
    cols: `customer_id uuid not null,
  site_id uuid not null,
  work_order_id uuid,
  maintenance_schedule_id uuid,
  reference text not null,
  job_type text not null check (job_type in ('service','repair','install','inspection','callout')),
  standard text check (standard in ('BS5839','BS5266','OTHER')),
  status text not null default 'draft' check (status in ('draft','scheduled','dispatched','en_route','on_site','completed','verified','invoiced','cancelled','overdue')),
  priority text not null default 'normal' check (priority in ('low','normal','high','emergency')),
  title text,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  assigned_user_id uuid,
  sla_due_at timestamptz,
  completed_at timestamptz,
  verified_at timestamptz,
  client_id uuid,
  version bigint not null default 0,
  unique (tenant_id, reference),
  unique (tenant_id, client_id),
  unique (tenant_id, maintenance_schedule_id, sla_due_at),
  check (scheduled_end is null or scheduled_start is null or scheduled_end > scheduled_start),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, site_id) references site (tenant_id, id),
  foreign key (tenant_id, work_order_id) references work_order (tenant_id, id),
  foreign key (tenant_id, maintenance_schedule_id) references maintenance_schedule (tenant_id, id),
  foreign key (tenant_id, assigned_user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, status)', '(tenant_id, assigned_user_id, scheduled_start)', '(tenant_id, customer_id)'],
    noDelete: true,
  },
  {
    sprint: 2, name: 'job_status_history', write: perms('jobs:write', 'jobs:transition'),
    cols: `job_id uuid not null,
  from_status text,
  to_status text not null,
  changed_by uuid,
  changed_at timestamptz not null default now(),
  reason text,
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, job_id, changed_at)'],
    grants: 'select, insert', noDelete: true,
  },
  // ---------------- Sprint 4 (field work; location = SECURITY/DPO review) ----------------
  {
    sprint: 4, name: 'location_consent', write: perms('location:report'),
    select: `(${OPS} or user_id = app_current_user())`,
    cols: `user_id uuid not null,
  consent_version text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, user_id, granted_at desc)'],
    grants: 'select, insert, update', noDelete: true,
  },
  {
    sprint: 4, name: 'location_ping', write: perms('location:report'),
    select: `(${OPS} or user_id = app_current_user())`,
    cols: `user_id uuid not null,
  job_id uuid,
  location geography(Point, 4326) not null,
  accuracy_m real,
  recorded_at timestamptz not null,
  received_at timestamptz not null default now(),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, user_id, recorded_at desc)', '(tenant_id, recorded_at)'],
    grants: 'select, insert, delete',
    comment: 'Retention: raw pings deleted after 90 days (DRAFT policy, docs/11-compliance.md).',
  },
  {
    sprint: 4, name: 'checklist_template', write: perms('jobs:write'),
    cols: `standard text not null check (standard in ('BS5839','BS5266','OTHER')),
  name text not null,
  version int not null default 1,
  items jsonb not null default '[]'::jsonb,
  unique (tenant_id, standard, name, version)`,
    indexes: ['(tenant_id, standard)'],
  },
  {
    sprint: 4, name: 'checklist_response', write: perms('fieldwork:execute', 'jobs:write'),
    cols: `job_id uuid not null,
  template_id uuid,
  asset_id uuid,
  item_key text not null,
  answer text not null check (answer in ('pass','fail','na')),
  notes text,
  answered_by uuid,
  answered_at timestamptz not null,
  unique (tenant_id, job_id, asset_id, item_key),
  foreign key (tenant_id, job_id) references job (tenant_id, id),
  foreign key (tenant_id, template_id) references checklist_template (tenant_id, id),
  foreign key (tenant_id, asset_id) references asset (tenant_id, id)`,
    indexes: ['(tenant_id, job_id)'],
    noDelete: true,
  },
  {
    sprint: 4, name: 'job_photo', write: perms('fieldwork:execute', 'jobs:write'),
    cols: `job_id uuid not null,
  storage_path text not null,
  content_type text not null,
  client_id uuid,
  taken_at timestamptz,
  uploaded_at timestamptz,
  unique (tenant_id, client_id),
  check (storage_path like 'tenants/' || tenant_id::text || '/%'),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, job_id)'],
    noDelete: true,
  },
  {
    sprint: 4, name: 'job_signature', write: perms('fieldwork:execute'),
    cols: `job_id uuid not null,
  signer_name text not null,
  storage_path text not null,
  signed_at timestamptz not null,
  check (storage_path like 'tenants/' || tenant_id::text || '/%'),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, job_id)'],
    noDelete: true,
  },
  // ---------------- Sprint 5 ----------------
  {
    sprint: 5, name: 'happy_code', write: perms('verification:verify', 'verification:override'),
    select: `app_current_role() is distinct from 'customer'`,
    cols: `job_id uuid not null,
  code_hash text not null,
  sent_to_phone_last4 text,
  expires_at timestamptz not null,
  attempts int not null default 0,
  max_attempts int not null default 5,
  verified_at timestamptz,
  created_at_sent timestamptz not null default now(),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, job_id)'],
    noDelete: true,
    comment: 'SECURITY-REVIEW-REQUIRED: OTP stored as hash only; never exposed to customer role.',
  },
  {
    sprint: 5, name: 'certificate', write: perms('compliance:issue'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `job_id uuid not null,
  customer_id uuid not null,
  site_id uuid not null,
  standard text not null check (standard in ('BS5839','BS5266','OTHER')),
  certificate_type text not null check (certificate_type in ('inspection_servicing','periodic_test','commissioning','modification')),
  version int not null default 1,
  supersedes_id uuid,
  status text not null default 'draft' check (status in ('draft','issued','superseded')),
  storage_path text,
  content_sha256 text,
  issued_at timestamptz,
  issued_by uuid,
  correction_reason text,
  foreign key (tenant_id, job_id) references job (tenant_id, id),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, site_id) references site (tenant_id, id),
  foreign key (tenant_id, supersedes_id) references certificate (tenant_id, id)`,
    indexes: ['(tenant_id, site_id, issued_at desc)', '(tenant_id, job_id)'],
    grants: 'select, insert, update', noDelete: true,
    comment: 'SECURITY-REVIEW-REQUIRED: immutable once issued (trigger below); compliance advisor sign-off.',
  },
  {
    sprint: 5, name: 'job_request', write: perms('portal:request-job', 'jobs:write'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `customer_id uuid not null,
  site_id uuid not null,
  requested_by uuid not null,
  description text not null,
  preferred_date date,
  status text not null default 'new' check (status in ('new','accepted','declined','converted')),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, site_id) references site (tenant_id, id)`,
    indexes: ['(tenant_id, status)'],
    noDelete: true,
  },
  // ---------------- Sprint 6 ----------------
  {
    sprint: 6, name: 'quote', write: perms('quotes:write', 'quotes:accept'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `customer_id uuid not null,
  site_id uuid,
  reference text not null,
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined','expired')),
  valid_until date,
  subtotal numeric(12,2) not null default 0,
  vat_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  accepted_at timestamptz,
  job_id uuid,
  version bigint not null default 0,
  unique (tenant_id, reference),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, site_id) references site (tenant_id, id),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, customer_id)', '(tenant_id, status)'],
    noDelete: true,
  },
  {
    sprint: 6, name: 'quote_line', write: perms('quotes:write'),
    select: `(app_current_role() is distinct from 'customer' or exists (select 1 from quote q where q.tenant_id = quote_line.tenant_id and q.id = quote_line.quote_id and q.customer_id = app_current_customer()))`,
    cols: `quote_id uuid not null,
  position int not null,
  description text not null,
  quantity numeric(10,2) not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  vat_rate numeric(4,2) not null check (vat_rate in (0.00, 0.05, 0.20)),
  line_total numeric(12,2) not null,
  foreign key (tenant_id, quote_id) references quote (tenant_id, id)`,
    indexes: ['(tenant_id, quote_id, position)'],
  },
  {
    sprint: 6, name: 'invoice', write: perms('invoices:write', 'payments:collect'), select: NOT_CUSTOMER_OR_OWN(),
    cols: `customer_id uuid not null,
  job_id uuid,
  reference text not null,
  status text not null default 'draft' check (status in ('draft','issued','paid','overdue','void')),
  issued_on date,
  due_on date,
  subtotal numeric(12,2) not null default 0,
  vat_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  version bigint not null default 0,
  unique (tenant_id, reference),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id),
  foreign key (tenant_id, job_id) references job (tenant_id, id)`,
    indexes: ['(tenant_id, customer_id)', '(tenant_id, status, due_on)'],
    noDelete: true,
  },
  {
    sprint: 6, name: 'invoice_line', write: perms('invoices:write'),
    select: `(app_current_role() is distinct from 'customer' or exists (select 1 from invoice i where i.tenant_id = invoice_line.tenant_id and i.id = invoice_line.invoice_id and i.customer_id = app_current_customer()))`,
    cols: `invoice_id uuid not null,
  position int not null,
  description text not null,
  quantity numeric(10,2) not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  vat_rate numeric(4,2) not null check (vat_rate in (0.00, 0.05, 0.20)),
  line_total numeric(12,2) not null,
  foreign key (tenant_id, invoice_id) references invoice (tenant_id, id)`,
    indexes: ['(tenant_id, invoice_id, position)'],
  },
  {
    sprint: 6, name: 'payment', write: perms('payments:collect'),
    select: `(app_current_role() is distinct from 'customer' or exists (select 1 from invoice i where i.tenant_id = payment.tenant_id and i.id = payment.invoice_id and i.customer_id = app_current_customer()))`,
    cols: `invoice_id uuid not null,
  provider text not null check (provider in ('stripe','mor','fake')),
  provider_ref text not null,
  amount numeric(12,2) not null,
  status text not null check (status in ('pending','succeeded','failed','refunded')),
  received_at timestamptz,
  unique (provider, provider_ref),
  foreign key (tenant_id, invoice_id) references invoice (tenant_id, id)`,
    indexes: ['(tenant_id, invoice_id)'],
    noDelete: true,
    comment: 'SECURITY-REVIEW-REQUIRED: payment records; webhook writes run in the tenant context resolved from provider metadata.',
  },
  {
    sprint: 6, name: 'chat_conversation', write: perms('chat:write'), deferPolicies: true,
    select: `(${OPS} or exists (select 1 from chat_participant p where p.tenant_id = chat_conversation.tenant_id and p.conversation_id = chat_conversation.id and p.user_id = app_current_user()))`,
    cols: `kind text not null check (kind in ('ops_worker','ops_customer')),
  job_id uuid,
  customer_id uuid,
  foreign key (tenant_id, job_id) references job (tenant_id, id),
  foreign key (tenant_id, customer_id) references customer (tenant_id, id)`,
    indexes: ['(tenant_id, job_id)'],
    noDelete: true,
  },
  {
    sprint: 6, name: 'chat_participant', write: perms('chat:write'),
    cols: `conversation_id uuid not null,
  user_id uuid not null,
  unique (tenant_id, conversation_id, user_id),
  foreign key (tenant_id, conversation_id) references chat_conversation (tenant_id, id),
  foreign key (tenant_id, user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, user_id)'],
  },
  {
    sprint: 6, name: 'chat_message', write: perms('chat:write', 'chat:moderate'),
    select: `(${OPS} or exists (select 1 from chat_participant p where p.tenant_id = chat_message.tenant_id and p.conversation_id = chat_message.conversation_id and p.user_id = app_current_user()))`,
    cols: `conversation_id uuid not null,
  sender_user_id uuid not null,
  body text not null check (length(body) between 1 and 4000),
  client_id uuid,
  sent_at timestamptz not null default now(),
  hidden_at timestamptz,
  hidden_by uuid,
  unique (tenant_id, client_id),
  foreign key (tenant_id, conversation_id) references chat_conversation (tenant_id, id),
  foreign key (tenant_id, sender_user_id) references app_user (tenant_id, id)`,
    indexes: ['(tenant_id, conversation_id, sent_at desc)'],
    noDelete: true,
  },
];

const out = [];
const deferred = [];
const p = (s = '') => out.push(s);
p('-- GENERATED by apps/api/scripts/v3-scaffolds.mjs, then reviewed. Explicit SQL: every policy is spelled out.');
p('-- SECURITY-REVIEW-REQUIRED: scaffold tables for all v1 modules (Sprints 1-6). Each table has');
p('-- tenant_id, unique (tenant_id, id), composite same-tenant FKs, an index leading with tenant_id,');
p('-- ENABLE + FORCE RLS, select/insert/update/delete policies and explicit grants to trackdesk_app.');
p('-- Write policies also check the role permission matrix (app_has_permission) — RLS mirrors Spring Security.');
let sprint = 0;
for (const t of tables) {
  if (t.sprint !== sprint) {
    sprint = t.sprint;
    p();
    p(`-- =============================== Sprint ${sprint} ===============================`);
  }
  const sel = t.select ? `${TENANT} and ${t.select}` : TENANT;
  const grants = t.grants ?? (t.noDelete ? 'select, insert, update' : 'select, insert, update, delete');
  p();
  if (t.comment) p(`-- ${t.comment}`);
  p(`create table ${t.name} (`);
  p(`  id uuid primary key default gen_random_uuid(),`);
  p(`  tenant_id uuid not null references tenant (id),`);
  p(`  ${t.cols},`);
  p(`  created_at timestamptz not null default now(),`);
  p(`  updated_at timestamptz not null default now(),`);
  p(`  unique (tenant_id, id)`);
  p(`);`);
  (t.indexes ?? []).forEach((ix, i) => {

    p(`create index ${t.name}_ix${i + 1} on ${t.name} ${ix};`);
  });
  if (!(t.indexes ?? []).some((ix) => ix.startsWith('(tenant_id'))) p(`create index ${t.name}_tenant_ix on ${t.name} (tenant_id);`);
  if (t.deferPolicies) { deferred.push(t); continue; }
  emitPolicies(t);
}
for (const t of deferred) {
  p();
  p(`-- Policies for ${t.name} reference tables created after it.`);
  emitPolicies(t);
}

function emitPolicies(t) {
  const sel = t.select ? `${TENANT} and ${t.select}` : TENANT;
  const grants = t.grants ?? (t.noDelete ? 'select, insert, update' : 'select, insert, update, delete');
  p(`alter table ${t.name} enable row level security;`);
  p(`alter table ${t.name} force row level security;`);
  p(`create policy ${t.name}_select on ${t.name} for select\n  using (${sel});`);
  if (grants.includes('insert'))
    p(`create policy ${t.name}_insert on ${t.name} for insert\n  with check (${TENANT} and ${t.write});`);
  if (grants.includes('update'))
    p(`create policy ${t.name}_update on ${t.name} for update\n  using (${sel} and ${t.write})\n  with check (${TENANT});`);
  if (grants.includes('delete'))
    p(`create policy ${t.name}_delete on ${t.name} for delete\n  using (${TENANT} and ${t.write});`);
  p(`grant ${grants} on ${t.name} to trackdesk_app;`);
}

p();
p('-- Certificates are immutable once issued: only status issued -> superseded is allowed.');
p(`create or replace function certificate_immutable() returns trigger language plpgsql as $$
begin
  if old.status in ('issued', 'superseded') then
    if old.status = 'issued' and new.status = 'superseded'
       and (to_jsonb(new) - 'status' - 'updated_at') = (to_jsonb(old) - 'status' - 'updated_at') then
      return new;
    end if;
    raise exception 'certificate % is immutable once issued', old.id using errcode = '42501';
  end if;
  return new;
end
$$;
create trigger certificate_immutable before update on certificate
  for each row execute function certificate_immutable();`);
p();
p('-- Platform-level webhook de-duplication (no tenant data stored: provider + event id only).');
p(`create table processed_webhook_event (
  provider     text not null,
  event_id     text not null,
  event_type   text not null,
  processed_at timestamptz not null default now(),
  primary key (provider, event_id)
);
alter table processed_webhook_event enable row level security;
alter table processed_webhook_event force row level security;
create policy processed_webhook_event_all on processed_webhook_event for all using (true) with check (true);
grant select, insert on processed_webhook_event to trackdesk_app;`);

process.stdout.write(out.join('\n') + '\n');
