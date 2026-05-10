"use client";

import { 
  User, 
  UserCircle, 
  FileCheck, 
  ShieldCheck, 
  Bell, 
  CreditCard 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { icon: User, label: "Profile", href: "/dashboard-notary/settings" },
  { icon: UserCircle, label: "Profile Details", href: "/dashboard-notary/settings/profile-details" },
  { icon: FileCheck, label: "Verification", href: "/dashboard-notary/settings/verification" },
  { icon: ShieldCheck, label: "Security", href: "/dashboard-notary/settings/security" },
  { icon: Bell, label: "Notifications", href: "/dashboard-notary/settings/notifications" },
  { icon: CreditCard, label: "Payments", href: "/dashboard-notary/settings/payments" },
];

export default function NotarySettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start relative">
      {/* Sticky Sidebar Container */}
      <div className="w-full lg:w-64 space-y-8 lg:sticky lg:top-0 shrink-0">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Settings</h1>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed">Manage account preferences</p>
        </div>

        {/* Sub Navigation */}
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-white text-[#1a4fdb] shadow-sm border border-zinc-100 ring-1 ring-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#1a4fdb]" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                <span className="text-sm font-bold">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-[#1a4fdb] rounded-full shadow-[0_0_8px_rgba(26,79,219,0.5)]"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden min-h-[600px]">
        {children}
      </div>
    </div>
  );
}
