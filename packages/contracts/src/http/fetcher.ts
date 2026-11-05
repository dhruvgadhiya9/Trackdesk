/**
 * Fetch mutator used by the orval-generated client. Apps configure it once at start-up with
 * `configureApiClient({ baseUrl, getAccessToken })` (Supabase session token).
 * Errors are thrown as ApiError carrying the RFC 9457 Problem Details body.
 */
import type { Problem } from '../generated/model';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => Promise<string | null | undefined> | string | null | undefined;
  fetchImpl?: typeof fetch;
}

let config: ApiClientConfig = { baseUrl: '' };

export function configureApiClient(next: ApiClientConfig): void {
  config = { ...config, ...next };
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: Partial<Problem> | undefined,
  ) {
    super(problem?.detail ?? problem?.title ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

export async function customFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await config.getAccessToken?.();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json, application/problem+json');

  const doFetch = config.fetchImpl ?? fetch;
  const res = await doFetch(`${config.baseUrl}${url}`, { ...options, headers });
  const text = res.status === 204 ? '' : await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(res.status, data);
  return { data, status: res.status, headers: res.headers } as T;
}

type SuccessStatus = 200 | 201 | 202 | 204;

/** Narrow an orval response to its success body. Non-2xx responses already threw ApiError. */
export function unwrap<R extends { status: number; data: unknown }>(
  response: R,
): Extract<R, { status: SuccessStatus }>['data'] {
  return response.data as Extract<R, { status: SuccessStatus }>['data'];
}
