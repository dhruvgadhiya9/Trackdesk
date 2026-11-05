/**
 * In-browser mock backend for UI development and Playwright (NEXT_PUBLIC_API_MOCKS=1).
 * Scenario via the page URL: ?scenario=empty | error | slow. SYNTHETIC DATA ONLY.
 */
import { buildCustomer, buildCustomerPage, buildMe, reseed } from '@trackdesk/contracts/mocks';
import type { Customer } from '@trackdesk/contracts';

reseed(42);
let customers: Customer[] = buildCustomerPage(8).items;

const json = (status: number, body: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': status >= 400 ? 'application/problem+json' : 'application/json' },
  });

export async function mockFetch(url: string, init?: RequestInit): Promise<Response> {
  const scenario = new URLSearchParams(window.location.search).get('scenario');
  const path = new URL(url, window.location.origin);
  const method = (init?.method ?? 'GET').toUpperCase();

  if (scenario === 'slow') await new Promise((r) => setTimeout(r, 1500));
  if (scenario === 'error') {
    return json(500, {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Mock failure',
      code: 'internal',
    });
  }

  if (path.pathname === '/v1/me') {
    const role = window.location.pathname.startsWith('/owner') ? 'company_owner' : 'ops_manager';
    return json(200, buildMe(role, { tenantName: 'Acme Fire and Safety Ltd' }));
  }

  if (path.pathname === '/v1/customers' && method === 'GET') {
    const search = path.searchParams.get('search')?.toLowerCase() ?? '';
    const items =
      scenario === 'empty' ? [] : customers.filter((c) => c.name.toLowerCase().includes(search));
    return json(200, {
      items,
      page: { page: 0, size: 20, totalElements: items.length, totalPages: 1 },
    });
  }

  if (path.pathname === '/v1/customers' && method === 'POST') {
    const body = JSON.parse(String(init?.body ?? '{}')) as Partial<Customer>;
    if (!body.name?.trim()) {
      return json(400, {
        type: 'about:blank',
        title: 'Bad Request',
        status: 400,
        code: 'validation',
        errors: [{ field: 'name', message: 'must not be blank' }],
      });
    }
    const created = buildCustomer({ ...body, name: body.name, version: 0 });
    customers = [created, ...customers];
    return json(201, created);
  }

  if (path.pathname === '/v1/invitations' && method === 'POST') {
    const body = JSON.parse(String(init?.body ?? '{}')) as { email: string; role: string };
    return json(201, {
      id: crypto.randomUUID(),
      email: body.email,
      role: body.role,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 86400_000).toISOString(),
    });
  }

  return json(501, {
    type: 'about:blank',
    title: 'Not Implemented',
    status: 501,
    code: 'not-implemented',
  });
}
