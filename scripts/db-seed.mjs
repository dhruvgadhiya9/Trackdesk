#!/usr/bin/env node
// Local-only seed: SYNTHETIC users and a demo company created through the REAL onboarding flow
// (Supabase Auth sign-up → POST /v1/tenants → POST /v1/invitations → POST /v1/invitations/accept).
// Requires: `pnpm db:start` (Supabase local) and the API running with the local profile
// (`pnpm --filter @trackdesk/api dev`, auth-admin provider = supabase).
// Refuses to run against anything that is not localhost.
import { execSync } from 'node:child_process';

const api = process.env.API_URL ?? 'http://localhost:8080';
const env = Object.fromEntries(
  execSync('pnpm exec supabase status -o env', { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((l) => l.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
const supabaseUrl = env.API_URL;
const anonKey = env.ANON_KEY;
const serviceKey = env.SERVICE_ROLE_KEY;
for (const url of [api, supabaseUrl]) {
  if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url ?? '')) {
    console.error(`Refusing to seed non-local target: ${url}`);
    process.exit(1);
  }
}

const PASSWORD = 'Password123!'; // synthetic, local only
const users = {
  owner: 'owner@example.test',
  ops: 'ops.manager@example.test',
  worker: 'field.worker@example.test',
};

async function call(url, { method = 'GET', token, body, key = anonKey } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw Object.assign(new Error(`${method} ${url} -> ${res.status} ${text}`), { status: res.status, json });
  return json;
}

async function ensureUser(email) {
  try {
    await call(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      key: serviceKey,
      token: serviceKey,
      body: { email, password: PASSWORD, email_confirm: true },
    });
  } catch (e) {
    if (e.status !== 422) throw e; // 422 = already exists
  }
}

async function signIn(email) {
  const r = await call(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    body: { email, password: PASSWORD },
  });
  return r.access_token;
}

async function main() {
  for (const email of Object.values(users)) await ensureUser(email);

  let ownerToken = await signIn(users.owner);
  try {
    await call(`${api}/v1/tenants`, {
      method: 'POST',
      token: ownerToken,
      body: { name: 'Acme Fire and Safety Ltd (demo)', fullName: 'Olivia Owner' },
    });
    ownerToken = await signIn(users.owner); // refreshed claims
  } catch (e) {
    if (e.status !== 409) throw e;
    console.log('Demo company already exists.');
    return;
  }

  // Invitation tokens are emailed. Locally (trackdesk.email.log-links=true, local profile only) the
  // API logs the accept link so you can open it in the browser.
  for (const [role, email] of [
    ['ops_manager', users.ops],
    ['field_worker', users.worker],
  ]) {
    await call(`${api}/v1/invitations`, { method: 'POST', token: ownerToken, body: { email, role } });
  }
  await call(`${api}/v1/customers`, {
    method: 'POST',
    token: ownerToken,
    body: { name: 'Northside Academy (synthetic)', email: 'fm@northside.example.test' },
  });
  console.log(`Seeded. Sign in at http://localhost:3000 as ${users.owner} / ${PASSWORD}.`);
  console.log('Invitations were created for ops + field worker; accept them via /accept-invite (accept links are printed in the API log with the local profile).');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
