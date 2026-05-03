import ComplianceStandards from "@/components/trust_page/ComplianceStandards";
import PrivacyFirst from "@/components/trust_page/PrivacyFirst";
import PlatformProtection from "@/components/trust_page/PlatformProtection";
import TrustCTA from "@/components/trust_page/TrustCTA";

export default function TrustCenterPage() {
  return (
    <main>
      <ComplianceStandards />
      <PrivacyFirst />
      <PlatformProtection />
      <TrustCTA />
    </main>
  );
}
