import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  Headphones,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { Avatar, Button, Card, MetricCard, PageHeader, StatusBadge, TextArea } from "../components/ui";
import { supportTickets } from "../data/notarixData";

const SupportList = () => (
  <div>
    <PageHeader title="Support" description="Manage support requests from users." />
    <div className="grid gap-7 md:grid-cols-2">
      <MetricCard label="Active Tickets" value="42" icon={Headphones} tone="danger" />
      <MetricCard label="Tickets Resolved" value="1,284" icon={CheckCircle2} />
    </div>

    <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-white p-1">
        {["Open", "Resolved", "All Tickets"].map((item) => (
          <button key={item} type="button" className={`h-10 rounded-md px-7 font-semibold ${item === "Open" ? "bg-[var(--color-brand-primary)] text-white" : "text-slate-600"}`}>{item}</button>
        ))}
      </div>
      <input className="h-12 w-full md:w-80" placeholder="Search support requests..." />
    </div>

    <Card className="mt-7 overflow-hidden">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-6 py-5">User Name</th><th className="px-6 py-5">User Type</th><th className="px-6 py-5">Issue/Subject</th><th className="px-6 py-5">Status</th><th className="px-6 py-5">Date</th><th className="px-6 py-5">Actions</th></tr>
        </thead>
        <tbody>
          {supportTickets.map((ticket) => (
            <tr key={ticket.name} className="border-t border-slate-100">
              <td className="px-6 py-5"><div className="flex items-center gap-4"><Avatar name={ticket.name} tone="bg-slate-200 text-slate-600" /><strong>{ticket.name}</strong></div></td>
              <td className="px-6 py-5 text-slate-600">{ticket.type}</td>
              <td className="px-6 py-5 text-slate-700">{ticket.issue}</td>
              <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
              <td className="px-6 py-5 text-slate-600">{ticket.date}</td>
              <td className="px-6 py-5"><Link to="/support/tk-8821"><Button variant="danger" size="sm">View Ticket</Button></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-slate-100 px-6 py-5 text-sm text-slate-600">Showing 1-4 of 128 tickets</div>
    </Card>
  </div>
);

const SupportDetail = () => (
  <div>
    <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <p className="mb-1 text-sm uppercase text-slate-600">Support Case · ID #TK-8821</p>
        <h1 className="text-3xl font-extrabold">Digital Seal Sync Error</h1>
      </div>
      <div className="flex gap-3"><StatusBadge status="In Progress" /><StatusBadge status="High Priority" className="bg-red-100 text-red-700" /></div>
    </div>
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-7">
        <Card className="p-7">
          <div className="flex gap-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]"><AlertTriangle className="h-7 w-7" /></span>
            <div>
              <h2 className="text-2xl font-semibold">Issue Details</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                The user reports that the digital seal fails to synchronize during the final verification step. The verification log shows a "HASH_MISMATCH_ERROR" during the cryptographic binding phase.
              </p>
            </div>
          </div>
          <div className="mt-7 border-t border-slate-200 pt-6">
            <p className="mb-4 uppercase text-slate-600">Attachments (1)</p>
            <div className="inline-flex min-w-[300px] items-center justify-between rounded-lg border border-[var(--color-border)] bg-[#f0eefb] p-4">
              <div><p className="font-bold">error_screenshot.png</p><p className="text-sm text-slate-500">1.2 MB · Image File</p></div>
              <Download className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <MessageBubble name="Marcus Rivera" time="09:42 AM" text="Hi Support, I'm currently in the middle of a high-priority closing and the digital seal won't apply to the final document. Please help ASAP!" />
          <MessageBubble admin name="Support Team (Admin)" time="10:15 AM" text="Hello Marcus, thanks for reaching out. We've identified the HASH_MISMATCH_ERROR in your logs. Are you able to try re-uploading the document as a flat PDF in the meantime?" />
          <MessageBubble name="Marcus Rivera" time="10:22 AM" text="I've tried re-uploading, but the same error persists. The client is waiting on the call. Is there any workaround or a patch coming shortly?" />
        </div>

        <Card className="p-5">
          <TextArea label="" placeholder="Type your reply..." />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-5 text-slate-600"><Paperclip className="h-5 w-5" /><Smile className="h-5 w-5" />@</div>
            <Button icon={Send}>Send Reply</Button>
          </div>
        </Card>
      </div>

      <aside className="space-y-7">
        <Card className="overflow-hidden">
          <div className="bg-[#e8e6f5] p-5 text-lg">Ticket Actions</div>
          <div className="space-y-4 p-5">
            <Button variant="secondary" className="w-full justify-between">Mark as Resolved <ChevronRight className="h-5 w-5" /></Button>
            <Button variant="secondary" className="w-full justify-between">Change Status <ChevronRight className="h-5 w-5" /></Button>
          </div>
        </Card>
        <Card className="overflow-hidden text-center">
          <div className="bg-[#e8e6f5] p-5 text-left text-lg">Requester Details</div>
          <div className="p-7">
            <Avatar name="Marcus Rivera" size="lg" />
            <h2 className="mt-5 text-2xl font-bold">Marcus Rivera</h2>
            <StatusBadge status="Licensed Notary" />
            <div className="mt-7 space-y-5 text-left">
              <Info label="Email Address" value="m.rivera@notarix-partner.com" />
              <Info label="Location" value="Miami, FL (Eastern Time)" />
              <Info label="Member Since" value="January 12, 2025" />
            </div>
            <Button variant="ghost" className="mt-5 text-[var(--color-brand-primary)]">View Profile</Button>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-[#e8e6f5] p-5 text-lg">Audit Trail</div>
          <div className="p-7">
            {["Admin Reply Sent", "Ticket Created by Marcus", "System Alert: Sync Lag Detected"].map((item) => (
              <div key={item} className="mb-6 border-l-2 border-slate-200 pl-5 last:mb-0">
                <p className="font-bold">{item}</p>
                <p className="text-sm text-slate-500">Today, 10:15 AM</p>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div><p className="text-sm uppercase text-slate-500">{label}</p><p className="font-semibold">{value}</p></div>
);

const MessageBubble = ({ name, time, text, admin = false }) => (
  <div className={`flex gap-4 ${admin ? "justify-end" : ""}`}>
    {!admin ? <Avatar name={name} /> : null}
    <div className="max-w-[760px]">
      <p className={`mb-2 font-bold ${admin ? "text-right text-[var(--color-brand-primary)]" : ""}`}>{name} <span className="ml-2 text-sm font-normal text-slate-500">{time}</span></p>
      <p className={`rounded-lg p-5 leading-7 ${admin ? "bg-[var(--color-brand-primary)] text-white" : "border border-[var(--color-border)] bg-[#e8e6f5]"}`}>{text}</p>
    </div>
    {admin ? <Avatar name={name} tone="bg-blue-100 text-blue-700" /> : null}
  </div>
);

const SupportPage = ({ detail = false }) => (detail ? <SupportDetail /> : <SupportList />);

export default SupportPage;
