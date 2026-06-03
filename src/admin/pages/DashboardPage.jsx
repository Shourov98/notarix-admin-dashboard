import { Link } from "react-router-dom";
import {
  ChartNoAxesColumn,
  PlusCircle,
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
import { selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppSelector } from "../../store/hooks";

const quickActions = [
  { label: "Create Order", icon: PlusCircle },
  { label: "Add Notary", icon: UsersRound, to: "/users/new?type=notary" },
  { label: "Add Client", icon: UserPlus, to: "/users/new?type=client" },
  { label: "View Reports", icon: ChartNoAxesColumn, to: "/reports" },
];

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
  const { dashboardStats, recentOrders } = useAppSelector(selectAdminConsole);

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
          <h2 className="text-2xl font-semibold">Orders Overview</h2>
          <div className="mt-6 rounded-lg border border-dashed border-[var(--color-border)] bg-slate-50 p-6 text-slate-600">
            Trend charts are not rendered here until the backend exposes a real time-series dataset for the admin dashboard.
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
    </div>
  );
};

export default DashboardPage;
