"use client";

import { Camera, ChevronDown } from "lucide-react";

export default function NotaryProfilePage() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Profile Settings</h2>
        <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
          Save Changes
        </button>
      </div>

      <div className="p-8 space-y-12">
        {/* Profile Header */}
        <div className="flex items-center gap-8">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-50 shadow-md">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia" 
                alt="Nadia Jackson" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-zinc-900 leading-none">Nadia Jackson</h3>
              <div className="bg-blue-50 p-0.5 rounded-full">
                <div className="w-3.5 h-3.5 bg-[#1a4fdb] rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1 border-b-2 border-l-2 border-white transform -rotate-45 -translate-y-0.5"></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Notary</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              defaultValue="Nadia Jackson"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              defaultValue="n.jackson@notarymail.com"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</label>
            <input 
              type="text" 
              defaultValue="(555) 982-1142"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Coverage Areas</label>
            <input 
              type="text" 
              placeholder="e.g. Manhattan, Brooklyn"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        {/* Business Address Section */}
        <div className="border border-zinc-100 rounded-[24px] overflow-hidden max-w-4xl">
          <div className="p-4 border-b border-zinc-50 bg-zinc-50/20">
            <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-[2px]">Business Address</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address Line 1</label>
              <input 
                type="text" 
                defaultValue="742 Evergreen Terrace"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address Line 2</label>
                <input 
                  type="text" 
                  placeholder="Suite, Apt"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
                <input 
                  type="text" 
                  defaultValue="New York"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all cursor-pointer">
                    <option>New York</option>
                    <option>California</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</label>
                <input 
                  type="text" 
                  defaultValue="10001"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
