import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-6">
            Secure & Smart Notary Services – <span className="text-[#1a4fdb]">Anytime, Anywhere</span>
          </h1>
          <p className="text-lg text-zinc-600 mb-10 max-w-lg leading-relaxed">
            Connect with verified notaries, manage documents, and complete legal signing online via our state-of-the-art encrypted platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-[#4169e1] hover:bg-[#3152c7] text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors shadow-lg shadow-blue-100">
              Get Started as Client
            </button>
            <button className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 px-8 py-3.5 rounded-lg font-semibold text-base transition-colors">
              Join as Notary
            </button>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-widest">Trusted By</span>
            <div className="flex gap-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9l-3-3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200">
            <Image
              src="/landing_page/hero_image.png"
              alt="Notary services"
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          
          {/* Floating Status Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-zinc-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Document Status</p>
              <p className="text-sm font-bold text-zinc-900">Verified & Sealed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
