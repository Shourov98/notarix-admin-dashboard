import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  Download,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
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
  Button,
  Card,
  MetricCard,
  StatusBadge,
} from "../components/ui";
import { apiRequest, buildApiUrl } from "../../services/httpClient";
import { getAdminSession } from "../../utils/auth";

const defaultDateRange = () => {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 30);
  return {
    dateFrom: monthAgo.toISOString().slice(0, 10),
    dateTo: today.toISOString().slice(0, 10),
  };
};

const toCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const buildExportQuery = (filters, format) =>
  new URLSearchParams({
    ...filters,
    format,
  }).toString();

const exportReport = async (path, filters, filename) => {
  const session = getAdminSession();
  if (!session?.accessToken) {
    throw new Error("Admin session expired. Please sign in again.");
  }

  const response = await fetch(
    buildApiUrl(`${path}?${buildExportQuery(filters, "csv")}`),
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to export CSV.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const ReportsPage = () => {
  const [filters, setFilters] = useState(defaultDateRange);
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState({
    stats: null,
    orders: null,
    payments: null,
    notaries: null,
    clients: null,
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setStatus("loading");
      setError("");

      try {
        const query = {
          ...filters,
          ...(statusFilter ? { status: statusFilter } : {}),
        };

        const [stats, orders, payments, notaries, clients] = await Promise.all([
          apiRequest("/admin/reports/dashboard-stats", { query }),
          apiRequest("/admin/reports/orders", { query }),
          apiRequest("/admin/reports/payments", { query }),
          apiRequest("/admin/reports/notaries", { query: filters }),
          apiRequest("/admin/reports/clients", { query: filters }),
        ]);

        if (!active) return;

        setData({
          stats: stats?.data || stats,
          orders: orders?.data || orders,
          payments: payments?.data || payments,
          notaries: notaries?.data || notaries,
          clients: clients?.data || clients,
        });
        setStatus("ready");
      } catch (requestError) {
        if (!active) return;
        setStatus("error");
        setError(requestError?.message || "Unable to load reports.");
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [filters, statusFilter]);

  const summary = data.stats?.summary || {};
  const orderRows = data.orders?.orders || [];
  const paymentRows = data.payments?.payments || [];
  const topNotaries = data.notaries?.notaries || [];
  const activeClients = data.clients?.clients || [];
  const chartValues = data.stats?.revenueSeries || [];
  const payoutValues = data.stats?.payoutSeries || [];
  const statusBreakdown = data.stats?.ordersByStatus || [];
  const paymentMethods = data.stats?.paymentMethods || [];

  const selectedDateLabel = useMemo(() => {
    if (!filters.dateFrom || !filters.dateTo) return "All dates";
    return `${filters.dateFrom} to ${filters.dateTo}`;
  }, [filters.dateFrom, filters.dateTo]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-normal text-[var(--color-ink)]">
          Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-base text-slate-600">
          Live order, payout, notary, and client activity insights from the production workflow.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            From
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                setFilters((current) => ({ ...current, dateFrom: event.target.value }))
              }
              className="h-11 rounded-lg border border-[var(--color-border)] px-3 text-sm font-semibold text-slate-700"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            To
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                setFilters((current) => ({ ...current, dateTo: event.target.value }))
              }
              className="h-11 rounded-lg border border-[var(--color-border)] px-3 text-sm font-semibold text-slate-700"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-lg border border-[var(--color-border)] px-3 text-sm font-semibold text-slate-700"
          >
            <option value="">All statuses</option>
            <option value="Pending Admin Review">Pending Admin Review</option>
            <option value="Accepted By Admin">Accepted By Admin</option>
            <option value="Notary Assigned">Notary Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <Button variant="secondary" icon={CalendarRange}>
            {selectedDateLabel}
          </Button>
          <Button
            icon={Download}
            onClick={() =>
              exportReport(
                "/admin/reports/orders",
                { ...filters, status: statusFilter },
                "orders-report.csv"
              )
            }
          >
            Export Orders
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() =>
              exportReport("/admin/reports/payments", filters, "payments-report.csv")
            }
          >
            Export Payments
          </Button>
        </div>
      </div>

      {status === "error" ? (
        <Card className="p-6 text-red-600">{error}</Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Orders" value={String(summary.totalOrders || 0)} icon={ReceiptText} />
        <MetricCard label="Completed Orders" value={String(summary.completedOrders || 0)} icon={ShieldCheck} />
        <MetricCard label="Total Revenue" value={toCurrency(summary.totalRevenue)} icon={Landmark} />
        <MetricCard label="Net Profit" value={toCurrency(summary.totalProfit)} icon={BarChart3} />
      </div>

      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Revenue Trend</h2>
            <span className="text-sm text-slate-500">Filtered by created date</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartValues}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => toCurrency(value)} />
                <Bar dataKey="value" fill="var(--color-brand-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-7">
          <h2 className="mb-6 text-2xl font-semibold">Orders by Status</h2>
          <div className="space-y-5">
            {statusBreakdown.map((entry) => {
              const percentage =
                summary.totalOrders > 0
                  ? Math.round((entry.count / summary.totalOrders) * 100)
                  : 0;

              return (
                <div key={entry.status}>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{entry.status}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#eeecfb]">
                    <div
                      className="h-full rounded-full bg-[var(--color-brand-primary)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Payout Trend</h2>
            <span className="text-sm text-slate-500">Outbound only</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payoutValues}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => toCurrency(value)} />
                <Bar dataKey="value" fill="#0f9d79" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Payment Methods</h2>
            <span className="text-sm text-slate-500">Inbound totals</span>
          </div>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.method}
                className="flex items-center justify-between rounded-xl bg-[#f7f8ff] px-4 py-3"
              >
                <span className="font-semibold text-slate-700">{method.method}</span>
                <strong className="text-[var(--color-brand-primary)]">
                  {toCurrency(method.amount)}
                </strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="p-7">
          <div className="mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-[var(--color-brand-primary)]" />
            <h2 className="text-2xl font-semibold">Top Notaries</h2>
          </div>
          <div className="space-y-4">
            {topNotaries.slice(0, 5).map((notary) => (
              <div key={notary.notaryId} className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="font-bold text-slate-900">{notary.name}</p>
                <p className="mt-1 text-sm text-slate-500">{notary.email}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{notary.completedOrders} completed</span>
                  <span className="font-semibold text-[var(--color-brand-primary)]">
                    {toCurrency(notary.totalPayout)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <StatusBadge status={status === "loading" ? "Pending" : "Active"} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-5">Order</th>
                  <th className="px-6 py-5">Client</th>
                  <th className="px-6 py-5">Service</th>
                  <th className="px-6 py-5">Fee</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderRows.slice(0, 8).map((order) => (
                  <tr key={order.orderId} className="border-t border-slate-200">
                    <td className="px-6 py-4 font-semibold">#{order.orderId}</td>
                    <td className="px-6 py-4">{order.clientCompany || order.clientName}</td>
                    <td className="px-6 py-4">{order.serviceType}</td>
                    <td className="px-6 py-4">{toCurrency(order.feeAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--color-border)] p-6">
            <h2 className="text-2xl font-semibold">Payment Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-5">Order</th>
                  <th className="px-6 py-5">Direction</th>
                  <th className="px-6 py-5">Counterparty</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.slice(0, 8).map((payment) => (
                  <tr key={`${payment.paymentId}-${payment.direction}`} className="border-t border-slate-200">
                    <td className="px-6 py-4 font-semibold">#{payment.orderId}</td>
                    <td className="px-6 py-4">{payment.direction}</td>
                    <td className="px-6 py-4">{payment.counterpartyName}</td>
                    <td className="px-6 py-4">{toCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-[var(--color-border)] p-6">
            <h2 className="text-2xl font-semibold">Client Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-5">Client</th>
                  <th className="px-6 py-5">Company</th>
                  <th className="px-6 py-5">Orders</th>
                  <th className="px-6 py-5">Spend</th>
                  <th className="px-6 py-5">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {activeClients.slice(0, 8).map((client) => (
                  <tr key={client.clientId} className="border-t border-slate-200">
                    <td className="px-6 py-4 font-semibold">{client.name}</td>
                    <td className="px-6 py-4">{client.company || "Individual"}</td>
                    <td className="px-6 py-4">{client.ordersCreated}</td>
                    <td className="px-6 py-4">{toCurrency(client.totalSpend)}</td>
                    <td className="px-6 py-4">{client.lastOrderLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
