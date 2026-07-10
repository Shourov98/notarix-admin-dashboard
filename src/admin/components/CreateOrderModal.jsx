import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  MessageSquare,
  Search,
  Settings2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Field,
  Modal,
  SelectField,
  TextArea,
} from "./ui";
import {
  createAdminOrder,
  fetchAdminUsers,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const SERVICE_TYPES = [
  "Loan Signing",
  "Remote Notarization",
  "Estate Signing",
  "Title Signing",
  "General Notarization",
];

const PAYMENT_STATUSES = ["Pending", "Paid", "Overdue", "Refunded"];
const PAYMENT_METHODS = ["Card", "ACH", "Wire", "Check", "Cash"];
const PAPER_SIZES = ["Letter", "Legal", "A4"];
const INK_COLORS = ["Black", "Blue", "Mixed"];

const initialFormState = {
  clientUserId: "",
  vendorCode: "26NC4999",
  serviceType: "Loan Signing",
  signerFirstName: "",
  signerLastName: "",
  signerPhone: "",
  signerEmail: "",
  hasSecondarySigner: false,
  propertyAddress: {
    line1: "",
    city: "",
    state: "",
    zip: "",
    timeZone: "",
  },
  signingDate: "",
  signingTime: "",
  feeAmount: "",
  paymentStatus: "Pending",
  paymentMethod: "Card",
  dueDate: "",
  paidDate: "",
  paymentNotes: "",
  paperSize: "Letter",
  preferredInk: "Black",
  estimatedPages: "",
  isRon: false,
  specialInstructions: "",
};

const requiredFieldLabels = [
  ["clientUserId", "Client"],
  ["vendorCode", "Vendor Code"],
  ["serviceType", "Service Type"],
  ["signerFirstName", "Borrower first name"],
  ["signerLastName", "Borrower last name"],
  ["signerPhone", "Borrower phone"],
  ["signerEmail", "Borrower email"],
  ["propertyAddress.line1", "Street address"],
  ["propertyAddress.city", "City"],
  ["propertyAddress.state", "State"],
  ["propertyAddress.zip", "ZIP code"],
  ["signingDate", "Signing date"],
  ["signingTime", "Signing time"],
  ["feeAmount", "Fee amount"],
];

const getFieldValue = (formState, fieldPath) =>
  fieldPath.split(".").reduce((value, key) => value?.[key], formState);

const computeMissingFields = (formState) =>
  requiredFieldLabels
    .filter(([fieldPath]) => {
      const value = getFieldValue(formState, fieldPath);
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return value === null || value === undefined;
    })
    .map(([, label]) => label);

const getClientDisplayName = (client) =>
  client?.organization?.companyName ||
  client?.company ||
  client?.name ||
  client?.email ||
  "Unnamed client";

const matchesClient = (client, query) => {
  if (!query) return true;
  const haystack = [
    client?.name,
    client?.email,
    client?.organization?.companyName,
    client?.company,
    client?.primaryContact?.name,
    client?.primaryContact?.email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
};

// Single searchable combobox: typing in the input filters the dropdown
// below, clicking a result selects the client. We keep the dropdown open
// while typing and close on outside-click / Escape / selection.
const ClientCombobox = ({
  clients = [],
  value,
  onChange,
  isLoading = false,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const selectedClient = clients.find((client) => client.id === value) || null;

  useEffect(() => {
    if (!isOpen) {
      // When the dropdown closes, reset the search input to the selection
      // label so the field stays informative.
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const filteredClients = useMemo(
    () => clients.filter((client) => matchesClient(client, query)).slice(0, 100),
    [clients, query]
  );

  const handleSelect = (clientId) => {
    onChange(clientId);
    setIsOpen(false);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  };

  const displayValue = isOpen
    ? query
    : selectedClient
      ? getClientDisplayName(selectedClient)
      : "";

  const placeholder = isLoading
    ? "Loading clients…"
    : "Search by name, company, or email";

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          Client
          {required ? <span className="text-red-600"> *</span> : null}
        </span>
        <div
          className={`flex h-11 w-full items-center rounded-lg border bg-white transition-colors ${
            isOpen
              ? "border-[var(--color-brand-primary)] ring-2 ring-blue-100"
              : "border-[var(--color-border)]"
          } ${disabled ? "opacity-70" : ""}`}
          onClick={() => {
            if (disabled) return;
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <span className="grid h-11 w-11 place-items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder={placeholder}
            value={displayValue}
            onFocus={() => !disabled && setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            disabled={disabled}
            autoComplete="off"
            aria-label="Select a client"
          />
          {selectedClient ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="grid h-9 w-9 place-items-center text-slate-400">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </span>
          )}
        </div>
      </label>

      {isOpen ? (
        <div className="notarix-scrollbar absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
          {isLoading && clients.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              Loading clients…
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500">
              {query
                ? `No clients match "${query}".`
                : "No clients available yet."}
            </div>
          ) : (
            <ul role="listbox" className="py-1">
              {filteredClients.map((client) => {
                const isSelected = client.id === value;
                const displayName = getClientDisplayName(client);
                return (
                  <li key={client.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(client.id)}
                      className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-[var(--color-brand-primary)]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {displayName
                          .split(" ")
                          .map((part) => part[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {displayName}
                        </span>
                        {client.email ? (
                          <span className="block truncate text-xs text-slate-500">
                            {client.email}
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-bold uppercase text-[var(--color-brand-primary)]">
                          Selected
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
};

const CreateOrderModal = ({ open, onClose, onCreated }) => {
  const dispatch = useAppDispatch();
  const {
    users,
    usersStatus,
    createAdminOrderStatus,
    createAdminOrderError,
  } = useAppSelector(selectAdminConsole);

  const [formState, setFormState] = useState(initialFormState);
  const [missingFields, setMissingFields] = useState([]);

  // Load clients when the modal opens. We filter on the backend via `role`
  // and apply a search term locally so the dropdown stays responsive.
  useEffect(() => {
    if (!open) return;
    dispatch(fetchAdminUsers({ role: "Client", search: "" }));
  }, [dispatch, open]);

  // Reset the form whenever the modal is closed so reopens start fresh.
  useEffect(() => {
    if (!open) {
      setFormState(initialFormState);
      setMissingFields([]);
    }
  }, [open]);

  const updateField = (field, value) =>
    setFormState((current) => ({ ...current, [field]: value }));

  const updateAddressField = (field, value) =>
    setFormState((current) => ({
      ...current,
      propertyAddress: {
        ...current.propertyAddress,
        [field]: value,
      },
    }));

  const clientOptions = useMemo(
    () => (users || []).filter((user) => user.role === "Client"),
    [users]
  );

  const isSubmitting = createAdminOrderStatus === "loading";
  const loadingClients = usersStatus === "loading";

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const nextMissing = computeMissingFields(formState);
    setMissingFields(nextMissing);
    if (nextMissing.length > 0) {
      toast.error(`Please fill: ${nextMissing.join(", ")}`);
      return;
    }

    const feeAmount = Number(formState.feeAmount);
    if (!Number.isFinite(feeAmount) || feeAmount < 0) {
      toast.error("Fee amount must be a non-negative number.");
      setMissingFields(["Fee amount"]);
      return;
    }

    try {
      const result = await dispatch(
        createAdminOrder({
          ...formState,
          feeAmount,
        })
      ).unwrap();

      const orderId =
        result?.orderId ||
        result?.order?.rawId ||
        result?.order?.id ||
        "";

      toast.success(
        orderId ? `Order ${orderId} created and queued for review.` : "Order created successfully."
      );
      onCreated?.(orderId);
    } catch (error) {
      const message =
        (typeof error === "string" && error) ||
        error?.message ||
        createAdminOrderError ||
        "Unable to create order.";
      toast.error(message);
    }
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating…
          </>
        ) : (
          "Create Order"
        )}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={Briefcase}
      title="Create New Order"
      subtitle="Place an order on behalf of a client — it lands in Pending Admin Review."
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {missingFields.length > 0 ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Missing required fields: {missingFields.join(", ")}
          </div>
        ) : null}

        {/* Client (the only field unique to the admin form) */}
        <section>
          <SectionHeading icon={User} title="Client" />
          <ClientCombobox
            clients={clientOptions}
            value={formState.clientUserId}
            onChange={(next) => updateField("clientUserId", next)}
            isLoading={loadingClients}
            disabled={loadingClients && clientOptions.length === 0}
            required
          />
          <p className="mt-2 text-xs text-slate-500">
            The selected client becomes the order owner. They will receive all
            status updates and the in-app notification when a notary is assigned.
          </p>
        </section>

        {/* Client-side order details (mirrors the site form) */}
        <section>
          <SectionHeading icon={Briefcase} title="Client Order Information" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Vendor Code"
              required
              value={formState.vendorCode}
              onChange={(event) => updateField("vendorCode", event.target.value)}
            />
            <SelectField
              label="Service Type"
              required
              value={formState.serviceType}
              onChange={(event) => updateField("serviceType", event.target.value)}
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectField>
          </div>
        </section>

        {/* Borrower */}
        <section>
          <SectionHeading icon={User} title="Borrower Information" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="First Name"
              required
              value={formState.signerFirstName}
              onChange={(event) => updateField("signerFirstName", event.target.value)}
            />
            <Field
              label="Last Name"
              required
              value={formState.signerLastName}
              onChange={(event) => updateField("signerLastName", event.target.value)}
            />
            <Field
              label="Phone Number"
              required
              type="tel"
              value={formState.signerPhone}
              onChange={(event) => updateField("signerPhone", event.target.value)}
            />
            <Field
              label="Email"
              required
              type="email"
              value={formState.signerEmail}
              onChange={(event) => updateField("signerEmail", event.target.value)}
            />
            <label className="md:col-span-2 flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                checked={formState.hasSecondarySigner}
                onChange={(event) =>
                  updateField("hasSecondarySigner", event.target.checked)
                }
              />
              Include a secondary signer on this signing
            </label>
          </div>
        </section>

        {/* Property & Signing */}
        <section>
          <SectionHeading icon={MapPin} title="Property & Signing Details" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Street Address"
              required
              className="md:col-span-2"
              value={formState.propertyAddress.line1}
              onChange={(event) => updateAddressField("line1", event.target.value)}
            />
            <Field
              label="City"
              required
              value={formState.propertyAddress.city}
              onChange={(event) => updateAddressField("city", event.target.value)}
            />
            <Field
              label="State"
              required
              value={formState.propertyAddress.state}
              onChange={(event) => updateAddressField("state", event.target.value)}
            />
            <Field
              label="ZIP Code"
              required
              value={formState.propertyAddress.zip}
              onChange={(event) => updateAddressField("zip", event.target.value)}
            />
            <Field
              label="Time Zone"
              placeholder="e.g. CST, PST"
              value={formState.propertyAddress.timeZone}
              onChange={(event) => updateAddressField("timeZone", event.target.value)}
            />
            <Field
              label="Signing Date"
              required
              type="date"
              value={formState.signingDate}
              onChange={(event) => updateField("signingDate", event.target.value)}
            />
            <Field
              label="Signing Time"
              required
              type="time"
              value={formState.signingTime}
              onChange={(event) => updateField("signingTime", event.target.value)}
            />
          </div>
        </section>

        {/* Payment */}
        <section>
          <SectionHeading icon={CreditCard} title="Payment / Fee Details" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Fee Amount (USD)"
              required
              type="number"
              min="0"
              step="0.01"
              value={formState.feeAmount}
              onChange={(event) => updateField("feeAmount", event.target.value)}
            />
            <SelectField
              label="Payment Status"
              value={formState.paymentStatus}
              onChange={(event) => updateField("paymentStatus", event.target.value)}
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Payment Method"
              value={formState.paymentMethod}
              onChange={(event) => updateField("paymentMethod", event.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </SelectField>
            <Field
              label="Due Date"
              type="date"
              value={formState.dueDate}
              onChange={(event) => updateField("dueDate", event.target.value)}
            />
            <Field
              label="Paid Date"
              type="date"
              value={formState.paidDate}
              onChange={(event) => updateField("paidDate", event.target.value)}
            />
            <TextArea
              label="Payment Notes"
              className="md:col-span-2"
              placeholder="Optional notes about the payment arrangement"
              value={formState.paymentNotes}
              onChange={(event) => updateField("paymentNotes", event.target.value)}
            />
          </div>
        </section>

        {/* Service preferences */}
        <section>
          <SectionHeading icon={Settings2} title="Service Details" />
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Paper Size"
              value={formState.paperSize}
              onChange={(event) => updateField("paperSize", event.target.value)}
            >
              {PAPER_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Preferred Ink"
              value={formState.preferredInk}
              onChange={(event) => updateField("preferredInk", event.target.value)}
            >
              {INK_COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </SelectField>
            <Field
              label="Estimated Pages"
              type="number"
              min="0"
              value={formState.estimatedPages}
              onChange={(event) => updateField("estimatedPages", event.target.value)}
            />
            <label className="flex items-center gap-3 self-end text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                checked={formState.isRon}
                onChange={(event) => updateField("isRon", event.target.checked)}
              />
              Remote Online Notarization (RON)
            </label>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <SectionHeading icon={MessageSquare} title="Special Instructions" />
          <TextArea
            label="Notes for the notary"
            placeholder="Anything the assigned notary should know before the signing"
            value={formState.specialInstructions}
            onChange={(event) => updateField("specialInstructions", event.target.value)}
          />
        </section>
      </form>
    </Modal>
  );
};

const SectionHeading = ({ icon: IconProp, title }) => {
  const HeadingIcon = IconProp;
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-[var(--color-brand-primary)]">
        {HeadingIcon ? <HeadingIcon className="h-5 w-5" /> : null}
      </span>
      <h3 className="text-lg font-bold text-[var(--color-ink)]">{title}</h3>
    </div>
  );
};

export default CreateOrderModal;