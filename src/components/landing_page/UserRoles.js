import { LayoutDashboard, TrendingUp, FileSignature, Shield } from "lucide-react";

export default function UserRoles() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-blue-900/10">
          
          {/* Left Side: Clients */}
          <div className="flex-1 bg-[#3b5bdb] p-12 lg:p-16 text-white">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-blue-200">
              For Individuals & Businesses
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Empowering Clients
            </h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="mt-1">
                  <LayoutDashboard className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Manage All Orders</h4>
                  <p className="text-blue-100 leading-relaxed text-sm">
                    A central hub to track multiple document requests and their current status.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="mt-1">
                  <TrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
                  <p className="text-blue-100 leading-relaxed text-sm">
                    Real-time updates from upload to final sealing with detailed audit trails.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professionals */}
          <div className="flex-1 bg-[#eef0f6] p-12 lg:p-16 text-zinc-900">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">
              For Legal Professionals
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Professional Notary Tools
            </h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="mt-1">
                  <FileSignature className="w-6 h-6 text-[#3b5bdb]" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Accept Assignments</h4>
                  <p className="text-zinc-600 leading-relaxed text-sm">
                    Receive automated lead notifications and manage your signing schedule effortlessly.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="mt-1">
                  <Shield className="w-6 h-6 text-[#3b5bdb]" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Digital Seal Management</h4>
                  <p className="text-zinc-600 leading-relaxed text-sm">
                    Apply your legally-compliant digital seal and electronic signature securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
