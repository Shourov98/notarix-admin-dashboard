"use client";

import { 
  Search, 
  Paperclip, 
  Send, 
  Eye, 
  ShieldAlert,
  FileText,
  Check,
  CheckCheck,
  Building2,
  CircleDot,
  Download
} from "lucide-react";
import Link from "next/link";

const conversations = [
  {
    id: 1,
    name: "Jonathan Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan",
    time: "10:45 AM",
    unread: 2,
    orderId: "#ORD-49210",
    preview: "I've uploaded the property de...",
    active: true,
    online: true
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    time: "Yesterday",
    unread: 0,
    orderId: "#ORD-38129",
    preview: "The signature witness is ready for th...",
    active: false,
    online: false
  },
  {
    id: 3,
    name: "Maria Gonzalez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    time: "Mon",
    unread: 0,
    orderId: "#ORD-88214",
    preview: "Thank you for the quick notarization!",
    active: false,
    online: false
  }
];

export default function MessagesPage() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm flex h-[calc(100vh-13rem)] overflow-hidden">
      
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

          <div className="flex items-center gap-6 border-b border-zinc-200 pb-1">
            <button className="text-sm font-bold text-white bg-[#1a4fdb] px-4 py-1.5 rounded-full shadow-sm">All</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Active</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Completed</button>
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-1.5 py-0.5 rounded">Order ID</span>
                  <span className="text-[10px] font-bold text-[#1a4fdb]">{conv.orderId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 truncate">{conv.preview}</p>
                  {conv.unread > 0 && (
                    <div className="w-4 h-4 bg-[#1a4fdb] rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ml-2">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Panel: Active Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="h-20 border-b border-zinc-100 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" alt="Jonathan Miller" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 leading-none">Jonathan Miller</h3>
                <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Client</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-emerald-500">Online</span>
                <span className="text-xs text-zinc-300">•</span>
                <span className="text-xs font-bold text-[#1a4fdb] hover:underline cursor-pointer">#ORD-49210</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
            <Eye className="w-4 h-4" />
            View Order
          </button>
        </div>

        {/* Security Banner */}
        <div className="bg-zinc-100/50 py-2.5 px-6 flex items-center justify-center gap-2 border-b border-zinc-100">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">External links are restricted for security purposes</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/20">
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full">Client • 09:30 AM</span>
          </div>

          {/* Incoming Message */}
          <div className="flex justify-start">
            <div className="bg-zinc-100 text-zinc-700 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm border border-zinc-200/50">
              <p className="text-sm font-medium leading-relaxed">
                Good morning! I just received the final draft for the property deed. Could you please check if the legal description on page 3 matches the recorded survey?
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 mt-6">
             <span className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest pr-1">You • 10:15 AM</span>
             {/* Outgoing Message */}
             <div className="bg-[#1a4fdb] text-white rounded-2xl rounded-tr-sm p-4 max-w-[80%] shadow-md shadow-blue-100">
               <p className="text-sm font-medium leading-relaxed">
                 Hello Jonathan. I am reviewing the document now. Please upload the survey map if you have the digital copy handy.
               </p>
             </div>
             <div className="flex items-center gap-1 text-zinc-400 pr-1">
                <span className="text-[10px] italic">Seen</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#1a4fdb]" />
             </div>
          </div>

          <div className="flex flex-col items-center mt-6">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full">Client • 10:45 AM</span>
          </div>

          {/* Incoming Message with Attachment */}
          <div className="flex justify-start">
            <div className="bg-zinc-100 text-zinc-700 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm border border-zinc-200/50 space-y-3">
              <p className="text-sm font-medium leading-relaxed">
                Sure thing, here is the scan of the survey map. Let me know if the resolution is good enough.
              </p>
              {/* Attachment */}
              <div className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">Property_Survey_2026.pdf</p>
                    <p className="text-[10px] font-medium text-zinc-500">2.4 MB • PDF Document</p>
                  </div>
                </div>
                <button className="p-2 border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 transition-colors shrink-0">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-100 bg-white flex items-center gap-3 shrink-0">
          <button className="p-3 border border-zinc-200 rounded-xl text-zinc-500 hover:bg-zinc-50 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
          <button className="px-6 py-3 bg-[#1a4fdb] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
            Send
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Panel: Order Details Context */}
      <div className="w-80 border-l border-zinc-100 bg-zinc-50/30 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-zinc-200/60">
          <h2 className="text-lg font-bold text-zinc-900">Order Details</h2>
        </div>
        
        <div className="p-6 space-y-8">
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order Identification</h3>
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm font-bold text-zinc-900">#ORD-49210-NJ</p>
              <p className="text-[10px] font-bold text-[#1a4fdb] mt-1">Verified Legal Transaction</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-[#1a4fdb]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Loan Signing</p>
                <p className="text-[10px] font-medium text-zinc-500">Real Estate Closing</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-200/60">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500">Borrower</span>
              <span className="text-sm font-bold text-zinc-900">Jonathan Miller</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500">Signing Date</span>
              <span className="text-sm font-bold text-zinc-900">Apr 24, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500">Location</span>
              <span className="text-sm font-bold text-zinc-900">Remote Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500">Status</span>
              <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-widest">In Progress</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-200/60">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-200">
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 bg-white border-2 border-[#1a4fdb] rounded-full ring-4 ring-blue-50"></div>
                <p className="text-xs font-bold text-zinc-900">Draft Document Uploaded</p>
                <p className="text-[10px] font-medium text-zinc-400 mt-0.5">Today, 10:45 AM</p>
              </div>
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 bg-zinc-200 rounded-full border-2 border-white"></div>
                <p className="text-xs font-medium text-zinc-500">Identity Verified</p>
                <p className="text-[10px] font-medium text-zinc-400 mt-0.5">Apr 22, 02:15 PM</p>
              </div>
              <div className="relative">
                <div className="absolute left-[-24px] top-1 w-3 h-3 bg-zinc-200 rounded-full border-2 border-white"></div>
                <p className="text-xs font-medium text-zinc-500">Order Initiated</p>
                <p className="text-[10px] font-medium text-zinc-400 mt-0.5">Apr 22, 11:30 AM</p>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
