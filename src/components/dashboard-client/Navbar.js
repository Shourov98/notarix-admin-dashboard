import { Bell, Search, PlusCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar Placeholder */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#1a4fdb] transition-colors" />
          <input 
            type="text" 
            placeholder="Search orders, documents..." 
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="bg-[#1a4fdb] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-100 active:scale-95">
          <PlusCircle className="w-4 h-4" />
          Create New Order
        </button>

        <div className="w-px h-8 bg-zinc-100"></div>

        <button className="relative p-2 text-zinc-500 hover:bg-zinc-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-zinc-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-zinc-900 leading-none mb-1">Alex Sterling</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
