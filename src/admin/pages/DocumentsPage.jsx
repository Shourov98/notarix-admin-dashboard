import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  Grid2X2,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  ActionIcons,
  Button,
  Card,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TextArea,
} from "../components/ui";
import { fetchAdminConsole, selectAdminConsole } from "../../store/adminConsoleSlice";
import { apiRequest } from "../../services/httpClient";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const PreviewPanel = ({ open, document, actionStatus, onClose, onReject, onVerify }) => {
  if (!open || !document) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[430px] border-l border-[var(--color-border)] bg-white shadow-modal">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Eye className="h-5 w-5 text-[var(--color-brand-primary)]" /> Document Preview</h2>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5">
            <p className="text-lg font-bold text-slate-900">{document.name}</p>
            <p className="mt-1 text-sm text-slate-600">{document.uploadedBy} • {document.type}</p>
            <p className="mt-1 text-sm text-slate-500">Status: {document.status}</p>
          </div>
          {document.url ? (
            <iframe
              title={document.name}
              src={document.url}
              className="h-[520px] w-full rounded-lg border border-[var(--color-border)] bg-white"
            />
          ) : (
            <div className="grid h-72 place-items-center rounded-lg bg-slate-100 text-sm text-slate-500">
              No uploaded file is available for preview.
            </div>
          )}
          {document.reviewNote ? (
            <TextArea
              label="Latest Review Note"
              value={document.reviewNote}
              readOnly
              className="mt-8"
            />
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-border)] p-5">
          <Button variant="dangerSolid" icon={XCircle} onClick={onReject} disabled={actionStatus === "loading"}>Reject</Button>
          <Button variant="success" icon={CheckCircle2} onClick={onVerify} disabled={actionStatus === "loading" || document.status === "Verified"}>
            {actionStatus === "loading" ? "Saving..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  const dispatch = useAppDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionStatus, setActionStatus] = useState("idle");
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const { metrics } = useAppSelector(selectAdminConsole);

  const loadDocuments = useCallback(async (page = 1, nextFilters = filters) => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/documents", {
        query: {
          page,
          role: nextFilters.role || undefined,
          status: nextFilters.status || undefined,
        },
      });
      const data = payload?.data || payload || {};
      setDocuments(data.items || []);
      setPagination(data.pagination || {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateDocumentStatus = useCallback(async (document, status, reviewNote = "") => {
    if (!document?.userId || !document?.id) {
      toast.error("Document record is missing its owner reference.");
      return;
    }

    setActionStatus("loading");
    try {
      await apiRequest(`/admin/users/${document.userId}/documents/${document.id}/status`, {
        method: "PATCH",
        body: { status, reviewNote },
      });
      toast.success(`${document.name} marked as ${status.toLowerCase()}.`);
      await Promise.all([
        loadDocuments(pagination.page, filters),
        dispatch(fetchAdminConsole()),
      ]);
      setSelectedDocument((current) =>
        current && current.id === document.id
          ? { ...current, status, reviewNote }
          : current
      );
      if (status === "Rejected") {
        setRejectOpen(false);
        setRejectReason("");
      }
    } catch (error) {
      toast.error(error?.message || `Unable to mark ${document.name} as ${status.toLowerCase()}.`);
    } finally {
      setActionStatus("idle");
    }
  }, [dispatch, filters, loadDocuments, pagination.page]);

  const openPreview = (document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const openRejectModal = (document) => {
    setSelectedDocument(document);
    setRejectReason(document?.reviewNote || "");
    setRejectOpen(true);
  };

  useEffect(() => {
    dispatch(fetchAdminConsole());
  }, [dispatch]);

  useEffect(() => {
    loadDocuments(1);
  }, [loadDocuments]);

  return (
    <div>
      <PageHeader title="Documents" description="Manage and verify all uploaded documents in the system." />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total" value={String(metrics.totalDocuments || documents.length)} change="+12% from last month" icon={FileText} />
        <MetricCard label="Pending" value={String(metrics.pendingDocuments || 0)} icon={FileText} />
        <MetricCard label="Verified" value={String(metrics.verifiedDocuments || 0)} icon={ShieldAlert} />
        <MetricCard label="Rejected" value={String(metrics.rejectedDocuments || 0)} icon={ShieldAlert} tone="danger" />
      </div>

      <Card className="mt-8 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              {["All", "Client", "Notary", "Internal"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    const nextFilters = {
                      ...filters,
                      role: item === "All" ? "" : item,
                    };
                    setFilters(nextFilters);
                    loadDocuments(1, nextFilters);
                  }}
                  className={`h-9 rounded-md px-5 text-sm font-semibold ${
                    (filters.role || "All") === item
                      ? "bg-blue-50 text-[var(--color-brand-primary)]"
                      : "text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <select
              className="h-10"
              value={filters.status}
              onChange={(event) => {
                const nextFilters = {
                  ...filters,
                  status: event.target.value,
                };
                setFilters(nextFilters);
                loadDocuments(1, nextFilters);
              }}
            >
              <option value="">All Types</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Missing">Missing</option>
            </select>
            <input className="h-10" type="date" disabled />
          </div>
          <div className="flex gap-4 text-slate-600">
            <Filter className="h-5 w-5" />
            <Grid2X2 className="h-5 w-5" />
          </div>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-4 rounded-lg bg-[var(--color-brand-primary)] p-5 text-white md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-3 text-lg font-semibold"><CheckCircle2 className="h-5 w-5" /> 3 Documents Selected</p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-white/15 shadow-none hover:bg-white/20">Download Bulk</Button>
          <Button className="bg-white/15 shadow-none hover:bg-white/20">Archive All</Button>
          <Button variant="dangerSolid" icon={Trash2}>Delete Selected</Button>
        </div>
      </div>

      <Card className="mt-7 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-5"><input type="checkbox" className="h-4 w-4 p-0" /></th>
                <th className="px-5 py-5">Document Name</th>
                <th className="px-5 py-5">Order ID</th>
                <th className="px-5 py-5">Uploaded By</th>
                <th className="px-5 py-5">Type</th>
                <th className="px-5 py-5">Date</th>
                <th className="px-5 py-5">Status</th>
                <th className="px-5 py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-slate-100">
                  <td className="px-5 py-6"><input type="checkbox" defaultChecked={doc.selected} className="h-4 w-4 p-0" /></td>
                  <td className="px-5 py-6">
                    <div className="flex items-center gap-4">
                      <FileText className={doc.status === "Rejected" ? "h-5 w-5 text-red-500" : "h-5 w-5 text-slate-500"} />
                      <strong>{doc.name}</strong>
                    </div>
                  </td>
                  <td className="px-5 py-6 text-slate-600">{doc.orderId}</td>
                  <td className="px-5 py-6">{doc.uploadedBy}</td>
                  <td className="px-5 py-6"><StatusBadge status={doc.type} /></td>
                  <td className="px-5 py-6 text-slate-600">{doc.date}</td>
                  <td className="px-5 py-6"><StatusBadge status={doc.status} /></td>
                  <td className="px-5 py-6">
                    {doc.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          icon={CheckCircle2}
                          disabled={actionStatus === "loading"}
                          onClick={() => updateDocumentStatus(doc, "Verified")}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="dangerSolid"
                          icon={XCircle}
                          disabled={actionStatus === "loading"}
                          onClick={() => openRejectModal(doc)}
                        >
                          Reject
                        </Button>
                        <ActionIcons onPreview={() => openPreview(doc)} downloadUrl={doc.downloadUrl} />
                      </div>
                    ) : doc.status === "Rejected" ? (
                      <div className="flex items-center gap-4">
                        <button type="button" className="font-semibold text-slate-600" onClick={() => openRejectModal(doc)}>View Reason</button>
                        <ActionIcons onPreview={() => openPreview(doc)} downloadUrl={doc.downloadUrl} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <StatusBadge status="Verified" />
                        <ActionIcons onPreview={() => openPreview(doc)} downloadUrl={doc.downloadUrl} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">
                    {loading ? "Loading documents..." : "No documents found for the current filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            {pagination.totalItems === 0
              ? "0"
              : `${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalItems
                )}`}{" "}
            of {pagination.totalItems} documents
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => loadDocuments(page)}
            disabled={loading}
          />
        </div>
      </Card>

      <PreviewPanel
        open={previewOpen}
        document={selectedDocument}
        actionStatus={actionStatus}
        onClose={() => setPreviewOpen(false)}
        onReject={() => {
          setPreviewOpen(false);
          openRejectModal(selectedDocument);
        }}
        onVerify={() => updateDocumentStatus(selectedDocument, "Verified")}
      />

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Document"
        icon={ShieldAlert}
        tone="danger"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="dangerSolid"
              disabled={actionStatus === "loading" || !selectedDocument}
              onClick={() => updateDocumentStatus(selectedDocument, "Rejected", rejectReason.trim())}
            >
              {actionStatus === "loading" ? "Saving..." : "Confirm Reject"}
            </Button>
          </div>
        }
      >
        <div className="mb-6 rounded-lg bg-slate-50 p-5 text-slate-600">
          Please provide a detailed reason for the rejection. This message will be sent directly to the client and recorded in the audit trail.
        </div>
        <TextArea
          label="Enter Reason For Rejection"
          placeholder="e.g., Signature missing on page 4, blurry photo ID..."
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
        />
        <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" className="h-5 w-5 p-0" />
          Notify client via email immediately
        </label>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
