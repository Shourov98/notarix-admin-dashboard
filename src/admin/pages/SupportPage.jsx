import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  Plus,
  Save,
  Send,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  Field,
  MetricCard,
  Modal,
  PageHeader,
  SelectField,
  StatusBadge,
  TextArea,
} from "../components/ui";
import {
  createSupportTicket,
  fetchSupportTicket,
  fetchSupportTickets,
  selectAdminConsole,
  updateSupportTicket,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";
import { useSocket } from "../../hooks/useSocket";

const STATUS_TABS = ["Open", "Resolved", "All Tickets"];
const STATUS_VALUES = {
  Open: "Open",
  Resolved: "Resolved",
  "All Tickets": undefined,
};

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const SupportList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { supportTickets, ticketsStatus, ticketsError, ticketActionStatus } =
    useAppSelector(selectAdminConsole);
  const [tab, setTab] = useState("Open");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      fetchSupportTickets({
        status: STATUS_VALUES[tab],
        search: debouncedSearch || undefined,
      })
    );
  }, [dispatch, tab, debouncedSearch]);

  const refresh = useCallback(() => {
    dispatch(
      fetchSupportTickets({
        status: STATUS_VALUES[tab],
        search: debouncedSearch || undefined,
      })
    );
  }, [dispatch, tab, debouncedSearch]);

  useSocket("support_ticket_created", refresh);
  useSocket("support_ticket_updated", refresh);

  const activeCount = useMemo(
    () => supportTickets.filter((ticket) => ticket.status !== "Resolved").length,
    [supportTickets]
  );
  const resolvedCount = useMemo(
    () => supportTickets.filter((ticket) => ticket.status === "Resolved").length,
    [supportTickets]
  );

  return (
    <div>
      <PageHeader
        title="Support"
        description="Manage support requests from users."
        actions={
          <Button icon={Plus} onClick={() => setCreateOpen(true)}>
            New Ticket
          </Button>
        }
      />
      <div className="grid gap-7 md:grid-cols-2">
        <MetricCard
          label="Active Tickets"
          value={String(activeCount)}
          icon={Headphones}
          tone="danger"
        />
        <MetricCard
          label="Tickets Resolved"
          value={String(resolvedCount)}
          icon={CheckCircle2}
        />
      </div>

      <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-white p-1">
          {STATUS_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`h-10 rounded-md px-7 font-semibold ${
                item === tab
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-12 w-full md:w-80"
          placeholder="Search support requests..."
        />
      </div>

      <Card className="mt-7 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-5">Requester</th>
              <th className="px-6 py-5">Priority</th>
              <th className="px-6 py-5">Subject</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Updated</th>
              <th className="px-6 py-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supportTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`/support/${ticket.id}`)}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={ticket.requesterEmail || ticket.subject || ticket.id}
                      tone="bg-slate-200 text-slate-600"
                    />
                    <strong>{ticket.requesterEmail || "—"}</strong>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-600 capitalize">{ticket.priority}</td>
                <td className="px-6 py-5 text-slate-700">{ticket.subject}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-5 text-slate-600">{formatDate(ticket.updatedAt)}</td>
                <td className="px-6 py-5">
                  <Link to={`/support/${ticket.id}`}>
                    <Button variant="danger" size="sm">
                      View Ticket
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {supportTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                  {ticketsStatus === "loading"
                    ? "Loading tickets..."
                    : ticketsError || "No tickets found."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="border-t border-slate-100 px-6 py-5 text-sm text-slate-600">
          Showing {supportTickets.length} ticket{supportTickets.length === 1 ? "" : "s"}
        </div>
      </Card>

      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        ticketActionStatus={ticketActionStatus}
        onCreate={async (values) => {
          const result = await dispatch(createSupportTicket(values));
          if (createSupportTicket.fulfilled.match(result)) {
            toast.success("Ticket created.");
            setCreateOpen(false);
          } else {
            toast.error(result.payload || "Unable to create ticket.");
          }
        }}
      />
    </div>
  );
};

const CreateTicketModal = ({ open, onClose, onCreate, ticketActionStatus }) => {
  const [form, setForm] = useState({
    subject: "",
    body: "",
    priority: "normal",
    requesterEmail: "",
  });

  const handleSubmit = () => {
    if (!form.subject || !form.body) {
      toast.error("Subject and body are required.");
      return;
    }
    onCreate(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Support Ticket"
      icon={Plus}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            icon={Send}
            onClick={handleSubmit}
            disabled={ticketActionStatus === "loading"}
          >
            {ticketActionStatus === "loading" ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Field
          label="Subject"
          required
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        />
        <Field
          label="Requester Email"
          type="email"
          value={form.requesterEmail}
          onChange={(event) => setForm({ ...form, requesterEmail: event.target.value })}
        />
        <SelectField
          label="Priority"
          value={form.priority}
          onChange={(event) => setForm({ ...form, priority: event.target.value })}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </SelectField>
        <TextArea
          label="Description"
          required
          value={form.body}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
        />
      </div>
    </Modal>
  );
};

const SupportDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { activeTicket, activeTicketStatus, activeTicketError, ticketActionStatus } =
    useAppSelector(selectAdminConsole);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("Open");

  useEffect(() => {
    if (id) {
      dispatch(fetchSupportTicket(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (activeTicket?.status) {
      setStatus(activeTicket.status);
    }
  }, [activeTicket]);

  useSocket("support_ticket_updated", (payload) => {
    if (payload?.id === id) {
      dispatch(fetchSupportTicket(id));
    }
  });

  const handleSave = async (event) => {
    event.preventDefault();
    const patch = { status };
    if (reply.trim()) {
      patch.reply = reply.trim();
      patch.replyAuthor = "admin";
    }
    const result = await dispatch(updateSupportTicket({ ticketId: id, patch }));
    if (updateSupportTicket.fulfilled.match(result)) {
      toast.success("Ticket updated.");
      setReply("");
    } else {
      toast.error(result.payload || "Unable to update ticket.");
    }
  };

  if (activeTicketStatus === "loading" || !activeTicket) {
    return (
      <div>
        <PageHeader title="Support Ticket" description="Loading..." />
        <Card className="p-8 text-slate-500">
          {activeTicketError || "Loading ticket..."}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Ticket ${activeTicket.id}`}
        description={`Subject: ${activeTicket.subject}`}
      />
      <div className="grid gap-7 lg:grid-cols-[2fr_1fr]">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Avatar
              name={activeTicket.requesterEmail || activeTicket.id}
              tone="bg-blue-100 text-[var(--color-brand-primary)]"
              size="lg"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">
                {activeTicket.requesterEmail || "Anonymous requester"}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Priority: {activeTicket.priority} · Created {formatDate(activeTicket.createdAt)}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {(activeTicket.messages || []).map((message) => (
              <div
                key={message.id}
                className={`rounded-lg p-4 text-sm ${
                  message.authorRole === "admin"
                    ? "bg-blue-50 text-blue-900"
                    : "bg-slate-50 text-slate-800"
                }`}
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {message.author} · {formatDate(message.createdAt)}
                </p>
                <p>{message.body}</p>
              </div>
            ))}
          </div>
          <form className="mt-7 space-y-4" onSubmit={handleSave}>
            <TextArea
              label="Reply"
              placeholder="Type a reply..."
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <SelectField
                label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </SelectField>
              <Button type="submit" icon={Save} disabled={ticketActionStatus === "loading"}>
                {ticketActionStatus === "loading" ? "Saving..." : "Update Ticket"}
              </Button>
            </div>
          </form>
        </Card>
        <Card className="space-y-4 p-7">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--color-brand-primary)]" />
            <p className="text-sm font-bold text-slate-900">Details</p>
          </div>
          <div className="text-sm text-slate-600">
            <p>
              <strong>Status:</strong> <StatusBadge status={activeTicket.status} />
            </p>
            <p className="mt-2">
              <strong>Updated:</strong> {formatDate(activeTicket.updatedAt)}
            </p>
            <p className="mt-2">
              <strong>Priority:</strong> {activeTicket.priority}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SupportPage = ({ detail = false }) => (detail ? <SupportDetail /> : <SupportList />);

export default SupportPage;
