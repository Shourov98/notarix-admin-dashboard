"use client";

import { 
  Download, 
  Printer, 
  Trash2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ZoomOut, 
  ZoomIn, 
  Maximize, 
  RotateCcw,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function DocumentViewerPage() {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1">
            <Link href="/dashboard-client/documents" className="hover:text-zinc-900 transition-colors">Documents</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard-client/orders/ORD-88219" className="hover:text-zinc-900 transition-colors">Order #ORD-88219</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-900">Loan_Agreement_V4.pdf</span>
          </div>
          <h1 className="text-lg font-bold text-zinc-900 leading-none">Loan_Agreement_V4.pdf</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-zinc-200 mx-2"></div>
          <Link href="/dashboard-client/documents">
            <button className="p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Document Viewer */}
        <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col items-center justify-center p-8">
          
          {/* Document Container */}
          <div className="bg-white shadow-xl rounded-sm w-full max-w-3xl aspect-[8.5/11] p-12 overflow-hidden border border-zinc-200 relative flex flex-col">
            {/* Header of Doc */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-[#1a4fdb] text-2xl font-bold tracking-tight mb-2">LOAN AGREEMENT</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Official Verification Document</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-900 mb-1">NOTARIX ID: NX-992-B</p>
                <p className="text-xs font-medium text-zinc-500">Oct 24, 2023</p>
              </div>
            </div>

            {/* Simulated Content */}
            <div className="space-y-4 mb-12">
              <div className="h-3 bg-zinc-50 rounded w-full"></div>
              <div className="h-3 bg-zinc-50 rounded w-11/12"></div>
              <div className="h-3 bg-zinc-50 rounded w-full"></div>
              <div className="h-3 bg-zinc-50 rounded w-10/12"></div>
            </div>

            <div className="border border-zinc-100 rounded-2xl p-8 bg-white shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-4">1. Principal Loan Amount</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The Lender agrees to loan the Borrower the principal sum o The Borrower acknowledges receipt of the full principal amount and agrees to repay the same according to the terms set forth herein.
              </p>
            </div>
          </div>

          {/* Viewer Controls */}
          <div className="absolute bottom-8 bg-zinc-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl z-10">
            <div className="flex items-center gap-3">
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs font-medium w-24 text-center">Page 1 of 12</span>
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-4">
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-xs font-medium w-12 text-center">100%</span>
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><ZoomIn className="w-4 h-4" /></button>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><Maximize className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-white/10 rounded transition-colors"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Details */}
        <div className="w-80 bg-zinc-50 border-l border-zinc-200 flex flex-col shrink-0 overflow-y-auto relative">
          {/* File Details */}
          <div className="p-6 border-b border-zinc-200/60 space-y-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">File Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs font-medium text-zinc-500">Name</span>
                <span className="text-sm font-medium text-zinc-900 text-right break-all">Loan_Agreement_V4.pdf</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-zinc-500">Uploaded By</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">Sarah Jenkins</span>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-widest">Notary</span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-zinc-500">Date</span>
                <span className="text-sm font-medium text-zinc-900">Apr 30, 2026</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-zinc-500">Size</span>
                <span className="text-sm font-medium text-zinc-900">2.4 MB</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-medium text-zinc-500">Type</span>
                <span className="text-sm font-medium text-zinc-900">PDF</span>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="p-6 border-b border-zinc-200/60 space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Participants</h3>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Notary
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-rose-100">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Admin
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Client
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6 border-b border-zinc-200/60 space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notes</h3>
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
              <p className="text-sm font-medium text-zinc-800 italic leading-relaxed">
                "Please review the signature on page 4 specifically for the borrower's initials."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-zinc-400">Sent by Sarah J. • 2h ago</span>
                <button className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest hover:underline">Reply</button>
              </div>
            </div>
          </div>

          {/* Access Banner */}
          <div className="p-6 pb-32">
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lock className="w-5 h-5 text-[#1a4fdb] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#1a4fdb]">Full Access</p>
                <p className="text-xs font-medium text-blue-600/80">You have Full Access to this document.</p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-zinc-200 space-y-3 z-10">
            <button className="w-full bg-[#1a4fdb] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="w-full bg-white text-zinc-700 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95">
              <RotateCcw className="w-4 h-4" />
              Replace Version
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
