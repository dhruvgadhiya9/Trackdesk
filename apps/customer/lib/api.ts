/**
 * Customer-portal data access. Resolves mock data after a short delay so screens exercise loading
 * states; replace bodies with the generated API client (customer-scoped endpoints) later.
 */
import * as mock from "./mock";

const LATENCY_MS = 250;
const resolve = <T,>(data: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(data)), LATENCY_MS));

export const api = {
  properties: () => resolve(mock.properties),
  requests: () => resolve(mock.requests),
  pastJobs: () => resolve(mock.pastJobs),
  quotes: () => resolve(mock.quotes),
  invoices: () => resolve(mock.invoices),
  payments: () => resolve(mock.payments),
  warranties: () => resolve(mock.warranties),
};
