"use client";

import { 
  FileText, 
  Image as ImageIcon, 
  Eye, 
  Download, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  Calendar
} from "lucide-react";
import Link from "next/link";

const documents = [
  {
    name: "Loan_Agreement_V4.pdf",
    orderId: "#ORD-88219",
    uploadedBy: "CLIENT",
    uploadedByColor: "bg-blue-50 text-blue-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "ID_Verification_Front.jpg",
    orderId: "#ORD-90211",
    uploadedBy: "ADMIN",
    uploadedByColor: "bg-purple-50 text-purple-600",
    type: "Image",
    date: "Apr 27, 2026",
    size: "842 KB",
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    name: "Loan_Agreement_V4.pdf",
    orderId: "#ORD-88219",
    uploadedBy: "CLIENT",
    uploadedByColor: "bg-blue-50 text-blue-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "ID_Verification_Front.jpg",
    orderId: "#ORD-90211",
    uploadedBy: "ADMIN",
    uploadedByColor: "bg-purple-50 text-purple-600",
    type: "Image",
    date: "Apr 27, 2026",
    size: "842 KB",
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    name: "Notary_Seal_Certificate.pdf",
    orderId: "#ORD-87422",
    uploadedBy: "NOTARY",
    uploadedByColor: "bg-emerald-50 text-emerald-600",
    type: "PDF",
    date: "Apr 27, 2026",
    size: "1.1 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  }
];

export default function DocumentsTable() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden">
      {/* Filters & Tabs Header */}
      <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b md:border-b-0 border-zinc-100">
          {["All Documents", "My Uploads", "Shared with Me"].map((tab, i) => (
            <button 
              key={tab} 
              className={`pb-4 text-sm font-bold transition-all relative ${
                i === 0 ? "text-[#1a4fdb]" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab}
              {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a4fdb] rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Action Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all">
              Uploaded By
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all">
              File Type
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 transition-all">
              <Calendar className="w-3.5 h-3.5" />
              Date Range
            </button>
          </div>
          <button className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-zinc-100 transition-all">
            <Filter className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">File Name</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Uploaded By</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Size</th>
              <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {documents.map((doc, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <Link href="/document/123" className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.iconBg}`}>
                      <doc.icon className={`w-5 h-5 ${doc.iconColor}`} />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-[#1a4fdb] transition-colors cursor-pointer">{doc.name}</span>
                  </Link>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-zinc-500">{doc.orderId}</span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${doc.uploadedByColor}`}>
                    {doc.uploadedBy}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-zinc-500">{doc.type}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-zinc-500">{doc.date}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-zinc-500">{doc.size}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <Link href="/document/123">
                      <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
        <span className="text-sm text-zinc-500 font-medium">Showing 5 of 124 documents</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
