import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ChartNoAxesColumn,
  ClipboardCheck,
  ClipboardList,
  Hourglass,
  Landmark,
  PlusCircle,
  ShieldUser,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Button,
  Card,
  MetricCard,
  PageHeader,
  StatusBadge,
} from "../components/ui";
import {
  fetchDashboardTimeSeries,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";
import CreateOrderModal from "../components/CreateOrderModal";

const dashboardStatIcons = {
  "Total Users": UsersRound,
  "Pending Approvals": Hourglass,
  "Total Orders": ClipboardList,
  "Completed Orders": ClipboardCheck,
  "Total Revenue": Landmark,
  "Admin Team": ShieldUser,
};

const toCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const quickActionClass =
  "inline-flex h-12 w-full items-center justify-start gap-2 rounded-lg bg-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20";

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

const DashboardPage = () => {
  const {
    dashboardStats,
    recentOrders,
    dashboardTimeSeries,
    dashboardTimeSeriesStatus,
  } = useAppSelector(selectAdminConsole);
  const dispatch = useAppDispatch();

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [trendDays, setTrendDays] = useState(14);

  useEffect(() => {
    dispatch(fetchDashboardTimeSeries({ days: trendDays }));
  }, [dispatch, trendDays]);

  const handleCreateOrder = () => {
    setCreateOrderOpen(true);
  };

  const seriesData = useMemo(() => {
    const series = dashboardTimeSeries?.series || [];
    return series.map((entry) => ({
      label: entry.label,
      orders: entry.orders,
      completed: entry.completedOrders,
      revenue: Math.round(Number(entry.revenue || 0)),
    }));
  }, [dashboardTimeSeries]);

  const totals = dashboardTimeSeries?.totals;

  const quickActions = [
    { label: "Create Order", icon: PlusCircle, onClick: handleCreateOrder },
    { label: "Add Notary", icon: UsersRound, to: "/users/new?type=notary" },
    { label: "Add Client", icon: UserPlus, to: "/users/new?type=client" },
    { label: "View Reports", icon: ChartNoAxesColumn, to: "/reports" },
  ];

  const handleCreateOrderRedirect = (orderId) => {
    toast.success(`Order ${orderId} created.`);
    setCreateOrderOpen(false);
  };

  return (
    <div>
      <PageHeader title="Dashboard Overview" description="System performance, orders, and activity insights" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardStats.map((item) => {
          const StatIcon = dashboardStatIcons[item.label] || BadgeCheck;
          return <MetricCard key={item.label} {...item} icon={StatIcon} />;
        })}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Orders Overview</h2>
            <div className="flex items-center gap-2">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setTrendDays(days)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    trendDays === days
                      ? "bg-[var(--color-brand-primary)] text-white"
                      : "border border-[var(--color-border)] bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {totals ? (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Orders
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">{totals.orders}</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Completed
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{totals.completedOrders}</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Revenue
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">{toCurrency(totals.revenue)}</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Payouts
                </p>
                <p className="mt-1 text-xl font-bold text-[#b34a4a]">{toCurrency(totals.payouts)}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-5 h-[280px] w-full">
            {dashboardTimeSeriesStatus === "loading" ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Loading order trends…
              </div>
            ) : seriesData.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-slate-50 text-sm text-slate-500">
                No order activity in the last {trendDays} days.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return toCurrency(value);
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    name="Orders created"
                    fill="var(--color-brand-primary)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    name="Orders completed"
                    fill="#0f9d79"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
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
                <button
                  key={action.label}
                  type="button"
                  className={quickActionClass}
                  onClick={action.onClick}
                >
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
                  {recentOrders.map((order) => {
                    // Order ids from the backend are prefixed with `#` (e.g.
                    // `#ORD-178...`). Strip the `#` so the URL matches the
                    // `/orders/:id` route used by the rest of the app.
                    const rawOrderId = String(order.id || "").replace(/^#/, "");
                    return (
                    <tr key={order.id} className="border-t border-slate-200">
                      <td className="px-5 py-5 font-semibold text-[var(--color-brand-primary)]">
                        <Link
                          to={`/orders/${rawOrderId}`}
                          className="text-[var(--color-brand-primary)] underline-offset-2 hover:underline"
                        >
                          {order.id}
                        </Link>
                      </td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <h2 className="border-b border-[var(--color-border)] px-5 py-4 text-xl font-bold">System Alerts</h2>
            <div className="px-5 py-6 text-sm text-slate-500">
              No live system alert feed is available from the backend yet.
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold">Platform Notices</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Security campaigns and bulk operational notices are not connected to a live backend feed yet, so this section stays informational instead of showing made-up campaigns.
            </p>
          </Card>
        </div>
      </div>

      <footer className="mt-16 border-t border-[var(--color-border)] pt-5 text-center text-sm text-slate-500">
        &copy; 2026 Notarix&trade; Technologies Inc. All rights reserved.
      </footer>

      <CreateOrderModal
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onCreated={handleCreateOrderRedirect}
      />
    </div>
  );
};

export default DashboardPage;
