-- Tenant-isolation fixture: one row in EVERY tenant-scoped table for tenant A and tenant B.
-- SYNTHETIC DATA ONLY. Executed by the container superuser (bypasses RLS) in RlsIsolationTest.
-- When you add a tenant table, add a row here — RlsIsolationTest.seedCoversEveryTenantTable fails otherwise.

create or replace function pg_temp.seed_tenant(t uuid, owner uuid, label text) returns void
language plpgsql as $$
declare
  cust uuid := gen_random_uuid();
  site uuid := gen_random_uuid();
  asset uuid := gen_random_uuid();
  team uuid := gen_random_uuid();
  wo uuid := gen_random_uuid();
  sched uuid := gen_random_uuid();
  job uuid := gen_random_uuid();
  tmpl uuid := gen_random_uuid();
  quote uuid := gen_random_uuid();
  inv uuid := gen_random_uuid();
  conv uuid := gen_random_uuid();
begin
  insert into tenant (id, name, slug) values (t, 'Isolation ' || label, 'isolation-' || lower(label));
  insert into app_user (id, tenant_id, email, full_name, role)
    values (owner, t, 'owner-' || lower(label) || '@example.test', 'Owner ' || label, 'company_owner');
  insert into invitation (tenant_id, email, role, token_hash, invited_by, expires_at)
    values (t, 'invitee-' || lower(label) || '@example.test', 'field_worker',
            encode(digest('token-' || label, 'sha256'), 'hex'), owner, now() + interval '7 days');
  insert into audit_event (tenant_id, actor_user_id, action, entity_type) values (t, owner, 'seed', 'tenant');
  insert into tenant_feature_flag (tenant_id, flag_key, enabled) values (t, 'happy_code', true);
  insert into idempotency_record (tenant_id, user_id, idempotency_key, request_hash, response_status)
    values (t, owner, 'key-' || label, 'hash', 200);

  insert into customer (id, tenant_id, name) values (cust, t, 'Customer ' || label);
  insert into site (id, tenant_id, customer_id, name, location)
    values (site, t, cust, 'Site ' || label, ST_SetSRID(ST_MakePoint(-1.5492, 53.7997), 4326)::geography);
  insert into asset (id, tenant_id, site_id, asset_type, standard) values (asset, t, site, 'smoke_detector', 'BS5839');
  insert into team (id, tenant_id, name) values (team, t, 'Team ' || label);
  insert into team_member (tenant_id, team_id, user_id) values (t, team, owner);
  insert into technician_skill (tenant_id, user_id, skill) values (t, owner, 'BS5839');
  insert into working_hours (tenant_id, user_id, day_of_week, starts_at, ends_at) values (t, owner, 1, '08:00', '17:00');

  insert into work_order (id, tenant_id, customer_id, site_id, reference, title)
    values (wo, t, cust, site, 'WO-' || label, 'Work order ' || label);
  insert into work_order_asset (tenant_id, work_order_id, asset_id) values (t, wo, asset);
  insert into maintenance_schedule (id, tenant_id, site_id, standard, title, interval_months, next_due_on)
    values (sched, t, site, 'BS5839', 'Six-monthly service', 6, current_date + 30);
  insert into job (id, tenant_id, customer_id, site_id, work_order_id, reference, job_type, status, assigned_user_id)
    values (job, t, cust, site, wo, 'JOB-' || label, 'service', 'scheduled', owner);
  insert into job_status_history (tenant_id, job_id, from_status, to_status, changed_by)
    values (t, job, 'draft', 'scheduled', owner);

  insert into location_consent (tenant_id, user_id, consent_version) values (t, owner, 'v1');
  insert into location_ping (tenant_id, user_id, job_id, location, recorded_at)
    values (t, owner, job, ST_SetSRID(ST_MakePoint(-1.55, 53.80), 4326)::geography, now());
  insert into checklist_template (id, tenant_id, standard, name) values (tmpl, t, 'BS5839', 'Service ' || label);
  insert into checklist_response (tenant_id, job_id, template_id, asset_id, item_key, answer, answered_at)
    values (t, job, tmpl, asset, 'panel.ok', 'pass', now());
  insert into job_photo (tenant_id, job_id, storage_path, content_type)
    values (t, job, 'tenants/' || t || '/jobs/' || job || '/p1.jpg', 'image/jpeg');
  insert into job_signature (tenant_id, job_id, signer_name, storage_path, signed_at)
    values (t, job, 'Site Contact', 'tenants/' || t || '/jobs/' || job || '/sig.png', now());

  insert into happy_code (tenant_id, job_id, code_hash, expires_at) values (t, job, 'hash', now() + interval '30 minutes');
  insert into certificate (tenant_id, job_id, customer_id, site_id, standard, certificate_type)
    values (t, job, cust, site, 'BS5839', 'inspection_servicing');
  insert into job_request (tenant_id, customer_id, site_id, requested_by, description)
    values (t, cust, site, owner, 'Faulty detector');

  insert into quote (id, tenant_id, customer_id, reference) values (quote, t, cust, 'Q-' || label);
  insert into quote_line (tenant_id, quote_id, position, description, quantity, unit_price, vat_rate, line_total)
    values (t, quote, 1, 'Service', 1, 100.00, 0.20, 100.00);
  insert into invoice (id, tenant_id, customer_id, job_id, reference) values (inv, t, cust, job, 'INV-' || label);
  insert into invoice_line (tenant_id, invoice_id, position, description, quantity, unit_price, vat_rate, line_total)
    values (t, inv, 1, 'Service', 1, 100.00, 0.20, 100.00);
  insert into payment (tenant_id, invoice_id, provider, provider_ref, amount, status)
    values (t, inv, 'fake', 'ref-' || label, 120.00, 'succeeded');

  insert into chat_conversation (id, tenant_id, kind, job_id) values (conv, t, 'ops_worker', job);
  insert into chat_participant (tenant_id, conversation_id, user_id) values (t, conv, owner);
  insert into chat_message (tenant_id, conversation_id, sender_user_id, body) values (t, conv, owner, 'Hello ' || label);
end
$$;

select pg_temp.seed_tenant('aaaaaaaa-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-0000000000a1', 'A');
select pg_temp.seed_tenant('bbbbbbbb-0000-4000-8000-000000000002', 'bbbbbbbb-0000-4000-8000-0000000000b1', 'B');
