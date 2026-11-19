/**
 * Synthetic data for the Field Worker app, transcribed from the `fw-*` design boards.
 * Fictional people/places only. Replace with API calls when the backend exists.
 */

export const technician = {
  name: "James Carter",
  title: "Senior HVAC Engineer",
  employeeId: "EMP-1014",
  mobile: "(214) 555-0122",
  email: "james@coolair.example.test",
  branch: "Dallas HQ",
};

export type JobStatus = "Scheduled" | "Assigned" | "Accepted" | "In Progress" | "Paused" | "Pending Verification" | "Completed";

export interface Job {
  id: string;
  service: string;
  category: string;
  priority: "Emergency" | "Regular";
  status: JobStatus;
  customer: string;
  customerPhone: string;
  property: string;
  address: string;
  window: string;
  day: "Today" | "Upcoming" | "Completed";
  notes?: string;
  checklistName: string;
  checklist: string[];
  activities: string[];
  distance?: string;
  travelTime?: string;
}

export const jobs: Job[] = [
  {
    id: "JOB-1048", service: "AC Repair", category: "HVAC", priority: "Emergency", status: "Assigned",
    customer: "Emily Johnson", customerPhone: "(214) 555-0182", property: "Riverside Office",
    address: "45 Riverside Dr, Suite 300, Dallas, TX 75201", window: "11:30 AM – 01:00 PM", day: "Today",
    notes: "Outdoor unit rattling, weak cooling", checklistName: "HVAC — Repair Checklist",
    checklist: ["Equipment Inspected", "Gas pressure check", "Compressor check", "Cleaning Completed", "Testing Completed"],
    activities: ["Recover refrigerant", "Replace compressor", "Replace run capacitor", "Pressure & leak test", "Recharge & test cooling"],
    distance: "6.4 mi", travelTime: "18 min",
  },
  {
    id: "JOB-1047", service: "HVAC Servicing", category: "HVAC", priority: "Regular", status: "In Progress",
    customer: "Riverside Offices LLC", customerPhone: "(214) 555-0190", property: "HQ Tower",
    address: "800 Commerce St, Dallas, TX 75202", window: "09:00 AM – 11:00 AM", day: "Today",
    checklistName: "HVAC — Service Checklist",
    checklist: ["Filters replaced", "Coils cleaned", "Thermostat calibrated"],
    activities: ["Replace filters", "Clean coils", "Calibrate thermostat"],
    distance: "2.1 mi", travelTime: "8 min",
  },
  {
    id: "JOB-1050", service: "AC Servicing", category: "HVAC", priority: "Regular", status: "Scheduled",
    customer: "Harper Young", customerPhone: "(214) 555-0177", property: "Cedar Office",
    address: "12 Cedar Ave, Dallas, TX 75204", window: "02:00 PM – 03:00 PM", day: "Today",
    checklistName: "HVAC — Service Checklist",
    checklist: ["Filters replaced", "Coils cleaned", "Thermostat calibrated"],
    activities: ["Replace filters", "Clean coils", "Calibrate thermostat"],
    distance: "4.8 mi", travelTime: "14 min",
  },
  {
    id: "JOB-1053", service: "Duct Cleaning", category: "HVAC", priority: "Regular", status: "Scheduled",
    customer: "Grace Lee", customerPhone: "(469) 555-0133", property: "Warehouse 2",
    address: "1200 Industrial Blvd, Irving, TX", window: "Tomorrow · 09:00 AM", day: "Upcoming",
    checklistName: "Duct Cleaning Checklist", checklist: ["Vents removed", "Ducts vacuumed", "Vents refitted"],
    activities: ["Remove vents", "Vacuum ducts", "Refit vents"],
  },
  {
    id: "JOB-1042", service: "AC Repair", category: "HVAC", priority: "Regular", status: "Completed",
    customer: "Emily Johnson", customerPhone: "(214) 555-0182", property: "Main St. Home",
    address: "2118 Main St, Dallas, TX 75201", window: "08:00 AM", day: "Completed",
    checklistName: "HVAC — Repair Checklist", checklist: ["Equipment Inspected"], activities: ["Replace capacitor"],
  },
];

/** Mock Happy Code accepted for any job (matches the customer portal demo). Real verification is server-side. */
export const MOCK_HAPPY_CODE = "582471";

export const attendanceHistory = [
  { day: "Wed, 18 Nov", inOut: "In 07:52 · Out 17:10", total: "9h 18m" },
  { day: "Tue, 17 Nov", inOut: "In 08:01 · Out 16:45", total: "8h 44m" },
  { day: "Mon, 16 Nov", inOut: "In 07:49 · Out 17:30", total: "9h 41m" },
];

export const previousServices = [
  { service: "AC Servicing", meta: "02 Aug 2026 · James Carter" },
  { service: "Duct Cleaning", meta: "20 Jan 2026 · Mia Brooks" },
  { service: "AC Installation", meta: "14 Aug 2025 · Ethan Ross" },
];

export interface Notification {
  id: string;
  title: string;
  meta: string;
  unread: boolean;
  kind: "job" | "location" | "chat";
}
export const notifications: Notification[] = [
  { id: "n1", title: "New Job Assigned #JOB-1048", meta: "Emergency · AC Repair · 2 min ago", unread: true, kind: "job" },
  { id: "n2", title: "Job Rescheduled", meta: "JOB-1050 moved to 02:00 PM · 20 min ago", unread: false, kind: "job" },
  { id: "n3", title: "Customer replied", meta: "Emily Johnson: “Parking is on P2” · 1 h ago", unread: false, kind: "chat" },
  { id: "n4", title: "Location requested by Marcus Reed", meta: "Share or reject with reason · 1 h ago", unread: true, kind: "location" },
];

export interface ChatMessage {
  id: number;
  from: "them" | "me";
  text: string;
  time: string;
  attachment?: string;
}
export const chats: Record<"Customer" | "Manager", { name: string; messages: ChatMessage[] }> = {
  Customer: {
    name: "Emily Johnson",
    messages: [
      { id: 1, from: "them", text: "Is the rooftop key at reception?", time: "09:44" },
      { id: 2, from: "me", text: "Thanks! I’m 10 minutes away.", time: "09:46" },
      { id: 3, from: "them", text: "Ask for Carla at reception. Parking is on P2.", time: "09:47" },
      { id: 4, from: "me", text: "Sharing my location.", time: "09:48", attachment: "Location · Commerce St" },
    ],
  },
  Manager: {
    name: "Marcus Reed",
    messages: [{ id: 1, from: "them", text: "JOB-1048 is an emergency — please prioritise it after HQ Tower.", time: "08:30" }],
  },
};

export const vehicle = {
  number: "TX 4KL-2291",
  type: "Ford Transit Van",
  branch: "Dallas HQ",
  insurance: "12 Mar 2027",
  lastService: "04 Jun 2026",
  fuel: "Gasoline",
};

export const pauseReasons = ["Waiting For Parts", "Customer Unavailable", "Weather Issue", "Other"] as const;
export const locationRejectReasons = ["Driving — will share at site", "Off duty / on break", "Poor signal", "Other"] as const;
