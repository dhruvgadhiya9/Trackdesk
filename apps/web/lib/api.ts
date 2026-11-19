/**
 * Data access for the Company Owner app.
 * Today every call resolves synthetic data from ./mock after a short delay so screens exercise
 * their loading states. When the backend is ready, replace each function body with the generated
 * API client call — screen code depends only on these signatures.
 */
import * as mock from "./mock";
import * as ops from "./ops-mock";

const LATENCY_MS = 250;

function resolve<T>(data: T): Promise<T> {
  return new Promise((r) => setTimeout(() => r(structuredClone(data)), LATENCY_MS));
}

export const api = {
  branches: () => resolve(mock.branches),
  users: () => resolve(mock.users),
  customers: () => resolve(mock.customers),
  customer: (id: string) => resolve(mock.customers.find((c) => c.id === id) ?? null),
  properties: () => resolve(mock.properties),
  services: () => resolve(mock.services),
  offers: () => resolve(mock.offers),
  taxRules: () => resolve(mock.taxRules),
  checklists: () => resolve(mock.checklists),
  requests: () => resolve(mock.requests),
  jobs: () => resolve(mock.jobs),
  job: (id: string) => resolve(mock.jobs.find((j) => j.id === id) ?? null),
  quotes: () => resolve(mock.quotes),
  invoices: () => resolve(mock.invoices),
  payments: () => resolve(mock.payments),
  refunds: () => resolve(mock.refunds),
  vehicles: () => resolve(mock.vehicles),
  notificationTemplates: () => resolve(mock.notificationTemplates),
  sendHistory: () => resolve(mock.sendHistory),
  tickets: () => resolve(mock.tickets),
  // Operations Manager
  opsRequests: () => resolve(ops.opsRequests),
  opsJobs: () => resolve(ops.opsJobs),
  workOrders: () => resolve(ops.workOrders),
  capacity: () => resolve(ops.capacity),
  dispatchSuggestions: () => resolve(ops.dispatchSuggestions),
  gpsRequests: () => resolve(ops.gpsRequests),
  warrantyRules: () => resolve(ops.warrantyRules),
  attendance: () => resolve(ops.attendance),
  leaveRequests: () => resolve(ops.leaveRequests),
  opsVehicles: () => resolve(ops.opsVehicles),
  branchOffers: () => resolve(ops.branchOffers),
  opsQuotes: () => resolve(ops.opsQuotes),
};
