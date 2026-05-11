import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileDown,
  Hourglass,
  MapPin,
  MessageSquare,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Field,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
} from "../components/ui";
import { notaries, orders } from "../data/notarixData";

const AssignNotaryModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Assign Notary"
    subtitle="Select a notary for this order"
    footer={
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold text-[var(--color-brand-primary)]">Selected: Sarah Jenkins</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Send Request</Button>
        </div>
      </div>
    }
  >
    <div className="grid gap-4 border-b border-[var(--color-border)] pb-5 md:grid-cols-4">
      {[
        ["Order ID", "#ORD-9421"],
        ["Service Type", "Loan Refinance"],
        ["Location", "Austin, TX"],
        ["Signing Date/Time", "Apr 24, 2026 • 14:00 PM"],
      ].map(([label, value]) => (
        <div key={label}>
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-1 font-bold">{value}</p>
        </div>
      ))}
    </div>

    <div className="my-6 grid gap-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-center sm:grid-cols-2">
      <div>
        <p className="text-xs font-bold uppercase text-slate-500">Client Paid</p>
        <p className="text-2xl">$150.00</p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-slate-500">Platform Fee</p>
        <p className="text-2xl text-red-600">$30.00</p>
      </div>
      <div className="sm:col-span-2">
        <label className="mx-auto block max-w-[260px]">
          <span className="text-xs font-bold uppercase text-[var(--color-brand-primary)]">Notary Offer Price</span>
          <span className="mt-1 flex h-16 items-center rounded-lg border-2 border-[var(--color-brand-primary)] bg-white px-5 text-3xl font-bold">
            <span className="mr-8">$</span>80
          </span>
        </label>
        <p className="mt-4 font-bold">You are offering $80 to the notary for this job</p>
        <p className="mt-2 text-sm italic text-slate-600">The first notary who accepts this offer will be automatically assigned to this order.</p>
      </div>
    </div>

    <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_110px]">
      <Field label="" placeholder="Search notary by name or ID..." />
      <select className="h-11"><option>Coverage Area</option></select>
      <select className="h-11"><option>All</option></select>
    </div>
    <div className="mb-5 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 font-bold text-[var(--color-brand-primary)]">
      Request sent to 18 notaries
      <Users className="h-5 w-5" />
    </div>

    <p className="mb-3 text-sm font-bold uppercase text-slate-600">Top Rated Near Austin (4)</p>
    <div className="space-y-3">
      {notaries.map((notary) => (
        <button
          key={notary.name}
          type="button"
          className="flex w-full items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-slate-50 p-4 text-left"
        >
          <div className="flex items-center gap-4">
            <Avatar name={notary.name} tone={notary.avatarTone} />
            <div>
              <p className="text-xl font-semibold">{notary.name}</p>
              <p className="text-sm text-slate-600">{notary.location} · {notary.radius}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {notary.tags.map((tag) => <StatusBadge key={tag} status={tag} />)}
              </div>
            </div>
          </div>
          <div className="hidden text-right md:block">
            <p className={notary.status === "Available" ? "text-emerald-600" : "text-orange-500"}>{notary.status.toUpperCase()}</p>
            <p className="mt-2 text-sm text-slate-600">{notary.jobs}</p>
          </div>
          <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${notary.selected ? "border-[var(--color-brand-primary)]" : "border-slate-300"}`}>
            {notary.selected ? <span className="h-3 w-3 rounded-full bg-[var(--color-brand-primary)]" /> : null}
          </span>
        </button>
      ))}
    </div>
  </Modal>
);

const OrderManagementPage = () => {
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Order Management"
        actions={<Button icon={Plus} size="lg">Create Order</Button>}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total" value="1,284" change="+12% from last month" icon={ClipboardList} />
        <MetricCard label="Pending" value="42" icon={Hourglass} />
        <MetricCard label="Assigned" value="156" icon={UserPlus} />
        <MetricCard label="In Progress" value="89" icon={CalendarClock} />
        <MetricCard label="Completed" value="997" icon={CheckCircle2} />
      </div>

      <Card className="mt-8 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_160px_160px_260px_130px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="h-12 w-full pl-11" placeholder="Search Order ID, Client, or Notary..." />
          </div>
          <select className="h-12"><option>All Statuses</option></select>
          <select className="h-12"><option>Service Type</option></select>
          <input className="h-12" value="Feb 1, 2026 - Mar 31, 2026" readOnly />
          <Button variant="secondary" icon={FileDown}>Export CSV</Button>
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
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-6 py-6">
                    <Link to={order.route} className="font-bold text-[var(--color-brand-primary)]">{order.id}</Link>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{order.client}</p>
                    <p className="text-sm text-slate-600">Borrower: {order.borrower}</p>
                  </td>
                  <td className="px-6 py-6">{order.service}</td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> {order.location}</span>
                  </td>
                  <td className="px-6 py-6">{order.schedule}</td>
                  <td className="px-6 py-6">{order.notary === "Unassigned" ? <em className="text-slate-600">Unassigned</em> : order.notary}</td>
                  <td className="px-6 py-6"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Link to={order.route} className="text-[var(--color-brand-primary)]" aria-label="View"><Eye className="h-4 w-4" /></Link>
                      {order.status === "Pending" ? (
                        <button type="button" onClick={() => setAssignOpen(true)} aria-label="Assign"><UserPlus className="h-4 w-4" /></button>
                      ) : null}
                      <button type="button" aria-label="Message"><MessageSquare className="h-4 w-4" /></button>
                      <button type="button" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button type="button" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      <button type="button" aria-label="More"><MoreVertical className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing <strong>1 - 4</strong> of <strong>1,284</strong> orders</p>
          <Pagination />
        </div>
      </Card>

      <AssignNotaryModal open={assignOpen} onClose={() => setAssignOpen(false)} />
    </div>
  );
};

export default OrderManagementPage;
