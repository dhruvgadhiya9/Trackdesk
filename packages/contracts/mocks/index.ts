/**
 * Mock data factories typed from the OpenAPI-generated models. SYNTHETIC DATA ONLY: never put
 * real customer data here. Use for Storybook, component tests, Playwright and mobile dev.
 * Every factory output is validated against the generated Zod schemas in test/mocks.test.ts.
 */
import { faker } from '@faker-js/faker';
import type {
  Asset,
  Customer,
  CustomerPage,
  DispatchBoard,
  Job,
  JobStatus,
  Me,
  PageMeta,
  Site,
  Technician,
} from '../src/generated/model';
import { ROLE_PERMISSIONS, type RoleName } from '../src/generated/permissions';

faker.seed(5839);

const UK_CITIES = ['Leeds', 'Manchester', 'Birmingham', 'Bristol', 'Sheffield', 'Nottingham'];
const iso = (d: Date) => d.toISOString();

export function reseed(seed = 5839): void {
  faker.seed(seed);
}

export function buildPageMeta(totalElements: number, page = 0, size = 20): PageMeta {
  return { page, size, totalElements, totalPages: Math.max(1, Math.ceil(totalElements / size)) };
}

export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  const created = faker.date.past({ years: 1 });
  return {
    id: faker.string.uuid(),
    name: `${faker.company.name()} ${faker.helpers.arrayElement(['Academy', 'Retail', 'Offices', 'Housing'])}`,
    accountNumber: `ACC-${faker.string.numeric(5)}`,
    email: faker.internet.email({ provider: 'example.test' }),
    phone: `0113 ${faker.string.numeric(3)} ${faker.string.numeric(4)}`,
    billingAddress: {
      line1: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(UK_CITIES),
      postcode: 'LS1 4AP',
    },
    status: 'active',
    version: 0,
    createdAt: iso(created),
    updatedAt: iso(created),
    ...overrides,
  };
}

export function buildCustomerPage(count = 5, overrides: Partial<Customer> = {}): CustomerPage {
  const items = Array.from({ length: count }, () => buildCustomer(overrides));
  return { items, page: buildPageMeta(count) };
}

export function buildSite(overrides: Partial<Site> = {}): Site {
  return {
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Main Building', 'Block C', 'Sports Hall', 'Warehouse 2']),
    address: {
      line1: faker.location.streetAddress(),
      city: faker.helpers.arrayElement(UK_CITIES),
      postcode: 'M1 1AE',
    },
    location: {
      latitude: 53.4808 + faker.number.float({ min: -0.05, max: 0.05 }),
      longitude: -2.2426 + faker.number.float({ min: -0.05, max: 0.05 }),
    },
    status: 'active',
    version: 0,
    ...overrides,
  };
}

export function buildAsset(overrides: Partial<Asset> = {}): Asset {
  const assetType = faker.helpers.arrayElement([
    'smoke_detector',
    'call_point',
    'emergency_light',
    'exit_sign',
  ] as const);
  return {
    id: faker.string.uuid(),
    siteId: faker.string.uuid(),
    assetType,
    standard: assetType === 'emergency_light' || assetType === 'exit_sign' ? 'BS5266' : 'BS5839',
    manufacturer: faker.helpers.arrayElement(['Apollo', 'Hochiki', 'Eaton', 'Ansell']),
    locationDescription: `Corridor ${faker.number.int({ min: 1, max: 9 })}, level ${faker.number.int({ min: 0, max: 4 })}`,
    status: 'active',
    ...overrides,
  };
}

export function buildJob(overrides: Partial<Job> = {}): Job {
  const start = faker.date.soon({ days: 1 });
  start.setMinutes(0, 0, 0);
  const end = new Date(start.getTime() + 2 * 3600_000);
  return {
    id: faker.string.uuid(),
    reference: `JOB-${faker.string.numeric(6)}`,
    customerId: faker.string.uuid(),
    siteId: faker.string.uuid(),
    siteName: faker.helpers.arrayElement([
      'Northside Academy - Main Building',
      'Oakwood Retail - Unit 4',
    ]),
    jobType: faker.helpers.arrayElement(['service', 'repair', 'inspection'] as const),
    standard: faker.helpers.arrayElement(['BS5839', 'BS5266'] as const),
    status: 'scheduled',
    priority: 'normal',
    title: faker.helpers.arrayElement([
      '6-monthly fire alarm service',
      'Monthly emergency lighting test',
      'Replace failed detector',
    ]),
    scheduledStart: iso(start),
    scheduledEnd: iso(end),
    slaDueAt: iso(new Date(end.getTime() + 24 * 3600_000)),
    version: 0,
    ...overrides,
  };
}

export const ALL_JOB_STATUSES: JobStatus[] = [
  'draft',
  'scheduled',
  'dispatched',
  'en_route',
  'on_site',
  'completed',
  'verified',
  'invoiced',
  'cancelled',
  'overdue',
];

export function buildTechnician(overrides: Partial<Technician> = {}): Technician {
  return {
    id: faker.string.uuid(),
    fullName: faker.person.fullName(),
    skills: faker.helpers.arrayElements(['BS5839', 'BS5266', 'FIA'], { min: 1, max: 3 }),
    ...overrides,
  };
}

export function buildDispatchBoard(technicianCount = 4, unassignedCount = 3): DispatchBoard {
  const technicians = Array.from({ length: technicianCount }, () => buildTechnician());
  const jobs = technicians.map((t) => buildJob({ assignedUserId: t.id, status: 'dispatched' }));
  return {
    date: new Date().toISOString().slice(0, 10),
    technicians,
    jobs,
    unassigned: Array.from({ length: unassignedCount }, () => buildJob({ status: 'scheduled' })),
  };
}

export function buildMe(role: RoleName = 'ops_manager', overrides: Partial<Me> = {}): Me {
  return {
    userId: faker.string.uuid(),
    email: faker.internet.email({ provider: 'example.test' }),
    fullName: faker.person.fullName(),
    tenantId: faker.string.uuid(),
    tenantName: 'Acme Fire and Safety Ltd',
    role,
    permissions: [...ROLE_PERMISSIONS[role]],
    ...overrides,
  };
}
