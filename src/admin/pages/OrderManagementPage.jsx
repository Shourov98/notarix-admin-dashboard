import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileDown,
  Hourglass,
  MapPin,
  Search,
  Send,
  UserPlus,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
} from "../components/ui";
import {
  assignAdminOrderNotary,
  fetchAllAdminNotaries,
  fetchAdminConsole,
  fetchAdminOrders,
  fetchEligibleNotaries,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { downloadReport } from "../../services/exports";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const ORDER_STATUS_OPTIONS = [
  "All Statuses",
  "Pending",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDateTime = (dateValue, timeValue) => {
  if (!dateValue) return "Not set";
  try {
    const iso =
      timeValue && /^\d{2}:\d{2}/.test(timeValue)
        ? `${dateValue}T${timeValue}`
        : dateValue;
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${dateValue} ${timeValue || ""}`.trim();
  }
};

const AVATAR_TONES = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
];

const initialsFromName = (name = "") =>
  String(name)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "NX";

const toneFromNotary = (notary) => {
  if (notary.avatarTone) return notary.avatarTone;
  const hash = String(notary.id || notary.name || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_TONES[hash % AVATAR_TONES.length];
};

const deriveCoverageArea = (notary) =>
  notary.location ||
  notary.area ||
  notary.address?.state ||
  notary.coverageArea ||
  "Coverage unknown";

const computeJobsCompletedLabel = (notary) => {
  if (typeof notary.jobsCompleted === "number") {
    return `${notary.jobsCompleted} Jobs Completed`;
  }
  if (typeof notary.jobs === "string") {
    return notary.jobs;
  }
  return "Notary record";
};

const AssignNotaryModal = ({
  open,
  onClose,
  order,
  notaries,
  eligibleNotaryIds,
  status,
  onSubmit,
}) => {
  const [selectedNotaryId, setSelectedNotaryId] = useState("");
  const [payoutReleaseDays, setPayoutReleaseDays] = useState("7");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [search, setSearch] = useState("");
  const [coverageFilter, setCoverageFilter] = useState("All");
  const [ronOnly, setRonOnly] = useState(false);

  // Numeric snapshots from the order so we can show "Client Paid / Platform Fee".
  const orderFeeAmount = Number(order?.feeAmount || 0);
  const orderOffer = Number(order?.notaryOfferAmount || 0);
  const initialOffer =
    orderOffer > 0
      ? orderOffer
      : orderFeeAmount > 0
        ? Math.max(0, Math.round(orderFeeAmount * 0.6))
        : "";

  const [offerDraft, setOfferDraft] = useState(() =>
    initialOffer === "" ? "" : String(initialOffer)
  );

  useEffect(() => {
    if (!open) return;
    setSelectedNotaryId(eligibleNotaryIds[0] || notaries[0]?.id || "");
    setOfferDraft(initialOffer === "" ? "" : String(initialOffer));
    setPayoutReleaseDays(
      order?.payoutReleaseDays != null
        ? String(order.payoutReleaseDays)
        : "7"
    );
    setAssignmentNotes("");
    setSearch("");
    setCoverageFilter("All");
    setRonOnly(false);
    // Intentionally only re-seed when the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, order?.rawId]);

  const offerNumber = Number(offerDraft);
  const platformFee =
    Number.isFinite(offerNumber) && orderFeeAmount > 0
      ? Math.max(0, orderFeeAmount - offerNumber)
      : 0;

  const coverageOptions = useMemo(() => {
    const set = new Set();
    (notaries || []).forEach((notary) => {
      const area = deriveCoverageArea(notary);
      if (area) set.add(area);
    });
    return ["All", ...Array.from(set).sort()];
  }, [notaries]);

  const visibleNotaries = useMemo(() => {
    const eligibleSet = new Set(eligibleNotaryIds);
    const term = search.trim().toLowerCase();

    return [...notaries]
      .sort((left, right) => {
        const leftEligible = eligibleSet.has(left.id) ? 1 : 0;
        const rightEligible = eligibleSet.has(right.id) ? 1 : 0;
        if (leftEligible !== rightEligible) {
          return rightEligible - leftEligible;
        }
        const leftJobs =
          typeof left.jobsCompleted === "number"
            ? left.jobsCompleted
            : Number(
                String(left.jobs || "").match(/\d+/)?.[0] || 0
              );
        const rightJobs =
          typeof right.jobsCompleted === "number"
            ? right.jobsCompleted
            : Number(
                String(right.jobs || "").match(/\d+/)?.[0] || 0
              );
        if (leftJobs !== rightJobs) {
          return rightJobs - leftJobs;
        }
        return String(left.name || "").localeCompare(String(right.name || ""));
      })
      .filter((notary) => {
        if (ronOnly) {
          const tags = Array.isArray(notary.tags) ? notary.tags : [];
          if (!tags.some((tag) => /ron/i.test(tag)) && !notary.ronEligible) {
            return false;
          }
        }
        if (coverageFilter && coverageFilter !== "All") {
          const area = deriveCoverageArea(notary);
          if (!area.toLowerCase().includes(coverageFilter.toLowerCase())) {
            return false;
          }
        }
        if (!term) return true;
        return [
          notary.name,
          notary.email,
          notary.phone,
          notary.id,
          deriveCoverageArea(notary),
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
  }, [eligibleNotaryIds, notaries, search, ronOnly, coverageFilter]);

  const selectedNotary = useMemo(
    () => notaries.find((notary) => notary.id === selectedNotaryId) || null,
    [notaries, selectedNotaryId]
  );

  const topRatedLabel = (() => {
    if (!order?.location) return "TOP RATED";
    const primary = String(order.location).split(",")[0]?.trim();
    return primary ? `TOP RATED NEAR ${primary.toUpperCase()}` : "TOP RATED";
  })();

  const handleSubmit = async () => {
    if (!selectedNotaryId) {
      toast.error("Select a notary before assigning this order.");
      return;
    }
    const offerValue =
      offerDraft === "" ? undefined : Number(offerDraft);
    if (offerValue !== undefined && (!Number.isFinite(offerValue) || offerValue < 0)) {
      toast.error("Notary offer must be a non-negative number.");
      return;
    }
    const releaseValue =
      payoutReleaseDays === "" ? undefined : Number(payoutReleaseDays);
    if (
      releaseValue !== undefined &&
      (!Number.isInteger(releaseValue) || releaseValue < 0)
    ) {
      toast.error("Payout release period must be a non-negative whole number of days.");
      return;
    }

    await onSubmit({
      notaryId: selectedNotaryId,
      notaryOfferAmount: offerValue,
      payoutReleaseDays: releaseValue,
      assignmentNotes,
    });
  };

  const requestCount = notaries.length;
  const topRatedCount = visibleNotaries.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={UserPlus}
      title="Assign Notary"
      subtitle={
        order
          ? `Select a notary for ${order.id}`
          : "Select a notary for this order"
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            {selectedNotary ? (
              <span className="inline-flex items-center gap-2 font-semibold text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Selected: {selectedNotary.name}
              </span>
            ) : (
              <span className="text-slate-500">No notary selected yet.</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button icon={Send} onClick={handleSubmit} disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send Request"}
            </Button>
          </div>
        </div>
      }
    >
      {order ? (
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order ID</p>
            <p className="mt-1 font-semibold text-slate-900">{order.id}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Type</p>
            <p className="mt-1 font-semibold text-slate-900">{order.service}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</p>
            <p className="mt-1 font-semibold text-slate-900">{order.location || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Signing Date/Time</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatDateTime(order.signingDate, order.signingTime)}
            </p>
          </div>
        </div>
      ) : null}

      {/* Financials */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <FinancialCard
          label="Client Paid"
          value={orderFeeAmount > 0 ? formatCurrency(orderFeeAmount) : "Not set"}
          tone="neutral"
        />
        <FinancialCard
          label="Platform Fee"
          value={
            orderFeeAmount > 0 && Number.isFinite(offerNumber)
              ? formatCurrency(platformFee)
              : "—"
          }
          tone="neutral"
        />
        <FinancialCard
          label="Notary Offer Price"
          value={
            <div className="flex items-center gap-1">
              <span className="text-2xl font-extrabold text-[var(--color-brand-primary)]">$</span>
              <input
                type="number"
                min="0"
                step="1"
                value={offerDraft}
                onChange={(event) => setOfferDraft(event.target.value)}
                placeholder="80"
                className="h-10 w-full border-0 bg-transparent text-2xl font-extrabold text-[var(--color-brand-primary)] outline-none placeholder:text-slate-300"
              />
            </div>
          }
          tone="primary"
        />
      </div>

      <div className="mt-3 rounded-lg bg-blue-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">
          {Number.isFinite(offerNumber) && offerNumber > 0
            ? `You are offering ${formatCurrency(offerNumber)} to the notary for this job`
            : "Enter the offer price to continue"}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          The first notary who accepts this offer will be automatically assigned
          to this order.
        </p>
      </div>

      {/* Payout release period */}
      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Wallet className="h-4 w-4 text-[var(--color-brand-primary)]" />
            Payout Release Period
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={payoutReleaseDays}
            onChange={(event) => setPayoutReleaseDays(event.target.value)}
            className="h-11 w-full"
            placeholder="7"
          />
        </label>
        <div className="md:max-w-[260px] md:text-right">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Notary receives payout
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {Number.isFinite(Number(payoutReleaseDays)) && Number(payoutReleaseDays) > 0
              ? `${payoutReleaseDays} day${
                  Number(payoutReleaseDays) === 1 ? "" : "s"
                } after completion`
              : "On the day of completion"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Set manually per assignment. The platform holds the funds and
            releases them once this period elapses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full pl-10"
            placeholder="Search notary by name or ID…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Coverage Area
          </span>
          <select
            value={coverageFilter}
            onChange={(event) => setCoverageFilter(event.target.value)}
            className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold"
          >
            {coverageOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            RON Approved Only
          </span>
          <button
            type="button"
            onClick={() => setRonOnly((value) => !value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              ronOnly ? "bg-[var(--color-brand-primary)]" : "bg-slate-300"
            }`}
            aria-pressed={ronOnly}
            aria-label="Toggle RON Approved Only"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                ronOnly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[var(--color-brand-primary)]">
        <span>Request sent to {requestCount} notaries</span>
        <Briefcase className="h-4 w-4" />
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {topRatedLabel} ({topRatedCount})
        </p>
        <div className="notarix-scrollbar mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
          {visibleNotaries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
              {notaries.length === 0
                ? "No notary records are available yet."
                : "No notaries match the current filters."}
            </div>
          ) : (
            visibleNotaries.map((notary) => {
              const isSelected = selectedNotaryId === notary.id;
              const area = deriveCoverageArea(notary);
              const radius = notary.radius || notary.travelRadius || "";
              const tags = Array.isArray(notary.tags) ? notary.tags : [];
              const notaryStatus = notary.status || "Pending";
              const isAvailable = /available|active/i.test(notaryStatus);
              return (
                <label
                  key={notary.id}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-[var(--color-brand-primary)] bg-blue-50"
                      : "border-[var(--color-border)] bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-1 items-start gap-4">
                    {notary.avatar ? (
                      <img
                        src={notary.avatar}
                        alt={notary.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold ${toneFromNotary(
                          notary
                        )}`}
                      >
                        {initialsFromName(notary.name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-bold text-slate-900">{notary.name}</p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isAvailable ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {notaryStatus}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {area}
                        </span>
                        {radius ? (
                          <span className="inline-flex items-center gap-1">
                            <Hourglass className="h-3 w-3" />
                            {radius}
                          </span>
                        ) : null}
                      </div>
                      {tags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <StatusBadge key={`${notary.id}-${tag}`} status={tag} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs font-semibold text-slate-500">
                      {computeJobsCompletedLabel(notary)}
                    </span>
                    <input
                      type="radio"
                      name="assign-notary"
                      className="h-5 w-5 cursor-pointer"
                      checked={isSelected}
                      onChange={() => setSelectedNotaryId(notary.id)}
                      aria-label={`Select ${notary.name}`}
                    />
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

const FinancialCard = ({ label, value, tone = "neutral" }) => {
  const isPrimary = tone === "primary";
  return (
    <div
      className={`rounded-lg border p-4 ${
        isPrimary
          ? "border-[var(--color-brand-primary)] bg-blue-50/40"
          : "border-[var(--color-border)] bg-slate-50"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <div className="mt-2 text-xl font-extrabold">
        {typeof value === "string" || typeof value === "number" ? (
          <span
            className={
              isPrimary
                ? "text-[var(--color-brand-primary)]"
                : "text-slate-900"
            }
          >
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

const OrderManagementPage = () => {
  const dispatch = useAppDispatch();
  const {
    metrics,
    orders,
    ordersPagination,
    ordersStatus,
    ordersError,
    allNotaries,
    allNotariesStatus,
    eligibleNotaries,
    eligibleNotariesStatus,
    orderActionStatus,
  } = useAppSelector(selectAdminConsole);

  const [filters, setFilters] = useState({
    search: "",
    status: "All Statuses",
    serviceType: "",
  });
  const [assignTarget, setAssignTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminConsole());
    dispatch(fetchAdminOrders({ page: 1 }));
  }, [dispatch]);

  const visibleOrders = useMemo(() => orders || [], [orders]);

  const handleFilterChange = (field, value) => {
    const nextFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(nextFilters);
    dispatch(
      fetchAdminOrders({
        search: nextFilters.search.trim() || undefined,
        status:
          nextFilters.status === "All Statuses" ? undefined : nextFilters.status,
        serviceType: nextFilters.serviceType.trim() || undefined,
        page: 1,
      })
    );
  };

  const openAssignModal = async (order) => {
    setAssignTarget(order);
    await Promise.all([
      dispatch(fetchEligibleNotaries(order.rawId || String(order.id).replace(/^#/, ""))),
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

  const handleAssign = async (payload) => {
    if (!assignTarget) return;

    try {
      await dispatch(
        assignAdminOrderNotary({
          orderId: assignTarget.rawId || String(assignTarget.id).replace(/^#/, ""),
          ...payload,
        })
      ).unwrap();
      toast.success("Notary assigned successfully.");
      setAssignTarget(null);
    } catch (error) {
      toast.error(error || "Unable to assign notary.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Order Management"
        description="Review incoming client orders, search live records, and assign qualified notaries."
        actions={
          <Button
            variant="secondary"
            icon={FileDown}
            onClick={async () => {
              try {
                const params = {
                  search: filters.search.trim() || undefined,
                  status:
                    filters.status && filters.status !== "All Statuses"
                      ? filters.status
                      : undefined,
                  serviceType: filters.serviceType || undefined,
                };
                await downloadReport(
                  "/admin/reports/orders",
                  params,
                  `orders-${new Date().toISOString().slice(0, 10)}.csv`
                );
                toast.success("Orders CSV downloaded.");
              } catch (error) {
                toast.error(error?.message || "Unable to export orders.");
              }
            }}
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total" value={String(metrics.totalOrders || visibleOrders.length)} icon={ClipboardList} />
        <MetricCard label="Pending" value={String(metrics.pendingOrders || 0)} icon={Hourglass} />
        <MetricCard label="Assigned" value={String(visibleOrders.filter((item) => item.status === "Assigned").length)} icon={UserPlus} />
        <MetricCard label="In Progress" value={String(visibleOrders.filter((item) => item.status === "In Progress").length)} icon={CalendarClock} />
        <MetricCard label="Completed" value={String(metrics.completedOrders || 0)} icon={CheckCircle2} />
      </div>

      <Card className="mt-8 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px]">
          <div className="relative">
            <Search className="notarix-search-icon absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="notarix-search-field h-12 w-full"
              placeholder="Search order ID, client, borrower, or notary..."
              value={filters.search}
              onChange={(event) => handleFilterChange("search", event.target.value)}
            />
          </div>
          <select
            className="h-12"
            value={filters.status}
            onChange={(event) => handleFilterChange("status", event.target.value)}
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            className="h-12"
            placeholder="Filter by service type"
            value={filters.serviceType}
            onChange={(event) => handleFilterChange("serviceType", event.target.value)}
          />
        </div>
      </Card>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Client & Borrower</th>
                <th className="px-6 py-5">Service Type</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5">Notary</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-6 py-6">
                    <Link to={order.route} className="font-bold text-[var(--color-brand-primary)]">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{order.client}</p>
                    <p className="text-sm text-slate-600">Borrower: {order.borrower}</p>
                  </td>
                  <td className="px-6 py-6">{order.service}</td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {order.location}
                    </span>
                  </td>
                  <td className="px-6 py-6">{order.schedule}</td>
                  <td className="px-6 py-6">
                    {order.notary === "Unassigned" ? (
                      <em className="text-slate-600">Unassigned</em>
                    ) : (
                      order.notary
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <Link
                        to={order.route}
                        className="text-[var(--color-brand-primary)]"
                        aria-label={`View ${order.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {(order.status === "Pending" || order.status === "Assigned") ? (
                        <button
                          type="button"
                          onClick={() => openAssignModal(order)}
                          className="text-slate-500"
                          aria-label={`Assign notary to ${order.id}`}
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-600">
                    {ordersStatus === "loading"
                      ? "Loading orders..."
                      : ordersError || "No orders match the current filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            {ordersPagination.totalItems === 0
              ? "0"
              : `${(ordersPagination.page - 1) * ordersPagination.pageSize + 1}-${Math.min(
                  ordersPagination.page * ordersPagination.pageSize,
                  ordersPagination.totalItems
                )}`}{" "}
            of {ordersPagination.totalItems} orders
          </p>
          <Pagination
            page={ordersPagination.page}
            totalPages={ordersPagination.totalPages}
            onPageChange={(page) =>
              dispatch(
                fetchAdminOrders({
                  search: filters.search.trim() || undefined,
                  status: filters.status === "All Statuses" ? undefined : filters.status,
                  serviceType: filters.serviceType.trim() || undefined,
                  page,
                })
              )
            }
            disabled={ordersStatus === "loading"}
          />
        </div>
      </Card>

      <AssignNotaryModal
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        order={assignTarget}
        notaries={assignableNotaries}
        eligibleNotaryIds={eligibleNotaries.map((notary) => notary.id)}
        status={
          orderActionStatus === "loading" ||
          eligibleNotariesStatus === "loading" ||
          allNotariesStatus === "loading"
            ? "loading"
            : "ready"
        }
        onSubmit={handleAssign}
      />
    </div>
  );
};

export default OrderManagementPage;
