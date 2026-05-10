"use client";

import { 
  Mic, 
  Video, 
  ScreenShare, 
  CircleDot, 
  ShieldCheck, 
  Info, 
  Video as VideoIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Type,
  Calendar,
  PenLine,
  PhoneOff,
  Settings,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function NotaryVideoSessionPage() {
  const { id } = useParams();

  return (
    <div className="h-screen bg-[#f4f5f7] flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 px-6 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-[#1a4fdb] font-bold text-lg">NotaryLive Secure Session</h1>
          <div className="h-6 w-px bg-zinc-200"></div>
          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Recording in Progress</span>
             <span className="text-[10px] font-bold text-rose-400 ml-1">00:24:15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-[#1a4fdb] px-4 py-1.5 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            End-to-End Encrypted
          </div>
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <VideoIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="ml-2 bg-[#1a4fdb] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#1541b8] transition-all">
            Complete Signing
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Video Feeds */}
        <div className="w-[500px] p-6 space-y-4 overflow-y-auto shrink-0 bg-white border-r border-zinc-100">
          {/* Main Notary Feed */}
          <div className="aspect-[4/3] bg-zinc-900 rounded-[32px] overflow-hidden relative shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" 
              alt="Notary" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Michael Sterling</span>
               <span className="text-[9px] font-bold text-blue-300 uppercase tracking-widest bg-blue-500/20 px-1.5 py-0.5 rounded">Notary Public</span>
               <Mic className="w-3 h-3 text-emerald-400" />
            </div>
            <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white/60 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Borrower Feed */}
             <div className="aspect-square bg-zinc-900 rounded-[24px] overflow-hidden relative shadow-lg border border-zinc-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Borrower" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                   <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Sarah Jenkins</span>
                   <span className="text-[8px] font-bold text-white/60 uppercase">Borrower</span>
                   <Mic className="w-2.5 h-2.5 text-emerald-400" />
                </div>
             </div>

             {/* Witness Feed / Waiting */}
             <div className="aspect-square bg-[#e9ecef] rounded-[24px] flex flex-col items-center justify-center relative border border-zinc-100 border-dashed">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                   <User className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-[2px]">Witness Participant</span>
                <div className="absolute bottom-3 left-3 bg-zinc-800 text-white text-[8px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                   Witness Waiting
                   <Mic className="w-2.5 h-2.5 text-rose-400" />
                </div>
             </div>
          </div>
        </div>

        {/* Right Pane: Document Workspace */}
        <div className="flex-1 flex flex-col relative bg-zinc-100/50 overflow-hidden">
          
          {/* Document Header Controls */}
          <div className="h-14 px-6 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-zinc-700">Refinance_Agreement_V4.pdf</span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1">
                 <button className="p-1 hover:bg-white rounded transition-colors text-zinc-400"><Minus className="w-3 h-3" /></button>
                 <span className="text-[10px] font-bold text-zinc-600 w-8 text-center">115%</span>
                 <button className="p-1 hover:bg-white rounded transition-colors text-zinc-400"><Plus className="w-3 h-3" /></button>
              </div>
              
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Page 4 of 28</span>
                 <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-zinc-50 rounded-lg border border-zinc-100 text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-zinc-50 rounded-lg border border-zinc-100 text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>
          </div>

          {/* Document Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-12 flex justify-center">
            <div className="bg-white w-full max-w-2xl shadow-2xl rounded-sm p-16 relative border border-zinc-200">
               <div className="space-y-12">
                  <div className="space-y-4">
                     <div className="h-6 bg-zinc-50 rounded w-1/2"></div>
                     <div className="h-3 bg-zinc-50 rounded w-full"></div>
                     <div className="h-3 bg-zinc-50 rounded w-11/12"></div>
                  </div>

                  {/* Required Signature Area */}
                  <div className="mt-20 border-2 border-dashed border-blue-200 bg-blue-50/20 rounded-2xl p-12 relative flex flex-col items-center justify-center">
                     <div className="absolute -top-3 left-4 bg-[#1a4fdb] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg">
                        REQUIRED SIGNATURE
                     </div>
                     
                     <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-6 h-32 flex items-center justify-center">
                        <span className="text-zinc-300 font-serif italic text-lg tracking-widest">Sign Here</span>
                     </div>
                     
                     <button className="mt-6 bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:scale-105 transition-all">
                        Sign Document
                     </button>
                  </div>
               </div>

               {/* Right Toolbar */}
               <div className="absolute -right-20 top-40 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-2 space-y-4">
                  <button className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl group transition-all">
                     <PenLine className="w-5 h-5 text-[#1a4fdb]" />
                     <span className="text-[8px] font-bold text-zinc-400 group-hover:text-[#1a4fdb] uppercase">Sign</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl group transition-all">
                     <Type className="w-5 h-5 text-zinc-400 group-hover:text-[#1a4fdb]" />
                     <span className="text-[8px] font-bold text-zinc-400 group-hover:text-[#1a4fdb] uppercase">Initial</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 hover:bg-blue-50 rounded-xl group transition-all">
                     <Calendar className="w-5 h-5 text-zinc-400 group-hover:text-[#1a4fdb]" />
                     <span className="text-[8px] font-bold text-zinc-400 group-hover:text-[#1a4fdb] uppercase">Date</span>
                  </button>
               </div>
               
               {/* Fixed Shield Icon */}
               <div className="absolute right-4 bottom-4 w-10 h-10 bg-white border border-zinc-100 rounded-full shadow-lg flex items-center justify-center text-[#1a4fdb]">
                  <ShieldCheck className="w-5 h-5" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <footer className="h-20 bg-white border-t border-zinc-200 px-12 flex items-center justify-center gap-8 shrink-0 relative">
        <div className="flex items-center gap-6">
           <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-[#1a4fdb] group-hover:text-white transition-all">
                 <Mic className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Mute</span>
           </button>
           <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-[#1a4fdb] group-hover:text-white transition-all">
                 <VideoIcon className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Camera</span>
           </button>
           <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-[#1a4fdb] group-hover:text-white transition-all">
                 <ScreenShare className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Share</span>
           </button>
           <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                 <CircleDot className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Record</span>
           </button>
        </div>

        <div className="h-8 w-px bg-zinc-200 mx-4"></div>

        <Link href={"/dashboard-notary/orders/" + (id || "2604270001")}>
           <button className="bg-rose-50 border border-rose-100 px-8 py-3 rounded-2xl flex items-center gap-3 group hover:bg-rose-500 transition-all shadow-sm">
              <PhoneOff className="w-5 h-5 text-rose-500 group-hover:text-white" />
              <span className="text-xs font-bold text-rose-600 group-hover:text-white uppercase tracking-widest">End Session</span>
           </button>
        </Link>
      </footer>
    </div>
  );
}
