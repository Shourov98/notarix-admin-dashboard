import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gauge,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

export const currentAdmin = {
  name: "Sterling Lx",
  role: "SUPER ADMIN",
  avatar: "/profile.jpg",
};

export const primaryNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", path: "/users", icon: Users },
  { label: "Order Management", path: "/orders", icon: CalendarCheck },
  { label: "Document", path: "/documents", icon: FileText },
  { label: "Payments", path: "/payments", icon: CircleDollarSign },
  { label: "Messages", path: "/messages", icon: MessageCircle },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Support", path: "/support", icon: Headphones },
  { label: "Settings", path: "/settings/profile", icon: Settings },
];

export const settingsNavItems = [
  { label: "Profile", path: "/settings/profile", icon: UserCog },
  { label: "Company", path: "/settings/company", icon: Building2 },
  { label: "Notifications", path: "/settings/notifications", icon: Bell },
  { label: "Security", path: "/settings/security", icon: ShieldCheck },
  { label: "Admin Management", path: "/settings/admins", icon: LockKeyhole },
];

export const dashboardStats = [
  { label: "Total Orders", value: "2,450", change: "+12%", icon: FileText },
  { label: "Active Orders", value: "184", change: "+5%", icon: ClipboardCheck },
  { label: "Completed", value: "2,140", change: "+8%", icon: ShieldCheck },
  { label: "Pending Orders", value: "126", change: "-2%", icon: Gauge, tone: "danger" },
  { label: "Total Revenue", value: "$142k", change: "+15%", icon: CircleDollarSign },
  { label: "Total Notaries", value: "482", change: "+3%", icon: Users },
];

export const recentOrders = [
  {
    id: "#2604270001",
    client: "Acme Corp",
    notary: "Sarah Jenkins",
    service: "RON",
    status: "completed",
    date: "Apr 24, 2026",
  },
  {
    id: "#2604270002",
    client: "Global Logistics",
    notary: "Michael Tan",
    service: "In-Person",
    status: "in progress",
    date: "Apr 24, 2026",
  },
  {
    id: "#2604270003",
    client: "Hedge Financial",
    notary: "Unassigned",
    service: "RON",
    status: "pending",
    date: "Apr 24, 2026",
  },
];

export const users = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    email: "s.jenkins@example.com",
    role: "Notary",
    company: "Sarah Jenins",
    area: "Florida",
    status: "Active",
    verification: "Approved",
    avatarTone: "bg-blue-100 text-blue-700",
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    email: "m.chen@acmelegal.com",
    role: "Client",
    company: "Acme Legal",
    area: "Nationwide",
    status: "Pending",
    verification: "Pending",
    avatarTone: "bg-slate-200 text-slate-700",
  },
  {
    id: "michael-chen-2",
    name: "Michael Chen",
    email: "m.chen@acmelegal.com",
    role: "Client",
    company: "Acme Legal",
    area: "Nationwide",
    status: "Pending",
    verification: "Pending",
    avatarTone: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "sarah-jenkins-2",
    name: "Sarah Jenkins",
    email: "s.jenkins@example.com",
    role: "Notary",
    company: "Sarah Jenins",
    area: "Florida",
    status: "Active",
    verification: "Approved",
    avatarTone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    email: "elena.r@lexglobal.com",
    role: "Client",
    company: "Lex Global",
    area: "New York",
    status: "Suspended",
    verification: "Approved",
    avatarTone: "bg-rose-100 text-rose-700",
  },
];

export const orders = [
  {
    id: "#ORD-9421",
    route: "/orders/assigned",
    client: "First American Title",
    borrower: "John D. Smith",
    service: "Loan Refinance",
    location: "Austin, TX",
    schedule: "Apr 24,2026 02:30 PM CST",
    notary: "Marcus Webb",
    status: "Assigned",
  },
  {
    id: "#ORD-9420",
    route: "/orders/pending",
    client: "Zillow Home Loans",
    borrower: "Sarah Johnson",
    service: "Seller Package",
    location: "Denver,CO",
    schedule: "Apr 24,2026 09:00 AM MST",
    notary: "Unassigned",
    status: "Pending",
  },
  {
    id: "#ORD-9418",
    route: "/orders/assigned",
    client: "Rocket Mortgage",
    borrower: "Michael Chen",
    service: "Equity Line (HELOC)",
    location: "Seattle,WA",
    schedule: "Apr 24,2026 04:45 PM PST",
    notary: "Elena Lopez",
    status: "In Progress",
  },
  {
    id: "#RON-9418",
    route: "/orders/ron-session",
    client: "Rocket Mortgage",
    borrower: "Michael Chen",
    service: "Equity Line (HELOC)",
    location: "Seattle,WA",
    schedule: "Apr 24,2026 04:45 PM PST",
    notary: "Elena Lopez",
    status: "In Progress",
  },
  {
    id: "#ORD-9415",
    route: "/orders/completed",
    client: "Wells Fargo",
    borrower: "David Miller",
    service: "Power of Attorney",
    location: "Phoenix,AZ",
    schedule: "Apr 24,2026 11:15 AM MST",
    notary: "Robert Hall",
    status: "Completed",
  },
];

export const notaries = [
  {
    name: "Sarah Jenkins",
    location: "Travis County",
    radius: "50 mile radius",
    status: "Available",
    jobs: "142 Jobs Completed",
    tags: ["RON", "HELOC", "PURCHASE"],
    selected: true,
    avatarTone: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Michael Chen",
    location: "Travis County",
    radius: "25 mile radius",
    status: "Busy",
    jobs: "218 Jobs Completed",
    tags: ["RON", "COMMERCIAL"],
    avatarTone: "bg-slate-200 text-slate-700",
  },
  {
    name: "Elena Rodriguez",
    location: "Williamson County",
    radius: "60 mile radius",
    status: "Available",
    jobs: "89 Jobs Completed",
    tags: ["ESTATE", "PURCHASE"],
    avatarTone: "bg-rose-100 text-rose-700",
  },
];

export const documents = [
  {
    name: "Residential_Lease_v2.pdf",
    orderId: "#26NC4999",
    uploadedBy: "John Smith",
    type: "Legal/Lease",
    date: "Apr24, 2026",
    status: "Pending",
    selected: true,
  },
  {
    name: "Power_of_Attorney_Final.pdf",
    orderId: "#26NC4999",
    uploadedBy: "Alice Miller",
    type: "Compliance",
    date: "Apr24, 2026",
    status: "Verified",
  },
  {
    name: "Identity_Verification.jpg",
    orderId: "#26NC4999",
    uploadedBy: "Robert King",
    type: "Personal ID",
    date: "Apr24, 2026",
    status: "Rejected",
  },
  {
    name: "NDA_Agreement_TechFlow.pdf",
    orderId: "#26NC999",
    uploadedBy: "Laura Green",
    type: "NDA",
    date: "Apr24, 2026",
    status: "Pending",
  },
];

export const payments = [
  {
    id: "#PAY-9921",
    reference: "TX-880221",
    client: "Sarah Jenkins",
    note: "Residential Notary Svc.",
    type: "Inbound",
    amount: "$150.00",
    status: "Paid",
    date: "Apr 23, 2026",
  },
  {
    id: "#PAY-9920",
    reference: "TX-880219",
    client: "Notary: Mark Stevens",
    note: "Payout for ORD-441",
    type: "Outbound",
    amount: "$85.00",
    status: "Pending",
    date: "Apr 23, 2026",
    selected: true,
  },
  {
    id: "#PAY-9918",
    reference: "TX-880215",
    client: "Corporate Dev. Inc.",
    note: "Bulk Document Signing",
    type: "Inbound",
    amount: "$1,200.00",
    status: "Failed",
    date: "Apr 23, 2026",
  },
  {
    id: "#PAY-9917",
    reference: "TX-880214",
    client: "Anita Rose",
    note: "Legal Affirmation Payout",
    type: "Inbound",
    amount: "$45.00",
    status: "Paid",
    date: "Apr 23, 2026",
  },
];

export const clientDocuments = [
  { title: "W-9 Form", status: "Verified", file: "w9_tax_2023.pdf" },
  { title: "Business License", status: "Uploaded", file: "license_final.jpg" },
  { title: "E&O Insurance", status: "Missing", file: "" },
  { title: "Certificate of Formation", status: "Rejected", file: "cert_formation.docx" },
  { title: "Articles of Organization", status: "Uploaded", file: "articles_of_org.pdf" },
];

export const notaryDocuments = [
  { title: "Commission Certificate", status: "Uploaded", file: "commission_cert_2023.pdf" },
  { title: "E&O Insurance", status: "Verified", file: "policy_docs_final.pdf" },
  { title: "Background Check", status: "Missing", file: "" },
  { title: "Government ID", status: "Uploaded", file: "drivers_license_scan.jpg" },
  { title: "Void Check / ACH", status: "Verified", file: "Chase Bank Business" },
];

export const messages = [
  {
    name: "Sarah Jenkins",
    role: "CLIENT",
    time: "10:45 AM",
    unread: 2,
    preview: "I've uploaded the ID fro",
    active: true,
  },
  {
    name: "Marcus Rivera",
    role: "NOTARY",
    time: "YESTERDAY",
    preview: "Awaiting confirmation for the",
  },
  {
    name: "Elena Lopez",
    role: "CLIENT",
    time: "OCT 24",
    preview: "Thank you for the quick turna",
  },
];

export const supportTickets = [
  {
    name: "John Doe",
    type: "Client",
    issue: "Unable to update menu pricing in dashboa...",
    status: "Open",
    date: "Apr 24, 2026",
  },
  {
    name: "Maria Santos",
    type: "Notary",
    issue: "Payment integration failure for online orders",
    status: "Open",
    date: "Apr 24, 2026",
  },
  {
    name: "Robert King",
    type: "client",
    issue: "Printer connectivity issue on POS terminal",
    status: "Resolved",
    date: "Apr 24, 2026",
  },
  {
    name: "Anita Lee",
    type: "Notary",
    issue: "Refund request for cancelled order #10293",
    status: "Resolved",
    date: "Apr 24, 2026",
  },
];

export const adminRows = [
  {
    name: "Sarah Jenkins",
    email: "s.jenkins@notarix.com",
    role: "SUPERADMIN",
    status: "Active",
    lastLogin: "2 mins ago",
  },
  {
    name: "Marcus Thorne",
    email: "m.thorne@notarix.com",
    role: "ADMIN",
    status: "Active",
    lastLogin: "5 hours ago",
  },
  {
    name: "David Chen",
    email: "d.chen@notarix.com",
    role: "ADMIN",
    status: "Inactive",
    lastLogin: "12 days ago",
  },
  {
    name: "Lila Vance",
    email: "l.vance@notarix.com",
    role: "ADMIN",
    status: "Active",
    lastLogin: "Yesterday",
  },
];
