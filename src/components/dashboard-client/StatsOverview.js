import { FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const stats = [
  { label: "TOTAL ORDERS", value: "124", trend: "+ 12% from last month", icon: FileText, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "ACTIVE ORDERS", value: "12", trend: "6 due this week", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "COMPLETED ORDERS", value: "108", trend: "98% satisfaction rate", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "PENDING ORDERS", value: "4", trend: "Awaiting signature", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stat.label === "TOTAL ORDERS" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
            <p className={`text-xs font-medium ${stat.label === "TOTAL ORDERS" ? "text-emerald-500" : "text-zinc-500"}`}>
              {stat.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
