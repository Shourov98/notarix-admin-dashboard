import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { toast } from "sonner";
import {
  approveAdminRequest,
  fetchAdminRequests,
  rejectAdminRequest,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { apiRequest } from "../../services/httpClient";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  Button,
  Card,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TextArea,
} from "../components/ui";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const DetailItem = ({ label, value, mono = false }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4">
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
      {label}
    </p>
    <p
      className={`mt-2 text-[15px] leading-6 text-slate-900 ${mono ? "font-mono" : "font-semibold"}`}
    >
      {value || "Not provided"}
    </p>
  </div>
);

const RequestDetailsModal = ({
  open,
  request,
  rejectionReason,
  onChangeReason,
  onApprove,
  onReject,
  onClose,
  loading,
}) => {
  if (!request) return null;

  const normalizedStatus = String(request.status || "").toLowerCase();
  const isPending = normalizedStatus === "pending";
  const isApproved = normalizedStatus === "approved";
  const isRejected = normalizedStatus === "rejected";
  const canReview = isPending;

  const statusSummary = isApproved
    ? "This request has already been approved. Review actions are now locked."
    : isRejected
      ? "This request has already been declined. Review actions are now locked."
      : "This request is still pending review. You can approve or decline it below.";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Details"
      subtitle="Review the full request before approving or declining access."
      icon={ClipboardList}
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            className="min-w-[110px]"
            onClick={onClose}
          >
            Close
          </Button>
          {isPending ? (
            <>
              <Button
                variant="danger"
                icon={ShieldX}
                className="min-w-[170px]"
                onClick={onReject}
                disabled={loading}
              >
                {loading ? "Updating..." : "Decline Request"}
              </Button>
              <Button
                icon={ShieldCheck}
                className="min-w-[170px]"
                onClick={onApprove}
                disabled={loading}
              >
                {loading ? "Updating..." : "Approve Request"}
              </Button>
            </>
          ) : (
            <Button
              variant={isApproved ? "secondary" : "danger"}
              icon={isApproved ? ShieldCheck : ShieldX}
              className="min-w-[190px]"
              disabled
            >
              {isApproved ? "Already Approved" : "Already Declined"}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-7 px-1 py-1">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef2ff_100%)] p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Request ID
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--color-brand-primary)]">
              {request.id}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Submitted {formatDate(request.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <StatusBadge
              status={request.contactType}
              className={
                request.contactType === "Notary"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }
            />
            <StatusBadge status={request.status} />
          </div>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-sm leading-6 ${
            isPending
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : isApproved
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusSummary}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Full Name" value={request.name} />
          <DetailItem label="Email Address" value={request.email} />
          <DetailItem label="Phone Number" value={request.phone} />
          <DetailItem
            label="Company Name"
            value={request.companyName || "Independent"}
          />
          <DetailItem label="Contact Type" value={request.contactType} />
          <DetailItem label="Request Type" value={request.requestType} />
          <DetailItem label="State / Coverage Area" value={request.state} />
          <DetailItem label="Current Status" value={request.status} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Requester Message
          </p>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">
            {request.message || "No additional message was provided."}
          </p>
        </div>

        {request.rejectionReason ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">
              Previous Rejection Reason
            </p>
            <p className="mt-3 text-[15px] leading-7 text-red-700">
              {request.rejectionReason}
            </p>
          </div>
        ) : null}

        {isPending ? (
          <TextArea
            label="Decline Reason"
            value={rejectionReason}
            onChange={(event) => onChangeReason(event.target.value)}
            placeholder="Provide a clear reason if you need to decline this request."
          />
        ) : null}
      </div>
    </Modal>
  );
};

const RequestsManagementPage = () => {
  const dispatch = useAppDispatch();
  const { requests, requestsPagination, requestsStatus, requestsError } =
    useAppSelector(selectAdminConsole);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [contactTypeFilter, setContactTypeFilter] = useState("All");
  const [activeRequest, setActiveRequest] = useState(null);
  const [activeRequestLoading, setActiveRequestLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const loadRequests = (page = 1) =>
    dispatch(
      fetchAdminRequests({
        search: search || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        contactType:
          contactTypeFilter === "All" ? undefined : contactTypeFilter,
        page,
      }),
    );

  useEffect(() => {
    loadRequests(1);
  }, [contactTypeFilter, dispatch, search, statusFilter]);

  const metrics = useMemo(() => {
    const pending = requests.filter((item) => item.status === "Pending").length;
    const approved = requests.filter(
      (item) => item.status === "Approved",
    ).length;
    const rejected = requests.filter(
      (item) => item.status === "Rejected",
    ).length;

    return {
      total: requestsPagination.totalItems || requests.length,
      pending,
      approved,
      rejected,
    };
  }, [requests, requestsPagination.totalItems]);

  const openRequestModal = async (requestId) => {
    setActiveRequestLoading(true);
    setRejectionReason("");

    try {
      const payload = await apiRequest(`/admin/requests/${requestId}`);
      const data = payload?.data || payload;
      setActiveRequest(data);
    } catch (error) {
      toast.error(error?.message || "Unable to load request details.");
    } finally {
      setActiveRequestLoading(false);
    }
  };

  const closeRequestModal = () => {
    if (reviewLoading) return;
    setActiveRequest(null);
    setRejectionReason("");
  };

  const handleApprove = async () => {
    if (!activeRequest) return;

    setReviewLoading(true);
    try {
      await dispatch(approveAdminRequest(activeRequest.id)).unwrap();
      toast.success("Request approved successfully.");
      setActiveRequest((current) =>
        current ? { ...current, status: "Approved" } : current,
      );
      loadRequests(requestsPagination.page);
    } catch (error) {
      toast.error(error || "Unable to approve request.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReject = async () => {
    if (!activeRequest) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a decline reason.");
      return;
    }

    setReviewLoading(true);
    try {
      await dispatch(
        rejectAdminRequest({
          requestId: activeRequest.id,
          reason: rejectionReason.trim(),
        }),
      ).unwrap();
      toast.success("Request declined successfully.");
      setActiveRequest((current) =>
        current
          ? {
              ...current,
              status: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : current,
      );
      loadRequests(requestsPagination.page);
    } catch (error) {
      toast.error(error || "Unable to decline request.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Requests Management"
        description="Review incoming access requests, inspect the full submission, and approve or decline from one place."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Requests"
          value={String(metrics.total)}
          icon={ClipboardList}
        />
        <MetricCard
          label="Pending Review"
          value={String(metrics.pending)}
          icon={Clock3}
          tone="danger"
        />
        <MetricCard
          label="Approved"
          value={String(metrics.approved)}
          icon={CheckCircle2}
        />
        <MetricCard
          label="Rejected"
          value={String(metrics.rejected)}
          icon={ShieldX}
        />
      </div>

      <Card className="mt-8 p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="block min-w-0 flex-1">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Search Requests
              </span>
              <div className="relative">
                <Search className="notarix-search-icon absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="notarix-search-field h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[var(--color-brand-primary)]"
                  placeholder="Request ID, name, email, company, state..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>

            <label className="block lg:w-[190px]">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Contact Type
              </span>
              <select
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[var(--color-brand-primary)]"
                value={contactTypeFilter}
                onChange={(event) => setContactTypeFilter(event.target.value)}
              >
                <option>All</option>
                <option>Client</option>
                <option>Notary</option>
              </select>
            </label>

            <label className="block lg:w-[170px]">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Status
              </span>
              <select
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus:border-[var(--color-brand-primary)]"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </label>

            <div className="mt-7 lg:w-[132px]">
              <Button
                variant="primary"
                className="h-12 w-full rounded-xl px-5"
                onClick={() => loadRequests(requestsPagination.page)}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {requestsPagination.totalItems} total requests
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              {metrics.pending} pending
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {metrics.approved} approved
            </span>
          </div>
        </div>
      </Card>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-6 py-5">Requester</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Company / State</th>
                <th className="px-6 py-5">Message</th>
                <th className="px-6 py-5">Submitted</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-slate-100 align-top"
                >
                  <td className="px-6 py-6">
                    <p className="font-mono text-sm font-bold text-[var(--color-brand-primary)]">
                      {request.id}
                    </p>
                    <p className="mt-3 text-lg font-bold text-slate-900">
                      {request.name}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                      <a
                        href={`mailto:${request.email}`}
                        className="inline-flex items-center gap-2 hover:text-[var(--color-brand-primary)]"
                      >
                        <Mail className="h-4 w-4" />
                        {request.email}
                      </a>
                      {request.phone ? (
                        <a
                          href={`tel:${request.phone}`}
                          className="inline-flex items-center gap-2 hover:text-[var(--color-brand-primary)]"
                        >
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge
                      status={request.contactType}
                      className={
                        request.contactType === "Notary"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    />
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {request.requestType}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-semibold text-slate-900">
                      {request.companyName || "Independent"}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {request.state || "No state provided"}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="max-w-[280px] text-sm leading-7 text-slate-600">
                      {request.message || "No message provided."}
                    </p>
                    {request.rejectionReason ? (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                        Rejected: {request.rejectionReason}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-6 text-sm text-slate-600">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => openRequestModal(request.id)}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-sm text-slate-500"
                  >
                    {requestsStatus === "loading"
                      ? "Loading requests..."
                      : requestsError ||
                        "No requests found for the current filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <strong>
              {requestsPagination.totalItems === 0
                ? 0
                : `${(requestsPagination.page - 1) * requestsPagination.pageSize + 1}-${Math.min(
                    requestsPagination.page * requestsPagination.pageSize,
                    requestsPagination.totalItems,
                  )}`}
            </strong>{" "}
            of <strong>{requestsPagination.totalItems}</strong> requests
          </p>
          <Pagination
            page={requestsPagination.page}
            totalPages={requestsPagination.totalPages}
            onPageChange={(page) => loadRequests(page)}
            disabled={requestsStatus === "loading"}
          />
        </div>
      </Card>

      {activeRequestLoading ? (
        <Modal
          open={activeRequestLoading}
          onClose={() => setActiveRequestLoading(false)}
          title="Loading Request"
          subtitle="Fetching the latest request details."
          icon={ClipboardList}
          footer={
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setActiveRequestLoading(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          <p className="text-sm text-slate-600">Loading request details...</p>
        </Modal>
      ) : null}

      <RequestDetailsModal
        open={Boolean(activeRequest)}
        request={activeRequest}
        rejectionReason={rejectionReason}
        onChangeReason={setRejectionReason}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={closeRequestModal}
        loading={reviewLoading}
      />
    </div>
  );
};

export default RequestsManagementPage;
