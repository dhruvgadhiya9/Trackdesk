-- SECURITY-REVIEW-REQUIRED: database roles. Run ONCE per environment by a human with a
-- privileged role (local: applied automatically by `supabase start` via
-- supabase/migrations/00000000000000_trackdesk_bootstrap.sql; tests: Testcontainers init script).
-- Flyway then runs as trackdesk_owner and owns every table; the API connects as trackdesk_app.
--
-- Passwords here are LOCAL/TEST placeholders. Staging/prod passwords are set by a human from the
-- secret manager: ALTER ROLE trackdesk_app PASSWORD '<from vault>';

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'trackdesk_owner') then
    create role trackdesk_owner login password 'trackdesk_owner_local'
      nosuperuser nocreatedb nocreaterole nobypassrls;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'trackdesk_app') then
    -- The API role: NOT superuser, NOT owner, NO BYPASSRLS. RLS applies to every query.
    create role trackdesk_app login password 'trackdesk_app_local'
      nosuperuser nocreatedb nocreaterole nobypassrls;
  end if;
end
$$;

create extension if not exists postgis;
create extension if not exists pgcrypto;

grant usage, create on schema public to trackdesk_owner;
grant usage on schema public to trackdesk_app;
alter role trackdesk_owner set search_path = public, extensions;
alter role trackdesk_app set search_path = public, extensions;
alter role trackdesk_app set statement_timeout = '15s';
