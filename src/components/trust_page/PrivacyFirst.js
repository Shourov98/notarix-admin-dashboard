import { CheckCircle2, Shield } from "lucide-react";

export default function PrivacyFirst() {
  return (
    <section className="bg-[#0a0f1e] py-24 px-6 md:px-12 lg:px-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div>
          <span className="text-[#a5b4fc] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            Privacy First
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            We do not monetize your document data.
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl leading-relaxed">
            Our platform is built on service-based fees not data usage. Access to sensitive information is restricted through internal controls and secure infrastructure.
          </p>
          
          <ul className="space-y-6">
            <li className="flex items-center gap-4 text-zinc-100 font-medium">
              <CheckCircle2 className="w-6 h-6 text-zinc-400" />
              <span>No third-party data sharing</span>
            </li>
            <li className="flex items-center gap-4 text-zinc-100 font-medium">
              <CheckCircle2 className="w-6 h-6 text-zinc-400" />
              <span>Automatic document expiration options</span>
            </li>
            <li className="flex items-center gap-4 text-zinc-100 font-medium">
              <CheckCircle2 className="w-6 h-6 text-zinc-400" />
              <span>GDPR & CCPA Compliant framework</span>
            </li>
          </ul>
        </div>

        {/* Right Side: Privacy Shield Card */}
        <div className="relative">
          <div className="bg-[#161d2d] rounded-3xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-bold">Privacy Shield</h3>
              <Shield className="w-6 h-6 text-zinc-400" />
            </div>

            <div className="bg-[#0a0f1e] rounded-xl p-6 border border-zinc-800 mb-8">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-widest">
                <span className="text-zinc-500">Encryption Key Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-full rounded-full"></div>
              </div>
            </div>

            <p className="text-zinc-500 text-sm italic leading-relaxed text-center">
              "User-controlled encryption ensures that NotaryTrust staff cannot view document content without explicit authorization."
            </p>
          </div>

          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1a4fdb] opacity-10 blur-[100px] rounded-full -z-10"></div>
        </div>

      </div>
    </section>
  );
}
