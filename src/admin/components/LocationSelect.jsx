import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, X } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const normalize = (value) => String(value || "").trim().toLowerCase();

/**
 * Reusable searchable combobox for selecting from a list of options.
 *
 * Props:
 *  - label, required, helper, error      Field metadata
 *  - value                                Currently selected value (string)
 *  - onChange(value)                      Fired when the user picks an option
 *  - options                              Array of `{value, label}` strings,
 *                                          plain strings, OR `{code, name}` objects
 *                                          when `optionValueKey`/`optionLabelKey` are set.
 *  - optionValueKey / optionLabelKey     Map custom option shapes (e.g. `code` / `name`).
 *  - disabled, placeholder
 *  - leftIcon                             Any lucide-react icon, shown inside the input
 *  - emptyMessage                         Shown when no options match the query
 *  - allowFreeText                        If true, picking nothing still keeps typed text
 *  - className                            Pass-through to outer wrapper
 */
export const LocationSelect = ({
  label,
  required = false,
  helper,
  error,
  value,
  onChange,
  options,
  optionValueKey = "value",
  optionLabelKey = "label",
  disabled = false,
  placeholder = "Type to search...",
  leftIcon,
  emptyMessage = "No matches found.",
  allowFreeText = false,
  className = "",
}) => {
  const listboxId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const LeftIconAlias = leftIcon || MapPin;

  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options
      .map((option) => {
        if (option === null || option === undefined) return null;
        if (typeof option === "string") {
          return { value: option, label: option };
        }
        if (typeof option !== "object") return null;
        const rawValue = option[optionValueKey];
        const rawLabel = option[optionLabelKey];
        if (rawValue === undefined || rawValue === null) return null;
        return {
          value: String(rawValue),
          label: String(rawLabel ?? rawValue),
        };
      })
      .filter(Boolean);
  }, [options, optionValueKey, optionLabelKey]);

  const [query, setQuery] = useState(value ? String(value) : "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Resolve the displayed text for the current `value`.
  // If `value` matches a known option, prefer the option's label so the user sees
  // the human-readable name (e.g. "Alabama") instead of the raw id (e.g. "AL").
  const valueToDisplay = useMemo(() => {
    if (value === undefined || value === null || value === "") return "";
    const match = normalizedOptions.find(
      (option) => String(option.value) === String(value)
    );
    if (match) return match.label;
    return String(value);
  }, [normalizedOptions, value]);

  // Sync external `value` changes back into the input (display label, not raw id).
  useEffect(() => {
    setQuery(valueToDisplay);
  }, [valueToDisplay]);

  // Filter options by case-insensitive substring match against label OR value.
  const filteredOptions = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return normalizedOptions;
    return normalizedOptions.filter((option) =>
      normalize(option.label).includes(needle) || normalize(option.value).includes(needle)
    );
  }, [normalizedOptions, query]);

  // Reset activeIndex when filtered list shrinks.
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Click-away closes the popup.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitValue = (next) => {
    setQuery(next);
    onChange?.(next);
  };

  const handleSelectOption = (option) => {
    commitValue(option.value);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = (event) => {
    event?.stopPropagation();
    commitValue("");
    setOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        filteredOptions.length === 0
          ? 0
          : (current + 1) % filteredOptions.length
      );
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        filteredOptions.length === 0
          ? 0
          : (current - 1 + filteredOptions.length) % filteredOptions.length
      );
      return;
    }
    if (event.key === "Enter") {
      if (!open) {
        setOpen(true);
        return;
      }
      const target = filteredOptions[activeIndex];
      if (target) {
        event.preventDefault();
        handleSelectOption(target);
      } else if (allowFreeText) {
        event.preventDefault();
        commitValue(query.trim());
        setOpen(false);
      }
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      if (allowFreeText && query.trim() !== (value || "")) {
        commitValue(query.trim());
      }
    }
  };

  const handleBlur = () => {
    // Free text: persist whatever the user typed.
    if (allowFreeText) {
      const trimmed = query.trim();
      if (trimmed !== (value || "")) {
        commitValue(trimmed);
      }
    }
  };

  const showClear = !disabled && (value || query);

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      {label ? (
        <label className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
          <span>{label}</span>
          {required ? <span className="text-rose-500">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "relative h-11 w-full rounded-lg border bg-white transition-colors",
          open
            ? "border-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-primary)]/15"
            : "border-slate-200 hover:border-slate-300",
          disabled && "cursor-not-allowed bg-slate-50",
          error && "border-rose-400"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center text-slate-400",
            disabled && "text-slate-300"
          )}
        >
          <LeftIconAlias className="h-4 w-4" />
        </span>
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "relative z-20 h-full w-full rounded-lg border-0 bg-transparent pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0",
            disabled && "cursor-not-allowed text-slate-400"
          )}
        />
        {showClear ? (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear selection"
            className="absolute inset-y-0 right-0 z-10 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 flex w-11 items-center justify-center text-slate-400 transition-transform",
              open && "rotate-180"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        )}

        {open ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-slate-900/5"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = normalize(option.value) === normalize(value);
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectOption(option);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition",
                      isActive ? "bg-slate-100" : "hover:bg-slate-50",
                      isSelected && "font-semibold text-[var(--color-brand-primary)]"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                    ) : null}
                  </button>
                );
              })
            )}
            {allowFreeText && query.trim() && filteredOptions.length > 0 ? (
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  commitValue(query.trim());
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:bg-slate-50"
              >
                <MapPin className="h-3.5 w-3.5" />
                Use "{query.trim()}"
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-xs font-medium text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
};

export default LocationSelect;