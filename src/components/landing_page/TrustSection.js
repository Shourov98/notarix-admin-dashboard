import { Lock, Gauge, Award, ShieldCheck } from "lucide-react";

export default function TrustSection() {
  const trustFactors = [
    {
      title: "Secure & Encrypted",
      description: "Military-grade AES 256-bit encryption for every document stored and transmitted on our network.",
      icon: <Lock className="w-5 h-5 text-[#1a4fdb]" />,
    },
    {
      title: "Fast Turnaround",
      description: "Efficient, reliable notarization with a focus on accuracy.",
      icon: <Gauge className="w-5 h-5 text-[#1a4fdb]" />,
    },
    {
      title: "Verified Professionals",
      description: "We review notary's commission, E&O insurance coverage on a recurring basis.",
      icon: <Award className="w-5 h-5 text-[#1a4fdb]" />,
    },
    {
      title: "Controlled Workflow",
      description: "Full administrative oversight ensures that every signing event meets state-specific legal requirements.",
      icon: <ShieldCheck className="w-5 h-5 text-[#1a4fdb]" />,
    },
  ];

  return (
    <section className="bg-[#fcfcfd] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-16">
          Why Trust Notarix?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {trustFactors.map((factor, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="bg-[#eff3ff] p-4 rounded-full flex-shrink-0">
                {factor.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">{factor.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
