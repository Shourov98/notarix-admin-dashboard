"use client";

import { 
  Monitor, 
  ChevronDown,
  ShieldCheck,
  Lock
} from "lucide-react";

export default function NotarySecurityPage() {
  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Security & Authentication</h2>
      </div>

      <div className="p-8 space-y-12 max-w-4xl">
        {/* Password Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Password</label>
            <input 
              type="password" 
              defaultValue="********"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        <hr className="border-zinc-50" />

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900">Two-Factor Authentication</h3>
            <p className="text-xs font-medium text-zinc-400">Add an extra layer of security to your account.</p>
          </div>
          <div className="w-12 h-6 bg-[#1a4fdb] rounded-full relative cursor-pointer shadow-sm shadow-[#1a4fdb]/20">
             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Login Activity */}
        <div className="border border-zinc-100 rounded-[24px] overflow-hidden">
          <div className="p-4 px-8 border-b border-zinc-50 bg-zinc-50/20">
            <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-[2px]">Login Activity</h3>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100/50">
                  <Monitor className="w-5 h-5 text-[#1a4fdb]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Chrome on MacOS</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase">New York, USA</span>
                    <span className="text-[10px] text-zinc-300">•</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active now</span>
                  </div>
                </div>
              </div>
              <button className="text-xs font-bold text-[#1a4fdb] hover:underline">Log out device</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
