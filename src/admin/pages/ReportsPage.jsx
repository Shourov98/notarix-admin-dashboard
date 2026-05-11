import { Calendar, Download, ShieldCheck, Users } from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  MetricCard,
  MiniBarChart,
  PageHeader,
  StatusBadge,
} from "../components/ui";

const ReportsPage = () => {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Track performance, revenue, and system activity across the Notarix platform."
        actions={
          <>
            <Button variant="secondary" icon={Calendar}>Apr 1, 2026 - Apr 31, 2026</Button>
            <Button icon={Download}>Export Report</Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Orders" value="1,284" change="+12.5% vs last month" icon={Calendar} />
        <MetricCard label="Total Revenue" value="$42,900" change="+8.2% vs last month" icon={Calendar} />
        <MetricCard label="Notary Payouts" value="$28,450" change="+0.5% vs last month" icon={ShieldCheck} />
        <Card className="bg-[var(--color-brand-primary)] p-6 text-white shadow-[0_18px_28px_rgba(32,72,230,0.22)]">
          <p>Net Profit</p>
          <p className="mt-2 text-4xl font-extrabold">$14,450</p>
          <p className="mt-7 text-sm">↗ +15.8% v. prev period</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
        <Card className="p-7">
          <div className="mb-7 flex justify-between">
            <h2 className="text-2xl font-semibold">Revenue Over Time</h2>
            <div className="flex gap-6 text-sm"><span className="rounded-full bg-[#eeecfb] px-4 py-1 text-[var(--color-brand-primary)]">Days</span><span>Months</span></div>
          </div>
          <MiniBarChart values={[46, 72, 64, 80, 72, 96, 80]} />
        </Card>
        <Card className="p-7">
          <h2 className="mb-8 text-2xl font-semibold">Orders by Status</h2>
          {[
            ["Completed", "75", "bg-[var(--color-brand-primary)]"],
            ["In Progress", "15", "bg-orange-800"],
            ["Pending", "10", "bg-slate-600"],
          ].map(([label, value, color]) => (
            <div key={label} className="mb-8">
              <div className="mb-3 flex justify-between text-sm font-semibold"><span>{label}</span><span>{value}%</span></div>
              <div className="h-3 rounded-full bg-[#eeecfb]"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </Card>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[390px_minmax(0,1fr)]">
        <Card className="grid gap-6 bg-[#f0eefb] p-7">
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]"><Users className="h-6 w-6" /></span>
            <div><p className="text-slate-600">Total Clients</p><p className="text-3xl font-extrabold">12,402</p></div>
          </div>
          <div className="h-px bg-slate-300" />
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-200 text-slate-600"><ShieldCheck className="h-6 w-6" /></span>
            <div><p className="text-slate-600">Total Notaries</p><p className="text-3xl font-extrabold">842</p></div>
          </div>
        </Card>
        <Card className="p-7">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Payment Methods</h2>
            <p className="text-sm text-slate-500">Last 30 Days</p>
          </div>
          <div className="grid gap-8 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
            <div className="grid h-36 w-36 place-items-center rounded-full border-[14px] border-[var(--color-brand-primary)] text-3xl font-extrabold">68%</div>
            <div className="space-y-4">
              <div className="flex justify-between rounded-lg bg-[#eeecfb] p-3"><span>Credit/Debit Card</span><strong>$29,172</strong></div>
              <div className="flex justify-between rounded-lg bg-[#eeecfb] p-3"><span>Bank Transfer (ACH)</span><strong>$13,728</strong></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="p-7">
          <h2 className="mb-6 text-2xl font-semibold">Top Notaries</h2>
          {["Elena Rodriguez", "Marcus Chen", "Sarah Jenkins"].map((name, index) => (
            <div key={name} className="mb-4 flex items-center gap-4 last:mb-0">
              <Avatar name={name} src={index === 0 ? "/profile.jpg" : undefined} />
              <div><p className="font-bold">{name}</p><p className="text-sm text-slate-500">{42 - index * 4} Orders · ${(2.1 - index * 0.3).toFixed(1)}k</p></div>
            </div>
          ))}
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6">
            <h2 className="text-2xl font-semibold">Recent Activity Detail</h2>
            <Button variant="ghost">View All Records</Button>
          </div>
          <table className="min-w-full text-left">
            <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
              <tr><th className="px-6 py-5">Order ID</th><th className="px-6 py-5">Client</th><th className="px-6 py-5">Notary</th><th className="px-6 py-5">Revenue</th><th className="px-6 py-5">Payout</th><th className="px-6 py-5">Profit</th><th className="px-6 py-5">Status</th></tr>
            </thead>
            <tbody>
              {["#ORD-9402", "#ORD-9398", "#ORD-9395", "#ORD-9391"].map((id, index) => (
                <tr key={id} className="border-t border-slate-200">
                  <td className="px-6 py-5">{id}</td>
                  <td className="px-6 py-5">{["Global Tech Inc.", "Jennifer Wu", "Real Estate Pros", "Smith Family Trust"][index]}</td>
                  <td className="px-6 py-5">{["Elena R.", "Marcus C.", "Sarah J.", "Elena R."][index]}</td>
                  <td className="px-6 py-5">$150.00</td>
                  <td className="px-6 py-5 text-slate-500">$105.00</td>
                  <td className="px-6 py-5 font-bold text-[var(--color-brand-primary)]">$45.00</td>
                  <td className="px-6 py-5"><StatusBadge status={index === 2 ? "Pending" : "Signed"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
