/**
 * Synthetic mock data for the Customer Portal, transcribed from the `cu-*` design boards.
 * Fictional customer only. Replace with API calls via lib/api.ts when the backend exists.
 */

export const me = {
  firstName: "Emily",
  lastName: "Johnson",
  email: "emily.j@example.test",
  mobile: "(214) 555-0182",
  since: "Mar 2025",
  company: "CoolAir Services",
};

export interface Property {
  id: string;
  name: string;
  type: "Home" | "Office" | "Factory" | "Warehouse";
  category: "Residential" | "Commercial" | "Industrial";
  address: string;
  city: string;
  landmark?: string;
  access?: string;
}
export const properties: Property[] = [
  { id: "main-st", name: "Main St. Home", type: "Home", category: "Residential", address: "2118 Main St", city: "Dallas, TX 75201" },
  { id: "riverside", name: "Riverside Office", type: "Office", category: "Commercial", address: "45 Riverside Dr, Suite 300", city: "Dallas, TX 75201", landmark: "Opposite Riverside Park", access: "Parking P2 · rooftop key at reception" },
  { id: "lake-cabin", name: "Lake Cabin", type: "Home", category: "Residential", address: "9 Shoreline Rd", city: "Rockwall, TX" },
];

export type RequestStage =
  | "Request Submitted"
  | "Reviewed"
  | "Assigned"
  | "Scheduled"
  | "Technician En Route"
  | "Work In Progress"
  | "Completion Pending Verification"
  | "Completed";
export const requestStages: RequestStage[] = [
  "Request Submitted",
  "Reviewed",
  "Assigned",
  "Scheduled",
  "Technician En Route",
  "Work In Progress",
  "Completion Pending Verification",
  "Completed",
];

export interface ServiceRequest {
  id: string;
  job: string;
  service: string;
  propertyId: string;
  priority: "Emergency" | "Regular";
  stage: RequestStage;
  stageTimes: Partial<Record<RequestStage, string>>;
  technician?: { name: string; title: string; phone: string; rating: number };
  scheduled: string;
  eta: "Today" | "Tomorrow" | "Within 2 days";
  updated: string;
  happyCode?: string;
}
export const requests: ServiceRequest[] = [
  {
    id: "REQ-3318", job: "JOB-1048", service: "AC Repair", propertyId: "riverside", priority: "Emergency", stage: "Technician En Route",
    stageTimes: { "Request Submitted": "19 Nov, 09:38", Reviewed: "19 Nov, 09:40", Assigned: "James Carter · 09:41", Scheduled: "Today", "Technician En Route": "Notified 09:42" },
    technician: { name: "James Carter", title: "Senior HVAC Engineer", phone: "(214) 555-0122", rating: 4.9 },
    scheduled: "Thu, 19 Nov 2026", eta: "Today", updated: "19 Nov, 09:42", happyCode: "582471",
  },
  {
    id: "REQ-3290", job: "JOB-1042", service: "AC Repair", propertyId: "main-st", priority: "Regular", stage: "Completed",
    stageTimes: { "Request Submitted": "17 Nov, 14:02", Reviewed: "17 Nov, 14:30", Assigned: "James Carter · 15:10", Scheduled: "19 Nov", "Technician En Route": "08:20", "Work In Progress": "08:55", "Completion Pending Verification": "09:05", Completed: "09:12" },
    technician: { name: "James Carter", title: "Senior HVAC Engineer", phone: "(214) 555-0122", rating: 4.9 },
    scheduled: "Thu, 19 Nov 2026", eta: "Today", updated: "19 Nov, 09:12",
  },
];

export interface PastJob {
  id: string;
  service: string;
  propertyId: string;
  date: string;
  technician: string;
  status: "Completed" | "Closed";
}
export const pastJobs: PastJob[] = [
  { id: "JOB-1042", service: "AC Repair", propertyId: "main-st", date: "19 Nov 2026", technician: "James Carter", status: "Completed" },
  { id: "JOB-0977", service: "AC Servicing", propertyId: "riverside", date: "02 Aug 2026", technician: "James Carter", status: "Closed" },
  { id: "JOB-0811", service: "Water Heater Fix", propertyId: "main-st", date: "14 Apr 2026", technician: "Ava Wilson", status: "Closed" },
  { id: "JOB-0640", service: "Duct Cleaning", propertyId: "riverside", date: "20 Jan 2026", technician: "Mia Brooks", status: "Closed" },
];

export interface QuoteLine {
  item: string;
  qty: string;
  amount: number;
}
export interface Quote {
  id: string;
  service: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Expired";
  date: string;
  version?: string;
  job?: string;
  propertyId?: string;
  validUntil?: string;
  description?: string;
  lines?: QuoteLine[];
  subtotal?: number;
  tax?: number;
  discount?: { code: string; amount: number };
  advancePct?: number;
}
export const quotes: Quote[] = [
  {
    id: "QT-5512", service: "AC Compressor Replacement", amount: 1265.33, status: "Pending", date: "19 Nov 2026", version: "v2", job: "JOB-1048",
    propertyId: "riverside", validUntil: "03 Dec 2026",
    description: "Replace the failed compressor on the rooftop AC unit, re-pipe the suction line and recharge refrigerant. Includes 12-month parts & labour warranty.",
    lines: [
      { item: "AC Compressor (3-ton, R-410A)", qty: "1", amount: 780 },
      { item: "Copper Pipe 3/8″ (ft)", qty: "15", amount: 90 },
      { item: "Labor — Compressor Replacement", qty: "3 h", amount: 285 },
      { item: "Emergency Charges", qty: "1", amount: 75 },
    ],
    subtotal: 1230, tax: 95.33, discount: { code: "WINTER20", amount: 60 }, advancePct: 50,
  },
  { id: "QT-5421", service: "Duct Cleaning", amount: 320, status: "Approved", date: "28 Jul 2026" },
  { id: "QT-5288", service: "Water Heater Replacement", amount: 1890, status: "Rejected", date: "10 Apr 2026" },
  { id: "QT-5104", service: "Smart Thermostat Install", amount: 260, status: "Expired", date: "02 Jan 2026" },
];

export interface Invoice {
  id: string;
  service: string;
  amount: number;
  status: "Unpaid" | "Paid" | "Refunded";
  date: string;
  due?: string;
  terms?: string;
}
export const invoices: Invoice[] = [
  { id: "INV-4489", service: "AC Compressor Replacement", amount: 1265.33, status: "Unpaid", date: "19 Nov 2026", due: "26 Nov 2026", terms: "Partial Advance (50%)" },
  { id: "INV-4471", service: "AC Repair", amount: 420.01, status: "Paid", date: "19 Nov 2026" },
  { id: "INV-4210", service: "Duct Cleaning", amount: 320, status: "Paid", date: "28 Jul 2026" },
  { id: "INV-4012", service: "Smart Thermostat", amount: 260, status: "Refunded", date: "02 Jan 2026" },
];

export interface Payment {
  id: string;
  invoice: string;
  amount: number;
  date: string;
  status: "Paid" | "Refunded";
}
export const payments: Payment[] = [
  { id: "PAY-9921", invoice: "INV-4471", amount: 420.01, date: "19 Nov 2026", status: "Paid" },
  { id: "PAY-9407", invoice: "INV-4210", amount: 320, date: "28 Jul 2026", status: "Paid" },
  { id: "PAY-9102", invoice: "INV-4012", amount: 260, date: "02 Jan 2026", status: "Refunded" },
  { id: "PAY-8871", invoice: "INV-3844", amount: 145, date: "14 Oct 2025", status: "Paid" },
];

export interface Warranty {
  id: string;
  service: string;
  detail: string;
  propertyId: string;
  start: string;
  expiry: string;
  status: "Active" | "Expired";
  coverage: string;
}
export const warranties: Warranty[] = [
  { id: "WAR-0381", service: "AC Repair", detail: "Compressor & capacitor", propertyId: "main-st", start: "19 Nov 2026", expiry: "18 Nov 2027", status: "Active", coverage: "Covers replaced parts and labour for 12 months from service date. Excludes physical damage, power surges and repairs by third parties." },
  { id: "WAR-0302", service: "AC Servicing", detail: "Annual service", propertyId: "riverside", start: "02 Aug 2026", expiry: "01 Feb 2027", status: "Active", coverage: "Covers workmanship for 6 months from service date." },
  { id: "WAR-0211", service: "Water Heater Fix", detail: "Thermostat & element", propertyId: "main-st", start: "14 Apr 2026", expiry: "13 Oct 2026", status: "Expired", coverage: "Covers replaced parts for 6 months from service date." },
];

export interface Notification {
  id: string;
  category: "Requests" | "Quotations" | "Payments" | "Technician";
  title: string;
  meta: string;
  unread: boolean;
  href: string;
}
export const notifications: Notification[] = [
  { id: "n1", category: "Requests", title: "Your request has been assigned.", meta: "REQ-3318 · James Carter will visit Today · 2 min ago", unread: true, href: "/requests/REQ-3318" },
  { id: "n2", category: "Technician", title: "Technician on the way", meta: "James Carter is heading to Riverside Office · 5 min ago", unread: true, href: "/requests/REQ-3318" },
  { id: "n3", category: "Quotations", title: "New quotation received.", meta: "QT-5512 · $1,265.33 · 1 h ago", unread: false, href: "/quotes/QT-5512" },
  { id: "n4", category: "Payments", title: "Invoice INV-4489 is pending.", meta: "Due 26 Nov 2026 · 1 h ago", unread: false, href: "/billing/pay/INV-4489" },
  { id: "n5", category: "Requests", title: "Service completed — share your Happy Code", meta: "JOB-1042 · Main St. Home · Yesterday", unread: false, href: "/requests/REQ-3290" },
  { id: "n6", category: "Requests", title: "Warranty certificate issued", meta: "WAR-0381 · 12 months · Yesterday", unread: false, href: "/warranty/WAR-0381" },
];

export interface ChatThread {
  id: string;
  kind: "Technician" | "Company";
  name: string;
  subtitle: string;
  preview: string;
  unread: boolean;
  messages: { id: number; from: "them" | "me"; text: string; time: string; attachment?: string }[];
}
export const chats: ChatThread[] = [
  {
    id: "c1", kind: "Technician", name: "James Carter", subtitle: "Technician · JOB-1048", preview: "JOB-1048 · On my way!", unread: true,
    messages: [
      { id: 1, from: "them", text: "Hi Emily, I am on my way to Riverside Office. Is the rooftop key at reception?", time: "09:44" },
      { id: 2, from: "me", text: "Yes, ask for Carla at reception. Parking is on P2.", time: "09:46" },
      { id: 3, from: "them", text: "Great, thanks! Sharing my location.", time: "09:47", attachment: "Location · near Commerce St" },
    ],
  },
  {
    id: "c2", kind: "Company", name: "CoolAir Services", subtitle: "Support · Ticket SUP-118", preview: "Support · Ticket SUP-118", unread: false,
    messages: [{ id: 1, from: "them", text: "Thanks for reaching out — your warranty question has been answered by email.", time: "2 d" }],
  },
];

export const propertyById = (id?: string) => properties.find((p) => p.id === id);
export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
