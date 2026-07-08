import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserPlus,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, buildApiUrl } from "../../services/httpClient";
import {
  Button,
  Card,
  Modal,
  PageHeader,
  SectionTitle,
  StatusBadge,
} from "../components/ui";
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
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

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

const InfoRow = ({ label, value }) => (
  <div className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-4">
    <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
    <p className="mt-2 font-semibold text-slate-900">{value || "Not provided"}</p>
  </div>
);

const AssignModal = ({ open, onClose, notaries, eligibleNotaryIds, onSubmit, status, title }) => {
  const [selectedNotaryId, setSelectedNotaryId] = useState("");
  const [notaryOfferAmount, setNotaryOfferAmount] = useState("");
  const [payoutReleaseDays, setPayoutReleaseDays] = useState("7");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [search, setSearch] = useState("");

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
        return String(left.name || "").localeCompare(String(right.name || ""));
      })
      .filter((notary) => {
        if (!term) return true;
        return [notary.name, notary.email, notary.phone, notary.location]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      });
  }, [eligibleNotaryIds, notaries, search]);

  useEffect(() => {
    if (!open) return;
    setSelectedNotaryId(eligibleNotaryIds[0] || notaries[0]?.id || "");
    setNotaryOfferAmount("");
    setPayoutReleaseDays("7");
    setAssignmentNotes("");
    setSearch("");
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

      <div className="mt-6 space-y-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find notary by name, email, phone, or state"
          />
        </label>
        {visibleNotaries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
            {notaries.length === 0
              ? "No notary records are available yet."
              : "No notaries match the current search."}
          </div>
        ) : (
          visibleNotaries.map((notary) => (
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
                <p className="mt-1 text-sm text-slate-500">{notary.email}</p>
                {eligibleNotaryIds.includes(notary.id) ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-primary)]">
                    Eligible for this order
                  </p>
                ) : null}
              </div>
              <input
                type="radio"
                name="order-notary"
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
    () => ["Notary Assigned", "Accepted By Notary", "Assigned", "In Progress"].includes(activeOrder?.workflowStatus || "") || activeOrder?.status === "Assigned",
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
      toast.error(error || "Unable to reassign notary.");
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Order Details"
        title={activeOrder.id}
        description={`${activeOrder.client} • ${activeOrder.service}`}
        actions={
          <>
            <StatusBadge status={activeOrder.status} />
            <Link to="/orders">
              <Button variant="secondary">Back to Orders</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-7">
          <Card className="p-6">
            <SectionTitle icon={Building2} title="Client Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Client" value={activeOrder.client} />
              <InfoRow label="Client Email" value={activeOrder.clientEmail} />
              <InfoRow label="Vendor Code" value={activeOrder.vendorCode} />
              <InfoRow label="Workflow Status" value={activeOrder.workflowStatus} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={UserRound} title="Borrower Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Borrower" value={activeOrder.borrower} />
              <InfoRow label="Borrower Email" value={activeOrder.borrowerEmail} />
              <InfoRow label="Borrower Phone" value={activeOrder.borrowerPhone} />
              <InfoRow label="Secondary Signer" value={activeOrder.hasSecondarySigner ? "Yes" : "No"} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={MapPin} title="Property & Signing" />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Property Address"
                value={[
                  activeOrder.propertyAddress?.line1,
                  activeOrder.propertyAddress?.city,
                  activeOrder.propertyAddress?.state,
                  activeOrder.propertyAddress?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
              <InfoRow label="Schedule" value={`${activeOrder.signingDate} ${activeOrder.signingTime}`} />
              <InfoRow label="Fee" value={`$${Number(activeOrder.payment?.feeAmount || 0).toFixed(2)}`} />
              <InfoRow label="Payment Status" value={activeOrder.payment?.paymentStatus} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={FolderOpen} title="Order Documents" />
            <div className="space-y-3">
              {(activeOrder.documents || []).length === 0 ? (
                <p className="text-sm text-slate-600">No client documents uploaded yet.</p>
              ) : (
                activeOrder.documents.map((document) => (
                  <div key={document.id} className="rounded-lg border border-[var(--color-border)] bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[var(--color-brand-primary)]" />
                        <div>
                          <p className="font-semibold text-slate-900">{document.name}</p>
                          <p className="text-xs text-slate-500">{document.mimeType || "Uploaded file"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={document.status || "Pending"} />
                        {document.url ? (
                          <a href={buildApiUrl(document.url, { skipPrefix: true })} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[var(--color-brand-primary)]">
                            Open
                          </a>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {document.status !== "Verified" ? (
                        <Button
                          size="sm"
                          icon={ShieldCheck}
                          onClick={() => handleDocumentStatusUpdate(document.id, "Verified")}
                          disabled={
                            documentActionStatus === "loading" || document.status === "Rejected"
                          }
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
                          disabled={
                            documentActionStatus === "loading" || document.status === "Verified"
                          }
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
                    {document.reviewNote ? (
                      document.status === "Rejected" ? (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
                            Rejection Reason
                          </p>
                          <p className="mt-2 text-sm leading-6 text-red-700">
                            {document.reviewNote}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Review Note
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {document.reviewNote}
                          </p>
                        </div>
                      )
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Card>

          {!allOrderDocumentsVerified ? (
            <Card className="border-amber-200 bg-amber-50 p-6">
              <SectionTitle icon={ShieldCheck} title="Document Review Required" />
              <p className="text-sm leading-7 text-amber-800">
                Admin must verify all client-uploaded order documents before accepting the order or assigning any notary.
              </p>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-7">
          <Card className="p-6">
            <SectionTitle icon={ShieldCheck} title="Current Assignment" />
            <div className="space-y-4">
              <InfoRow label="Assigned Notary" value={activeOrder.notary} />
              <InfoRow label="Offer Amount" value={activeOrder.payment?.notaryOfferAmount ? `$${Number(activeOrder.payment.notaryOfferAmount).toFixed(2)}` : "Not set"} />
              <InfoRow label="Release Days" value={activeOrder.payment?.payoutReleaseDays ? `${activeOrder.payment.payoutReleaseDays} days` : "Not set"} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={CalendarDays} title="Admin Actions" />
            <div className="space-y-3">
              {canReview ? (
                <>
                  <Button className="w-full" icon={CheckCircle2} onClick={handleAccept} disabled={orderActionStatus === "loading" || !allOrderDocumentsVerified}>
                    Accept Order
                  </Button>
                  <Button className="w-full" variant="dangerSolid" icon={XCircle} onClick={() => setShowRejectModal(true)} disabled={orderActionStatus === "loading"}>
                    Reject Order
                  </Button>
                </>
              ) : null}

              {canAssign ? (
                <Button
                  className="w-full"
                  variant="secondary"
                  icon={UserPlus}
                  disabled={!allOrderDocumentsVerified}
                  onClick={async () => {
                    await loadEligibleNotaries();
                    setShowAssignModal(true);
                  }}
                >
                  Assign Notary
                </Button>
              ) : null}

              {canReassign ? (
                <Button
                  className="w-full"
                  variant="secondary"
                  icon={RefreshCcw}
                  onClick={async () => {
                    await loadEligibleNotaries();
                    setShowReassignModal(true);
                  }}
                >
                  Reassign Notary
                </Button>
              ) : null}
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={FileText} title="Notes & Instructions" />
            <div className="space-y-4">
              <InfoRow label="Special Instructions" value={activeOrder.specialInstructions || "None"} />
              <InfoRow label="Admin Review Reason" value={activeOrder.adminReviewReason || "None"} />
              <InfoRow label="Assignment Notes" value={activeOrder.payment?.assignmentNotes || "None"} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={CalendarDays} title="Status Timeline" />
            <div className="space-y-4">
              {(activeOrder.timeline || []).length === 0 ? (
                <p className="text-sm text-slate-600">No status changes recorded yet.</p>
              ) : (
                activeOrder.timeline.map((entry) => (
                  <div key={`${entry.status}-${entry.changedAt}`} className="border-l-2 border-slate-200 pl-4">
                    <p className="font-semibold text-slate-900">{entry.status}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(entry.changedAt).toLocaleString("en-US")}
                    </p>
                    {entry.note ? <p className="mt-1 text-sm text-slate-500">{entry.note}</p> : null}
                  </div>
                ))
              )}
            </div>
          </Card>
        </aside>
      </div>

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
    </div>
  );
};

export default OrderDetailsPage;
