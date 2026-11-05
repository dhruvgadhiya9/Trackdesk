#!/usr/bin/env node
// Phase 3 gate smoke test against the REAL local stack (Supabase Auth + API + Postgres RLS):
// sign up → create company → invite worker → worker accepts → both log in and read /v1/me,
// then a second company proves cross-tenant isolation with real Supabase JWTs.
// Local only, synthetic users. Usage: node scripts/gate-smoke.mjs (API on :8080, pnpm db:start).
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const api = process.env.API_URL ?? 'http://localhost:8080';
const env = Object.fromEntries(
  execSync('pnpm exec supabase status -o env', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((l) => l.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
const sb = env.API_URL;
if (!/^http:\/\/(127\.0\.0\.1|localhost)/.test(sb) || !/^http:\/\/(127\.0\.0\.1|localhost)/.test(api)) {
  throw new Error('gate-smoke runs against localhost only');
}
const PASSWORD = 'Gate-Password-123!';
const run = randomUUID().slice(0, 8);
let failures = 0;

async function http(url, { method = 'GET', token, body, apikey = env.ANON_KEY } = {}) {
  const res = await fetch(url, {
    method,
    headers: { apikey, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : undefined };
}
const check = (ok, label, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? `  (${extra})` : ''}`);
  if (!ok) failures++;
};
const signUp = (email) => http(`${sb}/auth/v1/signup`, { method: 'POST', body: { email, password: PASSWORD } });
const signIn = async (email) =>
  (await http(`${sb}/auth/v1/token?grant_type=password`, { method: 'POST', body: { email, password: PASSWORD } })).json
    .access_token;
const claims = (jwt) => JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());

async function company(label) {
  const email = `gate-owner-${label}-${run}@example.test`;
  const s = await signUp(email);
  check(s.status === 200, `[${label}] owner signs up with Supabase Auth`, `HTTP ${s.status}`);
  let token = await signIn(email);
  const t = await http(`${api}/v1/tenants`, { method: 'POST', token, body: { name: `Gate Co ${label} ${run}`, fullName: 'Gate Owner' } });
  check(t.status === 201, `[${label}] POST /v1/tenants creates the company`, `HTTP ${t.status}`);
  token = await signIn(email); // refreshed session carries app_metadata
  const c = claims(token);
  check(c.app_metadata?.tenant_id === t.json?.id && c.app_metadata?.role === 'company_owner', `[${label}] refreshed JWT has tenant_id + role=company_owner`);
  return { email, token, tenantId: t.json?.id };
}

async function main() {
  const a = await company('A');

  const workerEmail = `gate-worker-${run}@example.test`;
  const inv = await http(`${api}/v1/invitations`, { method: 'POST', token: a.token, body: { email: workerEmail, role: 'field_worker' } });
  check(inv.status === 201, 'owner invites a field worker', `HTTP ${inv.status}`);

  console.log('      (reading the accept link from the API log — local profile with email.log-links)');
  const log = execSync(`node -e "process.stdout.write(require('fs').readFileSync(process.argv[1],'utf8'))" "${process.env.API_LOG}"`, { encoding: 'utf8' });
  const link = [...log.matchAll(/accept link for (\S+): (\S+)/g)].reverse().find((m) => m[1] === workerEmail)?.[2];
  check(!!link, 'invite link delivered (fake email sender, local only)');
  const inviteToken = new URL(link).searchParams.get('token');

  await signUp(workerEmail);
  let workerToken = await signIn(workerEmail);
  const acc = await http(`${api}/v1/invitations/accept`, { method: 'POST', token: workerToken, body: { token: inviteToken, fullName: 'Gate Worker' } });
  check(acc.status === 200 && acc.json?.role === 'field_worker', 'worker accepts the invitation', `HTTP ${acc.status}`);
  workerToken = await signIn(workerEmail);
  const me = await http(`${api}/v1/me`, { token: workerToken });
  check(me.status === 200 && me.json?.tenantId === a.tenantId && me.json?.role === 'field_worker', 'worker logs in: /v1/me shows tenant A + field_worker');

  const cust = await http(`${api}/v1/customers`, { method: 'POST', token: a.token, body: { name: `Gate Customer ${run}` } });
  check(cust.status === 201, 'owner creates a customer');
  const workerCreate = await http(`${api}/v1/customers`, { method: 'POST', token: workerToken, body: { name: 'nope' } });
  check(workerCreate.status === 403, 'field worker cannot create customers', `HTTP ${workerCreate.status}`);

  const b = await company('B');
  const crossGet = await http(`${api}/v1/customers/${cust.json.id}`, { token: b.token });
  check(crossGet.status === 404, 'tenant B cannot read tenant A customer (real JWT + RLS)', `HTTP ${crossGet.status}`);
  const bList = await http(`${api}/v1/customers`, { token: b.token });
  check(bList.status === 200 && bList.json.page.totalElements === 0, 'tenant B customer list is empty');

  const postgrest = await http(`${sb}/rest/v1/customer?select=id`, { token: b.token });
  check(postgrest.status !== 200 || (Array.isArray(postgrest.json) && postgrest.json.length === 0), 'PostgREST with B token exposes no tenant A rows', `HTTP ${postgrest.status}`);

  console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll gate checks passed.');
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
