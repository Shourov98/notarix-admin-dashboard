import ComplianceStandards from "@/components/trust_page/ComplianceStandards";
import PrivacyFirst from "@/components/trust_page/PrivacyFirst";

export default function TrustCenterPage() {
  return (
    <main>
      <div className="bg-[#f8f9ff] py-20 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">Trust Center</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Our commitment to security, compliance, and transparency.
        </p>
      </div>
      
      <ComplianceStandards />
      <PrivacyFirst />

      <section className="py-24 px-8 max-w-4xl mx-auto text-center border-t border-zinc-100">
        <p className="text-lg text-zinc-600">
          More trust and security information coming soon.
        </p>
      </section>
    </main>
  );
}
