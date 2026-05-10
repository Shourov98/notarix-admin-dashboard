"use client";

import { 
  Check, 
  ChevronRight, 
  Edit3, 
  Eye, 
  Download, 
  Plus, 
  FileText, 
  MessageSquare, 
  Paperclip, 
  Send, 
  Video, 
  Upload, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const steps = [
  { label: "Created", completed: true },
  { label: "Submitted", completed: true },
  { label: "Review", completed: true },
  { label: "Assigned", completed: true },
  { label: "In Progress", current: true, number: 5 },
  { label: "Completed", number: 6 },
];

export default function NotaryOrderDetailsPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
          <Link href="/dashboard-notary/orders" className="hover:text-zinc-900 transition-colors">Orders</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900">Details</span>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">Order {id || "#2604270001"}</h1>
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            In Progress
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between relative">
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
                {step.completed ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{step.number}</span>}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "FEE AMOUNT", value: "$150.00" },
          { label: "SIGNING DATE", value: "Apr 24, 2026", sub: "2:30 PM CST" },
          { label: "LOCATION", value: "Austin, TX-15423", sub: "Remote Portal" },
          { label: "ORDER TYPE", value: "Remote Online", sub: "Digital Notarization" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-6 rounded-[32px] shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
            {stat.sub && <p className="text-xs font-medium text-zinc-400 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Info */}
            <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">Client Info</h3>
                <button className="text-xs font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">Edit</button>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-2 shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg" alt="Lego" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Organization</p>
                    <p className="text-sm font-bold text-zinc-800">Lone Star Title Services</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Contact Agent</p>
                    <p className="text-sm font-bold text-zinc-800">Robert Sterling</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-zinc-800">+1 (555) 012-3456</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Email</p>
                    <p className="text-xs font-bold text-[#1a4fdb] break-all">r.sterling@lonestartitle.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrower Info */}
            <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">Borrower Info</h3>
                <button className="text-xs font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">Verify ID</button>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Full Name</p>
                  <p className="text-sm font-bold text-zinc-800">Sarah Mitchell</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Location</p>
                  <p className="text-sm font-bold text-zinc-800 text-zinc-500">Austin, TX</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">KBA Status</p>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-emerald-100">Passed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property & Signing Details */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
            <h3 className="font-bold text-zinc-900">Property & Signing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">Full Address</p>
                <p className="text-sm font-bold text-zinc-800 leading-relaxed">
                  7822 Barton Creek Dr<br />
                  Austin, TX 78735
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">Scheduled Time</p>
                <p className="text-sm font-bold text-zinc-800">October 24, 2024 at 2:30 PM CST</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">Notary Access Code</p>
              <p className="text-lg font-bold text-[#1a4fdb] tracking-[2px]">RON-992-X1</p>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Documents</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">
                <Plus className="w-3.5 h-3.5" />
                Add Documents
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Closing_Disclosure_Final.pdf", size: "2.4 MB • 12 Pages" },
                { name: "Warranty_Deed_Signed.pdf", size: "1.1 MB • 3 Pages" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl bg-zinc-50/20 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{doc.name}</p>
                      <p className="text-[10px] font-medium text-zinc-400">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-white rounded-lg transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-white rounded-lg transition-all shadow-sm"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Center */}
          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Message Center</h3>
              <div className="flex -space-x-2">
                {['CM', 'AD', 'NY'].map((initial, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${
                    initial === 'CM' ? 'bg-[#1a4fdb]' : initial === 'AD' ? 'bg-blue-600' : 'bg-zinc-800'
                  }`}>
                    {initial}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 space-y-8 bg-zinc-50/20 h-[320px] overflow-y-auto">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0">CM</div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Robert Sterling</span>
                    <span className="text-[9px] font-bold bg-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-widest">Client</span>
                    <span className="text-[10px] font-medium text-zinc-400">10:45 AM</span>
                  </div>
                  <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-none shadow-sm inline-block max-w-[80%]">
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                      Hi Team, I've just uploaded the finalized Disclosure. Sarah is ready for the session at 2:30.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">AD</div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Admin Support</span>
                    <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Admin</span>
                    <span className="text-[10px] font-medium text-zinc-400">10:48 AM</span>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl rounded-tl-none shadow-sm inline-block max-w-[80%]">
                    <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                      Confirmed, Robert. Sarah's KBA and ID verification have been successfully validated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-100 bg-white">
              <div className="relative group">
                <input type="text" placeholder="Type a message to participants..." className="w-full pl-4 pr-12 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-[#1a4fdb] transition-colors"><Send className="w-4 h-4" /></button>
                <button className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-[#1a4fdb] transition-colors"><Paperclip className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Remote Session Box */}
          <div className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden space-y-8 shadow-xl shadow-zinc-200/50">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">RON READY</span>
                <Video className="w-4 h-4 text-white/20 ml-auto" />
              </div>
              <h2 className="text-2xl font-bold">Remote Session</h2>
              <p className="text-white/40 font-medium text-sm leading-relaxed">
                Start the encrypted video session for legally binding signatures.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href={`/session-notary/${id || '2604270001'}`}>
                <button className="w-full bg-[#1a4fdb] text-white py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#1541b8] transition-all active:scale-95 shadow-lg shadow-blue-500/20 mb-3">
                  <Video className="w-5 h-5" />
                  Start Video Session
                </button>
              </Link>
              <button className="w-full bg-white/5 border border-white/10 text-white/80 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95">
                <Upload className="w-5 h-5" />
                Upload Documents
              </button>
              <button className="w-full bg-white/5 border border-white/10 text-white/80 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95">
                <CheckCircle2 className="w-5 h-5" />
                Mark Complete
              </button>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <h3 className="font-bold text-zinc-900">Payment</h3>
              <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-amber-100">Pending</span>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-zinc-900">$150.00</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-zinc-500">Due Date</span>
                <span className="text-zinc-900">Upon Completion</span>
              </div>
              <button className="w-full border border-zinc-200 text-zinc-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all active:scale-95">
                Download Invoice
              </button>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
            <h3 className="font-bold text-zinc-900">Audit Trail</h3>
            <div className="space-y-8 relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-100">
              {[
                { title: "KBA Identification Passed", time: "OCT 24, 10:15 AM", status: "success" },
                { title: "Witnesses Confirmed", time: "OCT 24, 09:30 AM", status: "success" },
                { title: "Order Initialized", time: "OCT 23, 04:15 PM", status: "info" },
              ].map((event, i) => (
                <div key={i} className="relative">
                  <div className={`absolute left-[-23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    event.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-[#1a4fdb]'
                  }`}></div>
                  <h4 className="text-xs font-bold text-zinc-800">{event.title}</h4>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">{event.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
