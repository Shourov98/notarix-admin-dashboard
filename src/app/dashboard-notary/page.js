"use client";

import { 
  CheckSquare, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  MapPin,
  Building2,
  MoreVertical,
  Briefcase
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "COMPLETED TOTAL ASSIGNMENTS", value: "1,284", icon: CheckSquare, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "OPEN ASSIGNMENTS", value: "04", icon: Calendar, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "TOTAL EARNINGS", value: "$14,205", icon: CreditCard, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
];

const todayAssignments = [
  { time: "09:30 AM", name: "Benjamin Richardson", type: "Refinance - 42 Documents", status: "CONFIRMED", statusColor: "bg-emerald-50 text-emerald-600" },
  { time: "01:15 PM", name: "Elena Rodriguez", type: "Power of Attorney", status: "IN PROGRESS", statusColor: "bg-blue-50 text-blue-600" },
  { time: "04:00 PM", name: "Samuel Thompson", type: "Home Equity Line of Credit", status: "UPCOMING", statusColor: "bg-zinc-100 text-zinc-500" },
];

const newRequests = [
  {
    org: "First National Bank",
    type: "Mortgage Deed Signing",
    time: "Tomorrow, 10:00 AM",
    location: "Downtown, Seattle (2.4 mi)",
    price: "$125.00",
    icon: Building2
  },
  {
    org: "Westside Legal Group",
    type: "Affidavit Verification",
    time: "Oct 26, 11:30 AM",
    location: "Remote / Online",
    price: "$85.00",
    icon: Briefcase
  }
];

export default function NotaryDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-6 rounded-[32px] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Middle Left: Today's Assignments */}
        <div className="lg:col-span-8 bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-50 flex items-center justify-between bg-white">
            <h3 className="font-bold text-zinc-900">Today's Assignments</h3>
            <button className="text-xs font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">View Schedule</button>
          </div>
          <div className="flex-1">
            {todayAssignments.map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-6 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors group">
                <span className="text-sm font-bold text-zinc-900 w-20 shrink-0">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-800">{item.name}</h4>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">{item.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Right: Projected Earnings */}
        <div className="lg:col-span-4 bg-[#1a4fdb] rounded-[32px] p-8 text-white shadow-lg shadow-blue-100 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-4">Projected Earnings</p>
            <p className="text-4xl font-bold mb-2">$3,450.00</p>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Based on current schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: New Assignment Requests */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-zinc-900">New Assignment Requests</h3>
          <span className="bg-[#1a4fdb] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newRequests.map((req, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100">
                  <req.icon className="w-5 h-5" />
                </div>
                <p className="text-base font-bold text-zinc-900">{req.price}</p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-zinc-900">{req.org}</h4>
                  <p className="text-xs font-medium text-zinc-400 mt-0.5">{req.type}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{req.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{req.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button className="bg-[#1a4fdb] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95">
                  Accept
                </button>
                <button className="bg-white text-zinc-500 border border-zinc-100 py-2.5 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all active:scale-95">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
