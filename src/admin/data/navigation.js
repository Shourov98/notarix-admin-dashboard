import {
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

export const primaryNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", path: "/users", icon: Users },
  { label: "Requests Management", path: "/requests", icon: ClipboardList },
  { label: "Order Management", path: "/orders", icon: ScrollText },
  { label: "Document", path: "/documents", icon: FileText },
  { label: "Messages", path: "/messages", icon: MessageSquare },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Audit Logs", path: "/audit-logs", icon: ShieldCheck },
  { label: "Support", path: "/support", icon: Bell },
  { label: "Admin Management", path: "/settings/admins", icon: UserCog, superAdminOnly: true },
  { label: "Settings", path: "/settings/profile", icon: Settings },
];

export const settingsNavItems = [
  { label: "Company", path: "/settings/company", icon: Users },
  { label: "Profile", path: "/settings/profile", icon: UserCog },
  { label: "Notifications", path: "/settings/notifications", icon: Bell },
  { label: "Security", path: "/settings/security", icon: ShieldCheck },
  { label: "Admins", path: "/settings/admins", icon: Users },
];
