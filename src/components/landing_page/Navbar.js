export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white border-b border-zinc-100 sticky top-0 z-50">
      {/* Left: Logo placeholder */}
      <div className="flex items-center gap-2">
        <div className="bg-[#1a4fdb] text-white w-8 h-8 flex items-center justify-center rounded font-bold text-sm">
          NT
        </div>
        <span className="text-xl font-bold text-zinc-900 tracking-tight">Notarix™</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="/" className="text-[#1a4fdb] font-semibold border-b-2 border-[#1a4fdb] pb-1 translate-y-[2px]">
          Home
        </a>
        <a href="/trust" className="text-zinc-600 hover:text-zinc-900 transition-colors">
          Trust Center
        </a>
        <a href="/contact" className="text-zinc-600 hover:text-zinc-900 transition-colors">
          Contact
        </a>
      </div>

      {/* Right: Auth Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <a href="/login" className="hidden sm:block text-zinc-600 font-medium hover:text-zinc-900 transition-colors">
          Log In
        </a>
        <button className="bg-[#1a4fdb] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:bg-[#1541b8] transition-colors text-sm md:text-base">
          Get Started
        </button>
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-zinc-600 p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </nav>
  );
}
