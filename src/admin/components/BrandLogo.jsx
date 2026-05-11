import { ShieldCheck } from "lucide-react";

const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-[10px] border border-[#b99c46] bg-[#14253d] text-[#f2cf6a] shadow-panel">
        <ShieldCheck className="h-8 w-8" strokeWidth={1.8} />
      </div>
      {!compact ? (
        <div className="leading-none">
          <p className="text-[1.45rem] font-extrabold tracking-normal text-[#081126]">
            Notarix<sup className="text-xs">TM</sup>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default BrandLogo;
