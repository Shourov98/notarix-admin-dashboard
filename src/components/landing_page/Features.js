import { ShieldCheck, FileLock2, MessageSquare, Video, CheckCircle2 } from "lucide-react";

export default function Features() {
  const featureList = [
    {
      title: "Secure Upload",
      description: "End-to-end encrypted file storage ensures your sensitive data remains private.",
      icon: <FileLock2 className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Real-time Chat",
      description: "Communicate directly with your assigned notary through our secure messaging portal.",
      icon: <MessageSquare className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Verified Notaries",
      description: "Every professional on our platform undergoes rigorous background checks and credentialing.",
      icon: <ShieldCheck className="w-6 h-6 text-[#1a4fdb]" />,
    },
    {
      title: "Remote Online Notary",
      description: "Perform legal acts via live audio-visual technology from anywhere in the world.",
      icon: <Video className="w-6 h-6 text-[#1a4fdb]" />,
    },
  ];

  return (
    <section id="features" className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left Side: Header and Checklist */}
        <div className="lg:col-span-1">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-6">
            Designed for Security, Built for Speed.
          </h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Our platform integrates advanced legal tech features into a simple, user-friendly interface.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-[#1a4fdb] font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Fully PII & MISMO Compliant</span>
            </li>
            <li className="flex items-center gap-3 text-[#1a4fdb] font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Hosted on SOC 2 Type II compliant infrastructure</span>
            </li>
          </ul>
        </div>

        {/* Right Side: Feature Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#f5f7ff] p-8 rounded-2xl transition-all hover:bg-[#eff2ff]"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
