import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeDollarSign,
  ChartNoAxesColumn,
  PlusCircle,
  ShieldAlert,
  UserCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  Button,
  Card,
  MetricCard,
  PageHeader,
  StatusBadge,
} from "../components/ui";
import { dashboardStats, recentOrders } from "../data/notarixData";

const chartValues = [
  { label: "JAN", value: 42 },
  { label: "FEB", value: 57 },
  { label: "MAR", value: 48 },
  { label: "APR", value: 73 },
  { label: "MAY", value: 62 },
  { label: "JUN", value: 88 },
  { label: "JUL", value: 99 },
  { label: "AUG", value: 84 },
  { label: "SEP", value: 94 },
  { label: "OCT", value: 79 },
  { label: "NOV", value: 86 },
  { label: "DEC", value: 101 },
];

const quickActions = [
  { label: "Create Order", icon: PlusCircle },
  { label: "Add Notary", icon: UsersRound, to: "/users/new?type=notary" },
  { label: "Add Client", icon: UserPlus, to: "/users/new?type=client" },
  { label: "View Reports", icon: ChartNoAxesColumn, to: "/reports" },
];

const systemAlerts = [
  {
    title: "New Notary Registration Pending",
    meta: "2h ago - Needs review",
    action: "Review Application",
    icon: UserCheck,
  },
  {
    title: "Payment Pending Verification",
    meta: "5h ago - Transaction #4402",
    action: "Review Payment",
    icon: BadgeDollarSign,
  },
  {
    title: "Document Missing Warning",
    meta: "1d ago - Order #2604270001",
    action: "Notify Notary",
    icon: ShieldAlert,
  },
];

const summaryCards = [
  {
    title: "Client Summary",
    items: [
      { value: "1,240", label: "Total Clients" },
      { value: "980", label: "Active", tone: "green" },
      { value: "45", label: "New (30d)", tone: "blue" },
    ],
  },
  {
    title: "Notary Summary",
    items: [
      { value: "482", label: "Total Notaries" },
      { value: "390", label: "Active", tone: "green" },
      { value: "12", label: "Pending Approval", tone: "red" },
    ],
  },
];

const summaryToneClass = {
  default: "text-[var(--color-ink)]",
  green: "text-emerald-600",
  blue: "text-[var(--color-brand-primary)]",
  red: "text-red-600",
};

const quickActionClass =
  "inline-flex h-12 w-full items-center justify-start gap-2 rounded-lg bg-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20";

const SummaryCard = ({ title, items }) => (
  <Card className="p-6">
    <p className="text-sm font-bold text-slate-600">{title}</p>
    <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--color-border)]">
      {items.map((item) => (
        <div key={item.label} className="px-4 text-center first:pl-0 last:pr-0">
          <p className={`text-2xl font-extrabold ${summaryToneClass[item.tone] || summaryToneClass.default}`}>
            {item.value}
          </p>
          <p className="mt-1 text-sm text-slate-600">{item.label}</p>
        </div>
      ))}
    </div>
  </Card>
);

const NotaryCell = ({ name }) => {
  if (name === "Unassigned") {
    return <span className="text-slate-500">{name}</span>;
  }

  return (
    <span className="inline-flex items-center gap-3">
      <span className="h-6 w-6 rounded-full bg-[#deddf0]" aria-hidden="true" />
      <span>{name}</span>
    </span>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-panel">
        <p className="text-xs font-bold text-slate-500">{payload[0].payload.label}</p>
        <p className="text-lg font-extrabold text-[var(--color-brand-primary)]">
          {payload[0].value} <span className="text-xs font-medium text-slate-400">Orders</span>
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState("Yearly");

  return (
    <div>
      <PageHeader title="Dashboard Overview" description="System performance, orders, and activity insights" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardStats.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="p-7">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">Orders Overview</h2>
            <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[#eeecfb] p-1">
              {["Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTimeRange(item)}
                  className={`h-8 rounded-md px-4 text-sm font-semibold transition-all ${
                    timeRange === item
                      ? "bg-white text-[var(--color-brand-primary)] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartValues} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar
                  dataKey="value"
                  fill="var(--color-brand-primary)"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-[var(--color-brand-primary)] p-7 text-white ">
          <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              const actionContent = (
                <>
                  <ActionIcon className="h-4 w-4" />
                  {action.label}
                </>
              );

              return action.to ? (
                <Link key={action.label} to={action.to} className={quickActionClass}>
                  {actionContent}
                </Link>
              ) : (
                <button key={action.label} type="button" className={quickActionClass}>
                  {actionContent}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6">
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              <Link to="/orders" className="text-sm font-bold text-[var(--color-brand-primary)]">
                View All Orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#f0eefb] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Client Name</th>
                    <th className="px-5 py-4">Notary Assigned</th>
                    <th className="px-5 py-4">Service Type</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-200">
                      <td className="px-5 py-5 font-semibold text-[var(--color-brand-primary)]">{order.id}</td>
                      <td className="px-5 py-5">{order.client}</td>
                      <td className="px-5 py-5">
                        <NotaryCell name={order.notary} />
                      </td>
                      <td className="px-5 py-5">{order.service}</td>
                      <td className="px-5 py-5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-5 text-slate-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <h2 className="border-b border-[var(--color-border)] px-5 py-4 text-xl font-bold">System Alerts</h2>
            {systemAlerts.map((alert) => {
              const AlertIcon = alert.icon;

              return (
                <div key={alert.title} className="border-b border-slate-200 px-5 py-4 last:border-b-0">
                  <div className="flex gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[var(--color-brand-primary)]">
                      <AlertIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold leading-tight">{alert.title}</p>
                      <p className="text-sm text-slate-500">{alert.meta}</p>
                    </div>
                  </div>
                  <Button variant="subtle" size="sm" className="mt-3 h-7 w-full rounded-md text-xs text-[var(--color-brand-primary)]">
                    {alert.action}
                  </Button>
                </div>
              );
            })}
          </Card>

          <Card className="overflow-hidden border-0 bg-[#0f1f3f] text-white shadow-[0_14px_26px_rgba(10,31,92,0.25)]">
            <div
              className="flex min-h-48 flex-col justify-end bg-cover bg-center p-6"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(7, 18, 42, 0.05) 0%, rgba(18, 54, 183, 0.96) 100%), url('/security-upgrade.png')",
              }}
            >
              <p className="text-xl font-bold">Upgrade System Security</p>
              <p className="mt-1 max-w-[240px] text-sm text-blue-100">
                Enable 2FA for all notaries across the network.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <footer className="mt-16 border-t border-[var(--color-border)] pt-5 text-center text-sm text-slate-500">
        &copy; 2026 Notarix&trade; Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;
