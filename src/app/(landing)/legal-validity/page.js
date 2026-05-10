import { 
  Gavel, 
  Scale, 
  CheckCircle2, 
  UserCheck, 
  FileText, 
  Info, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";

export default function LegalValidityPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8">
            <Gavel className="w-8 h-8 text-[#1a4fdb]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
            Legal Validity & Enforceability Notice
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Important information regarding the legal status and enforceability of documents processed through Notarix.
          </p>
        </div>
      </section>

      {/* Platform Role & Limitations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Platform Role & Limitations</h2>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              Notarix provides a technology platform designed to facilitate the execution and notarization of documents, 
              including electronic and remote online notarization where permitted.
            </p>
            <div className="bg-blue-50/50 border-l-4 border-[#1a4fdb] p-6 rounded-r-lg">
              <p className="text-zinc-800 font-medium italic">
                Notarix does not guarantee the legal validity, enforceability, or admissibility of any document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Factors Affecting Legal Validity */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">Factors Affecting Legal Validity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grid Items */}
            <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex flex-col">
              <Scale className="w-6 h-6 text-[#1a4fdb] mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">Legislative Compliance</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Adherence to Federal, state, and local laws governing electronic transactions.
              </p>
            </div>
            <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex flex-col">
              <CheckCircle2 className="w-6 h-6 text-[#1a4fdb] mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">Proper Execution</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Correct performance of notarial acts as required by specific jurisdiction rules.
              </p>
            </div>
            <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex flex-col">
              <UserCheck className="w-6 h-6 text-[#1a4fdb] mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">Identity & Authority</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Confirmation of the identity and legal authority of all participating parties.
              </p>
            </div>
            <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex flex-col">
              <FileText className="w-6 h-6 text-[#1a4fdb] mb-4" />
              <h3 className="font-bold text-zinc-900 mb-2">Transaction Type</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The specific nature of the document being signed or notarized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State-Level Regulations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start shadow-sm">
            <Info className="w-8 h-8 text-[#1a4fdb] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-[#1a4fdb] mb-4">State-Level Regulations</h2>
              <p className="text-zinc-600 leading-relaxed">
                Notarial laws vary significantly by state. While some jurisdictions allow full remote online notarization, others maintain strict restrictions or traditional physical presence requirements. Verification, recording, and record-keeping requirements differ across borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Limitations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Verification Limitations</h2>
            <p className="text-zinc-600 mb-8 leading-relaxed">
              Notarix may perform identity checks to assist in the notarial process. These checks rely on third-party databases and systems that are subject to error or omission.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-zinc-200 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-700">
              <span className="text-[#1a4fdb]">NOTICE:</span> Verification does not equal certification
            </div>
          </div>
        </div>
      </section>

      {/* Electronic Signature Compliance */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Electronic Signature Compliance</h2>
            <p className="text-zinc-600 leading-relaxed">
              Our processes are designed with the **ESIGN Act** and **UETA** frameworks in mind. However, the ultimate enforceability of an electronic signature depends on full legal compliance by all parties involved in the transaction.
            </p>
          </div>
          <div className="w-full md:w-64 h-64 bg-zinc-50 rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-[#1a4fdb]" />
            </div>
          </div>
        </div>
      </section>

      {/* No Legal Advice (Warning) */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-amber-900 tracking-tight text-[1.4rem]">No Legal Advice</h2>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Notarix does NOT provide legal advice or represent users in any legal capacity. The information provided on this platform is for general informational purposes only. Users should consult with a qualified attorney to address specific legal questions or document requirements.
            </p>
          </div>
        </div>
      </section>

      {/* User Acknowledgment */}
      <section className="pt-12 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">User Acknowledgment</h2>
          <p className="text-zinc-600 mb-12 leading-relaxed">
            By using this platform, users accept full responsibility for the use of the services. Notarix serves solely as a tool to facilitate signatures and notarial acts.
          </p>
          <div className="bg-[#0f172a] rounded-xl p-8 text-center shadow-xl">
            <p className="text-white text-xl md:text-2xl font-medium">
              All legal risks remain solely with the user.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
