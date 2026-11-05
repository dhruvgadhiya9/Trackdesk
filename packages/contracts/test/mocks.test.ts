import { describe, expect, it } from 'vitest';
import * as z from '../src/generated/zod';
import {
  ALL_JOB_STATUSES,
  buildAsset,
  buildCustomer,
  buildCustomerPage,
  buildDispatchBoard,
  buildJob,
  buildMe,
  buildSite,
} from '../mocks';
import { can, PERMISSIONS, ROLE_PERMISSIONS } from '../src/generated/permissions';

describe('mock factories conform to the OpenAPI contract', () => {
  it('customer', () => expect(() => z.getCustomerResponse.parse(buildCustomer())).not.toThrow());
  it('customer page', () =>
    expect(() => z.listCustomersResponse.parse(buildCustomerPage(3))).not.toThrow());
  it('site', () => expect(() => z.getSiteResponse.parse(buildSite())).not.toThrow());
  it('asset', () => expect(() => z.getAssetResponse.parse(buildAsset())).not.toThrow());
  it.each(ALL_JOB_STATUSES)('job in status %s', (status) =>
    expect(() => z.getJobResponse.parse(buildJob({ status }))).not.toThrow(),
  );
  it('dispatch board', () =>
    expect(() => z.getDispatchBoardResponse.parse(buildDispatchBoard())).not.toThrow());
  it('me', () => expect(() => z.getMeResponse.parse(buildMe('field_worker'))).not.toThrow());
});

describe('permission matrix', () => {
  it('portal_owner never gets tenant data permissions', () => {
    expect(can('portal_owner', PERMISSIONS.CUSTOMERS_READ)).toBe(false);
    expect(can('portal_owner', PERMISSIONS.JOBS_READ)).toBe(false);
  });
  it('field workers cannot create customers or manage users', () => {
    expect(can('field_worker', PERMISSIONS.CUSTOMERS_CREATE)).toBe(false);
    expect(can('field_worker', PERMISSIONS.USERS_MANAGE)).toBe(false);
  });
  it('only field workers report location', () => {
    const reporters = Object.entries(ROLE_PERMISSIONS).filter(([, p]) =>
      p.includes(PERMISSIONS.LOCATION_REPORT),
    );
    expect(reporters.map(([r]) => r)).toEqual(['field_worker']);
  });
  it('fails closed for a missing role', () =>
    expect(can(undefined, PERMISSIONS.CUSTOMERS_READ)).toBe(false));
});
