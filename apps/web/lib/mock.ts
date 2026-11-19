/**
 * Synthetic mock data for the Company Owner app, transcribed from the `co-*` design boards.
 * No real people or customers — every name, phone and email here is fictional.
 * Replace with the generated API client once the backend contracts exist (see lib/api.ts).
 */

export type Status =
  | "Active"
  | "Inactive"
  | "Disabled"
  | "Draft"
  | "Expiring"
  | "Expired"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Paid"
  | "Unpaid"
  | "Partial"
  | "Overdue"
  | "Failed"
  | "Delivered"
  | "New"
  | "Reviewed"
  | "Assigned"
  | "Converted"
  | "Open"
  | "In Progress"
  | "On Hold"
  | "Completed"
  | "Closed"
  | "Manager Reviewed"
  | "Refunded"
  | "Escalated"
  | "Resolved";

export const currentUser = { name: "Sarah Mitchell", role: "Admin", company: "CoolAir Services" };

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  manager: string;
  technicians: number;
  activeJobs: number;
  status: Status;
}
export const branches: Branch[] = [
  { id: "b1", name: "Dallas HQ", code: "DAL-01", city: "Dallas, TX", manager: "Marcus Reed", technicians: 16, activeJobs: 12, status: "Active" },
  { id: "b2", name: "Houston North", code: "HOU-02", city: "Houston, TX", manager: "Nina Alvarez", technicians: 10, activeJobs: 7, status: "Active" },
  { id: "b3", name: "Austin Central", code: "AUS-03", city: "Austin, TX", manager: "Tom Becker", technicians: 8, activeJobs: 6, status: "Active" },
  { id: "b4", name: "San Antonio", code: "SAT-04", city: "San Antonio, TX", manager: "Rosa Diaz", technicians: 4, activeJobs: 2, status: "Disabled" },
];

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: "Manager" | "Technician" | "Office Staff";
  designation: string;
  mobile: string;
  email: string;
  status: Status;
  created: string;
}
export const users: User[] = [
  { id: "u1", employeeId: "EMP-1001", name: "Marcus Reed", role: "Manager", designation: "Operations Manager", mobile: "(214) 555-0101", email: "marcus@coolair.example.test", status: "Active", created: "12 Jan 2025" },
  { id: "u2", employeeId: "EMP-1014", name: "James Carter", role: "Technician", designation: "Senior HVAC Engineer", mobile: "(214) 555-0122", email: "james@coolair.example.test", status: "Active", created: "03 Feb 2025" },
  { id: "u3", employeeId: "EMP-1019", name: "Liam Chen", role: "Technician", designation: "Electrician", mobile: "(214) 555-0134", email: "liam@coolair.example.test", status: "Active", created: "21 Mar 2025" },
  { id: "u4", employeeId: "EMP-1023", name: "Ava Wilson", role: "Technician", designation: "Plumber", mobile: "(713) 555-0145", email: "ava@coolair.example.test", status: "Active", created: "02 May 2025" },
  { id: "u5", employeeId: "EMP-1031", name: "Noah Patel", role: "Technician", designation: "Solar Installer", mobile: "(512) 555-0157", email: "noah@coolair.example.test", status: "Inactive", created: "19 Jul 2025" },
  { id: "u6", employeeId: "EMP-1040", name: "Nina Alvarez", role: "Manager", designation: "Branch Manager", mobile: "(713) 555-0168", email: "nina@coolair.example.test", status: "Active", created: "04 Sep 2025" },
];

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  contact: string;
  type: "Individual" | "Business";
  mobile: string;
  address: string;
  properties: number;
  activeJobs: number;
  portal: boolean;
  status: Status;
  since: string;
  lifetimeValue: string;
}
export const customers: Customer[] = [
  { id: "c1", code: "CUS-2041", name: "Emily Johnson", email: "emily.j@example.test", contact: "Emily Johnson", type: "Individual", mobile: "(214) 555-0182", address: "2118 Main St, Dallas, TX 75201", properties: 3, activeJobs: 2, portal: true, status: "Active", since: "Mar 2025", lifetimeValue: "$6,840" },
  { id: "c2", code: "CUS-2038", name: "Riverside Offices LLC", email: "facilities@riverside.example.test", contact: "Mark Hughes", type: "Business", mobile: "(214) 555-0190", address: "800 Commerce St, Dallas, TX 75202", properties: 5, activeJobs: 4, portal: true, status: "Active", since: "Jan 2025", lifetimeValue: "$48,210" },
  { id: "c3", code: "CUS-2032", name: "Oliver Smith", email: "oliver.smith@example.test", contact: "Oliver Smith", type: "Individual", mobile: "(214) 555-0171", address: "14 Oak Lane, Dallas, TX 75204", properties: 1, activeJobs: 0, portal: false, status: "Active", since: "Jun 2025", lifetimeValue: "$2,140" },
  { id: "c4", code: "CUS-2027", name: "Grace Lee", email: "grace.lee@example.test", contact: "Grace Lee", type: "Individual", mobile: "(469) 555-0133", address: "1200 Industrial Blvd, Irving, TX 75061", properties: 2, activeJobs: 1, portal: true, status: "Active", since: "Feb 2025", lifetimeValue: "$19,870" },
  { id: "c5", code: "CUS-2019", name: "Metro Warehousing Inc.", email: "ops@metrowh.example.test", contact: "Daniel Kim", type: "Business", mobile: "(817) 555-0118", address: "77 Logistics Pkwy, Fort Worth, TX 76177", properties: 4, activeJobs: 0, portal: false, status: "Disabled", since: "Nov 2024", lifetimeValue: "$31,400" },
  { id: "c6", code: "CUS-2011", name: "Sophia Martinez", email: "sophia.m@example.test", contact: "Sophia Martinez", type: "Individual", mobile: "(972) 555-0164", address: "310 Lake Ave, Plano, TX 75074", properties: 1, activeJobs: 1, portal: true, status: "Active", since: "Oct 2024", lifetimeValue: "$1,960" },
];

export interface Property {
  id: string;
  name: string;
  customer: string;
  type: "Home" | "Office" | "Factory" | "Warehouse";
  address: string;
  activeJobs: number;
}
export const properties: Property[] = [
  { id: "p1", name: "Main St. Home", customer: "Emily Johnson", type: "Home", address: "2118 Main St, Dallas, TX", activeJobs: 1 },
  { id: "p2", name: "Riverside Office", customer: "Emily Johnson", type: "Office", address: "45 Riverside Dr, Dallas, TX", activeJobs: 1 },
  { id: "p3", name: "HQ Tower", customer: "Riverside Offices LLC", type: "Office", address: "800 Commerce St, Dallas, TX", activeJobs: 3 },
  { id: "p4", name: "Warehouse 2", customer: "Metro Warehousing Inc.", type: "Warehouse", address: "1200 Industrial Blvd, Irving, TX", activeJobs: 0 },
  { id: "p5", name: "Plant A", customer: "Metro Warehousing Inc.", type: "Factory", address: "77 Logistics Pkwy, Fort Worth, TX", activeJobs: 1 },
  { id: "p6", name: "Lakeview Condo", customer: "Sophia Martinez", type: "Home", address: "310 Lake Ave, Plano, TX", activeJobs: 1 },
];

export interface Service {
  id: string;
  name: string;
  category: "HVAC" | "Plumbing" | "Electrical" | "Solar" | "Cleaning" | "Facilities";
  basePrice: string;
  emergencyPrice: string;
  quotationRequired: boolean;
  status: Status;
}
export const services: Service[] = [
  { id: "s1", name: "AC Repair", category: "HVAC", basePrice: "$120.00", emergencyPrice: "$195.00", quotationRequired: false, status: "Active" },
  { id: "s2", name: "AC Installation", category: "HVAC", basePrice: "Quote", emergencyPrice: "Quote", quotationRequired: true, status: "Active" },
  { id: "s3", name: "AC Servicing", category: "HVAC", basePrice: "$89.00", emergencyPrice: "$149.00", quotationRequired: false, status: "Active" },
  { id: "s4", name: "Leak Detection & Repair", category: "Plumbing", basePrice: "$95.00", emergencyPrice: "$170.00", quotationRequired: false, status: "Active" },
  { id: "s5", name: "Panel Upgrade", category: "Electrical", basePrice: "Quote", emergencyPrice: "Quote", quotationRequired: true, status: "Active" },
  { id: "s6", name: "Solar Panel Installation", category: "Solar", basePrice: "Quote", emergencyPrice: "—", quotationRequired: true, status: "Active" },
  { id: "s7", name: "Deep Office Cleaning", category: "Cleaning", basePrice: "$240.00", emergencyPrice: "$320.00", quotationRequired: false, status: "Inactive" },
];

export interface Offer {
  id: string;
  name: string;
  code: string;
  type: string;
  validity: string;
  branches: string;
  status: Status;
}
export const offers: Offer[] = [
  { id: "o1", name: "Winter AC Tune-up", code: "WINTER20", type: "Percentage — 20%", validity: "01 Nov – 31 Dec 2026", branches: "All", status: "Active" },
  { id: "o2", name: "Free Inspection Week", code: "—", type: "Free Inspection", validity: "18 – 25 Nov 2026", branches: "Dallas HQ", status: "Active" },
  { id: "o3", name: "$50 Off Plumbing", code: "PLUMB50", type: "Flat — $50", validity: "01 Oct – 30 Nov 2026", branches: "All", status: "Expiring" },
  { id: "o4", name: "Solar + Cleaning Bundle", code: "SUNCLEAN", type: "Bundle Offer", validity: "01 Jan – 31 Mar 2027", branches: "Austin Central", status: "Draft" },
  { id: "o5", name: "First Service Free", code: "WELCOME", type: "Free Service", validity: "01 Jan – 31 Aug 2026", branches: "All", status: "Expired" },
];

export interface TaxRule {
  id: string;
  country: "USA" | "UK" | "Canada";
  region: string;
  taxType: string;
  appliesTo: string;
  rate: string;
  effective: string;
}
export const taxRules: TaxRule[] = [
  { id: "t1", country: "USA", region: "Texas › Dallas County", taxType: "Sales Tax", appliesTo: "Labor, Material, HVAC", rate: "8.25%", effective: "01 Nov 2026" },
  { id: "t2", country: "USA", region: "Texas › Harris County", taxType: "Sales Tax", appliesTo: "Material, HVAC", rate: "8.25%", effective: "01 Jan 2026" },
  { id: "t3", country: "USA", region: "Texas › Travis County", taxType: "Sales Tax", appliesTo: "Material", rate: "8.25%", effective: "01 Jan 2026" },
  { id: "t4", country: "UK", region: "National", taxType: "Standard VAT", appliesTo: "All services", rate: "20%", effective: "04 Jan 2011" },
  { id: "t5", country: "UK", region: "National", taxType: "Reduced VAT", appliesTo: "Energy-saving (Solar)", rate: "5%", effective: "01 Apr 2022" },
  { id: "t6", country: "Canada", region: "Ontario", taxType: "HST", appliesTo: "Labor, Material, HVAC", rate: "13%", effective: "01 Jul 2010" },
  { id: "t7", country: "Canada", region: "Quebec", taxType: "GST + QST", appliesTo: "Electrical", rate: "14.975%", effective: "01 Jan 2013" },
  { id: "t8", country: "Canada", region: "British Columbia", taxType: "GST + PST", appliesTo: "Material", rate: "12%", effective: "01 Apr 2013" },
];

export interface ChecklistItem {
  label: string;
  input: string;
  required: boolean;
}
export interface Checklist {
  id: string;
  name: string;
  category: string;
  type: "Service" | "Quotation";
  servicesMapped: number;
  autoAssigned: string;
  items: ChecklistItem[];
}
export const checklists: Checklist[] = [
  {
    id: "cl1", name: "HVAC — Repair Checklist", category: "HVAC", type: "Service", servicesMapped: 2, autoAssigned: "AC Repair, AC Servicing",
    items: [
      { label: "Gas Pressure", input: "Number · psi", required: true },
      { label: "Compressor Check", input: "Pass / Fail", required: true },
      { label: "Filter Condition", input: "Photo required", required: false },
      { label: "Thermostat Calibration", input: "Yes / No", required: false },
      { label: "Customer Notes", input: "Text", required: false },
    ],
  },
  { id: "cl2", name: "HVAC Installation Assessment", category: "HVAC", type: "Quotation", servicesMapped: 1, autoAssigned: "AC Installation", items: [{ label: "Room dimensions", input: "Number · sq ft", required: true }, { label: "Existing unit photo", input: "Photo required", required: true }] },
  { id: "cl3", name: "Electrical Safety", category: "Electrical", type: "Service", servicesMapped: 3, autoAssigned: "Panel Upgrade, Wiring, Lighting", items: [{ label: "Voltage test", input: "Number · V", required: true }, { label: "Earthing test", input: "Pass / Fail", required: true }] },
  { id: "cl4", name: "Electrical Repair Assessment", category: "Electrical", type: "Quotation", servicesMapped: 2, autoAssigned: "Panel Upgrade, Wiring", items: [{ label: "Fault description", input: "Text", required: true }] },
  { id: "cl5", name: "Solar Installation Assessment", category: "Solar", type: "Quotation", servicesMapped: 1, autoAssigned: "Solar Panel Installation", items: [{ label: "Roof orientation", input: "Text", required: true }, { label: "Roof photo", input: "Photo required", required: true }] },
  { id: "cl6", name: "Office Cleaning", category: "Cleaning", type: "Service", servicesMapped: 4, autoAssigned: "Deep Office Cleaning", items: [{ label: "Areas completed", input: "Text", required: true }] },
];

export interface ServiceRequest {
  id: string;
  number: string;
  customer: string;
  property: string;
  service: string;
  priority: "Emergency" | "Regular";
  status: Status;
  created: string;
}
export const requests: ServiceRequest[] = [
  { id: "r1", number: "REQ-3318", customer: "Emily Johnson", property: "Riverside Office", service: "AC Repair", priority: "Emergency", status: "New", created: "19 Nov, 09:38" },
  { id: "r2", number: "REQ-3317", customer: "Grace Lee", property: "Warehouse 2", service: "Solar Inspection", priority: "Regular", status: "Reviewed", created: "19 Nov, 08:51" },
  { id: "r3", number: "REQ-3316", customer: "Riverside Offices LLC", property: "HQ Tower", service: "HVAC + Electrical", priority: "Regular", status: "Assigned", created: "19 Nov, 08:10" },
  { id: "r4", number: "REQ-3315", customer: "Oliver Smith", property: "Oak Lane Home", service: "Leak Detection", priority: "Emergency", status: "Assigned", created: "18 Nov, 21:47" },
  { id: "r5", number: "REQ-3312", customer: "Sophia Martinez", property: "Lakeview Condo", service: "“Breaker keeps tripping”", priority: "Regular", status: "New", created: "18 Nov, 17:05" },
  { id: "r6", number: "REQ-3309", customer: "Metro Warehousing Inc.", property: "Plant A", service: "Deep Cleaning", priority: "Regular", status: "Converted", created: "18 Nov, 11:20" },
];

export interface Job {
  id: string;
  number: string;
  customer: string;
  property: string;
  service: string;
  technician: string | null;
  priority: "Emergency" | "Regular";
  status: Status;
  scheduled: string;
}
export const jobs: Job[] = [
  { id: "JOB-1048", number: "JOB-1048", customer: "Emily Johnson", property: "Riverside Office", service: "AC Repair", technician: "James Carter", priority: "Emergency", status: "Assigned", scheduled: "20 Nov" },
  { id: "JOB-1047", number: "JOB-1047", customer: "Riverside Offices LLC", property: "HQ Tower", service: "HVAC + Electrical", technician: "Liam Chen", priority: "Regular", status: "In Progress", scheduled: "19 Nov" },
  { id: "JOB-1046", number: "JOB-1046", customer: "Oliver Smith", property: "Oak Lane Home", service: "Leak Detection", technician: "Ava Wilson", priority: "Emergency", status: "In Progress", scheduled: "19 Nov" },
  { id: "JOB-1045", number: "JOB-1045", customer: "Grace Lee", property: "Warehouse 2", service: "Solar Inspection", technician: "Noah Patel", priority: "Regular", status: "On Hold", scheduled: "19 Nov" },
  { id: "JOB-1044", number: "JOB-1044", customer: "Metro Warehousing Inc.", property: "Plant A", service: "Deep Cleaning", technician: null, priority: "Regular", status: "Open", scheduled: "21 Nov" },
  { id: "JOB-1042", number: "JOB-1042", customer: "Emily Johnson", property: "Main St. Home", service: "AC Repair", technician: "James Carter", priority: "Regular", status: "Completed", scheduled: "19 Nov" },
];

export interface Quote {
  id: string;
  number: string;
  customer: string;
  job: string;
  amount: string;
  version: string;
  status: Status;
}
export const quotes: Quote[] = [
  { id: "q1", number: "QT-5512", customer: "Emily Johnson", job: "JOB-1048", amount: "$1,180.00", version: "v2", status: "Pending" },
  { id: "q2", number: "QT-5509", customer: "Riverside Offices LLC", job: "JOB-1047", amount: "$3,460.00", version: "v1", status: "Approved" },
  { id: "q3", number: "QT-5503", customer: "Grace Lee", job: "JOB-1045", amount: "$14,900.00", version: "v3", status: "Pending" },
  { id: "q4", number: "QT-5498", customer: "Oliver Smith", job: "JOB-1031", amount: "$640.00", version: "v1", status: "Rejected" },
  { id: "q5", number: "QT-5490", customer: "Sophia Martinez", job: "JOB-1029", amount: "$285.00", version: "v1", status: "Expired" },
];

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  job: string;
  subtotal: string;
  tax: string;
  amount: string;
  status: Status;
}
export const invoices: Invoice[] = [
  { id: "i1", number: "INV-4471", customer: "Emily Johnson", job: "JOB-1042", subtotal: "$388.00", tax: "$32.01", amount: "$420.01", status: "Paid" },
  { id: "i2", number: "INV-4470", customer: "Riverside Offices LLC", job: "JOB-1039", subtotal: "$2,980.00", tax: "$245.85", amount: "$3,225.85", status: "Unpaid" },
  { id: "i3", number: "INV-4468", customer: "Oliver Smith", job: "JOB-1036", subtotal: "$1,145.00", tax: "$94.46", amount: "$1,239.46", status: "Paid" },
  { id: "i4", number: "INV-4466", customer: "Grace Lee", job: "JOB-1030", subtotal: "$4,500.00", tax: "$371.25", amount: "$4,871.25", status: "Partial" },
  { id: "i5", number: "INV-4459", customer: "Sophia Martinez", job: "JOB-1022", subtotal: "$260.00", tax: "$21.45", amount: "$281.45", status: "Overdue" },
];

export interface Payment {
  id: string;
  number: string;
  customer: string;
  invoice: string;
  amount: string;
  method: string;
  terms: string;
  date: string;
  status: Status;
}
export const payments: Payment[] = [
  { id: "pay1", number: "PAY-9921", customer: "Emily Johnson", invoice: "INV-4471", amount: "$420.01", method: "Stripe · Visa •• 4242", terms: "Post Service", date: "19 Nov", status: "Paid" },
  { id: "pay2", number: "PAY-9918", customer: "Oliver Smith", invoice: "INV-4468", amount: "$1,239.46", method: "Stripe · ACH", terms: "Post Service", date: "19 Nov", status: "Paid" },
  { id: "pay3", number: "PAY-9910", customer: "Grace Lee", invoice: "INV-4466", amount: "$2,435.63", method: "Stripe · Mastercard", terms: "Partial Advance", date: "17 Nov", status: "Partial" },
  { id: "pay4", number: "PAY-9904", customer: "Riverside Offices LLC", invoice: "QT-5509", amount: "$3,460.00", method: "Bank Transfer", terms: "Full Advance", date: "16 Nov", status: "Paid" },
  { id: "pay5", number: "PAY-9899", customer: "Sophia Martinez", invoice: "INV-4459", amount: "$281.45", method: "Stripe · Visa", terms: "Post Service", date: "15 Nov", status: "Failed" },
];

export interface Refund {
  id: string;
  number: string;
  invoice: string;
  customer: string;
  amount: string;
  reason: string;
  status: Status;
}
export const refunds: Refund[] = [
  { id: "rf1", number: "RF-0318", invoice: "INV-4459", customer: "Sophia Martinez", amount: "$281.45", reason: "Duplicate charge", status: "Pending" },
  { id: "rf2", number: "RF-0316", invoice: "INV-4402", customer: "Daniel Kim", amount: "$120.00", reason: "Service cancelled", status: "Manager Reviewed" },
  { id: "rf3", number: "RF-0311", invoice: "INV-4377", customer: "Grace Lee", amount: "$75.00", reason: "Emergency fee waived", status: "Refunded" },
  { id: "rf4", number: "RF-0305", invoice: "INV-4351", customer: "Mark Hughes", amount: "$540.00", reason: "Customer dispute", status: "Rejected" },
];

export interface Vehicle {
  id: string;
  number: string;
  type: string;
  branch: string;
  assignedTo: string;
  insuranceExpiry: string;
  serviceDue: string;
  distance: string;
}
export const vehicles: Vehicle[] = [
  { id: "v1", number: "TX 4KL-2291", type: "Ford Transit Van", branch: "Dallas HQ", assignedTo: "James Carter", insuranceExpiry: "12 Mar 2027", serviceDue: "04 Dec 2026", distance: "1,284 mi" },
  { id: "v2", number: "TX 7PQ-1180", type: "Ram ProMaster", branch: "Dallas HQ", assignedTo: "Liam Chen", insuranceExpiry: "28 Nov 2026", serviceDue: "15 Jan 2027", distance: "962 mi" },
  { id: "v3", number: "TX 2MN-8842", type: "Chevy Express", branch: "Houston North", assignedTo: "Team · Plumbing A", insuranceExpiry: "09 Jun 2027", serviceDue: "22 Nov 2026", distance: "1,540 mi" },
  { id: "v4", number: "TX 9RS-3307", type: "Ford F-150", branch: "Austin Central", assignedTo: "Noah Patel", insuranceExpiry: "17 Feb 2027", serviceDue: "30 Mar 2027", distance: "688 mi" },
];

export interface NotificationTemplate {
  id: string;
  channel: "SMS" | "Email" | "Push";
  name: string;
  body: string;
}
export const notificationTemplates: NotificationTemplate[] = [
  { id: "nt1", channel: "SMS", name: "Technician Assigned", body: "Hi {name}, {technician} is assigned to your {service} on {date}." },
  { id: "nt2", channel: "SMS", name: "Technician On The Way", body: "{technician} is on the way to {property}. ETA: {eta}." },
  { id: "nt3", channel: "SMS", name: "Service Completed", body: "Your {service} is complete. Share Happy Code {code} only if satisfied." },
  { id: "nt4", channel: "SMS", name: "Payment Due", body: "Invoice {invoice} of {amount} is due on {due_date}. Pay securely: {link}" },
  { id: "nt5", channel: "Email", name: "Quotation Ready", body: "Hi {name}, your quotation {quote} for {service} is ready to review." },
  { id: "nt6", channel: "Push", name: "New Job Assigned", body: "New {priority} job {job} at {property}." },
];

export interface SendLog {
  id: string;
  sent: string;
  to: string;
  template: string;
  status: Status;
}
export const sendHistory: SendLog[] = [
  { id: "sh1", sent: "09:41", to: "(214) 555-0182", template: "Technician Assigned", status: "Delivered" },
  { id: "sh2", sent: "09:12", to: "(713) 555-0145", template: "On The Way", status: "Delivered" },
  { id: "sh3", sent: "08:55", to: "(512) 555-0110", template: "Payment Due", status: "Failed" },
  { id: "sh4", sent: "08:20", to: "(214) 555-0122", template: "Service Completed", status: "Delivered" },
];

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  priority: "High" | "Medium" | "Low";
  status: Status;
  updated: string;
}
export const tickets: Ticket[] = [
  { id: "tk1", number: "TCK-2291", subject: "Invoices not syncing tax for Texas", priority: "High", status: "Escalated", updated: "09:31" },
  { id: "tk2", number: "TCK-2203", subject: "Add HST rule for New Brunswick", priority: "Medium", status: "Resolved", updated: "12 Nov" },
  { id: "tk3", number: "TCK-2177", subject: "Bulk import customers from CSV", priority: "Low", status: "Closed", updated: "02 Nov" },
];

export const recentActivities = [
  { id: "a1", title: "New request REQ-3318 · AC not cooling", meta: "Emily Johnson · Riverside Office · 4 min ago", tag: "Emergency" as const },
  { id: "a2", title: "JOB-1042 completed · Happy Code verified", meta: "James Carter · Main St. Home · 22 min ago", tag: "Completed" as const },
  { id: "a3", title: "Payment received · INV-4468 · $1,240.00", meta: "Stripe · Oliver Smith · 41 min ago", tag: "Paid" as const },
  { id: "a4", title: "New request REQ-3317 · Solar panel inspection", meta: "Grace Lee · Warehouse 2 · 1 h ago", tag: "Regular" as const },
];

/** Monthly revenue in $k for the dashboard chart (Dec → Nov). */
export const revenueTrend = {
  labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  current: [82, 88, 91, 97, 102, 99, 108, 112, 115, 119, 124, 128],
  previous: [70, 72, 78, 80, 84, 86, 88, 90, 94, 96, 99, 104],
};

export const jobStatusDistribution = [
  { label: "Open", value: 9 },
  { label: "Assigned", value: 12 },
  { label: "In Progress", value: 15 },
  { label: "Hold", value: 4 },
  { label: "Completed", value: 38 },
];

export const staffAvailability = [
  { label: "Available", value: 21 },
  { label: "Busy", value: 17 },
  { label: "Leave", value: 8 },
];

export const permissionModules = ["Customer", "Service Request", "Work Order", "Quotation", "Invoice", "Reports"] as const;
export const permissionActions = ["View", "Create", "Edit", "Delete", "Approve"] as const;
export const permissionRoles = ["Manager", "Technician", "Office Staff"] as const;
