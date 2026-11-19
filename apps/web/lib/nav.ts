import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  BarChart3,
  Bell,
  Building2,
  Car,
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  KanbanSquare,
  KeyRound,
  LayoutGrid,
  LifeBuoy,
  Percent,
  ReceiptText,
  RotateCcw,
  Settings,
  UserRound,
  Users,
  Wrench,
  Inbox,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Gauge,
  MapPin,
  MessagesSquare,
  Smile,
  Sparkles,
  UsersRound,
  Route,
  Building,
  CreditCard as PlanIcon,
  Headset,
  Activity,
  ShieldCheck,
  Lock,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}
export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

/** Company Owner navigation — mirrors the sidebar on every `co-*` board in the design. */
export const ownerNav: NavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/owner", icon: LayoutGrid }] },
  {
    label: "Organization",
    items: [
      { label: "Branches", href: "/owner/branches", icon: Building2 },
      { label: "Users", href: "/owner/users", icon: Users },
      { label: "Permission Matrix", href: "/owner/permissions", icon: KeyRound },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "Customers", href: "/owner/customers", icon: UserRound },
      { label: "Properties", href: "/owner/properties", icon: Home },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Service Catalog", href: "/owner/catalog", icon: Wrench },
      { label: "Offers", href: "/owner/offers", icon: BadgePercent },
      { label: "Tax Master", href: "/owner/tax", icon: Percent },
      { label: "Checklist Builder", href: "/owner/checklists", icon: ClipboardCheck },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Service Requests", href: "/owner/requests", icon: Inbox, badge: 8 },
      { label: "Job Pipeline", href: "/owner/pipeline", icon: KanbanSquare },
      { label: "Quotations", href: "/owner/quotes", icon: FileText },
      { label: "Vehicles", href: "/owner/vehicles", icon: Car },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", href: "/owner/invoices", icon: ReceiptText },
      { label: "Payments", href: "/owner/payments", icon: CreditCard },
      { label: "Refunds", href: "/owner/refunds", icon: RotateCcw },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", href: "/owner/reports", icon: BarChart3 },
      { label: "Notification Center", href: "/owner/notifications", icon: Bell },
      { label: "Support Center", href: "/owner/support", icon: LifeBuoy },
      { label: "Settings", href: "/owner/settings", icon: Settings },
    ],
  },
];

/** Operations Manager navigation — mirrors the sidebar on every `om-*` board. */
export const opsNav: NavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/ops", icon: LayoutGrid }] },
  {
    label: "Requests",
    items: [
      { label: "Service Requests", href: "/ops/requests", icon: Inbox, badge: 6 },
      { label: "Smart Dispatch", href: "/ops/dispatch", icon: Route },
      { label: "Scheduling", href: "/ops/calendar", icon: CalendarDays },
      { label: "Capacity Planning", href: "/ops/capacity", icon: Gauge },
    ],
  },
  {
    label: "Jobs",
    items: [
      { label: "Job Pipeline", href: "/ops/pipeline", icon: KanbanSquare },
      { label: "Work Orders", href: "/ops/workorders", icon: BriefcaseBusiness },
      { label: "Quotations", href: "/ops/quotes", icon: FileText },
      { label: "Happy Code", href: "/ops/happy-code", icon: Smile },
      { label: "Warranty", href: "/ops/warranty", icon: Award },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Workforce", href: "/ops/workforce", icon: UsersRound },
      { label: "GPS Requests", href: "/ops/gps", icon: MapPin },
      { label: "Vehicles", href: "/ops/vehicles", icon: Car },
      { label: "Communication", href: "/ops/chat", icon: MessagesSquare, badge: 3 },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Branch Offers", href: "/ops/offers", icon: Sparkles },
      { label: "Reports", href: "/ops/reports", icon: BarChart3 },
    ],
  },
];

/** Platform Owner navigation — mirrors the sidebar on every `po-*` board. */
export const platformNav: NavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/platform", icon: LayoutGrid }] },
  {
    label: "Tenants",
    items: [
      { label: "Companies", href: "/platform/companies", icon: Building },
      { label: "Subscription Plans", href: "/platform/plans", icon: PlanIcon },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Support Tickets", href: "/platform/tickets", icon: LifeBuoy, badge: 12 },
      { label: "Support Agents", href: "/platform/agents", icon: Headset },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Platform Monitoring", href: "/platform/monitoring", icon: Activity },
      { label: "GDPR & Compliance", href: "/platform/gdpr", icon: ShieldCheck },
      { label: "Reports", href: "/platform/reports", icon: BarChart3 },
      { label: "Security", href: "/platform/security", icon: Lock },
    ],
  },
];
