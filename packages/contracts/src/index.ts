// Public surface of @trackdesk/contracts. Everything under ./generated is produced from
// packages/contracts/openapi/*.yaml and permissions.yaml — run `pnpm contracts:generate`.
export * from './generated/client';
export * from './generated/model';
export * from './generated/permissions';
export { configureApiClient, ApiError, unwrap, type ApiClientConfig } from './http/fetcher';
