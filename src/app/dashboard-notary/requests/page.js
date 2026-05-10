"use client";

import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  AlertCircle,
  Inbox
} from "lucide-react";
import Link from "next/link";

const requests = [
  {
    id: "#ORD-4492",
    serviceType: "RON SERVICE",
    serviceColor: "bg-blue-50 text-[#1a4fdb]",
    isNew: true,
    location: "Virtual - Online Platform",
    subLocation: "Nationwide Connectivity",
    date: "Oct 24, 2023 • 02:30 PM",
    timeZone: "Eastern Standard Time (EST)",
    earnings: "$80",
    docs: "12 Pages",
    specialInstructions: "Loan modifications...",
    expires: "08:45"
  },
  {
    id: "#ORD-4510",
    serviceType: "IN-PERSON",
    serviceColor: "bg-zinc-100 text-zinc-600",
    isNew: true,
    location: "Austin, TX",
    subLocation: "4.2 miles away",
    date: "Oct 25, 2023 • 10:00 AM",
    timeZone: "Central Standard Time (CST)",
    earnings: "$125",
    docs: "45 Pages",
    specialInstructions: "Full closing docs...",
    expires: "15:20"
  },
  {
    id: "#ORD-4512",
    serviceType: "RON SERVICE",
    serviceColor: "bg-blue-50 text-[#1a4fdb]",
    isNew: true,
    location: "Virtual - Online Platform",
    subLocation: "Nationwide Connectivity",
    date: "ASAP • Priority",
    timeZone: "Ready for connection now",
    earnings: "$65",
    docs: "4 Pages",
    specialInstructions: "Power of Attorney...",
    expires: "02:15"
  }
];

export default function AssignmentRequestsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">New Assignment Requests</h1>
        <p className="text-zinc-500 font-medium text-sm">Review and accept available job requests in real-time.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row items-center gap-4 bg-white p-4 rounded-[24px] border border-zinc-100 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#1a4fdb] transition-colors" />
          <input 
            type="text" 
            placeholder="Search Location or Order ID" 
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            Service Type <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            Date Range <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
            Distance <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            All Filters
          </button>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-lg font-bold text-zinc-900">{req.id}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${req.serviceColor}`}>{req.serviceType}</span>
                {req.isNew && (
                  <span className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                    <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></div>
                    New Request
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">{req.location}</p>
                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5 uppercase tracking-wide">{req.subLocation}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">{req.date}</p>
                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5 uppercase tracking-wide">{req.timeZone}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between mb-6">
               <div>
                 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Estimated Earnings</p>
               </div>
               <div className="text-right">
                 <p className="text-sm font-bold text-[#1a4fdb]">You Earn:</p>
                 <p className="text-2xl font-black text-[#1a4fdb]">{req.earnings}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-50 pt-6 mb-6">
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Docs
                </p>
                <p className="text-xs font-bold text-zinc-800">{req.docs}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  Special Instructions
                </p>
                <p className="text-xs font-bold text-zinc-800 truncate">{req.specialInstructions}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-rose-500 mb-8">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Expires in {req.expires}</span>
            </div>

            <div className="grid grid-cols-5 gap-3 mt-auto">
               <button className="col-span-3 bg-[#1a4fdb] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95">
                 Accept Request
               </button>
               <button className="col-span-2 bg-white text-zinc-500 border border-zinc-200 py-3 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all active:scale-95">
                 Decline
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* No more requests section */}
      <div className="border-2 border-dashed border-zinc-100 rounded-[40px] p-16 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-50/20">
         <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
            <Inbox className="w-8 h-8 text-zinc-300" />
         </div>
         <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-900">No more requests?</h3>
            <p className="text-sm font-medium text-zinc-400 max-w-sm">We'll notify you as soon as new jobs matching your profile become available in your area.</p>
         </div>
         <button className="text-[#1a4fdb] font-bold text-sm hover:underline">Update Service Area Radius</button>
      </div>
    </div>
  );
}
