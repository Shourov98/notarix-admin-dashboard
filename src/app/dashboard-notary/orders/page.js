"use client";

import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MessageSquare, 
  Download,
  RotateCcw,
  Calendar
} from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "#RON-2604270001",
    signerName: "Sarah Mitchell",
    serviceType: "Loan Signing",
    location: "Austin, TX",
    date: "Oct 24, 2024",
    status: "In Progress",
    statusColor: "bg-orange-50 text-orange-600",
    client: "Lone Star Title Services"
  },
  {
    id: "#2604270002",
    signerName: "Johnnathan Doe",
    serviceType: "Power of Attorney",
    location: "Remote Online",
    date: "Oct 25, 2024",
    status: "Confirmed",
    statusColor: "bg-emerald-50 text-emerald-600",
    client: "Acme Legal Services"
  }
];

export default function NotaryOrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Assignments Orders</h1>
          <p className="text-zinc-500 font-medium text-sm">Manage and track your notary assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-zinc-50 text-zinc-600 border border-zinc-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all active:scale-95">
            <Calendar className="w-4 h-4" />
            Schedule View
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden">
        {/* Filters & Actions Header */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status:</span>
              <select className="text-sm font-medium bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none">
                <option>All Statuses</option>
                <option>In Progress</option>
                <option>Confirmed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500 font-medium">Showing 1-2 of 2 assignments</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-zinc-500" />
              </button>
              <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signer's Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <Link href={`/dashboard-notary/orders/${order.id.replace('#', '')}`}>
                      <span className="text-sm font-bold text-[#1a4fdb] hover:underline cursor-pointer">{order.id}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-zinc-700">{order.signerName}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-600">{order.serviceType}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-500">{order.client}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-500">{order.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard-notary/orders/${order.id.replace('#', '')}`}>
                        <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
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
