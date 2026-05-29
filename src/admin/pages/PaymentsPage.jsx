import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  MoreVertical,
  Search,
  WalletCards,
} from "lucide-react";
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
import { selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppSelector } from "../../store/hooks";

const MarkPaidModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Mark Payment as Paid"
    subtitle="Confirm and record this payment in the ledger"
    footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onClose}>Confirm Payment</Button></div>}
  >
    <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[#f2f0ff] p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
        <div><p className="text-xs font-bold uppercase text-slate-500">Order ID</p><p className="font-bold">#NTX-90124</p><p className="text-xs font-bold uppercase text-slate-500">Client</p><p>Sarah Jenkins</p></div>
        <div><p className="text-xs font-bold uppercase text-slate-500">Payment ID</p><p className="font-bold">#PAY-9920</p><p className="text-xs font-bold uppercase text-slate-500">Notary</p><p>Robert Vance</p></div>
        <div className="text-right"><StatusBadge status="Pending" /><p className="mt-3 text-4xl font-extrabold text-[var(--color-brand-primary)]">$150.00</p></div>
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <label>
        <span className="mb-2 block text-sm font-bold uppercase text-slate-600">Payment Method</span>
        <select className="h-11 w-full"><option>Card</option><option>ACH</option></select>
      </label>
      <Field label="Transaction ID / Ref" placeholder="e.g. TXN-88210" />
      <Field label="Payment Date" type="date" defaultValue="2023-10-27" className="md:col-span-2" />
      <TextArea label="Notes" placeholder="Add any internal payment notes..." className="md:col-span-2" />
    </div>
    <div className="mt-6 rounded-lg border border-dashed border-[var(--color-border)] bg-[#fbf8ff] p-8 text-center">
      <Download className="mx-auto h-8 w-8 text-slate-500" />
      <p className="mt-3 font-bold">Upload receipt or proof</p>
      <p className="text-slate-600">PDF, JPG, or PNG (Max 5MB)</p>
    </div>
    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-[var(--color-brand-primary)]">
      You are about to mark this payment as <strong>PAID</strong>. This action will update financial records and notify the client.
    </div>
  </Modal>
);

const PaymentsPage = () => {
  const [paidOpen, setPaidOpen] = useState(false);
  const { payments } = useAppSelector(selectAdminConsole);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Manage transactions, client payments, and notary payouts"
        actions={
          <>
            <Button variant="subtle" icon={Download} size="lg">Export</Button>
            <Button icon={CreditCard} size="lg">Record Payment</Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Revenue" value="$124,592.00" change="+12.5%" icon={WalletCards} />
        <MetricCard label="Paid To Notaries" value="$45,210.00" icon={CreditCard} />
        <MetricCard label="Pending Payments" value="$8,125.00" icon={CreditCard} tone="danger" />
        <MetricCard label="Completed" value="1,429" change="98% Success" icon={CheckCircle2} />
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="h-12 w-full bg-[#f0eefb] pl-11" placeholder="Search by Order ID, Client, or Notary..." />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {["All Payments", "Inbound", "Outbound"].map((item) => (
              <button key={item} type="button" className={`h-10 rounded-full px-4 text-sm font-bold ${item === "All Payments" ? "bg-[var(--color-brand-primary)] text-white" : "bg-[#eeecfb] text-slate-600"}`}>{item}</button>
            ))}
            <select className="h-12"><option>Payment Method</option></select>
            <select className="h-12"><option>Status</option></select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5"><input type="checkbox" className="h-4 w-4 p-0" /></th>
                <th className="px-6 py-5">Payment ID</th>
                <th className="px-6 py-5">Order & Client</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-200">
                  <td className="px-6 py-6"><input type="checkbox" defaultChecked={payment.selected} className="h-4 w-4 p-0" /></td>
                  <td className="px-6 py-6"><p className="font-bold">{payment.id}</p><p className="text-sm text-slate-500">{payment.reference}</p></td>
                  <td className="px-6 py-6"><p className="font-bold">{payment.client}</p><p className="text-sm text-slate-500">{payment.note}</p></td>
                  <td className="px-6 py-6"><StatusBadge status={payment.type} /></td>
                  <td className="px-6 py-6 font-bold">{payment.amount}</td>
                  <td className="px-6 py-6"><StatusBadge status={payment.status} /></td>
                  <td className="px-6 py-6 text-slate-600">{payment.date}</td>
                  <td className="px-6 py-6">
                    {payment.status === "Pending" ? (
                      <div className="flex items-center gap-3">
                        <Button size="sm" onClick={() => setPaidOpen(true)}>Mark as Paid</Button>
                        <MoreVertical className="h-5 w-5 text-slate-500" />
                      </div>
                    ) : payment.status === "Failed" ? (
                      <button type="button" className="font-bold text-red-600">Retry Charge</button>
                    ) : (
                      <div className="flex gap-5 text-slate-600"><Eye className="h-5 w-5" /><Download className="h-5 w-5" /></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-[#f0eefb] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing <strong>1 to 10</strong> of 1,249 transactions</p>
          <Pagination />
        </div>
      </Card>

      <MarkPaidModal open={paidOpen} onClose={() => setPaidOpen(false)} />
    </div>
  );
};

export default PaymentsPage;
