import { useState } from "react";
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
import { documents } from "../data/notarixData";

const PreviewPanel = ({ open, onClose, onReject }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[430px] border-l border-[var(--color-border)] bg-white shadow-modal">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Eye className="h-5 w-5 text-[var(--color-brand-primary)]" /> Document Preview</h2>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid h-72 place-items-center rounded-lg bg-slate-800 text-white">
            <div className="rounded-full bg-slate-950 px-5 py-3 text-sm">← Page 1 of 4 →</div>
          </div>
          <TextArea label="Internal Note / Rejection Reason" placeholder="Type verification notes or rejection reasons here..." className="mt-8" />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-border)] p-5">
          <Button variant="dangerSolid" icon={XCircle} onClick={onReject}>Reject</Button>
          <Button variant="success" icon={CheckCircle2}>Verify</Button>
        </div>
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Documents" description="Manage and verify all uploaded documents in the system." />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total" value="2,482" change="+12% from last month" icon={FileText} />
        <MetricCard label="Pending" value="128" icon={FileText} />
        <MetricCard label="Verified" value="2,140" icon={ShieldAlert} />
        <MetricCard label="Rejected" value="214" icon={ShieldAlert} tone="danger" />
      </div>

      <Card className="mt-8 p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
              {["All", "Client", "Notary", "Internal"].map((item) => (
                <button key={item} type="button" className={`h-9 rounded-md px-5 text-sm font-semibold ${item === "All" ? "bg-blue-50 text-[var(--color-brand-primary)]" : "text-slate-600"}`}>{item}</button>
              ))}
            </div>
            <select className="h-10"><option>All Types</option></select>
            <input className="h-10" type="date" />
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
                <tr key={doc.name} className="border-t border-slate-100">
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
                        <Button size="sm" variant="success" icon={CheckCircle2}>Verify</Button>
                        <Button size="sm" variant="dangerSolid" icon={XCircle} onClick={() => setRejectOpen(true)}>Reject</Button>
                        <ActionIcons onPreview={() => setPreviewOpen(true)} />
                      </div>
                    ) : doc.status === "Rejected" ? (
                      <div className="flex items-center gap-4">
                        <button type="button" className="font-semibold text-slate-600" onClick={() => setRejectOpen(true)}>View Reason</button>
                        <ActionIcons onPreview={() => setPreviewOpen(true)} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <StatusBadge status="Verified" />
                        <ActionIcons onPreview={() => setPreviewOpen(true)} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing 1-10 of 124 documents</p>
          <Pagination />
        </div>
      </Card>

      <PreviewPanel
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onReject={() => {
          setPreviewOpen(false);
          setRejectOpen(true);
        }}
      />

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Document"
        icon={ShieldAlert}
        tone="danger"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Button><Button variant="dangerSolid" onClick={() => setRejectOpen(false)}>Confirm Reject</Button></div>}
      >
        <div className="mb-6 rounded-lg bg-slate-50 p-5 text-slate-600">
          Please provide a detailed reason for the rejection. This message will be sent directly to the client and recorded in the audit trail.
        </div>
        <TextArea label="Enter Reason For Rejection" placeholder="e.g., Signature missing on page 4, blurry photo ID..." />
        <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" className="h-5 w-5 p-0" />
          Notify client via email immediately
        </label>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
