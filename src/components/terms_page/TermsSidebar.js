"use client";

import { useState, useEffect } from "react";

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

export default function TermsSidebar() {
  const [activeId, setActiveId] = useState("");
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6 text-[10px] tracking-[0.1em]">Sections</h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`block py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                activeId === section.id
                  ? "bg-blue-50 text-[#1a4fdb] font-semibold border-l-2 border-[#1a4fdb]"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
