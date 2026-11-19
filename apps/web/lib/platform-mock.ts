/**
 * Synthetic mock data for the Platform Owner (super admin) app, from the `po-*` design boards.
 * Fictional companies/people; domains use example.test and IPs use documentation ranges (RFC 5737).
 */

export const platformUser = { name: "Daniel Carter", role: "Super Admin" };

export type CompanyStatus = "Active" | "Trial" | "Renewal Due" | "Suspended";

export interface Company {
  id: string;
  name: string;
  domain: string;
  code: string;
  industry: "HVAC & Plumbing" | "Electrical & Solar" | "Cleaning & Facilities";
  country: "United States" | "Canada" | "United Kingdom";
  plan: "Starter" | "Pro" | "Enterprise";
  branches: number;
  users: number;
  status: CompanyStatus;
  expiry: string;
  admin: { name: string; email: string };
  created: string;
  storageUsedGb: number;
  storageLimitGb: number;
}
export const companies: Company[] = [
  { id: "cas-001", name: "CoolAir Services", domain: "coolair.example.test", code: "CAS-001", industry: "HVAC & Plumbing", country: "United States", plan: "Enterprise", branches: 6, users: 84, status: "Active", expiry: "31 Dec 2026", admin: { name: "Sarah Mitchell", email: "sarah@coolair.example.test" }, created: "12 Jan 2025", storageUsedGb: 186, storageLimitGb: 250 },
  { id: "sps-014", name: "SunPeak Solar", domain: "sunpeak.example.test", code: "SPS-014", industry: "Electrical & Solar", country: "Canada", plan: "Pro", branches: 3, users: 41, status: "Active", expiry: "14 Feb 2027", admin: { name: "Liam Chen", email: "liam@sunpeak.example.test" }, created: "03 Mar 2025", storageUsedGb: 31, storageLimitGb: 100 },
  { id: "scc-022", name: "Sparkle Clean Co.", domain: "sparkle.example.test", code: "SCC-022", industry: "Cleaning & Facilities", country: "United Kingdom", plan: "Starter", branches: 1, users: 12, status: "Trial", expiry: "03 Dec 2026", admin: { name: "Olivia Brown", email: "olivia@sparkle.example.test" }, created: "19 Nov 2026", storageUsedGb: 2, storageLimitGb: 25 },
  { id: "vee-031", name: "VoltEdge Electric", domain: "voltedge.example.test", code: "VEE-031", industry: "Electrical & Solar", country: "United States", plan: "Pro", branches: 4, users: 56, status: "Active", expiry: "22 Jun 2027", admin: { name: "Ava Wilson", email: "ava@voltedge.example.test" }, created: "21 May 2025", storageUsedGb: 58, storageLimitGb: 100 },
  { id: "afp-040", name: "AquaFlow Plumbing", domain: "aquaflow.example.test", code: "AFP-040", industry: "HVAC & Plumbing", country: "United Kingdom", plan: "Pro", branches: 2, users: 27, status: "Renewal Due", expiry: "28 Nov 2026", admin: { name: "Mia Thompson", email: "mia@aquaflow.example.test" }, created: "08 Aug 2025", storageUsedGb: 22, storageLimitGb: 100 },
  { id: "nsf-052", name: "NorthStar Facilities", domain: "northstar.example.test", code: "NSF-052", industry: "Cleaning & Facilities", country: "Canada", plan: "Enterprise", branches: 9, users: 132, status: "Active", expiry: "09 Sep 2027", admin: { name: "Ethan Roy", email: "ethan@northstar.example.test" }, created: "17 Sep 2024", storageUsedGb: 460, storageLimitGb: 500 },
  { id: "bse-063", name: "BrightSpark Electrical", domain: "brightspark.example.test", code: "BSE-063", industry: "Electrical & Solar", country: "United States", plan: "Starter", branches: 1, users: 8, status: "Suspended", expiry: "01 Oct 2026", admin: { name: "Ryan Hale", email: "ryan@brightspark.example.test" }, created: "02 Feb 2026", storageUsedGb: 4, storageLimitGb: 25 },
];

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  cycles: string;
  userLimit: string;
  storage: string;
  status: "Active" | "Inactive";
  features: string[];
  popular?: boolean;
}
export const plans: Plan[] = [
  { id: "starter", name: "Starter", monthly: 79, annual: 790, cycles: "Monthly, Annual", userLimit: "10", storage: "25 GB", status: "Active", features: ["CRM & Customer Management", "Job Management", "Invoicing", "Mobile App"] },
  { id: "pro", name: "Pro", monthly: 199, annual: 1990, cycles: "Monthly, Annual", userLimit: "50", storage: "100 GB", status: "Active", popular: true, features: ["Everything in Starter", "Scheduling & Smart Dispatch", "Reporting", "Inventory"] },
  { id: "enterprise", name: "Enterprise", monthly: 499, annual: 4990, cycles: "Annual", userLimit: "Unlimited", storage: "250 GB", status: "Active", features: ["Everything in Pro", "API Access", "Multi-branch & multi-country tax", "Priority support"] },
  { id: "legacy", name: "Legacy Basic", monthly: 49, annual: 490, cycles: "Monthly", userLimit: "5", storage: "10 GB", status: "Inactive", features: ["CRM & Customer Management", "Job Management"] },
];
export const planModules = ["CRM", "Customer Management", "Job Management", "Scheduling", "Inventory", "Invoicing", "Reporting", "Mobile App", "API Access"];

export interface Ticket {
  id: string;
  company: string;
  subject: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Pending" | "Escalated" | "Resolved" | "Closed";
  agent: string;
  sla: string;
  created: string;
  description: string;
}
export const platformTickets: Ticket[] = [
  { id: "TCK-2291", company: "VoltEdge Electric", subject: "Invoices not syncing tax for Texas", priority: "High", status: "Escalated", agent: "Ryan Cole", sla: "0h 45m", created: "19 Nov 2026, 09:12", description: "Invoices generated after 18 Nov for Dallas County properties apply 0% tax although the jurisdiction rule is 8.25% (Labor, Material and HVAC taxable)." },
  { id: "TCK-2288", company: "CoolAir Services", subject: "Technician app GPS check-in failing", priority: "High", status: "Open", agent: "Aisha Khan", sla: "2h 10m", created: "19 Nov 2026, 08:40", description: "Technicians cannot check in at job sites; the app reports location unavailable." },
  { id: "TCK-2285", company: "SunPeak Solar", subject: "Need HST rule for New Brunswick", priority: "Medium", status: "Pending", agent: "Leo Martin", sla: "6h 30m", created: "18 Nov 2026, 15:02", description: "Requesting a 15% HST rule for New Brunswick." },
  { id: "TCK-2280", company: "Sparkle Clean Co.", subject: "How to clone a checklist?", priority: "Low", status: "Open", agent: "Aisha Khan", sla: "1d 4h", created: "18 Nov 2026, 11:20", description: "Looking for a way to duplicate an existing checklist." },
  { id: "TCK-2276", company: "AquaFlow Plumbing", subject: "Refund stuck in finance processing", priority: "Medium", status: "Resolved", agent: "Ryan Cole", sla: "—", created: "16 Nov 2026, 10:05", description: "Refund RF-0311 has been in finance processing for 5 days." },
  { id: "TCK-2271", company: "NorthStar Facilities", subject: "Add 20 more user seats", priority: "Low", status: "Closed", agent: "Leo Martin", sla: "—", created: "14 Nov 2026, 13:47", description: "Please increase the user limit by 20 seats." },
];

export interface Agent {
  id: string;
  name: string;
  email: string;
  open: number;
  resolved: number;
  status: "Active" | "On Leave" | "Disabled";
}
export const agents: Agent[] = [
  { id: "ag1", name: "Ryan Cole", email: "ryan.cole@trackdesk.example.test", open: 9, resolved: 412, status: "Active" },
  { id: "ag2", name: "Aisha Khan", email: "aisha.khan@trackdesk.example.test", open: 7, resolved: 388, status: "Active" },
  { id: "ag3", name: "Leo Martin", email: "leo.martin@trackdesk.example.test", open: 5, resolved: 296, status: "Active" },
  { id: "ag4", name: "Chloe Evans", email: "chloe.evans@trackdesk.example.test", open: 0, resolved: 154, status: "On Leave" },
  { id: "ag5", name: "Noah Fischer", email: "noah.fischer@trackdesk.example.test", open: 0, resolved: 61, status: "Disabled" },
];

export interface GdprExport {
  id: string;
  company: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}
export const gdprExports: GdprExport[] = [
  { id: "EXP-0192", company: "AquaFlow Plumbing", requestedBy: "Mia Thompson", date: "18 Nov 2026", status: "Pending" },
  { id: "EXP-0190", company: "Sparkle Clean Co.", requestedBy: "Olivia Brown", date: "15 Nov 2026", status: "Approved" },
  { id: "EXP-0187", company: "CoolAir Services", requestedBy: "Sarah Mitchell", date: "09 Nov 2026", status: "Rejected" },
];
export interface GdprDeletion {
  id: string;
  company: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}
export const gdprDeletions: GdprDeletion[] = [
  { id: "DEL-0044", company: "BrightSpark Electrical", reason: "Customer closed account — erase PII", status: "Pending" },
  { id: "DEL-0041", company: "SunPeak Solar", reason: "Right to erasure (Art. 17) — 1 customer", status: "Approved" },
];
export const consentRecords = [
  { id: "cr1", customer: "Emily Johnson", company: "CoolAir Services", consent: "Marketing + Service", date: "12 Mar 2026", version: "v3.2" },
  { id: "cr2", customer: "Oliver Smith", company: "AquaFlow Plumbing", consent: "Service only", date: "02 Feb 2026", version: "v3.1" },
  { id: "cr3", customer: "Grace Lee", company: "SunPeak Solar", consent: "Marketing + Service", date: "28 Jan 2026", version: "v3.1" },
];

export const sessions = [
  { id: "se1", user: "Sarah Mitchell", company: "CoolAir Services", login: "19 Nov, 09:41", device: "Chrome · macOS", ip: "203.0.113.8" },
  { id: "se2", user: "Marcus Reed", company: "CoolAir Services", login: "19 Nov, 08:02", device: "Edge · Windows", ip: "203.0.113.11" },
  { id: "se3", user: "Liam Chen", company: "SunPeak Solar", login: "19 Nov, 09:38", device: "Safari · iPadOS", ip: "198.51.100.90" },
  { id: "se4", user: "James Carter", company: "CoolAir Services", login: "19 Nov, 07:15", device: "TrackDesk App · Android", ip: "192.0.2.4" },
];
export const auditLog = [
  { id: "al1", date: "19 Nov, 09:44", user: "Sarah Mitchell", company: "CoolAir Services", module: "Tax Master", action: "Edited rule “Dallas County”", ip: "203.0.113.8" },
  { id: "al2", date: "19 Nov, 09:40", user: "Marcus Reed", company: "CoolAir Services", module: "Work Orders", action: "Reassigned JOB-1042", ip: "203.0.113.11" },
  { id: "al3", date: "19 Nov, 09:31", user: "Ryan Cole", company: "TrackDesk Support", module: "Tickets", action: "Escalated TCK-2291", ip: "10.0.4.21" },
  { id: "al4", date: "19 Nov, 09:12", user: "Daniel Carter", company: "TrackDesk", module: "Companies", action: "Suspended BrightSpark Electrical", ip: "10.0.4.2" },
];
export const loginActivity = [
  { id: "la1", company: "CoolAir", user: "Sarah Mitchell", ip: "203.0.113.8", time: "09:41" },
  { id: "la2", company: "SunPeak", user: "Liam Chen", ip: "198.51.100.90", time: "09:38" },
  { id: "la3", company: "VoltEdge", user: "Ava Wilson", ip: "198.51.100.172", time: "09:35" },
  { id: "la4", company: "NorthStar", user: "Ethan Roy", ip: "192.0.2.21", time: "09:30" },
];

export const platformActivities = [
  { id: "pa1", date: "19 Nov, 09:42", activity: "New company registered", company: "Sparkle Clean Co.", user: "Olivia Brown" },
  { id: "pa2", date: "19 Nov, 09:10", activity: "Plan upgraded Starter → Pro", company: "CoolAir Services", user: "Sarah Mitchell" },
  { id: "pa3", date: "19 Nov, 08:55", activity: "Ticket TCK-2291 escalated", company: "VoltEdge Electric", user: "Agent: Ryan Cole" },
  { id: "pa4", date: "18 Nov, 18:30", activity: "Subscription renewed (Annual)", company: "SunPeak Solar", user: "Daniel Carter" },
  { id: "pa5", date: "18 Nov, 16:12", activity: "Data export request submitted", company: "AquaFlow Plumbing", user: "Mia Thompson" },
];

export const companyGrowth = {
  labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  values: [118, 129, 140, 152, 163, 176, 188, 199, 212, 224, 233, 248],
};
export const platformRevenue = {
  labels: ["D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"],
  current: [61, 64, 66, 69, 71, 73, 75, 77, 80, 82, 84, 86],
  previous: [38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60],
};
export const apiCallsPerHour = {
  labels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
  today: [22, 14, 10, 18, 74, 96, 102, 98, 91, 66, 41, 30],
  yesterday: [20, 13, 11, 16, 68, 88, 95, 92, 85, 61, 39, 28],
};
