import { FileText, Search, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import TermsSidebar from "@/components/terms_page/TermsSidebar";

export default function TermsOfUsePage() {
  const sections = [
    { id: "formation", title: "1. Formation of Agreement" },
    { id: "nature-scope", title: "2. Nature and Scope of Services" },
    { id: "verification", title: "3. Mandatory Verification Framework" },
    { id: "independent-status", title: "4. Independent Status of Notaries" },
    { id: "eligibility", title: "5. Eligibility and User Representations" },
    { id: "accounts", title: "6. Accounts and Security" },
    { id: "user-content", title: "7. User Content and Responsibility" },
    { id: "document-handling", title: "8. Document Handling and Data Security" },
    { id: "identity-limitations", title: "9. Identity Verification Limitations" },
    { id: "compliance", title: "10. Compliance with Notarial Laws" },
    { id: "signatures", title: "11. Electronic Signatures" },
    { id: "payment", title: "12. Payment and Financial Responsibility" },
    { id: "availability", title: "13. Platform Availability" },
    { id: "disclaimer", title: "14. Disclaimer of Warranties" },
    { id: "dispute", title: "15. Dispute Resolution" },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center border-b border-zinc-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
            <FileText className="w-8 h-8 text-[#1a4fdb]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Terms of Use
          </h1>
          <p className="text-zinc-600 mb-8">
            Governing your access and use of the Notarix platform
          </p>
          <div className="bg-blue-50/50 px-6 py-2 rounded-full text-sm font-medium text-[#1a4fdb] border border-blue-100">
            Effective Date: 1 September 2026
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-16">
        {/* Sticky Sidebar */}
        <TermsSidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Sticky Search Bar Mockup */}
          <div className="sticky top-24 z-20 bg-white/90 backdrop-blur-sm pt-4 pb-8 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search within Terms..." 
                className="w-full pl-12 pr-4 py-4 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/20 focus:border-[#1a4fdb] text-zinc-700 shadow-sm bg-white"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-24 pb-24">
            {/* 1. Formation of Agreement */}
            <section id="formation" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">1. Formation of Agreement</h2>
              <div className="bg-white border border-zinc-100 rounded-2xl p-8 shadow-sm">
                <p className="text-zinc-600 leading-relaxed mb-8">
                  By accessing or using the Notarix platform ("Platform"), you agree to be legally bound by these Terms of Use ("Terms"). This agreement constitutes a binding legal contract between you and Notarix Legal Technologies Inc. If you do not agree to these terms, you must immediately cease all use of the platform.
                </p>
                <div className="bg-blue-50 border-l-4 border-[#1a4fdb] p-6 rounded-r-xl">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#1a4fdb] mb-2">Important Legal Notice:</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    These terms contain an arbitration agreement and class action waiver that apply to all claims brought against Notarix. Please read carefully.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Nature and Scope of Services */}
            <section id="nature-scope" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">2. Nature and Scope of Services</h2>
              <p className="text-zinc-600 leading-relaxed mb-8">
                Notarix provides a technology platform that facilitates Remote Online Notarization (RON). Our services include secure identity verification, encrypted audio-visual communication, digital sealing tools, and electronic journal maintenance. Notarix acts as a software service provider and does not provide legal advice.
              </p>
              <div className="aspect-video w-full bg-zinc-100 rounded-3xl overflow-hidden relative group">
                <img 
                  src="/landing_page/hero_image.png" 
                  alt="Nature of Services" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </section>

            {/* 3. Mandatory Verification Framework */}
            <section id="verification" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">3. Mandatory Verification Framework</h2>
              <div className="bg-[#f8f9fc] border border-blue-50 rounded-3xl p-8 md:p-10">
                <p className="text-zinc-700 leading-relaxed mb-8">
                  Security is the cornerstone of the Notarix ecosystem. All users must undergo a multi-factor verification process before engaging in any notarial act. This includes:
                </p>
                <div className="space-y-4">
                  {[
                    { title: "Knowledge-Based Authentication (KBA)", desc: "Validating identity through series of personal history questions." },
                    { title: "Credential Analysis", desc: "Automated forensic analysis of government-issued identification." },
                    { title: "Biometric Comparison", desc: "Live facial recognition matching against credential images." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-5 h-5 text-[#1a4fdb] mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-zinc-900">{item.title}:</span>{" "}
                        <span className="text-zinc-600">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-amber-900">General Disclaimer</h4>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 italic leading-relaxed">
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES OF ANY KIND. NOTARIX DOES NOT GUARANTEE THAT THE USE OF THE PLATFORM WILL RESULT IN DOCUMENTS THAT ARE ACCEPTED BY ALL THIRD-PARTY RECIPIENTS OR GOVERNMENTAL ENTITIES.
                </p>
              </div>
            </section>

            {/* 4. Independent Status of Notaries */}
            <section id="independent-status" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">4. Independent Status of Notaries</h2>
              <p className="text-zinc-600 leading-relaxed mb-10">
                Notaries who use the Platform are independent contractors and public officials commissioned by their respective states. They are not employees or agents of Notarix. Notarix does not exercise control over the specific performance of a notarial act by a notary.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-[#eff1f9] p-8 rounded-2xl border border-blue-100/50">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Notary Responsibility</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    The notary is solely responsible for determining the signer's identity and willingness to sign under penalty of law.
                  </p>
                </div>
                <div className="bg-[#eff1f9] p-8 rounded-2xl border border-blue-100/50">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Platform Role</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    Notarix provides the technology for the session recording and credential analysis but does not attest to the truthfulness of the notary act.
                  </p>
                </div>
              </div>

              {/* Need Help Box */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Need Help?</h3>
                  <p className="text-zinc-600">Our support team is available 24/7 for legal and technical inquiries.</p>
                  <a href="mailto:owner@notarix.live" className="text-[#1a4fdb] font-semibold mt-4 block hover:underline">
                    owner@notarix.live
                  </a>
                </div>
                <button className="bg-[#1a4fdb] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-[#1541b8] transition-all shadow-lg shadow-blue-200">
                  <Mail className="w-5 h-5" />
                  Contact Support
                </button>
              </div>
            </section>

            {/* Placeholders for 5-15 */}
            {sections.slice(4).map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32 pt-8 border-t border-zinc-50">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">{section.title}</h2>
                <div className="bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl p-12 text-center">
                  <p className="text-zinc-400 italic">This section content follows our standard legal framework for {section.title.split('. ')[1].toLowerCase()}. Please refer to the full legal documentation for details.</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
