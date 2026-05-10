export default function OrderDistribution() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm h-full">
      <h3 className="text-xl font-bold text-zinc-900 mb-8">Order Distribution</h3>
      
      <div className="relative flex justify-center mb-8">
        {/* Simple CSS Donut Chart Mockup */}
        <div className="w-48 h-48 rounded-full border-[16px] border-[#1a4fdb] relative flex items-center justify-center">
          {/* Partially completed slice mockup */}
          <div className="absolute inset-[-16px] rounded-full border-[16px] border-amber-500 border-t-transparent border-r-transparent border-l-transparent rotate-[45deg]"></div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-zinc-900">124</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1a4fdb]"></div>
            <span className="text-sm font-medium text-zinc-600">Completed</span>
          </div>
          <span className="text-sm font-bold text-zinc-900">75%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium text-zinc-600">Active</span>
          </div>
          <span className="text-sm font-bold text-zinc-900">15%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
            <span className="text-sm font-medium text-zinc-600">Drafts</span>
          </div>
          <span className="text-sm font-bold text-zinc-900">10%</span>
        </div>
      </div>
    </div>
  );
}
