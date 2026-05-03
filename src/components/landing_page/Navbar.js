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
      <div className="flex items-center gap-6">
        <a href="/login" className="text-zinc-600 font-medium hover:text-zinc-900 transition-colors">
          Log In
        </a>
        <button className="bg-[#1a4fdb] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1541b8] transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
}
