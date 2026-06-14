import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Download,
  Search,
  Upload,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Field,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TextArea,
} from "../components/ui";
import { apiRequest, buildApiUrl } from "../../services/httpClient";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const statusOptionsByTarget = {
  client: ["Pending", "Received", "Failed"],
  notary: ["Pending", "Scheduled", "Paid", "Failed"],
};

const PaymentActionModal = ({
  open,
  onClose,
  payment,
  onSubmit,
  submitting,
}) => {
  const [status, setStatus] = useState("Pending");
  const [method, setMethod] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState(null);

  useEffect(() => {
    if (!payment) return;
    setStatus(payment.status || "Pending");
    setMethod(payment.method === "Not set" ? "" : payment.method || "");
    setPaidDate("");
    setTransactionReference(payment.reference || "");
    setNotes("");
    setProof(null);
  }, [payment]);

  if (!payment) return null;

  const label =
    payment.target === "client" ? "Update Client Payment" : "Update Notary Payout";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={label}
      subtitle="Record the latest manual payment state and supporting proof."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() =>
              onSubmit({
                target: payment.target,
                status,
                method,
                paidDate,
                transactionReference,
                notes,
                proof,
              })
            }
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Update"}
          </Button>
        </div>
      }
    >
      <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[#f2f0ff] p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Order</p>
            <p className="font-bold">{payment.orderId}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Counterparty</p>
            <p>{payment.counterpartyName}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={payment.direction} />
            <p className="mt-3 text-4xl font-extrabold text-[var(--color-brand-primary)]">
              {payment.amountLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold uppercase text-slate-600">Status</span>
          <select
            className="h-11 w-full"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statusOptionsByTarget[payment.target].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <Field
          label="Payment Method"
          value={method}
          onChange={(event) => setMethod(event.target.value)}
          placeholder="Bank Transfer / ACH / Card"
        />
        <Field
          label="Transaction ID / Ref"
          value={transactionReference}
          onChange={(event) => setTransactionReference(event.target.value)}
          placeholder="e.g. TXN-88210"
        />
        <Field
          label="Effective Date"
          type="date"
          value={paidDate}
          onChange={(event) => setPaidDate(event.target.value)}
        />
        <TextArea
          label="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add internal notes for this payment update..."
          className="md:col-span-2"
        />
      </div>

      <label className="mt-6 block rounded-lg border border-dashed border-[var(--color-border)] bg-[#fbf8ff] p-8 text-center">
        <Upload className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-3 font-bold">Upload transfer proof</p>
        <p className="text-slate-600">PDF, JPG, or PNG</p>
        <input
          type="file"
          className="hidden"
          onChange={(event) => setProof(event.target.files?.[0] || null)}
        />
        {proof ? <p className="mt-3 text-sm text-slate-500">{proof.name}</p> : null}
      </label>
    </Modal>
  );
};

const PaymentsPage = () => {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [activePayment, setActivePayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPayments = useCallback(async (nextFilters = {}, page = 1) => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/payments", {
        query: {
          search: nextFilters.search ?? search,
          type: nextFilters.type ?? type,
          status: nextFilters.status ?? status,
          page,
        },
      });

      const data = payload?.data || payload || {};
      setSummary(data.summary || null);
      setPayments(data.items || []);
      setPagination(data.pagination || {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      });
    } catch (error) {
      toast.error(error?.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }, [search, type, status]);

  useEffect(() => {
    loadPayments({ search: "", type: "", status: "" }, 1);
  }, [loadPayments]);

  const filteredPayments = useMemo(() => payments, [payments]);

  const handleSubmit = async (formValues) => {
    if (!activePayment) return;

    setSubmitting(true);
    try {
      await apiRequest(`/admin/orders/${activePayment.rawOrderId}/payment-status`, {
        method: "PATCH",
        body: {
          target: formValues.target,
          status: formValues.status,
          method: formValues.method,
          paidDate: formValues.paidDate,
          transactionReference: formValues.transactionReference,
          notes: formValues.notes,
        },
      });

      if (formValues.proof) {
        const formData = new FormData();
        formData.append("target", formValues.target);
        formData.append("proof", formValues.proof);
        await apiRequest(`/admin/orders/${activePayment.rawOrderId}/payment-proof`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      }

      toast.success("Payment record updated.");
      setActivePayment(null);
      await loadPayments();
    } catch (error) {
      toast.error(error?.message || "Unable to update payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const metrics = summary || {
    totalClientRevenue: 0,
    totalNotaryPayouts: 0,
    pendingInbound: 0,
    totalCompanyRevenue: 0,
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Manage manual client receipts, notary payouts, and supporting proof."
        actions={
          <Button variant="subtle" icon={Download} size="lg">Export</Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Client Revenue" value={formatCurrency(metrics.totalClientRevenue)} icon={WalletCards} />
        <MetricCard label="Notary Payouts" value={formatCurrency(metrics.totalNotaryPayouts)} icon={CreditCard} />
        <MetricCard label="Pending Inbound" value={formatCurrency(metrics.pendingInbound)} icon={CreditCard} tone="danger" />
        <MetricCard label="Company Revenue" value={formatCurrency(metrics.totalCompanyRevenue)} icon={CheckCircle2} />
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="notarix-search-icon absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="notarix-search-field h-12 w-full bg-[#f0eefb]"
              placeholder="Search by order, client, or notary..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="h-12" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">All Directions</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
            <select className="h-12" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
            <Button variant="secondary" onClick={() => loadPayments({}, 1)}>Apply</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">Payment ID</th>
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Counterparty</th>
                <th className="px-6 py-5">Direction</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Method</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Proof</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-200">
                  <td className="px-6 py-6">
                    <p className="font-bold">{payment.paymentId}</p>
                    <p className="text-sm text-slate-500">{payment.description}</p>
                  </td>
                  <td className="px-6 py-6 font-bold">{payment.orderId}</td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{payment.counterpartyName}</p>
                    <p className="text-sm text-slate-500">{payment.counterpartyEmail || "No email"}</p>
                  </td>
                  <td className="px-6 py-6"><StatusBadge status={payment.direction} /></td>
                  <td className="px-6 py-6 font-bold">{payment.amountLabel}</td>
                  <td className="px-6 py-6"><StatusBadge status={payment.status} /></td>
                  <td className="px-6 py-6 text-slate-600">{payment.method}</td>
                  <td className="px-6 py-6 text-slate-600">{payment.dateLabel}</td>
                  <td className="px-6 py-6 text-sm">
                    {payment.proof?.url ? (
                      <a
                        href={buildApiUrl(payment.proof.url, { skipPrefix: true })}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[var(--color-brand-primary)] hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-slate-400">Missing</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <Button size="sm" onClick={() => setActivePayment(payment)}>
                      {payment.target === "client" ? "Mark Received" : "Mark Paid"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <p className="px-6 py-5 text-sm text-slate-500">Loading payments...</p>
        ) : filteredPayments.length === 0 ? (
          <p className="px-6 py-5 text-sm text-slate-500">No payment records found.</p>
        ) : null}
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            {pagination.totalItems === 0
              ? "0"
              : `${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalItems
                )}`}{" "}
            of {pagination.totalItems} payments
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => loadPayments({}, page)}
            disabled={loading}
          />
        </div>
      </Card>

      <PaymentActionModal
        open={Boolean(activePayment)}
        onClose={() => setActivePayment(null)}
        payment={activePayment}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default PaymentsPage;
