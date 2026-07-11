import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Edit3,
  Eye,
  FileText,
  FolderOpen,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  UserPlus,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, buildApiUrl } from "../../services/httpClient";
import {
  Avatar,
  Button,
  Card,
  Modal,
  PageHeader,
  SectionTitle,
  StatusBadge,
} from "../components/ui";
import OrderMessageCenter from "../components/OrderMessageCenter";
import {
  acceptAdminOrder,
  assignAdminOrderNotary,
  fetchAdminOrder,
  fetchAllAdminNotaries,
  fetchAdminOrders,
  fetchEligibleNotaries,
  rejectAdminOrder,
  reassignAdminOrderNotary,
  selectAdminConsole,
  updateAdminOrderStatus,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const friendlyApiError = (error, fallback) => {
  const raw = typeof error === "string" ? error : error?.message;
  if (!raw) return fallback;
  if (/networkerror|failed to fetch|load failed/i.test(raw)) {
    return "We couldn't reach the server. Check your internet connection and try again.";
  }
  if (/timeout|timed out/i.test(raw)) {
    return "The request took too long. Please try again in a moment.";
  }
  if (/validation|invalid/i.test(raw)) {
    return "Some of the information you entered isn't valid. Please review the form and try again.";
  }
  return raw;
};

const toDirectoryNotary = (notary) => ({
  id: notary.id,
  name: notary.name,
  email: notary.email,
  phone: notary.personalInfo?.phone || "",
  location: notary.area || notary.address?.state || "Coverage unknown",
  status: notary.status || "Pending",
  tags: [
    ...(notary.ronEligible ? ["RON"] : []),
    ...((notary.specialties || []).filter(Boolean)),
  ].slice(0, 3),
});

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const formatShortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatTimelineStamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const InfoRow = ({ label, value }) => (
  <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-4">
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
    <p className="mt-2 font-semibold text-slate-900">{value || "Not provided"}</p>
  </div>
);

const HIGHLIGHT_TERM_RX = /[\s\S]/; // placeholder to keep helper discoverable; actual highlight is done inline

const highlightMatch = (text, term) => {
  if (!text) return text;
  const value = String(text);
  const trimmed = term.trim();
  if (!trimmed) return value;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(`(${escaped})`, "ig");
  const parts = value.split(rx);
  return parts.map((part, index) =>
    rx.test(part) ? (
      <mark
        key={`hl-${index}`}
        className="rounded bg-[var(--color-brand-primary-soft)] px-0.5 font-bold text-[var(--color-brand-primary)]"
      >
        {part}
      </mark>
    ) : (
      <span key={`tx-${index}`}>{part}</span>
    )
  );
};

const NotarySearchCombobox = ({ notaries, eligibleNotaryIds, value, onChange }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const selected = notaries.find((notary) => notary.id === value) || null;

  const sorted = useMemo(() => {
    const eligibleSet = new Set(eligibleNotaryIds);
    return [...notaries].sort((left, right) => {
      const leftEligible = eligibleSet.has(left.id) ? 1 : 0;
      const rightEligible = eligibleSet.has(right.id) ? 1 : 0;
      if (leftEligible !== rightEligible) {
        return rightEligible - leftEligible;
      }
      return String(left.name || "").localeCompare(String(right.name || ""));
    });
  }, [eligibleNotaryIds, notaries]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sorted;
    return sorted.filter((notary) =>
      [notary.name, notary.email, notary.phone, notary.location]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [query, sorted]);

  // Reset active row whenever the filtered list changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [filtered.length, query]);

  // Click-outside closes the popover but never clears the selection.
  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (notaryId) => {
    onChange(notaryId);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.min(current + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      if (!open) return;
      const target = filtered[activeIndex];
      if (target) {
        event.preventDefault();
        handleSelect(target.id);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showChip = Boolean(selected) && !query && !open;
  const popoverVisible = open && (query.length > 0 || Boolean(selected) || notaries.length > 0);
  const eligibleSet = new Set(eligibleNotaryIds);
  const term = query.trim();

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Notary
      </label>
      <div
        className={`relative flex h-14 w-full items-center rounded-xl border bg-white pl-5 pr-14 text-base transition focus-within:ring-4 ${
          open
            ? "border-[var(--color-brand-primary)] ring-blue-200"
            : "border-[var(--color-border)]"
        }`}
      >
        {showChip ? (
          <div className="flex flex-1 items-center gap-3 truncate">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-brand-primary-soft)] text-xs font-bold text-[var(--color-brand-primary)]">
              {String(selected.name || "?")
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-semibold text-slate-900">{selected.name}</span>
              {selected.location ? (
                <span className="truncate text-xs text-slate-500">{selected.location}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <span className="mr-4 select-none text-base font-semibold uppercase tracking-wider text-slate-400">
              Search
            </span>
            <span className="mr-3 h-6 w-px bg-slate-200" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              className="h-full flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search notary by name, email, phone, or state..."
            />
          </>
        )}

        {(query || selected) ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className="absolute right-12 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        <Search
          className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
            open ? "text-[var(--color-brand-primary)]" : "text-slate-400"
          }`}
        />
      </div>

      {popoverVisible ? (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-xl">
          {notaries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-slate-500">
              <UserRound className="h-6 w-6 text-slate-300" />
              No notary records are available yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-slate-500">
              <Search className="h-6 w-6 text-slate-300" />
              No notaries match
              <span className="font-semibold text-slate-700"> &ldquo;{term}&rdquo;</span>.
            </div>
          ) : (
            <ul
              role="listbox"
              className="max-h-72 overflow-y-auto py-1"
            >
              {filtered.map((notary, index) => {
                const isSelected = selected?.id === notary.id;
                const isActive = index === activeIndex;
                const isEligible = eligibleSet.has(notary.id);
                return (
                  <li
                    key={notary.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
                      isActive ? "bg-[var(--color-brand-primary-soft)]" : "hover:bg-slate-50"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(notary.id)}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-brand-primary-soft)] text-xs font-bold text-[var(--color-brand-primary)]">
                      {String(notary.name || "?")
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {highlightMatch(notary.name, term)}
                        </p>
                        {isEligible ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-brand-primary-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-primary)]" />
                            Eligible
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {[notary.location, notary.email].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                    ) : (
                      <span className="h-4 w-4 shrink-0" />
                    )}
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

const AssignModal = ({ open, onClose, notaries, eligibleNotaryIds, onSubmit, status, title }) => {
  const [selectedNotaryId, setSelectedNotaryId] = useState("");
  const [notaryOfferAmount, setNotaryOfferAmount] = useState("");
  const [payoutReleaseDays, setPayoutReleaseDays] = useState("7");
  const [assignmentNotes, setAssignmentNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelectedNotaryId(eligibleNotaryIds[0] || notaries[0]?.id || "");
    setNotaryOfferAmount("");
    setPayoutReleaseDays("7");
    setAssignmentNotes("");
  }, [eligibleNotaryIds, notaries, open]);

  const handleSubmit = async () => {
    if (!selectedNotaryId) {
      toast.error("Select a notary before continuing.");
      return;
    }

    await onSubmit({
      notaryId: selectedNotaryId,
      notaryOfferAmount:
        notaryOfferAmount === "" ? undefined : Number(notaryOfferAmount),
      payoutReleaseDays:
        payoutReleaseDays === "" ? undefined : Number(payoutReleaseDays),
      assignmentNotes,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Use live notary records from MongoDB."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Confirm"}
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Notary Offer</span>
          <input
            type="number"
            className="h-11 w-full"
            value={notaryOfferAmount}
            onChange={(event) => setNotaryOfferAmount(event.target.value)}
            placeholder="80"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Payout Release Days</span>
          <input
            type="number"
            className="h-11 w-full"
            value={payoutReleaseDays}
            onChange={(event) => setPayoutReleaseDays(event.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Assignment Notes</span>
          <textarea
            className="min-h-[96px] w-full rounded-lg border border-[var(--color-border)] px-3 py-3"
            value={assignmentNotes}
            onChange={(event) => setAssignmentNotes(event.target.value)}
            placeholder="Optional notes for this assignment."
          />
        </label>
      </div>

      <div className="mt-6">
        <NotarySearchCombobox
          notaries={notaries}
          eligibleNotaryIds={eligibleNotaryIds}
          value={selectedNotaryId}
          onChange={setSelectedNotaryId}
        />
      </div>
    </Modal>
  );
};

const RejectModal = ({ open, onClose, onSubmit, status }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Add a short rejection reason for the client record.");
      return;
    }

    await onSubmit(reason.trim());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reject Order"
      subtitle="This reason will be stored on the order record."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="dangerSolid" onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Rejecting..." : "Reject Order"}
          </Button>
        </div>
      }
    >
      <textarea
        className="min-h-[120px] w-full rounded-lg border border-[var(--color-border)] px-3 py-3"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Explain why this order cannot move forward."
      />
    </Modal>
  );
};

const RejectDocumentModal = ({ open, onClose, onSubmit, status, documentName }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Add a rejection reason for this document.");
      return;
    }

    await onSubmit(reason.trim());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reject Order Document"
      subtitle={documentName ? `This note will be saved for ${documentName}.` : "This note will be saved on the rejected document."}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="dangerSolid" onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Reject Document"}
          </Button>
        </div>
      }
    >
      <textarea
        className="min-h-[120px] w-full rounded-lg border border-[var(--color-border)] px-3 py-3"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Explain why this uploaded document is being rejected."
      />
    </Modal>
  );
};

const CancelOrderModal = ({ open, onClose, onSubmit, status }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Add a short cancellation reason.");
      return;
    }
    await onSubmit(reason.trim());
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cancel Order"
      subtitle="This action cannot be undone. The order will move to a terminal Cancelled state."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Keep Order</Button>
          <Button variant="dangerSolid" onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      }
    >
      <textarea
        className="min-h-[120px] w-full rounded-lg border border-[var(--color-border)] px-3 py-3"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Explain why this order is being cancelled."
      />
    </Modal>
  );
};

const OrderDetailsPage = () => {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const {
    activeOrder,
    activeOrderStatus,
    activeOrderError,
    allNotaries,
    allNotariesStatus,
    eligibleNotaries,
    eligibleNotariesStatus,
    orderActionStatus,
  } = useAppSelector(selectAdminConsole);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [documentActionStatus, setDocumentActionStatus] = useState("ready");
  const [documentRejectTarget, setDocumentRejectTarget] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminOrder(id));
    }
  }, [dispatch, id]);

  const canReview = useMemo(
    () => activeOrder?.workflowStatus === "Pending Admin Review",
    [activeOrder]
  );
  const hasOrderDocuments = useMemo(
    () => Array.isArray(activeOrder?.documents) && activeOrder.documents.length > 0,
    [activeOrder]
  );
  const allOrderDocumentsVerified = useMemo(
    () =>
      !hasOrderDocuments ||
      (activeOrder?.documents || []).every((document) => document.status === "Verified"),
    [activeOrder, hasOrderDocuments]
  );
  const canAssign = useMemo(
    () => ["Accepted By Admin", "Needs Reassignment", "Assigned"].includes(activeOrder?.workflowStatus || "") || activeOrder?.status === "Pending",
    [activeOrder]
  );
  const canReassign = useMemo(
    () =>
      [
        "Notary Assigned",
        "Accepted By Notary",
        "Rejected By Notary",
        "Needs Reassignment",
      ].includes(activeOrder?.workflowStatus || ""),
    [activeOrder]
  );
  const canCancel = useMemo(
    () => !["Completed", "Cancelled", "Rejected By Admin"].includes(activeOrder?.workflowStatus || ""),
    [activeOrder]
  );
  const canMarkCompleted = useMemo(
    () => activeOrder?.workflowStatus === "In Progress" ||
           (activeOrder?.workflowStatus === "Accepted By Notary" && Boolean(activeOrder?.notaryId)),
    [activeOrder]
  );

  const loadEligibleNotaries = async () => {
    if (!id) return;
    await Promise.all([
      dispatch(fetchEligibleNotaries(id)),
      dispatch(fetchAllAdminNotaries()),
    ]);
  };

  const assignableNotaries = useMemo(() => {
    if (allNotaries.length === 0) {
      return eligibleNotaries;
    }

    const eligibleMap = new Map(eligibleNotaries.map((notary) => [notary.id, notary]));
    return allNotaries
      .map((notary) => {
        const directoryNotary = toDirectoryNotary(notary);
        return {
          ...directoryNotary,
          ...(eligibleMap.get(notary.id) || {}),
        };
      })
      .filter((notary) => notary.status !== "Suspended");
  }, [allNotaries, eligibleNotaries]);

  const handleAccept = async () => {
    try {
      await dispatch(acceptAdminOrder(id)).unwrap();
      toast.success("Order accepted.");
    } catch (error) {
      toast.error(error || "Unable to accept order.");
    }
  };

  const handleReject = async (reason) => {
    try {
      await dispatch(rejectAdminOrder({ orderId: id, reason })).unwrap();
      toast.success("Order rejected.");
      setShowRejectModal(false);
    } catch (error) {
      toast.error(error || "Unable to reject order.");
    }
  };

  const handleAssign = async (payload) => {
    try {
      await dispatch(assignAdminOrderNotary({ orderId: id, ...payload })).unwrap();
      toast.success("Notary assigned.");
      setShowAssignModal(false);
    } catch (error) {
      toast.error(error || "Unable to assign notary.");
    }
  };

  const handleReassign = async (payload) => {
    try {
      await dispatch(reassignAdminOrderNotary({ orderId: id, ...payload })).unwrap();
      toast.success("Notary reassigned.");
      setShowReassignModal(false);
    } catch (error) {
      toast.error(friendlyApiError(error, "We couldn't reassign the notary. Please try again."));
    }
  };

  const handleCancel = async (note) => {
    try {
      await dispatch(
        updateAdminOrderStatus({ orderId: id, status: "Cancelled", note })
      ).unwrap();
      toast.success("Order cancelled.");
      setShowCancelModal(false);
    } catch (error) {
      toast.error(error || "Unable to cancel order.");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await dispatch(
        updateAdminOrderStatus({
          orderId: id,
          status: "Completed",
          note: "Order marked as completed by admin.",
        })
      ).unwrap();
      toast.success("Order marked as completed.");
    } catch (error) {
      toast.error(error || "Unable to mark order as completed.");
    }
  };

  const handleDocumentStatusUpdate = async (documentId, status, reviewNote = "") => {
    try {
      setDocumentActionStatus("loading");
      await apiRequest(`/admin/orders/${id}/documents/${documentId}/status`, {
        method: "PATCH",
        body: {
          status,
          reviewNote,
        },
      });
      await dispatch(fetchAdminOrder(id)).unwrap();
      await dispatch(fetchAdminOrders()).unwrap();
      toast.success(`Document marked as ${status.toLowerCase()}.`);
    } catch (error) {
      toast.error(error?.message || `Unable to mark document as ${status.toLowerCase()}.`);
    } finally {
      setDocumentActionStatus("ready");
    }
  };

  if (activeOrderStatus === "loading" && !activeOrder) {
    return <div className="text-sm text-slate-600">Loading order details...</div>;
  }

  if (!activeOrder) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {activeOrderError || "Order not found."}
      </div>
    );
  }

  const notaryName = activeOrder.notaryDetails?.name || activeOrder.notary;
  const notaryEmail = activeOrder.notaryDetails?.email || activeOrder.notaryEmail || "";
  const notaryPhone = activeOrder.notaryDetails?.phone || "";
  const notaryAvatar = activeOrder.notaryDetails?.avatar || null;
  const isRon = activeOrder.type === "RON";
  const propertyAddress = [
    activeOrder.propertyAddress?.line1,
    activeOrder.propertyAddress?.city,
    activeOrder.propertyAddress?.state,
    activeOrder.propertyAddress?.zip,
  ]
    .filter(Boolean)
    .join(", ");
  const documents = activeOrder.documents || [];
  const timeline = (activeOrder.timeline || []).slice().reverse();
  const canOpenChat = Boolean(activeOrder.rawId || activeOrder.id);

  return (
    <div className="space-y-7">
      {/* Page header: matches mockup eyebrow + ID + meta + 3 actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Order Details
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            {activeOrder.id || activeOrder.rawId}
          </h1>
          {activeOrder.createdAt ? (
            <p className="mt-2 text-sm text-slate-500">
              Created {formatTimelineStamp(activeOrder.createdAt)}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            icon={Edit3}
            onClick={() => toast.info("Edit flow not yet wired in this build.")}
          >
            Edit Order
          </Button>
          <Button
            icon={MessageSquare}
            onClick={() => {
              const target = document.getElementById("order-message-center");
              if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            disabled={!canOpenChat}
          >
            Open Chat
          </Button>
          <Button
            variant="danger"
            icon={XCircle}
            onClick={() => setShowCancelModal(true)}
            disabled={!canCancel || orderActionStatus === "loading"}
          >
            Cancel Order
          </Button>
        </div>
      </div>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-7">
          {/* Top row: Client Info + Borrower Info */}
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <SectionTitle icon={Building2} title="Client Info" />
                <Link
                  to={`/users?focusClient=${encodeURIComponent(activeOrder.clientUserId || activeOrder.clientEmail || "")}`}
                  className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline"
                >
                  View Profile
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Company Name
                  </p>
                  <p className="mt-1.5 text-base font-bold text-slate-900">
                    {activeOrder.client || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Primary Contact
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-slate-900">
                    {activeOrder.primaryContactName ||
                      activeOrder.clientContactName ||
                      activeOrder.clientName ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <SectionTitle icon={UserRound} title="Borrower Info" />
                <a
                  href={activeOrder.borrowerEmail ? `mailto:${activeOrder.borrowerEmail}` : "#"}
                  className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline"
                >
                  Contact
                </a>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Full Name
                  </p>
                  <p className="mt-1.5 text-base font-bold text-slate-900">
                    {activeOrder.borrower || "Not provided"}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Phone
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">
                      {activeOrder.borrowerPhone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Email
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900 break-all">
                      {activeOrder.borrowerEmail || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Property & Signing Details */}
          <Card className="p-6">
            <SectionTitle icon={MapPin} title="Property & Signing Details" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Location
                </p>
                <p className="mt-2 text-base font-bold text-slate-900 break-words">
                  {propertyAddress || "Not provided"}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Signing Type
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-blue-700">
                    {isRon ? <MessageSquare className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {isRon ? "Remote Online Meeting" : "In-person Meeting"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <SectionTitle icon={FolderOpen} title="Documents" />
            <div className="mt-5 space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                  No client documents uploaded yet.
                </div>
              ) : (
                documents.map((document) => {
                  const viewHref = document.url
                    ? buildApiUrl(document.url, { skipPrefix: true, withToken: true })
                    : null;
                  return (
                    <div
                      key={document.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-white px-5 py-4 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                          <FileText className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900" title={document.name}>
                            {document.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Uploaded {formatShortDate(document.uploadedAt)}
                            {document.size ? ` • ${formatBytes(document.size)}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={document.status || "Pending"} />
                        {viewHref ? (
                          <a
                            href={viewHref}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Preview ${document.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[var(--color-brand-primary)]"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        ) : null}
                        {document.downloadUrl ? (
                          <a
                            href={buildApiUrl(document.downloadUrl, { skipPrefix: true, withToken: true })}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Download ${document.name}`}
                            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[var(--color-brand-primary)]"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Document review actions — kept compact */}
            {documents.length > 0 ? (
              <div className="mt-5 space-y-3">
                {documents.map((document) => (
                  <div key={`actions-${document.id}`} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800 truncate" title={document.name}>
                        {document.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {document.status !== "Verified" ? (
                          <Button
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleDocumentStatusUpdate(document.id, "Verified")}
                            disabled={documentActionStatus === "loading" || document.status === "Rejected"}
                          >
                            Verify
                          </Button>
                        ) : null}
                        {document.status !== "Rejected" ? (
                          <Button
                            size="sm"
                            variant="danger"
                            icon={XCircle}
                            onClick={() => setDocumentRejectTarget({ id: document.id, name: document.name })}
                            disabled={documentActionStatus === "loading" || document.status === "Verified"}
                          >
                            Reject
                          </Button>
                        ) : null}
                        {document.status !== "Pending" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDocumentStatusUpdate(document.id, "Pending")}
                            disabled={documentActionStatus === "loading"}
                          >
                            Mark Pending
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    {document.reviewNote ? (
                      <p className="mt-2 text-xs text-slate-600">
                        <span className="font-semibold">Note:</span> {document.reviewNote}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

          {/* Pre-assignment admin review actions — visible only while the order is in Pending Admin Review */}
          {canReview ? (
            <Card className="border-amber-200 bg-amber-50/70 p-6">
              <SectionTitle icon={ShieldCheck} title="Admin Review" />
              <p className="mt-2 text-sm leading-6 text-amber-800">
                {allOrderDocumentsVerified
                  ? "All documents are verified. Accept this order to enable notary assignment, or reject it with a reason."
                  : "Verify every uploaded document before accepting this order."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  icon={CheckCircle2}
                  onClick={handleAccept}
                  disabled={orderActionStatus === "loading" || !allOrderDocumentsVerified}
                >
                  Accept Order
                </Button>
                <Button
                  variant="dangerSolid"
                  icon={XCircle}
                  onClick={() => setShowRejectModal(true)}
                  disabled={orderActionStatus === "loading"}
                >
                  Reject Order
                </Button>
              </div>
            </Card>
          ) : null}

          {/* Message Center */}
          <div id="order-message-center">
            <OrderMessageCenter
              orderId={activeOrder.rawId || String(activeOrder.id || "").replace(/^#/, "")}
              orderLabel={activeOrder.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-7">
          {/* Quick Actions — bright blue gradient card */}
          <Card className="overflow-hidden border-0 p-0">
            <div className="bg-gradient-to-br from-[#3b5bff] via-[#3b5bff] to-[#1f3fdc] p-6 text-white">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                  <CircleDot className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold">Quick Actions</h3>
              </div>
              <div className="mt-5 space-y-3">
                {canReassign ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await loadEligibleNotaries();
                      setShowReassignModal(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reassign Notary
                  </button>
                ) : null}
                {canMarkCompleted ? (
                  <button
                    type="button"
                    onClick={handleMarkCompleted}
                    disabled={orderActionStatus === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Completed
                  </button>
                ) : null}
                {canAssign ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await loadEligibleNotaries();
                      setShowAssignModal(true);
                    }}
                    disabled={!allOrderDocumentsVerified || orderActionStatus === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25 disabled:opacity-60"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Notary
                  </button>
                ) : null}
                {!canReassign && !canMarkCompleted && !canAssign ? (
                  <p className="rounded-lg bg-white/10 p-3 text-xs text-white/80">
                    Quick actions become available as the order progresses through its workflow.
                  </p>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Assigned Notary — only shown after a notary has been assigned to the order */}
          {activeOrder?.notaryId || notaryName ? (
            <Card className="p-6">
              <SectionTitle icon={ShieldCheck} title="Assigned Notary" />
              <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    name={notaryName}
                    tone="bg-blue-100 text-blue-700"
                    size="md"
                    src={notaryAvatar}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{notaryName || "Not assigned"}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                      Accepted
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Email</span>
                    <span className="font-semibold text-slate-900 truncate">{notaryEmail || "Not provided"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-semibold text-slate-900">{notaryPhone || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Payment Details */}
          <Card className="p-6">
            <SectionTitle icon={FileText} title="Payment Details" />
            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-[var(--color-border)] bg-white">
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="text-sm font-semibold text-slate-600">Total Fee</span>
                <span className="text-base font-extrabold text-[var(--color-brand-primary)]">
                  {activeOrder.fee || `$${Number(activeOrder.feeAmount || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="text-sm font-semibold text-slate-600">Method</span>
                <span className="text-sm font-semibold text-slate-900">
                  {activeOrder.payment?.paymentMethod || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <span className="text-sm font-semibold text-slate-600">Paid Date</span>
                <span className="text-sm font-semibold text-slate-900">
                  {activeOrder.payment?.paidDate || "Not paid yet"}
                </span>
              </div>
            </div>
          </Card>

          {/* Special Instructions */}
          <Card className="p-6">
            <h3 className="text-base font-extrabold text-amber-600">Special Instructions</h3>
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm italic leading-relaxed text-amber-700">
              {activeOrder.specialInstructions
                ? `"${activeOrder.specialInstructions}"`
                : "No special instructions for this order."}
            </div>
          </Card>

          {/* Order Timeline — vertical */}
          <Card className="p-6">
            <SectionTitle icon={CalendarDays} title="Order Timeline" />
            <ol className="mt-5 space-y-4">
              {timeline.length === 0 ? (
                <li className="text-sm text-slate-600">No status changes recorded yet.</li>
              ) : (
                timeline.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`} className="relative pl-7">
                    <span className="absolute left-0 top-1 grid h-4 w-4 place-items-center">
                      <span className="absolute inset-0 rounded-full bg-blue-100" />
                      <span className="relative h-2 w-2 rounded-full bg-blue-600" />
                    </span>
                    {index < timeline.length - 1 ? (
                      <span className="absolute left-[7px] top-5 h-full w-px bg-blue-100" />
                    ) : null}
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                      {entry.status}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {formatTimelineStamp(entry.changedAt)} •{" "}
                      {new Date(entry.changedAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    {entry.note ? (
                      <p className="mt-1 text-xs text-slate-500">{entry.note}</p>
                    ) : null}
                  </li>
                ))
              )}
            </ol>
          </Card>
        </aside>
      </div>

      {/* Modals */}
      <AssignModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        notaries={assignableNotaries}
        eligibleNotaryIds={eligibleNotaries.map((notary) => notary.id)}
        onSubmit={handleAssign}
        status={
          orderActionStatus === "loading" ||
          eligibleNotariesStatus === "loading" ||
          allNotariesStatus === "loading"
            ? "loading"
            : "ready"
        }
        title="Assign Notary"
      />
      <AssignModal
        open={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        notaries={assignableNotaries}
        eligibleNotaryIds={eligibleNotaries.map((notary) => notary.id)}
        onSubmit={handleReassign}
        status={
          orderActionStatus === "loading" ||
          eligibleNotariesStatus === "loading" ||
          allNotariesStatus === "loading"
            ? "loading"
            : "ready"
        }
        title="Reassign Notary"
      />
      <RejectModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleReject}
        status={orderActionStatus}
      />
      <RejectDocumentModal
        open={Boolean(documentRejectTarget)}
        onClose={() => setDocumentRejectTarget(null)}
        status={documentActionStatus}
        documentName={documentRejectTarget?.name}
        onSubmit={async (reason) => {
          if (!documentRejectTarget?.id) return;
          await handleDocumentStatusUpdate(documentRejectTarget.id, "Rejected", reason);
          setDocumentRejectTarget(null);
        }}
      />
      <CancelOrderModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleCancel}
        status={orderActionStatus}
      />
    </div>
  );
};

export default OrderDetailsPage;