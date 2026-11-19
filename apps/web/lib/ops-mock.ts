/**
 * Synthetic mock data for the Operations Manager app, transcribed from the `om-*` design boards.
 * Fictional people and places only. Replace with API calls via lib/api.ts when the backend exists.
 */

export const opsUser = { name: "Marcus Reed", branch: "Dallas HQ" };

export type Load = "Available" | "Moderate" | "Overloaded";

export interface Technician {
  id: string;
  name: string;
  skill: string;
  rating?: number;
}
export const technicians: Technician[] = [
  { id: "t1", name: "James Carter", skill: "Senior HVAC", rating: 4.9 },
  { id: "t2", name: "Liam Chen", skill: "Electrician", rating: 4.8 },
  { id: "t3", name: "Ava Wilson", skill: "Plumber", rating: 4.7 },
  { id: "t4", name: "Noah Patel", skill: "Solar Installer", rating: 4.6 },
  { id: "t5", name: "Mia Brooks", skill: "HVAC Tech", rating: 4.8 },
  { id: "t6", name: "Ethan Ross", skill: "HVAC + Electrical", rating: 4.5 },
];

export interface OpsRequest {
  id: string;
  number: string;
  customer: string;
  phone: string;
  property: string;
  service: string;
  classified: boolean;
  priority: "Emergency" | "High" | "Medium" | "Low";
  branch: string;
  status: "New" | "Reviewed" | "Assigned" | "Converted";
  created: string;
  source: string;
  description: string;
}
export const opsRequests: OpsRequest[] = [
  { id: "REQ-3318", number: "REQ-3318", customer: "Emily Johnson", phone: "(214) 555-0182", property: "Riverside Office", service: "AC Repair", classified: true, priority: "Emergency", branch: "Dallas HQ", status: "New", created: "09:38", source: "Customer Portal", description: "AC not cooling in the main office since this morning." },
  { id: "REQ-3316", number: "REQ-3316", customer: "Riverside Offices LLC", phone: "(214) 555-0190", property: "HQ Tower", service: "HVAC + Electrical", classified: true, priority: "High", branch: "Dallas HQ", status: "Assigned", created: "08:10", source: "Staff", description: "Rooftop unit servicing plus wiring check on panel B." },
  { id: "REQ-3314", number: "REQ-3314", customer: "Lucas Wright", phone: "(214) 555-0199", property: "Elm St. Home", service: "“Noisy AC”", classified: false, priority: "Medium", branch: "Dallas HQ", status: "New", created: "07:52", source: "Customer Portal — Problem Description", description: "My AC is making noise and not cooling. It started yesterday evening, the outdoor unit rattles loudly." },
  { id: "REQ-3312", number: "REQ-3312", customer: "Sophia Martinez", phone: "(972) 555-0164", property: "Lakeview Condo", service: "Breaker Trips", classified: true, priority: "Low", branch: "Dallas HQ", status: "Reviewed", created: "Yesterday", source: "QR Code", description: "Kitchen breaker keeps tripping when the oven is on." },
  { id: "REQ-3310", number: "REQ-3310", customer: "Harper Young", phone: "(214) 555-0177", property: "Cedar Office", service: "Deep Cleaning", classified: true, priority: "Low", branch: "Dallas HQ", status: "Converted", created: "Yesterday", source: "Voice", description: "Quarterly deep clean of the office floor." },
];

export type HappyCodeStatus = "Not Generated" | "Generated" | "Verified" | "Override Approved" | "Expired";

export interface OpsJob {
  id: string;
  number: string;
  customer: string;
  phone: string;
  property: string;
  service: string;
  priority: "Emergency" | "Regular";
  technician: string;
  scheduled: string;
  status: "Assigned" | "In Progress" | "Pending Verification" | "Completed" | "On Hold";
  happyCode: HappyCodeStatus;
  verifiedAt?: string;
  verifyMethod?: string;
}
export const opsJobs: OpsJob[] = [
  { id: "JOB-1048", number: "JOB-1048", customer: "Emily Johnson", phone: "(214) 555-0182", property: "Riverside Office", service: "AC Repair", priority: "Emergency", technician: "James Carter", scheduled: "20 Nov", status: "Assigned", happyCode: "Not Generated" },
  { id: "JOB-1047", number: "JOB-1047", customer: "Riverside Offices LLC", phone: "(214) 555-0190", property: "HQ Tower", service: "HVAC + Electrical", priority: "Regular", technician: "Liam Chen", scheduled: "19 Nov", status: "In Progress", happyCode: "Not Generated" },
  { id: "JOB-1046", number: "JOB-1046", customer: "Oliver Smith", phone: "(469) 555-0133", property: "Oak Lane Home", service: "Leak Detection", priority: "Emergency", technician: "Ava Wilson", scheduled: "19 Nov", status: "Pending Verification", happyCode: "Generated" },
  { id: "JOB-1042", number: "JOB-1042", customer: "Emily Johnson", phone: "(214) 555-0182", property: "Main St. Home", service: "AC Repair", priority: "Regular", technician: "James Carter", scheduled: "19 Nov", status: "Completed", happyCode: "Verified", verifiedAt: "19 Nov, 09:12", verifyMethod: "Happy Code" },
  { id: "JOB-1038", number: "JOB-1038", customer: "Harper Young", phone: "(214) 555-0177", property: "Cedar Office", service: "Deep Cleaning", priority: "Regular", technician: "Mia Brooks", scheduled: "18 Nov", status: "Completed", happyCode: "Override Approved", verifiedAt: "18 Nov, 17:40", verifyMethod: "Manager Override" },
  { id: "JOB-1035", number: "JOB-1035", customer: "Lucas Wright", phone: "(214) 555-0199", property: "Elm St. Home", service: "AC Servicing", priority: "Regular", technician: "Ethan Ross", scheduled: "17 Nov", status: "Pending Verification", happyCode: "Expired" },
];

export interface WorkOrder {
  id: string;
  number: string;
  customer: string;
  service: string;
  technician: string;
  status: "Assigned" | "In Progress" | "Pending Verification" | "On Hold" | "Closed";
  updated: string;
}
export const workOrders: WorkOrder[] = [
  { id: "WO-2210", number: "WO-2210", customer: "Emily Johnson", service: "AC Repair", technician: "James Carter", status: "Assigned", updated: "09:40" },
  { id: "WO-2209", number: "WO-2209", customer: "Riverside Offices", service: "HVAC + Electrical", technician: "Liam Chen", status: "In Progress", updated: "10:05" },
  { id: "WO-2208", number: "WO-2208", customer: "Oliver Smith", service: "Leak Detection", technician: "Ava Wilson", status: "Pending Verification", updated: "10:44" },
  { id: "WO-2205", number: "WO-2205", customer: "Grace Lee", service: "Solar Inspection", technician: "Noah Patel", status: "On Hold", updated: "08:10" },
  { id: "WO-2201", number: "WO-2201", customer: "Harper Young", service: "Deep Cleaning", technician: "Mia Brooks", status: "Closed", updated: "Yesterday" },
];

export interface CapacityRow {
  id: string;
  technician: string;
  assigned: number;
  completed: number;
  capacity: number;
  availableHours: string;
  load: Load;
}
export const capacity: CapacityRow[] = [
  { id: "c1", technician: "Ethan Ross", assigned: 6, completed: 3, capacity: 100, availableHours: "0 h", load: "Overloaded" },
  { id: "c2", technician: "James Carter", assigned: 5, completed: 3, capacity: 83, availableHours: "1.5 h", load: "Moderate" },
  { id: "c3", technician: "Liam Chen", assigned: 4, completed: 2, capacity: 67, availableHours: "3 h", load: "Moderate" },
  { id: "c4", technician: "Ava Wilson", assigned: 3, completed: 2, capacity: 50, availableHours: "4 h", load: "Available" },
  { id: "c5", technician: "Mia Brooks", assigned: 2, completed: 1, capacity: 33, availableHours: "5.5 h", load: "Available" },
  { id: "c6", technician: "Noah Patel", assigned: 1, completed: 0, capacity: 17, availableHours: "6.5 h", load: "Available" },
];

export interface ScheduleItem {
  id: string;
  job: string;
  service: string;
  technician: string;
  day: number; // 0 = Mon … 6 = Sun
  time: string;
}
export const weekDays = ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20", "Sat 21", "Sun 22"];
export const schedule: ScheduleItem[] = [
  { id: "s1", job: "JOB-1021", service: "AC Servicing", technician: "James Carter", day: 0, time: "09:00 – 11:00" },
  { id: "s2", job: "JOB-1033", service: "Duct Clean", technician: "James Carter", day: 1, time: "09:00 – 11:00" },
  { id: "s3", job: "JOB-1042", service: "AC Repair", technician: "James Carter", day: 3, time: "09:00 – 11:00" },
  { id: "s4", job: "JOB-1048", service: "AC Repair", technician: "James Carter", day: 4, time: "09:00 – 11:00" },
  { id: "s5", job: "JOB-1025", service: "Rewire", technician: "Liam Chen", day: 0, time: "09:00 – 11:00" },
  { id: "s6", job: "JOB-1047", service: "HVAC+Elec", technician: "Liam Chen", day: 3, time: "09:00 – 11:00" },
  { id: "s7", job: "JOB-1050", service: "Panel", technician: "Liam Chen", day: 5, time: "09:00 – 11:00" },
  { id: "s8", job: "JOB-1019", service: "Leak", technician: "Ava Wilson", day: 1, time: "09:00 – 11:00" },
  { id: "s9", job: "JOB-1046", service: "Leak", technician: "Ava Wilson", day: 3, time: "09:00 – 11:00" },
  { id: "s10", job: "JOB-1052", service: "Heater", technician: "Ava Wilson", day: 4, time: "09:00 – 11:00" },
  { id: "s11", job: "JOB-1036", service: "Solar Survey", technician: "Noah Patel", day: 2, time: "09:00 – 11:00" },
  { id: "s12", job: "JOB-1045", service: "On Hold", technician: "Noah Patel", day: 3, time: "09:00 – 11:00" },
  { id: "s13", job: "JOB-1027", service: "AC Servicing", technician: "Mia Brooks", day: 1, time: "09:00 – 11:00" },
  { id: "s14", job: "JOB-1049", service: "Install", technician: "Mia Brooks", day: 4, time: "09:00 – 11:00" },
];

export interface DispatchSuggestion {
  id: string;
  technician: string;
  skill: string;
  match: number;
  branch: string;
  workload: string;
  availability: "Available" | "Busy" | "On Job";
  distance: string;
}
export const dispatchSuggestions: DispatchSuggestion[] = [
  { id: "d1", technician: "James Carter", skill: "Senior HVAC · ★4.9", match: 96, branch: "Dallas HQ", workload: "2 / 6 jobs", availability: "Available", distance: "3.2 mi" },
  { id: "d2", technician: "Mia Brooks", skill: "HVAC Tech · ★4.8", match: 88, branch: "Dallas HQ", workload: "3 / 6 jobs", availability: "Available", distance: "5.8 mi" },
  { id: "d3", technician: "Ethan Ross", skill: "HVAC + Electrical", match: 74, branch: "Dallas HQ", workload: "5 / 6 jobs", availability: "Busy", distance: "2.1 mi" },
  { id: "d4", technician: "Liam Chen", skill: "Electrician", match: 41, branch: "Dallas HQ", workload: "4 / 6 jobs", availability: "On Job", distance: "7.4 mi" },
];

export interface GpsRequest {
  id: string;
  technician: string;
  requested: string;
  status: "Shared" | "Rejected" | "Pending";
  responseTime: string;
  reason: string;
}
export const gpsRequests: GpsRequest[] = [
  { id: "g1", technician: "James Carter", requested: "19 Nov, 09:20", status: "Shared", responseTime: "42 s", reason: "—" },
  { id: "g2", technician: "Ethan Ross", requested: "19 Nov, 09:05", status: "Rejected", responseTime: "1 m 10 s", reason: "Driving — will share at site" },
  { id: "g3", technician: "Ava Wilson", requested: "19 Nov, 08:50", status: "Shared", responseTime: "18 s", reason: "—" },
  { id: "g4", technician: "Liam Chen", requested: "19 Nov, 08:40", status: "Pending", responseTime: "—", reason: "—" },
];

export interface WarrantyRule {
  id: string;
  name: string;
  service: string;
  duration: string;
  status: "Active" | "Inactive";
}
export const warrantyRules: WarrantyRule[] = [
  { id: "w1", name: "HVAC Repair Standard", service: "AC Repair", duration: "12 months", status: "Active" },
  { id: "w2", name: "Plumbing Basic", service: "Leak Detection", duration: "6 months", status: "Active" },
  { id: "w3", name: "Solar Install Premium", service: "Solar Installation", duration: "5 years", status: "Active" },
  { id: "w4", name: "Cleaning", service: "Deep Cleaning", duration: "—", status: "Inactive" },
];
export const warrantyApprovals = [
  { id: "wa1", job: "JOB-1046", customer: "Oliver Smith" },
  { id: "wa2", job: "JOB-1038", customer: "Harper Young" },
];

export interface Attendance {
  id: string;
  employeeId: string;
  name: string;
  login: string;
  logout: string;
  location: string;
  status: "Present" | "Late" | "On Leave" | "Review";
}
export const attendance: Attendance[] = [
  { id: "at1", employeeId: "EMP-1014", name: "James Carter", login: "07:58", logout: "—", location: "Geo-fence: Dallas HQ", status: "Present" },
  { id: "at2", employeeId: "EMP-1019", name: "Liam Chen", login: "08:04", logout: "—", location: "Geo-fence: Dallas HQ", status: "Present" },
  { id: "at3", employeeId: "EMP-1023", name: "Ava Wilson", login: "08:31", logout: "—", location: "Geo-fence: Dallas HQ", status: "Late" },
  { id: "at4", employeeId: "EMP-1031", name: "Noah Patel", login: "—", logout: "—", location: "—", status: "On Leave" },
  { id: "at5", employeeId: "EMP-1044", name: "Ethan Ross", login: "07:45", logout: "—", location: "Outside geo-fence", status: "Review" },
];

export interface LeaveRequest {
  id: string;
  employee: string;
  type: "Sick" | "Annual" | "Personal";
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
}
export const leaveRequests: LeaveRequest[] = [
  { id: "l1", employee: "Noah Patel", type: "Sick", from: "19 Nov", to: "20 Nov", status: "Pending" },
  { id: "l2", employee: "Mia Brooks", type: "Annual", from: "24 Dec", to: "31 Dec", status: "Pending" },
  { id: "l3", employee: "Liam Chen", type: "Personal", from: "27 Nov", to: "27 Nov", status: "Pending" },
];

export const productivity = [
  { id: "pr1", technician: "James Carter", assigned: 66, completed: 62, pending: 4, overdue: 0, efficiency: 94, weekCompleted: 14, rating: 4.9 },
  { id: "pr2", technician: "Liam Chen", assigned: 64, completed: 58, pending: 5, overdue: 1, efficiency: 91, weekCompleted: 12, rating: 4.8 },
  { id: "pr3", technician: "Ava Wilson", assigned: 60, completed: 55, pending: 3, overdue: 2, efficiency: 92, weekCompleted: 11, rating: 4.7 },
  { id: "pr4", technician: "Noah Patel", assigned: 40, completed: 36, pending: 3, overdue: 1, efficiency: 90, weekCompleted: 9, rating: 4.6 },
  { id: "pr5", technician: "Mia Brooks", assigned: 38, completed: 34, pending: 2, overdue: 1, efficiency: 89, weekCompleted: 8, rating: 4.8 },
  { id: "pr6", technician: "Ethan Ross", assigned: 52, completed: 44, pending: 5, overdue: 3, efficiency: 85, weekCompleted: 6, rating: 4.5 },
];

export interface OpsVehicle {
  id: string;
  number: string;
  type: string;
  technician: string | null;
  branch: string;
  status: "Assigned" | "Available" | "In Service";
  insurance: string;
  serviceDue: string;
  distance: string;
  utilization: string;
  fuel: string;
}
export const opsVehicles: OpsVehicle[] = [
  { id: "ov1", number: "TX 4KL-2291", type: "Ford Transit Van", technician: "James Carter", branch: "Dallas HQ", status: "Assigned", insurance: "12 Mar 2027", serviceDue: "04 Dec 2026", distance: "1,284 mi", utilization: "78%", fuel: "Gasoline" },
  { id: "ov2", number: "TX 7PQ-1180", type: "Ram ProMaster", technician: "Liam Chen", branch: "Dallas HQ", status: "Assigned", insurance: "28 Nov 2026", serviceDue: "15 Jan 2027", distance: "962 mi", utilization: "64%", fuel: "Diesel" },
  { id: "ov3", number: "TX 5JD-0931", type: "Ford Transit Van", technician: null, branch: "Dallas HQ", status: "Available", insurance: "02 Aug 2027", serviceDue: "10 Feb 2027", distance: "0 mi", utilization: "0%", fuel: "Gasoline" },
  { id: "ov4", number: "TX 3WE-7720", type: "Chevy Express", technician: null, branch: "Dallas HQ", status: "In Service", insurance: "19 May 2027", serviceDue: "Now", distance: "412 mi", utilization: "31%", fuel: "Gasoline" },
];

export interface ChatMessage {
  id: number;
  from: "them" | "me";
  text: string;
  time: string;
  attachment?: string;
}
export interface ChatThread {
  id: string;
  kind: "Customers" | "Technicians";
  name: string;
  context: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}
export const chatThreads: ChatThread[] = [
  {
    id: "ch1", kind: "Customers", name: "Emily Johnson", context: "JOB-1048 · Riverside Office", preview: "Is James coming tomorrow?", time: "New", unread: true,
    messages: [
      { id: 1, from: "them", text: "Hi, is the technician still coming tomorrow morning? The office opens at 8.", time: "09:40" },
      { id: 2, from: "me", text: "Good morning Emily! Yes, James Carter is scheduled for tomorrow. You will get an “On the way” notification.", time: "09:42" },
      { id: 3, from: "them", text: "Perfect. Here is a photo of the unit label.", time: "09:43", attachment: "unit-label.jpg" },
    ],
  },
  { id: "ch2", kind: "Customers", name: "Oliver Smith", context: "JOB-1046 · Oak Lane Home", preview: "Got the Happy Code, thanks", time: "09:52", unread: false, messages: [{ id: 1, from: "them", text: "Got the Happy Code, thanks", time: "09:52" }] },
  { id: "ch3", kind: "Customers", name: "Harper Young", context: "JOB-1038 · Cedar Office", preview: "Invoice received", time: "Yesterday", unread: false, messages: [{ id: 1, from: "them", text: "Invoice received", time: "Yesterday" }] },
  { id: "ch4", kind: "Technicians", name: "Ethan Ross", context: "JOB-1039", preview: "Parts arriving at 2pm", time: "08:55", unread: true, messages: [{ id: 1, from: "them", text: "Parts arriving at 2pm, will finish after.", time: "08:55" }] },
];

export interface BranchOffer {
  id: string;
  name: string;
  type: "Free Service" | "Discount %" | "Fixed Amount";
  branch: string;
  from: string;
  to: string;
  status: "Published" | "Draft" | "Expired";
}
export const branchOffers: BranchOffer[] = [
  { id: "bo1", name: "Dallas Free Inspection", type: "Free Service", branch: "Dallas HQ", from: "18 Nov", to: "25 Nov", status: "Published" },
  { id: "bo2", name: "Duct Clean 15%", type: "Discount %", branch: "Dallas HQ", from: "01 Dec", to: "31 Dec", status: "Draft" },
  { id: "bo3", name: "$40 Off Plumbing", type: "Fixed Amount", branch: "Dallas HQ", from: "01 Oct", to: "15 Nov", status: "Expired" },
];

export interface OpsQuote {
  id: string;
  number: string;
  customer: string;
  job: string;
  amount: string;
  version: string;
  status: "Pending" | "Approved" | "Rejected" | "Draft";
  created: string;
  technician: string;
}
export const opsQuotes: OpsQuote[] = [
  { id: "QT-5512", number: "QT-5512", customer: "Emily Johnson", job: "JOB-1048", amount: "$1,180.00", version: "v2", status: "Pending", created: "19 Nov", technician: "James Carter" },
  { id: "QT-5509", number: "QT-5509", customer: "Riverside Offices LLC", job: "JOB-1047", amount: "$3,460.00", version: "v1", status: "Approved", created: "18 Nov", technician: "Liam Chen" },
  { id: "QT-5503", number: "QT-5503", customer: "Grace Lee", job: "JOB-1045", amount: "$14,900.00", version: "v3", status: "Pending", created: "17 Nov", technician: "Noah Patel" },
  { id: "QT-5498", number: "QT-5498", customer: "Oliver Smith", job: "JOB-1031", amount: "$640.00", version: "v1", status: "Rejected", created: "15 Nov", technician: "Ava Wilson" },
  { id: "QT-5490", number: "QT-5490", customer: "Sophia Martinez", job: "JOB-1029", amount: "$285.00", version: "v1", status: "Draft", created: "14 Nov", technician: "Liam Chen" },
];

export interface LineItem {
  id: number;
  item: string;
  qty: number;
  unitCost: number;
  taxable: boolean;
}
export const quoteLineItems: LineItem[] = [
  { id: 1, item: "AC Compressor (3-ton, R-410A)", qty: 1, unitCost: 780, taxable: true },
  { id: 2, item: "Copper Pipe 3/8″ (ft)", qty: 15, unitCost: 6, taxable: true },
  { id: 3, item: "Labor — Compressor Replacement (h)", qty: 3, unitCost: 95, taxable: true },
  { id: 4, item: "Emergency Charges", qty: 1, unitCost: 75, taxable: false },
];
