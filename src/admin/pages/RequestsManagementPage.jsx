import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Mail,
  Phone,
  Search,
  ShieldX,
} from "lucide-react";
import {
  fetchAdminRequests,
  selectAdminConsole,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Button, Card, MetricCard, PageHeader, Pagination, StatusBadge } from "../components/ui";

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

const RequestsManagementPage = () => {
  const dispatch = useAppDispatch();
  const {
    requests,
    requestsStatus,
    requestsError,
  } = useAppSelector(selectAdminConsole);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [contactTypeFilter, setContactTypeFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAdminRequests());
  }, [dispatch]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        !search ||
        [
          request.id,
          request.name,
          request.email,
          request.companyName,
          request.state,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          );

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;
      const matchesContactType =
        contactTypeFilter === "All" || request.contactType === contactTypeFilter;

      return matchesSearch && matchesStatus && matchesContactType;
    });
  }, [contactTypeFilter, requests, search, statusFilter]);

  const metrics = useMemo(() => {
    const pending = requests.filter((item) => item.status === "Pending").length;
    const approved = requests.filter((item) => item.status === "Approved").length;
    const rejected = requests.filter((item) => item.status === "Rejected").length;

    return {
      total: requests.length,
      pending,
      approved,
      rejected,
    };
  }, [requests]);

  return (
    <div>
      <PageHeader
        title="Requests Management"
        description="View access requests submitted by clients and notaries so the admin team can contact them directly."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Requests" value={String(metrics.total)} icon={ClipboardList} />
        <MetricCard label="Pending Review" value={String(metrics.pending)} icon={Clock3} tone="danger" />
        <MetricCard label="Approved" value={String(metrics.approved)} icon={CheckCircle2} />
        <MetricCard label="Rejected" value={String(metrics.rejected)} icon={ShieldX} />
      </div>

      <Card className="mt-8 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px_140px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full pl-11"
              placeholder="Search request ID, name, email, company..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            className="h-12"
            value={contactTypeFilter}
            onChange={(event) => setContactTypeFilter(event.target.value)}
          >
            <option>All</option>
            <option>Client</option>
            <option>Notary</option>
          </select>
          <select
            className="h-12"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <Button
            variant="secondary"
            onClick={() => dispatch(fetchAdminRequests())}
          >
            Refresh
          </Button>
        </div>
      </Card>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">Request</th>
                <th className="px-6 py-5">Contact Type</th>
                <th className="px-6 py-5">Company / State</th>
                <th className="px-6 py-5">Message</th>
                <th className="px-6 py-5">Submitted</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-slate-100">
                  <td className="px-6 py-6">
                    <p className="font-bold text-[var(--color-brand-primary)]">{request.id}</p>
                    <p className="mt-2 font-bold text-slate-900">{request.name}</p>
                    <a
                      href={`mailto:${request.email}`}
                      className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--color-brand-primary)]"
                    >
                      <Mail className="h-4 w-4" />
                      {request.email}
                    </a>
                    {request.phone ? (
                      <a
                        href={`tel:${request.phone}`}
                        className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[var(--color-brand-primary)]"
                      >
                        <Phone className="h-4 w-4" />
                        {request.phone}
                      </a>
                    ) : null}
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
                    <p className="mt-3 text-sm text-slate-600">{request.requestType}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-semibold text-slate-900">
                      {request.companyName || "Independent"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{request.state || "No state provided"}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="max-w-[320px] text-sm leading-6 text-slate-600">
                      {request.message || "No message provided."}
                    </p>
                    {request.rejectionReason ? (
                      <p className="mt-3 text-sm font-semibold text-red-600">
                        Rejection reason: {request.rejectionReason}
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
                    <div className="flex flex-col gap-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Admin Review Only</span>
                      <span>Use the contact details to follow up directly.</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-sm text-slate-500">
                    {requestsStatus === "loading"
                      ? "Loading requests..."
                      : requestsError || "No requests found for the current filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> requests
          </p>
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default RequestsManagementPage;
