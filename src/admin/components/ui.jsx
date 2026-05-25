import { createElement } from "react";
import { Check, ChevronLeft, ChevronRight, Download, Eye, X } from "lucide-react";
import { cn } from "../utils/cn";

const toneMap = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  slate: "bg-slate-100 text-slate-700",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] shadow-[0_8px_18px_rgba(32,72,230,0.18)]",
    secondary: "border border-[var(--color-border)] bg-white text-slate-900 hover:bg-slate-50",
    subtle: "bg-[#eeecfb] text-slate-900 hover:bg-[#e4e1f4]",
    danger: "border border-red-500 bg-white text-red-600 hover:bg-red-50",
    dangerSolid: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", as = "section" }) =>
  createElement(
    as,
    {
      className: cn(
        "rounded-lg border border-[var(--color-border)] shadow-panel",
        !className.includes("bg-") && "bg-white",
        className
      ),
    },
    children
  );

export const PageHeader = ({ title, eyebrow, description, actions }) => (
  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      {eyebrow ? <p className="mb-1 text-sm uppercase tracking-normal text-slate-600">{eyebrow}</p> : null}
      <h1 className="text-3xl font-extrabold tracking-normal text-[var(--color-ink)] md:text-[2rem]">
        {title}
      </h1>
      {description ? <p className="mt-1 text-base text-slate-600">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
  </div>
);

export const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {Icon ? <Icon className="h-5 w-5 text-[var(--color-brand-primary)]" /> : null}
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
    </div>
    {action}
  </div>
);

export const IconChip = ({ icon: Icon, tone = "blue" }) => (
  <span className={cn("grid h-11 w-11 place-items-center rounded-lg", toneMap[tone])}>
    {createElement(Icon, { className: "h-5 w-5" })}
  </span>
);

export const MetricCard = ({ label, value, change, icon: Icon, tone = "blue", align = "left" }) => (
  <Card className="p-5">
    <div className={cn("flex items-start justify-between gap-4", align === "center" && "text-center")}>
      <IconChip icon={Icon} tone={tone === "danger" ? "red" : "blue"} />
      {change ? (
        <span
          className={cn(
            "text-xs font-bold",
            change.startsWith("-") ? "text-red-600" : "text-emerald-600"
          )}
        >
          {change}
        </span>
      ) : null}
    </div>
    <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">{value}</p>
  </Card>
);

export const StatusBadge = ({ status, className = "" }) => {
  const normalized = String(status || "").toLowerCase();
  const styles =
    {
      completed: "bg-emerald-100 text-emerald-700",
      complete: "bg-emerald-100 text-emerald-700",
      approved: "bg-emerald-50 text-emerald-700",
      verified: "bg-emerald-50 text-emerald-700",
      uploaded: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-50 text-blue-700",
      assigned: "bg-blue-50 text-blue-700",
      "in progress": "bg-blue-100 text-blue-700",
      pending: "bg-amber-100 text-amber-700",
      missing: "bg-red-100 text-red-700",
      rejected: "bg-red-100 text-red-700",
      failed: "bg-red-100 text-red-700",
      suspended: "bg-red-50 text-red-700",
      inactive: "bg-slate-100 text-slate-600",
      paid: "bg-emerald-100 text-emerald-700",
      outbound: "bg-orange-100 text-orange-700",
      inbound: "bg-blue-100 text-blue-700",
    }[normalized] || "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase leading-none",
        styles,
        className
      )}
    >
      {["active", "paid", "verified", "approved", "completed"].includes(normalized) ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      ) : null}
      {status}
    </span>
  );
};

export const Avatar = ({ name, tone = "bg-blue-100 text-blue-700", src, size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-xl",
  };
  const initials = String(name || "NX")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size])} />;
  }

  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full font-bold", sizes[size], tone)}>
      {initials}
    </span>
  );
};

export const Field = ({ label, required, className = "", inputClassName = "", ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required ? <span className="text-red-600"> *</span> : null}
    </span>
    <input className={cn("h-11 w-full", inputClassName)} {...props} />
  </label>
);

export const SelectField = ({ label, required, children, className = "", ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required ? <span className="text-red-600"> *</span> : null}
    </span>
    <select className="h-11 w-full" {...props}>
      {children}
    </select>
  </label>
);

export const TextArea = ({ label, required, className = "", ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
      {required ? <span className="text-red-600"> *</span> : null}
    </span>
    <textarea className="min-h-[96px] w-full py-3" {...props} />
  </label>
);

export const CheckboxLine = ({ label, description, checked = false, className = "" }) => (
  <label
    className={cn(
      "flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3",
      checked && "border-[var(--color-brand-primary)] bg-blue-50",
      className
    )}
  >
    <span
      className={cn(
        "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded border border-[var(--color-border)]",
        checked && "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white"
      )}
    >
      {checked ? <Check className="h-3.5 w-3.5" /> : null}
    </span>
    <span>
      <span className={cn("block font-semibold", checked && "text-[var(--color-brand-primary)]")}>
        {label}
      </span>
      {description ? <span className="block text-sm text-slate-600">{description}</span> : null}
    </span>
  </label>
);

export const SegmentedControl = ({ options, active, onChange, className = "" }) => (
  <div className={cn("inline-flex rounded-lg border border-[var(--color-border)] bg-[#eeecfb] p-1", className)}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange?.(option.value)}
        className={cn(
          "h-9 min-w-[88px] rounded-md px-4 text-sm font-semibold text-slate-600",
          active === option.value && "bg-white text-[var(--color-brand-primary)] shadow-panel"
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const ProgressBar = ({ value = 0 }) => (
  <div className="h-2 overflow-hidden rounded-full bg-[#e6e6f2]">
    <div className="h-full rounded-full bg-[var(--color-brand-primary)]" style={{ width: `${value}%` }} />
  </div>
);

export const MiniBarChart = ({ values = [] }) => {
  const bars = values.map((item) =>
    typeof item === "number" ? { value: item } : item
  );
  const maxValue = Math.max(...bars.map((bar) => Number(bar.value) || 0), 1);

  return (
    <div className="flex h-[270px] items-end gap-3 px-1" aria-label="Orders overview bar chart">
      {bars.map((bar, index) => {
        const rawValue = Number(bar.value) || 0;
        const height = Math.max(34, Math.min(100, (rawValue / maxValue) * 100));

        return (
          <div key={bar.label || index} className="flex h-full flex-1 items-end">
            <span
              className="w-full rounded-t-md bg-[#cfd6fb]"
              style={{ height: `${height}%` }}
              title={bar.label ? `${bar.label}: ${rawValue}` : String(rawValue)}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Pagination = () => (
  <div className="flex items-center gap-2">
    <Button variant="secondary" size="sm" className="w-9 px-0" aria-label="Previous">
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Button size="sm" className="w-9 px-0">
      1
    </Button>
    <Button variant="secondary" size="sm" className="w-9 px-0">
      2
    </Button>
    <Button variant="secondary" size="sm" className="w-9 px-0">
      3
    </Button>
    <Button variant="secondary" size="sm" className="w-9 px-0" aria-label="Next">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export const ActionIcons = ({ onPreview }) => (
  <div className="flex items-center gap-3 text-slate-500">
    <button type="button" onClick={onPreview} aria-label="View" className="text-[var(--color-brand-primary)]">
      <Eye className="h-4 w-4" />
    </button>
    <button type="button" aria-label="Download">
      <Download className="h-4 w-4" />
    </button>
  </div>
);

export const Modal = ({ title, subtitle, icon: Icon, open, onClose, children, footer, tone = "blue" }) => {
  if (!open) return null;
  const toneClass = tone === "danger" ? "bg-red-100 text-red-600" : "bg-blue-100 text-[var(--color-brand-primary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-modal">
        <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div className="flex items-start gap-4">
            {Icon ? (
              <span className={cn("grid h-10 w-10 place-items-center rounded-lg", toneClass)}>
                <Icon className="h-5 w-5" />
              </span>
            ) : null}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="notarix-scrollbar max-h-[calc(92vh-154px)] overflow-y-auto px-6 py-6">
          {children}
        </div>
        {footer ? <div className="border-t border-[var(--color-border)] bg-[#f3f1fb] px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
};
