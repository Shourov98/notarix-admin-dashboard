import { FileText, UserCheck, Video, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Order",
      description: "Upload your documents and specify the type of notarization required.",
      icon: <FileText className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Admin Assigns",
      description: "Our system matches you with a qualified, verified notary agent immediately.",
      icon: <UserCheck className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Remote Signing",
      description: "Join a secure video session to sign and have your documents notarized.",
      icon: <Video className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Instant Delivery",
      description: "Download your legally binding, encrypted documents once complete.",
      icon: <Download className="w-6 h-6 text-[#1a4fdb]" />,
    },
  ];

  return (
    <section className="bg-[#f8f9ff] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Seamless Online Notarization
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Four simple steps to get your documents legally signed and sealed from the comfort of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
            >
              <div className="bg-[#eff3ff] p-3 rounded-xl mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
