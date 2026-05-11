"use client";

import { 
  Download, 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Info,
  Building2,
  Search,
  ChevronDown,
  Eye,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export default function EarningsPage() {
  const chartHeights = [35, 48, 40, 62, 55, 75, 88, 68, 82, 72, 80, 92];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const earnings = [
    { id: "#ORD-4921", initials: "JD", color: "bg-blue-100 text-blue-600", client: "Jane Doe", service: "Online Notary", date: "Apr 12, 2026", amount: "$75.00", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500", method: "Visa (****4242)" },
    { id: "#ORD-4920", initials: "MS", color: "bg-purple-100 text-purple-600", client: "Mark Smith", service: "Loan Signing", date: "Apr 12, 2026", amount: "$250.00", status: "Processing", statusColor: "bg-blue-50 text-blue-600", dot: "bg-blue-500", method: "Bank Transfer" },
    { id: "#ORD-4919", initials: "RL", color: "bg-orange-100 text-orange-600", client: "Robert Lee", service: "Mobile Notary", date: "Apr 12, 2026", amount: "$120.00", status: "Pending", statusColor: "bg-orange-50 text-orange-600", dot: "bg-orange-500", method: "Stripe Connect" },
  ];

  const payouts = [
    { id: "#PAY-882193", date: "Oct 12, 2023", method: "Chase Bank (**** 8821)", amount: "$1,240.00", status: "Success" },
    { id: "#PAY-881042", date: "Sept 28, 2023", method: "Chase Bank (**** 8821)", amount: "$980.50", status: "Success" },
  ];

  const [activeTab, setActiveTab] = useState("Yearly");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Earnings & Payments</h1>
          <p className="text-zinc-500 font-medium text-sm">Monitor your income and manage payouts with precision.</p>
        </div>
        <button className="bg-white text-zinc-700 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-95 shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Earned", value: "$12,450.00", icon: Wallet, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
          { label: "This Month", value: "$3,842.15", icon: TrendingUp, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
          { label: "Pending", value: "$850.50", icon: Clock, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
          { label: "Paid Out", value: "$11,599.50", icon: CheckCircle2, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-6 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Chart & Payout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="xl:col-span-2 bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-bold text-zinc-900 text-lg">Revenue Performance</h3>
            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-1">
              {["Weekly", "Monthly", "Yearly"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === tab 
                      ? "bg-white text-[#1a4fdb] shadow-sm border border-zinc-100" 
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 relative pb-2">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[1, 2, 3, 4, 5].map((line) => (
                <div key={line} className="w-full h-px bg-zinc-50 border-dashed"></div>
              ))}
            </div>
            
            {chartHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-5 relative z-10">
                <div 
                  className="w-full bg-[#1a4fdb]/10 rounded-t-2xl transition-all hover:bg-[#1a4fdb]/20 cursor-pointer relative group" 
                  style={{ height: `${h}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl pointer-events-none">
                      ${(h * 120).toLocaleString()}
                   </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal & Last Payout */}
        <div className="space-y-6 h-[480px] flex flex-col">
          <div className="bg-[#1a4fdb] rounded-[32px] p-8 text-white shadow-lg shadow-blue-100 flex-1 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-100">Available for Withdrawal</span>
                <Info className="w-4 h-4 text-blue-200" />
              </div>
              <p className="text-4xl font-bold mb-6">$4,230.15</p>
              
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">Chase Business Checking</p>
                  <p className="text-[10px] font-medium text-blue-200">Ending in **** 8821</p>
                </div>
              </div>
            </div>
            <button className="w-full bg-white text-[#1a4fdb] font-bold text-sm py-4 rounded-[20px] hover:bg-zinc-50 transition-all active:scale-95 shadow-xl relative z-10">
              Withdraw Funds
            </button>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[24px] p-6 shadow-sm flex items-center justify-between shrink-0">
             <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" />
                   Last Payout
                </p>
                <p className="text-lg font-bold text-zinc-900">$1,240.00</p>
                <p className="text-xs font-medium text-zinc-500">Apr 12, 2026</p>
             </div>
             <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Success</span>
             </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row items-center gap-4 bg-white p-4 rounded-[24px] border border-zinc-100 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#1a4fdb] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Client Name or Order ID..." 
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            All Statuses <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            Last 30 Days <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            All Services <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Earnings Table */}
      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-zinc-100 bg-white">
            <h2 className="text-lg font-bold text-zinc-900">Recent Earnings</h2>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Method</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {earnings.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-zinc-900">{row.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${row.color}`}>
                         {row.initials}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">{row.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-600">{row.service}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-500">{row.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-zinc-900">{row.amount}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${row.statusColor}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${row.dot}`}></div>
                       {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-zinc-500">{row.method}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <button className="p-2 text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-5 h-5" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
         <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
          <span className="text-sm text-zinc-500 font-medium">Showing 1 to 3 of 152 transactions</span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors bg-white shadow-sm">Previous</button>
            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors bg-white shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-zinc-100 bg-white">
            <h2 className="text-lg font-bold text-zinc-900">Payout History</h2>
         </div>
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/30">
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payout ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {payouts.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-zinc-900">{row.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-600">{row.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-500">{row.method}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-bold text-zinc-900">{row.amount}</span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{row.status}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </div>

    </div>
  );
}
