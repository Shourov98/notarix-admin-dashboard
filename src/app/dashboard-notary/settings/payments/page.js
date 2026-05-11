"use client";

import { 
  CreditCard, 
  Plus, 
  ShieldCheck, 
  Info,
  CircleDot
} from "lucide-react";
import { useState } from "react";

export default function NotaryPaymentsSettingsPage() {
  const [schedule, setSchedule] = useState("Bi-weekly");

  return (
    <div className="flex flex-col h-full bg-white font-sans relative">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-1">Payment Settings</h2>
          <p className="text-zinc-500 font-medium text-sm">Manage your billing accounts, payout preferences, and financial security.</p>
        </div>
        <button className="bg-[#1a4fdb] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95">
          <Plus className="w-4 h-4" />
          Add Payment Method
        </button>
      </div>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto pb-32">
        
        {/* Default Payout Method */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-zinc-900">Default Payout Method</h3>
          <div className="p-6 border-2 border-[#1a4fdb]/10 bg-blue-50/10 rounded-[24px] flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-2 border-[#1a4fdb] flex items-center justify-center p-1 bg-white shadow-sm">
                <div className="w-full h-full bg-[#1a4fdb] rounded-full"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Stripe Connect</h4>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">Instant payouts available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Payout Schedule */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-zinc-900">Payout Schedule</h3>
            <div className="flex items-center bg-zinc-100/80 p-1 rounded-2xl border border-zinc-200/50">
              {["Weekly", "Bi-weekly", "Monthly"].map((option) => (
                <button 
                  key={option}
                  onClick={() => setSchedule(option)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                    schedule === option 
                      ? "bg-white text-[#1a4fdb] shadow-md border border-zinc-100" 
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-zinc-400 italic">
              Your next payout is scheduled for Friday, Apr 27.
            </p>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-zinc-900">Financial Summary</h3>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">Available for Payout</span>
                  <span className="text-xl font-bold text-[#1a4fdb]">$1,240.00</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-500">Pending Processing</span>
                  <span className="text-xl font-bold text-zinc-900">$340.50</span>
               </div>
               <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Payout</span>
                  <span className="text-xs font-bold text-zinc-700">$980.00 (Oct 12)</span>
               </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-[28px] p-6 flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100/50">
                 <div className="w-6 h-6 bg-[#1a4fdb] rounded-full shadow-[0_0_8px_rgba(26,79,219,0.4)]"></div>
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold text-[#1a4fdb]">Security Note</h4>
                 <p className="text-xs font-medium text-blue-600/80 leading-relaxed">
                    Payment details are securely stored and only visible to Super Admin
                 </p>
              </div>
           </div>
           <Lock className="w-6 h-6 text-blue-100 group-hover:text-blue-200 transition-colors" />
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-zinc-100 flex items-center justify-end gap-4 shrink-0 z-20">
         <button className="px-8 py-3 rounded-xl text-sm font-bold text-zinc-500 border border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95">
            Cancel Changes
         </button>
         <button className="px-10 py-3.5 bg-[#1a4fdb] text-white rounded-xl text-sm font-bold hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
            Save Payment Settings
         </button>
      </div>

    </div>
  );
}

function Lock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
