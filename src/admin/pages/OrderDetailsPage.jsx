import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Download,
  FileText,
  FolderOpen,
  MapPin,
  MessageSquare,
  Pencil,
  Send,
  ShieldCheck,
  UserPlus,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Modal,
  SectionTitle,
  StatusBadge,
} from "../components/ui";

const Timeline = ({ completed = false, assigned = true }) => (
  <Card className="p-6">
    <h2 className="mb-6 text-2xl font-semibold">Order Timeline</h2>
    {[
      ["Order Created", "Apr 20, 2026 • 09:12 AM", true],
      ["Assigned", assigned ? "Apr 21, 2026 • 10:00 AM" : "Pending Assignment", assigned],
      ["In Progress", completed ? "Oct 24, 2024 • 13:00 PM" : "Awaiting Assignment", completed],
      ["Completed", completed ? "Oct 24, 2024 • 14:15 PM" : "Future Event", completed],
    ].map(([title, time, active]) => (
      <div key={title} className="relative flex gap-4 pb-8 last:pb-0">
        <span className={`z-10 grid h-8 w-8 place-items-center rounded-full ${active ? "bg-[var(--color-brand-primary)] text-white" : "border border-slate-300 bg-white text-slate-300"}`}>
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div className="absolute left-4 top-8 h-full w-px bg-slate-200 last:hidden" />
        <div>
          <p className={`font-bold ${active ? "text-slate-900" : "text-slate-400"}`}>{title}</p>
          <p className="text-sm text-slate-500">{time}</p>
        </div>
      </div>
    ))}
  </Card>
);

const DocumentsList = () => (
  <Card className="p-6">
    <SectionTitle icon={FolderOpen} title="Documents" action={<Button variant="ghost" size="sm">+ Add File</Button>} />
    <div className="space-y-3">
      {["Service_Agreement.pdf", "W-9_Form.pdf"].map((doc) => (
        <div key={doc} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">{doc}</p>
              <p className="text-xs text-slate-500">Uploaded Oct 20 • 2.4 MB</p>
            </div>
          </div>
          <div className="flex gap-4 text-slate-500">
            <FileText className="h-4 w-4" />
            <Download className="h-4 w-4" />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const AssignedView = () => (
  <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
    <div className="space-y-7">
      <div className="grid gap-7 md:grid-cols-2">
        <Card className="p-6">
          <SectionTitle icon={Building2} title="Client Info" action={<Button variant="ghost">View Profile</Button>} />
          <Info label="Company Name" value="First American Title" />
          <Info label="Primary Contact" value="John Smith" />
        </Card>
        <Card className="p-6">
          <SectionTitle icon={UserRound} title="Borrower Info" action={<Button variant="ghost">Contact</Button>} />
          <Info label="Full Name" value="Marcus Webb" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Info label="Phone" value="+1 (555) 123-4567" />
            <Info label="Email" value="m.webb@example.com" />
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <SectionTitle icon={MapPin} title="Property & Signing Details" />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-slate-600">Location</p>
            <p className="mt-2 text-lg font-bold">123 Legal Way<br />Austin, TX - 78701</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-6">
            <p className="text-xs font-bold uppercase text-slate-600">Signing Type</p>
            <p className="mt-4 text-xl font-bold">In-person Meeting</p>
          </div>
        </div>
      </Card>
      <DocumentsList />
      <MessageCenter />
    </div>
    <aside className="space-y-7">
      <Card className="bg-[var(--color-brand-primary)] p-7 text-white">
        <h2 className="mb-5 text-2xl font-bold">Quick Actions</h2>
        <div className="space-y-3">
          <Button className="w-full bg-white/15 shadow-none hover:bg-white/20">Reassign Notary</Button>
          <Button className="w-full bg-white/15 shadow-none hover:bg-white/20">Mark as Completed</Button>
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={ShieldCheck} title="Assigned Notary" />
        <div className="mb-5 flex items-center gap-4 rounded-lg border border-[var(--color-border)] p-4">
          <Avatar name="Marcus Webb" src="/profile.jpg" />
          <div>
            <p className="font-bold">Marcus Webb</p>
            <p className="text-sm font-semibold text-emerald-600">Accepted</p>
          </div>
        </div>
        <Info label="Email" value="webb@gmail.com" />
        <Info label="Phone" value="+1 (555) 000-9876" />
      </Card>
      <Card className="p-6">
        <SectionTitle icon={FileText} title="Payment Details" />
        <div className="rounded-lg border border-[var(--color-border)] p-4">
          <Info label="Total Fee" value="$150.00" />
          <Info label="Method" value="Card •••• 4242" />
          <Info label="Paid Date" value="Oct 22, 2023" />
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-orange-800">Special Instructions</h2>
        <p className="rounded-lg border border-orange-100 bg-orange-50 p-4 italic text-orange-800">
          "Signer requires a physical copy of the disclosure forms."
        </p>
      </Card>
      <Timeline completed={false} assigned />
    </aside>
  </div>
);

const Info = ({ label, value }) => (
  <div className="mb-4 last:mb-0">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 font-bold">{value}</p>
  </div>
);

const PendingView = () => {
  const [assignOpen, setAssignOpen] = useState(false);
  return (
    <>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_520px]">
        <div className="space-y-7">
          <Card className="p-6">
            <SectionTitle icon={Building2} title="Client Information" action={<Pencil className="h-5 w-5 text-slate-500" />} />
            <div className="grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
              <Info label="Company" value="First American Title" />
              <Info label="Contact Person" value="John Smith" />
            </div>
          </Card>
          <Card className="p-6">
            <SectionTitle icon={UserRound} title="Borrower Information" />
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <Avatar name="Marcus Webb" />
                <div>
                  <p className="font-bold">Marcus Webb</p>
                  <p className="text-sm text-slate-500">Primary Borrower</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Info label="Phone Number" value="+1 (512) 555-0198" />
                <Info label="Email Address" value="m.webb@example.com" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <SectionTitle icon={MapPin} title="Property Details" />
            <Info label="Address" value="1201 S Congress Ave, Austin, TX 78704" />
            <p className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-[var(--color-brand-primary)]">
              Verified residential address
            </p>
          </Card>
        </div>
        <aside className="space-y-7">
          <Card className="border-dashed border-blue-300 p-10 text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]">
              <UserPlus className="h-9 w-9" />
            </span>
            <h2 className="mt-6 text-2xl font-bold">No Notary Assigned</h2>
            <p className="mx-auto mt-3 max-w-sm text-slate-600">
              This order requires an active notary to proceed. Browse available professionals in the Austin area.
            </p>
            <Button className="mt-8 w-full" size="lg" icon={SearchIcon} onClick={() => setAssignOpen(true)}>Assign Notary</Button>
          </Card>
          <DocumentsList />
          <Timeline assigned={false} />
        </aside>
      </div>
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Notary"
        subtitle="Send this order to qualified notaries in Austin."
        icon={UserPlus}
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button><Button onClick={() => setAssignOpen(false)}>Send Request</Button></div>}
      >
        <div className="space-y-3">
          {["Sarah Jenkins", "Michael Chen", "Elena Rodriguez"].map((name, index) => (
            <label key={name} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4">
              <span className="flex items-center gap-3"><Avatar name={name} /><strong>{name}</strong></span>
              <input type="radio" name="pending-notary" defaultChecked={index === 0} className="h-5 w-5 p-0" />
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
};

const SearchIcon = (props) => <UserPlus {...props} />;

const CompletedView = () => (
  <div className="space-y-7">
    <Card className="grid gap-5 p-6 md:grid-cols-4">
      <Info label="Order ID" value="#NS-8842-2024" />
      <Info label="Service Type" value="Loan Refinance Package" />
      <Info label="Completed Date" value="Oct 24, 2025" />
      <Info label="Payment Status" value="Paid in Full" />
    </Card>
    <div className="grid gap-7 lg:grid-cols-2">
      <Card className="p-6">
        <SectionTitle icon={Building2} title="Client & Borrower Information" />
        <div className="space-y-5">
          <div className="rounded-lg bg-slate-50 p-5"><Info label="Client Company" value="Evergreen Title & Escrow" /><p className="text-slate-600">contact@evergreentitle.com</p></div>
          <div className="rounded-lg bg-slate-50 p-5"><Info label="Borrower" value="Jonathan Q. Arbuckle" /><p className="text-slate-600">+1 (555) 902-1143<br />j.arbuckle@provider.com</p></div>
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={MapPin} title="Property & Notary Details" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-5"><Info label="Property Address" value="1248 Oakwood Avenue" /><p className="text-slate-600">Suite 400<br />Charlotte, NC 28202</p></div>
          <div className="rounded-lg bg-slate-50 p-5"><Avatar name="Sarah Jenkins" src="/profile.jpg" /><p className="mt-3 font-bold">Sarah Jenkins</p><p className="font-bold text-[var(--color-brand-primary)]">ID: NS-NC-9921</p></div>
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={FileText} title="Payment Information" action={<StatusBadge status="Receipt #44921" />} />
        {[
          ["Base Fee", "$150.00"],
          ["Travel Surcharge", "$25.00"],
          ["Document Prep", "$15.00"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-slate-200 py-3"><span>{label}</span><strong>{value}</strong></div>
        ))}
        <div className="mt-4 flex justify-between rounded bg-blue-50 p-3 font-bold text-[var(--color-brand-primary)]">
          <span>Total Amount Paid</span><span>$190.00</span>
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={ShieldCheck} title="Signed Documents" />
        {["Signed_Closing_Disclosure.pdf", "Deed_of_Trust_Executed.pdf", "Affidavit_of_Occupancy.pdf"].map((doc) => (
          <div key={doc} className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-red-600" /><strong>{doc}</strong></div>
            <Download className="h-5 w-5 text-slate-500" />
          </div>
        ))}
      </Card>
      <Timeline completed />
      <Card className="p-6">
        <h2 className="mb-5 text-2xl font-semibold">Final Completion Notes</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <p className="text-sm uppercase text-slate-500">System Notes</p>
              <p className="mt-3 text-slate-700">Digital seal successfully applied. All compliance checks passed. Documents have been archived for 7 years as per state regulations.</p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <p className="text-sm uppercase text-slate-500">Notary Comments</p>
              <p className="mt-3 italic text-slate-700">"Borrower was punctual and had all required primary and secondary identification ready."</p>
            </div>
          </div>
          <div className="grid place-items-center rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center">
            <ShieldCheck className="mb-4 h-20 w-20 text-[var(--color-brand-primary)]" />
            <p className="font-semibold">Legal Seal Verified</p>
            <p className="text-sm text-slate-500">This order carries a digital legal seal ensuring authenticity.</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const MessageCenter = () => (
  <Card className="overflow-hidden">
    <div className="border-b border-[var(--color-border)] p-6">
      <SectionTitle icon={MessageSquare} title="Message Center" />
    </div>
    <div className="space-y-4 p-6">
      <div className="max-w-xl rounded-lg border border-[var(--color-border)] p-4">
        Document #ORD-9421-DS has been successfully uploaded and shared with the notary.
      </div>
      <div className="ml-auto max-w-xl rounded-lg bg-[var(--color-brand-primary)] p-4 text-white">
        I have confirmed with the borrower. We are scheduled for tomorrow at 2:00 PM.
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <input className="h-11 flex-1 rounded-full bg-slate-100" placeholder="Type your message..." />
        <Button className="h-12 w-12 rounded-full px-0" aria-label="Send"><Send className="h-5 w-5" /></Button>
      </div>
    </div>
  </Card>
);

const OrderDetailsPage = ({ variant = "assigned" }) => {
  const isPending = variant === "pending";
  const isCompleted = variant === "completed";

  return (
    <div>
      {isPending ? (
        <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-4 font-semibold text-yellow-800">
          Notary not assigned to this order. Action required.
        </div>
      ) : null}
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold">
              {isCompleted ? "Order Details" : isPending ? "#ORD-9421" : "Order Details"}
            </h1>
            <StatusBadge status={isCompleted ? "Completed" : isPending ? "Pending" : "Assigned"} />
          </div>
          {!isCompleted ? (
            <p className="mt-1 text-slate-600">
              <span className="font-bold text-[var(--color-brand-primary)]">#ORD-9421</span> · Created {isPending ? "on Apr 20, 2026 • 09:12 AM" : "May 01, 2026"}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          {isCompleted ? (
            <>
              <Button variant="secondary" icon={Download}>Download Documents</Button>
              <Button variant="secondary" icon={FileText}>View Invoice</Button>
              <Button>Duplicate Order</Button>
            </>
          ) : (
            <>
              {isPending ? <Button icon={UserPlus}>Assign Notary</Button> : null}
              <Button variant="secondary" icon={Pencil}>Edit Order</Button>
              {isPending ? null : <Button icon={MessageSquare}>Open Chat</Button>}
              <Button variant="danger" icon={XCircle}>Cancel Order</Button>
            </>
          )}
        </div>
      </div>

      {isCompleted ? <CompletedView /> : isPending ? <PendingView /> : <AssignedView />}
    </div>
  );
};

export default OrderDetailsPage;
