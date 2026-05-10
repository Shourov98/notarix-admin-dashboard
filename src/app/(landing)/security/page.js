import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Radio, 
  Activity, 
  Info, 
  Database, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f1f3f9] rounded-3xl p-12 md:p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#1a4fdb]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
              Security & Data Protection
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl">
              Learn how Notarix protects your data and maintains platform security through state-of-the-art encryption and administrative safeguards.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment & Safeguards */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Our Commitment to Security</h2>
          <p className="text-zinc-600 mb-12 leading-relaxed">
            Notarix is committed to maintaining the confidentiality, integrity, and availability of user data. Our platform is built on a foundation of trust, ensuring that legal processes remain secure from end-to-end.
          </p>
          
          <div className="bg-white border border-zinc-100 rounded-2xl p-8 md:p-10 shadow-sm flex gap-6 items-start">
            <ShieldCheck className="w-6 h-6 text-[#1a4fdb] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Administrative, Technical, and Organizational Safeguards</h3>
              <p className="text-zinc-600 leading-relaxed">
                We implement multi-layered security protocols designed to prevent unauthorized access and ensure compliance with global data protection standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection Measures */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-zinc-900 mb-10">Data Protection Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f8f9fc] p-6 rounded-xl flex items-center gap-4">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span className="text-zinc-700 font-medium">Encryption during data transmission</span>
              </div>
              <div className="bg-[#f8f9fc] p-6 rounded-xl flex items-center gap-4">
                <Key className="w-5 h-5 text-emerald-600" />
                <span className="text-zinc-700 font-medium">Secure session handling</span>
              </div>
              <div className="bg-[#f8f9fc] p-6 rounded-xl flex items-center gap-4">
                <Radio className="w-5 h-5 text-emerald-600" />
                <span className="text-zinc-700 font-medium">Access control systems</span>
              </div>
              <div className="bg-[#f8f9fc] p-6 rounded-xl flex items-center gap-4">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-zinc-700 font-medium">Monitoring & logging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Service Providers */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Third-Party Service Providers</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            We partner with leading infrastructure, identity verification, and payment processing providers to deliver a seamless experience. These partners are vetted for their security posture and compliance with industry standards.
          </p>
          <div className="bg-[#eef2ff] border border-blue-100 rounded-2xl p-8 flex gap-6 items-start">
            <Info className="w-6 h-6 text-[#1a4fdb] flex-shrink-0 mt-1" />
            <p className="text-zinc-800 leading-relaxed italic">
              Notarix does NOT control third-party security systems. Users are encouraged to review the security policies of our service partners.
            </p>
          </div>
        </div>
      </section>

      {/* Document Storage & Responsibility */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Document Storage & Responsibility</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            While Notarix provides a secure environment for document processing, the final storage and long-term archival of notarized documents are critical user responsibilities.
          </p>
          <div className="border-l-4 border-[#1a4fdb] pl-8 py-2">
            <p className="text-zinc-900 font-bold text-lg leading-relaxed">
              Users are responsible for maintaining their own records and ensuring secure copies are stored in their own designated environments.
            </p>
          </div>
        </div>
      </section>

      {/* Verification & Authentication Limitations */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-8">Verification & Authentication Limitations</h2>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 md:p-10">
            <div className="flex gap-6 items-start">
              <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-red-900 leading-relaxed mb-4">
                  Our identity verification rely on third-party databases and biometric technology. While highly accurate, these systems have inherent technical limitations.
                </p>
                <p className="text-red-700 font-bold text-lg">
                  Verification does not eliminate fraud risks completely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Security Improvements */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Continuous Security Improvements</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Our security team monitors for emerging threats 24/7. We perform regular system updates and vulnerability assessments to adapt to the evolving cyber landscape.
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="text-orange-900 font-medium">
              No system can guarantee 100% security. We strive for maximum resilience.
            </p>
          </div>
        </div>
      </section>

      {/* Your Responsibility */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8">Your Responsibility</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-zinc-700 leading-relaxed">Protect login credentials and use strong, unique passwords.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-zinc-700 leading-relaxed">Use secure devices and trusted networks when accessing the platform.</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-zinc-700 leading-relaxed">Handle sensitive data following best practices for document safety.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="pt-12 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-8">Limitation of Liability</h2>
          <p className="text-zinc-600 mb-12 leading-relaxed">
            Notarix employs rigorous security measures, but is not liable for data breaches, cyber threats, or unauthorized access within legal limits and as defined in our Terms of Service.
          </p>
          <div className="bg-[#334155] rounded-xl p-8 text-center shadow-xl">
            <p className="text-white text-sm md:text-base font-bold tracking-widest uppercase">
              USE OF THE PLATFORM INVOLVES INHERENT RISKS.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
