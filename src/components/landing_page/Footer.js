import { Facebook, Linkedin, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] pt-16 pb-8 px-6 text-[#475569] border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight">Notarix™</h2>
            <p className="text-sm leading-relaxed mb-6">
              Building the future of legal digital identity and document verification with precision and authority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-700 hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-zinc-700 hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-zinc-700 hover:text-black transition-colors border border-zinc-300 rounded-md p-1.5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Legal Validity</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">About</a></li>
              <li><a href="/trust" className="hover:text-zinc-900 transition-colors">Trust Center</a></li>
              <li><a href="/contact" className="hover:text-zinc-900 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Stay updated with legal tech trends.</p>
            <div className="flex h-10">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#1a4fdb] focus:border-[#1a4fdb] bg-white text-sm"
              />
              <button className="bg-[#1a4fdb] text-white px-5 rounded-r-md font-medium text-sm hover:bg-[#1541b8] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-200 text-center text-sm text-zinc-500">
          © 2026 Notarix™ Technologies Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
