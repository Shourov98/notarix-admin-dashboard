import { ShieldCheck } from "lucide-react";

const AuthShell = ({ children, compact = false }) => {
  return (
    <div className="min-h-screen bg-[#f8f7ff] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-[940px] overflow-hidden rounded-[28px] bg-[#2048e6] px-7 py-10 shadow-[0_28px_60px_rgba(32,72,230,0.22)] md:px-16 md:py-14">
          <div
            className={`mx-auto flex w-full flex-col text-white ${
              compact ? "max-w-[652px]" : "max-w-[760px]"
            }`}
          >
            <div className="mb-10 flex justify-center md:mb-12">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-xl border border-[#f2cf6a] bg-[#14253d] text-[#f2cf6a]">
                  <ShieldCheck className="h-9 w-9" />
                </span>
                <span className="text-3xl font-extrabold">
                  Notarix<sup className="text-sm">TM</sup>
                </span>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
