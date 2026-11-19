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
