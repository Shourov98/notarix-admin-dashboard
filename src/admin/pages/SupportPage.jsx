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
import { selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppSelector } from "../../store/hooks";

const SupportList = () => {
  const { supportTickets } = useAppSelector(selectAdminConsole);

  return (
    <div>
      <PageHeader title="Support" description="Manage support requests from users." />
      <div className="grid gap-7 md:grid-cols-2">
        <MetricCard label="Active Tickets" value={String(supportTickets.filter((item) => item.status !== "Resolved").length)} icon={Headphones} tone="danger" />
        <MetricCard label="Tickets Resolved" value={String(supportTickets.filter((item) => item.status === "Resolved").length)} icon={CheckCircle2} />
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
              <tr key={ticket.id} className="border-t border-slate-100">
                <td className="px-6 py-5"><div className="flex items-center gap-4"><Avatar name={ticket.name} tone="bg-slate-200 text-slate-600" /><strong>{ticket.name}</strong></div></td>
                <td className="px-6 py-5 text-slate-600">{ticket.type}</td>
                <td className="px-6 py-5 text-slate-700">{ticket.issue}</td>
                <td className="px-6 py-5"><StatusBadge status={ticket.status} /></td>
                <td className="px-6 py-5 text-slate-600">{ticket.date}</td>
                <td className="px-6 py-5"><Link to={`/support/${ticket.id}`}><Button variant="danger" size="sm">View Ticket</Button></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-100 px-6 py-5 text-sm text-slate-600">Showing 1-{supportTickets.length} of {supportTickets.length} tickets</div>
      </Card>
    </div>
  );
};

const SupportDetail = () => (
  <div>
    <PageHeader title="Support Ticket" description="Detailed support threads are not backed by a live admin endpoint yet." />
    <Card className="p-8">
      <div className="flex gap-5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold">Live ticket detail is not available</h2>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
            The support listing can show real ticket rows when the backend returns them, but this detail route is not connected to a real ticket thread, requester profile, or audit stream yet. It intentionally stays empty instead of rendering sample messages.
          </p>
        </div>
      </div>
    </Card>
  </div>
);

const SupportPage = ({ detail = false }) => (detail ? <SupportDetail /> : <SupportList />);

export default SupportPage;
