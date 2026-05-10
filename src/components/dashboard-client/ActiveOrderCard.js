import { Video, Calendar } from "lucide-react";

export default function ActiveOrderCard() {
  return (
    <div className="bg-[#1a4fdb] rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-8 overflow-hidden relative group">
      {/* Background Pattern Mockup */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors"></div>
      
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active Priority</span>
          <span className="text-blue-100 font-medium text-sm">#26NC4999</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Remote Online Notarization</h2>
        <p className="text-blue-100 mb-6 flex items-center gap-2">
          Assigned Notary: <span className="text-white font-bold">John Smith</span> • Est. Completion: Today
        </p>
        
        <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="w-3/4 h-full bg-white rounded-full"></div>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white text-[#1a4fdb] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-black/10">
            Join Session
          </button>
          <button className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20">
            View Details
          </button>
        </div>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-center min-w-[240px] relative z-10 backdrop-blur-sm">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
          <Video className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">Scheduled for</p>
          <p className="text-2xl font-bold">2:30 PM EST</p>
        </div>
      </div>
    </div>
  );
}
