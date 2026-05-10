"use client";

import { 
  Check, 
  User, 
  Info, 
  MessageSquare, 
  FileText, 
  Paperclip, 
  Send, 
  Video, 
  Headphones,
  ExternalLink,
  Download,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Created", completed: true },
  { label: "Submitted", completed: true },
  { label: "Admin Review", completed: true },
  { label: "Get rid of negotiation", completed: true },
  { label: "Assigned", current: true, number: 5 },
  { label: "In Progress", number: 6 },
  { label: "Completed", number: 7 },
];

export default function OrderDetailsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm flex items-center justify-between">
        <div className="flex gap-16">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-lg font-bold text-zinc-900">26NC4999</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Signer</p>
            <p className="text-lg font-bold text-zinc-900">Jonathan Miller</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Created</p>
            <p className="text-lg font-bold text-zinc-900">Apr 24, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a4fdb] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
          <ShieldCheck className="w-4 h-4" />
          Assigned
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between relative">
          {/* Connector Lines */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-100 -z-0"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step.completed 
                  ? "bg-[#1a4fdb] border-[#1a4fdb] text-white" 
                  : step.current
                    ? "bg-white border-[#1a4fdb] text-[#1a4fdb] ring-4 ring-blue-50"
                    : "bg-white border-zinc-100 text-zinc-300"
              }`}>
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{step.number}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step.current || step.completed ? "text-[#1a4fdb]" : "text-zinc-400"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Borrower Info */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-[#1a4fdb]">
              <User className="w-5 h-5" />
              <h3 className="font-bold text-zinc-900">Borrower Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-bold text-zinc-800">Jonathan Miller</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Address</p>
                <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                  4522 Oakwood Dr, Ste 400<br />
                  Austin, TX 78701
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Phone</p>
                <p className="text-sm font-bold text-zinc-800">(512) 555-0192</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email</p>
                <p className="text-sm font-bold text-zinc-800">j.miller@notarix.io</p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-[#1a4fdb]">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-zinc-900">Order Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Signing Type</p>
                <span className="inline-block bg-blue-50 text-[#1a4fdb] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Remote</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Scheduled Time</p>
                <p className="text-sm font-bold text-zinc-800">2:30 PM EST</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Instructions</p>
                <div className="bg-zinc-50 rounded-2xl p-4">
                  <p className="text-xs font-medium text-zinc-500 italic leading-relaxed">
                    "Please ensure all secondary signers have valid government-issued ID ready before the session starts."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Message Center & Documents */}
        <div className="lg:col-span-6 space-y-6">
          {/* Message Center */}
          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#1a4fdb]" />
                <h3 className="font-bold text-zinc-900">Message Center</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Support</span>
              </div>
            </div>
            
            <div className="p-6 h-[400px] overflow-y-auto space-y-6 bg-zinc-50/30">
              {/* Message from Client */}
              <div className="space-y-2 max-w-[80%]">
                <p className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest ml-1">Client: Jonathan Miller</p>
                <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <p className="text-sm font-medium text-zinc-600">Hi Sarah, just confirming the 2:30 PM slot. Will we be using the internal portal for the video?</p>
                </div>
              </div>

              {/* Message from Admin (Right aligned) */}
              <div className="space-y-2 ml-auto max-w-[80%] flex flex-col items-end">
                <p className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest mr-1 text-right">Admin: Notarix Support</p>
                <div className="bg-[#1a4fdb] p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-100">
                  <p className="text-sm font-medium text-white">Yes, Jonathan. Sarah will initiate the link through the dashboard 5 minutes prior.</p>
                </div>
              </div>

              {/* Message from Notary */}
              <div className="space-y-2 max-w-[80%]">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">Notary: Sarah Jenkins</p>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-sm font-medium text-zinc-600">Understood! I've reviewed the documents and I'm ready to proceed at 2:30.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-50 bg-white flex items-center gap-3">
              <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 text-sm font-medium focus:outline-none placeholder:text-zinc-400"
              />
              <button className="p-2.5 bg-[#1a4fdb] text-white rounded-xl hover:bg-[#1541b8] transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Section */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#1a4fdb]" />
              <h3 className="font-bold text-zinc-900">Document Section</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Closing_Disclosure.pdf</p>
                    <p className="text-[10px] font-medium text-zinc-400">Uploaded 2h ago • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[10px] font-bold text-zinc-400 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors">Preview</button>
                  <button className="text-[10px] font-bold text-zinc-400 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors">Download</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Title_Insurance_Agreement.pdf</p>
                    <p className="text-[10px] font-medium text-zinc-400">Uploaded 1h ago • 1.1 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-[10px] font-bold text-zinc-400 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors">Preview</button>
                  <button className="text-[10px] font-bold text-zinc-400 hover:text-[#1a4fdb] uppercase tracking-widest transition-colors">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notary & Actions */}
        <div className="lg:col-span-3 space-y-6">
          {/* Assigned Notary */}
          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-50 flex items-center gap-2 text-[#1a4fdb]">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Assigned Notary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Notary" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">Sarah Jenkins</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="space-y-4 border-b border-zinc-50 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Fee</span>
                <span className="text-sm font-bold text-zinc-800">$125.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Remote Convenience</span>
                <span className="text-sm font-bold text-zinc-800">$25.00</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest">Total Service Fee</span>
              <span className="text-lg font-bold text-[#1a4fdb]">$150.00</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button className="w-full bg-[#1a4fdb] text-white py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
              <Video className="w-4 h-4" />
              Request Video Session
            </button>
            <button className="w-full bg-zinc-50 text-zinc-600 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 border border-zinc-100 hover:bg-zinc-100 transition-all active:scale-95">
              <Headphones className="w-4 h-4" />
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
