"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Trust Center", href: "/trust" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 px-6 max-w-7xl mx-auto">
        {/* Left: Logo placeholder */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#1a4fdb] text-white w-8 h-8 flex items-center justify-center rounded font-bold text-sm">
            NT
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">Notarix™</span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-all pb-1 translate-y-[2px] ${
                  isActive
                    ? "text-[#1a4fdb] border-b-2 border-[#1a4fdb]"
                    : "text-zinc-600 hover:text-zinc-900 border-b-2 border-transparent"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/login" 
            className="hidden sm:block text-zinc-600 font-medium hover:text-zinc-900 transition-colors text-sm"
          >
            Log In
          </Link>
          <button className="bg-[#1a4fdb] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:bg-[#1541b8] transition-colors text-sm md:text-base">
            Get Started
          </button>
          
          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden text-zinc-600 p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 py-4 px-6 space-y-4 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-semibold py-2 ${
                  isActive ? "text-[#1a4fdb]" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-4">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="text-zinc-600 font-medium text-base py-2"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
