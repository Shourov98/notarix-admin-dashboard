"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function RequestAccessForm() {
  return (
    <section className="bg-[#fcfcfd] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Top Badge & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#eff1f9] text-[#475569] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Internal Review Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Request Access
          </h1>
          <p className="text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Complete the form below and our team will review your request and follow up with you shortly.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-100 shadow-xl shadow-zinc-200/50">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all"
                />
              </div>
              {/* Company */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Acme Legal Services"
                  className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all"
                />
              </div>
              {/* Contact Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Contact Type*
                </label>
                <select className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all appearance-none">
                  <option>Select your role</option>
                  <option>Individual</option>
                  <option>Business</option>
                  <option>Notary Agent</option>
                </select>
              </div>
              {/* Request Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Request Type*
                </label>
                <select className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all appearance-none">
                  <option>Select request reason</option>
                  <option>General Inquiry</option>
                  <option>Platform Access</option>
                  <option>Partnership</option>
                </select>
              </div>
            </div>

            {/* State/Coverage */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                State / Coverage Area
              </label>
              <input
                type="text"
                placeholder="Example: North Carolina, South Carolina, Nationwide"
                className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Message
              </label>
              <textarea
                placeholder="Tell us about your request..."
                rows={6}
                className="w-full bg-[#f8f9ff] border border-zinc-100 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-[#1a4fdb] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#1541b8] transition-colors shadow-lg shadow-blue-100">
                Submit Request
              </button>
              <Link 
                href="/"
                className="inline-flex items-center justify-center border border-zinc-200 text-zinc-700 px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
