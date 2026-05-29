import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileDown,
  Hourglass,
  MapPin,
  Search,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  MetricCard,
  Modal,
  PageHeader,
  StatusBadge,
} from "../components/ui";
import {
  assignAdminOrderNotary,
  fetchAdminConsole,
  fetchAdminOrders,
  fetchEligibleNotaries,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const ORDER_STATUS_OPTIONS = [
  "All Statuses",
  "Pending",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

const AssignNotaryModal = ({
  open,
  onClose,
  order,
  notaries,
  status,
  onSubmit,
}) => {
  const [selectedNotaryId, setSelectedNotaryId] = useState("");
  const [notaryOfferAmount, setNotaryOfferAmount] = useState("");
  const [payoutReleaseDays, setPayoutReleaseDays] = useState("7");
  const [assignmentNotes, setAssignmentNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelectedNotaryId(notaries[0]?.id || "");
    setNotaryOfferAmount("");
    setPayoutReleaseDays("7");
    setAssignmentNotes("");
  }, [open, notaries]);

  const handleSubmit = async () => {
    if (!selectedNotaryId) {
      toast.error("Select a notary before assigning this order.");
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
      title="Assign Notary"
      subtitle={order ? `Choose a notary for ${order.id}` : "Select a notary"}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={status === "loading"}>
            {status === "loading" ? "Assigning..." : "Assign Notary"}
          </Button>
        </div>
      }
    >
      {order ? (
        <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Borrower</p>
            <p className="mt-1 font-semibold">{order.borrower}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Service</p>
            <p className="mt-1 font-semibold">{order.service}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Location</p>
            <p className="mt-1 font-semibold">{order.location}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Notary Offer</span>
          <input
            type="number"
            min="0"
            value={notaryOfferAmount}
            onChange={(event) => setNotaryOfferAmount(event.target.value)}
            className="h-11 w-full"
            placeholder="80"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Payout Release Days</span>
          <input
            type="number"
            min="0"
            value={payoutReleaseDays}
            onChange={(event) => setPayoutReleaseDays(event.target.value)}
            className="h-11 w-full"
          />
        </label>
        <label className="block md:col-span-3">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Assignment Notes</span>
          <textarea
            value={assignmentNotes}
            onChange={(event) => setAssignmentNotes(event.target.value)}
            className="min-h-[96px] w-full rounded-lg border border-[var(--color-border)] px-3 py-3"
            placeholder="Add optional payout or scheduling notes for the notary."
          />
        </label>
      </div>

      <div className="mt-6 space-y-3">
        {notaries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
            No eligible notaries found for this order yet.
          </div>
        ) : (
          notaries.map((notary) => (
            <label
              key={notary.id}
              className={`flex cursor-pointer items-start justify-between rounded-lg border p-4 ${
                selectedNotaryId === notary.id
                  ? "border-[var(--color-brand-primary)] bg-blue-50"
                  : "border-[var(--color-border)] bg-white"
              }`}
            >
              <div>
                <p className="font-bold text-slate-900">{notary.name}</p>
                <p className="text-sm text-slate-600">{notary.location}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {notary.email}
                  {notary.phone ? ` • ${notary.phone}` : ""}
                </p>
                {Array.isArray(notary.tags) && notary.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {notary.tags.map((tag) => (
                      <StatusBadge key={`${notary.id}-${tag}`} status={tag} />
                    ))}
                  </div>
                ) : null}
              </div>
              <input
                type="radio"
                name="eligible-notary"
                className="mt-1 h-5 w-5"
                checked={selectedNotaryId === notary.id}
                onChange={() => setSelectedNotaryId(notary.id)}
              />
            </label>
          ))
        )}
      </div>
    </Modal>
  );
};

const OrderManagementPage = () => {
  const dispatch = useAppDispatch();
  const {
    metrics,
    orders,
    ordersStatus,
    ordersError,
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
    dispatch(fetchAdminOrders());
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
      })
    );
  };

  const openAssignModal = async (order) => {
    setAssignTarget(order);
    await dispatch(fetchEligibleNotaries(order.rawId || String(order.id).replace(/^#/, "")));
  };

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
          <Button variant="secondary" icon={FileDown}>
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
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full pl-11"
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
        <div className="border-t border-slate-100 px-6 py-5 text-sm text-slate-600">
          Showing <strong>{visibleOrders.length}</strong> live order{visibleOrders.length === 1 ? "" : "s"}
        </div>
      </Card>

      <AssignNotaryModal
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        order={assignTarget}
        notaries={eligibleNotaries}
        status={orderActionStatus === "loading" || eligibleNotariesStatus === "loading" ? "loading" : "ready"}
        onSubmit={handleAssign}
      />
    </div>
  );
};

export default OrderManagementPage;
