"use client";

import { 
  Search, 
  Video, 
  Paperclip, 
  Send, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  MoreHorizontal,
  Download,
  FileText,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const conversations = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "10:24 AM",
    unread: true,
    orderId: "#RD-77291",
    preview: "I've attached the property survey f...",
    active: true,
    online: true
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    time: "Yesterday",
    unread: false,
    orderId: "#RD-88420",
    preview: "Thank you for the quick session!",
    active: false,
    online: false
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    time: "Oct 12",
    unread: false,
    orderId: "#RD-99124",
    preview: "Wait, I missed one page on the deed.",
    active: false,
    online: false
  }
];

export default function NotaryMessagesPage() {
  return (
    <div className="bg-white border border-zinc-200 rounded-[32px] shadow-sm flex h-[calc(100vh-13rem)] overflow-hidden font-sans">
      
      {/* Left Panel: Conversations List */}
      <div className="w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/30 shrink-0">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-zinc-900">Messages</h2>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#1a4fdb] transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 border-b border-zinc-200 pb-1">
            <button className="text-[10px] font-bold text-white bg-[#1a4fdb] px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest transition-all">All</button>
            <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 px-4 py-1.5 rounded-full uppercase tracking-widest transition-all">Unread</button>
            <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 px-4 py-1.5 rounded-full uppercase tracking-widest transition-all">Active</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`flex gap-3 p-4 cursor-pointer transition-colors relative ${
                conv.active ? "bg-white border-l-4 border-l-[#1a4fdb]" : "hover:bg-white border-l-4 border-l-transparent"
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-zinc-900 truncate">{conv.name}</h4>
                  <span className="text-[10px] font-medium text-zinc-400">{conv.time}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                   <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Order ID</span>
                   <span className="text-[10px] font-bold text-[#1a4fdb]">{conv.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 truncate font-medium">{conv.preview}</p>
                  {conv.unread && (
                    <div className="w-2 h-2 bg-[#1a4fdb] rounded-full shrink-0 ml-2 shadow-[0_0_8px_rgba(26,79,219,0.4)]"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Panel: Active Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-zinc-100">
        {/* Chat Header */}
        <div className="h-20 border-b border-zinc-50 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Jenkins" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 leading-none">Sarah Jenkins</h3>
              <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">Online</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1a4fdb] rounded-xl text-xs font-bold hover:bg-blue-100 transition-all active:scale-95 shadow-sm border border-blue-100">
            <Video className="w-3.5 h-3.5" />
            Request Video Session
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50/10">
          
          <div className="flex items-center justify-center">
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[4px] bg-white px-4 py-1 rounded-full border border-zinc-100 shadow-sm">Today</span>
          </div>

          {/* Incoming Message */}
          <div className="flex flex-col gap-2 max-w-[85%]">
            <div className="bg-white border border-zinc-100 p-5 rounded-[24px] rounded-tl-sm shadow-sm">
              <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                Good morning! I'm ready for the notarization. I've uploaded the property survey document for you to check first.
              </p>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">10:21 AM</span>
          </div>

          {/* Attachment Block */}
          <div className="flex flex-col gap-2 max-w-[85%]">
            <div className="bg-white border-2 border-dashed border-zinc-200 p-4 rounded-[24px] flex items-center justify-between gap-4 hover:border-[#1a4fdb]/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-800 truncate">Property_Survey.pdf</p>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">2.4 MB • PDF Document</p>
                </div>
              </div>
              <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-blue-50 rounded-lg transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">10:22 AM</span>
          </div>

          {/* Outgoing Message */}
          <div className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
             <div className="bg-[#1a4fdb] text-white p-5 rounded-[24px] rounded-tr-sm shadow-lg shadow-blue-100/50">
               <p className="text-sm font-medium leading-relaxed">
                 Received. I am reviewing the document now. It looks complete. Would you like to start the video verification session in 5 minutes?
               </p>
             </div>
             <div className="flex items-center gap-2 mr-1">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">10:24 AM • Read</span>
             </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 bg-white shrink-0 border-t border-zinc-50">
           <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-2 flex items-center gap-2 focus-within:border-[#1a4fdb]/30 transition-all shadow-inner">
              <button className="p-3 text-zinc-400 hover:text-[#1a4fdb] hover:bg-white rounded-xl transition-all">
                 <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                rows={1}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 text-zinc-700 placeholder:text-zinc-400 resize-none"
              ></textarea>
              <button className="p-3 bg-[#1a4fdb] text-white rounded-xl hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95">
                 <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* Right Panel: Order Context */}
      <div className="w-72 bg-white flex flex-col shrink-0 overflow-y-auto font-sans">
        <div className="p-6 border-b border-zinc-50 bg-zinc-50/30">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[2px]">Order Context</h3>
        </div>
        
        <div className="p-6 space-y-10 flex-1">
          {/* Order Identity */}
          <div className="space-y-4">
             <div className="space-y-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</p>
                <p className="text-lg font-bold text-zinc-900">#RD-77291</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Client</p>
                   <p className="text-xs font-bold text-zinc-700">Sarah J.</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Notary</p>
                   <p className="text-xs font-bold text-zinc-700">You</p>
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Status</p>
                <div className="flex items-center gap-1.5 text-[9px] font-bold bg-blue-50 text-[#1a4fdb] px-2 py-1 rounded uppercase tracking-widest border border-blue-100 w-fit">
                   <div className="w-1 h-1 bg-[#1a4fdb] rounded-full"></div>
                   Assigned
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Signing Date</p>
                <p className="text-sm font-bold text-zinc-800">Apr 24, 2026</p>
             </div>
          </div>

          <hr className="border-zinc-50" />

          {/* Quick Actions */}
          <div className="space-y-4">
             <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[2px]">Quick Actions</h4>
             <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:border-[#1a4fdb]/20 transition-all shadow-sm group">
                   <Eye className="w-4 h-4 text-zinc-400 group-hover:text-[#1a4fdb] transition-colors" />
                   View Order
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:border-[#1a4fdb]/20 transition-all shadow-sm group">
                   <CheckCircle2 className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                   Mark Complete
                </button>
             </div>
          </div>
        </div>

        {/* Secure Footer */}
        <div className="p-6 border-t border-zinc-50 bg-zinc-50/20">
           <div className="flex items-center gap-3 text-[#1a4fdb]/50">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] leading-tight">Secure Session Active</span>
           </div>
        </div>
      </div>

    </div>
  );
}
