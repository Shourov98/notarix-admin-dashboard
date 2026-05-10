import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MessageSquare, 
  MoreVertical,
  Download,
  RotateCcw
} from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "#26NC4999",
    signerName: "Sarah Harrison",
    serviceType: "Real Estate Closing",
    location: "Austin, TX 78799",
    date: "Apr 24, 2026",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-600",
    notary: {
      name: "Michael Scott",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    }
  },
  {
    id: "#26NC4999",
    signerName: "David Miller",
    serviceType: "Power of Attorney",
    location: "Dallas, TX 75299",
    date: "Apr 25, 2026",
    status: "In Progress",
    statusColor: "bg-orange-50 text-orange-600",
    notary: {
      name: "Pam Beesly",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pam"
    }
  },
  {
    id: "#26NC4999",
    signerName: "Elena Rodriguez",
    serviceType: "Loan Signing",
    location: "Houston, TX 77099",
    date: "Apr 26, 2026",
    status: "Assigned",
    statusColor: "bg-blue-50 text-blue-600",
    notary: {
      name: "Jim Halpert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jim"
    }
  },
  {
    id: "#26NC4999",
    signerName: "Robert Wilson",
    serviceType: "Health Directive",
    location: "San Antonio, TX 78299",
    date: "Apr 27, 2026",
    status: "Pending",
    statusColor: "bg-amber-50 text-amber-600",
    notary: null
  },
  {
    id: "#26NC4999",
    signerName: "Alice Cooper",
    serviceType: "Identity Verification",
    location: "Austin, TX 73799",
    date: "Apr 28, 2026",
    status: "Cancelled",
    statusColor: "bg-rose-50 text-rose-600",
    notary: {
      name: "Dwight Schrute",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dwight"
    }
  }
];

export default function OrdersTable() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden">
      {/* Filters & Actions Header */}
      <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status:</span>
            <select className="text-sm font-medium bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 transition-all cursor-pointer">
              <option>All Statuses</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Range:</span>
            <select className="text-sm font-medium bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 transition-all cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service:</span>
            <select className="text-sm font-medium bg-white border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 transition-all cursor-pointer">
              <option>All Services</option>
              <option>Real Estate Closing</option>
              <option>Power of Attorney</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">Showing 1-10 of 1,284 orders</span>
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
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Notary</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <Link href={`/dashboard-client/orders/${order.id.replace('#', '')}`}>
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
                  <span className="text-sm font-medium text-zinc-500">{order.location}</span>
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
                  {order.notary ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                        <img src={order.notary.avatar} alt={order.notary.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700">{order.notary.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-zinc-300 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    {order.status === "Cancelled" ? (
                      <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
        <div className="flex items-center gap-2">
          {[1, 2, 3, "...", 128].map((page, i) => (
            <button 
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                page === 1 
                  ? "bg-white border border-zinc-200 text-[#1a4fdb] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-bold text-[#1a4fdb] hover:text-[#1541b8] transition-colors">
          Download Report
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
