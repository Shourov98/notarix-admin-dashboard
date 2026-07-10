import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  AtSign,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Headphones,
  Image as ImageIcon,
  Paperclip,
  Plus,
  PlusCircle,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Button,
  Card,
  Field,
  MetricCard,
  Modal,
  PageHeader,
  Pagination,
  SectionTitle,
  SelectField,
  StatusBadge,
  TextArea,
} from "../components/ui";
import {
  createSupportTicket,
  fetchSupportTicket,
  fetchSupportTicketCounts,
  fetchSupportTickets,
  selectAdminConsole,
  updateSupportTicket,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSocket } from "../../hooks/useSocket";
import { buildApiUrl } from "../../services/httpClient";

const STATUS_TABS = ["Open", "Resolved", "All Tickets"];
const STATUS_VALUES = {
  Open: "Open",
  Resolved: "Resolved",
  "All Tickets": undefined,
};

const ACTIVE_STATUSES = new Set(["Open", "In Progress", "Pending"]);

const TONE_BADGES = {
  Resolved: "bg-emerald-100 text-emerald-700",
  Open: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Closed: "bg-slate-100 text-slate-600",
};

const SEVERITY_BADGES = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-red-50 text-red-700",
  Normal: "bg-blue-50 text-blue-700",
  Low: "bg-slate-100 text-slate-600",
};

const ROLE_TONE = {
  Client: "bg-blue-100 text-blue-700",
  Notary: "bg-orange-100 text-orange-700",
  System: "bg-slate-200 text-slate-700",
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, exponent);
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const SupportList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    supportTickets,
    supportTicketsPagination,
    supportTicketCounts,
    ticketsStatus,
    ticketsError,
  } = useAppSelector(selectAdminConsole);
  const [tab, setTab] = useState("Open");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const refresh = useCallback(() => {
    dispatch(
      fetchSupportTickets({
        status: STATUS_VALUES[tab],
        search: debouncedSearch || undefined,
        page,
        pageSize: 10,
      })
    );
    dispatch(fetchSupportTicketCounts());
  }, [dispatch, tab, debouncedSearch, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useSocket("support_ticket_created", refresh);
  useSocket("support_ticket_updated", refresh);

  const pagination = supportTicketsPagination || { page: 1, totalItems: 0, totalPages: 1 };
  const showingStart =
    pagination.totalItems === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const showingEnd = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

  return (
    <div>
      <PageHeader
        title="Support"
        description="Manage support requests from users."
      />

      <div className="grid gap-7 md:grid-cols-2">
        <MetricCard
          label="Active Tickets"
          value={String(supportTicketCounts?.active ?? 0)}
          icon={Headphones}
          tone="danger"
        />
        <MetricCard
          label="Tickets Resolved"
          value={String(supportTicketCounts?.resolved ?? 0)}
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-white p-1">
          {STATUS_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setPage(1);
              }}
              className={`h-10 rounded-md px-7 font-semibold transition-colors ${
                item === tab
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 w-full pl-10"
            placeholder="Search support requests..."
          />
        </div>
      </div>

      <Card className="mt-7 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">User Name</th>
                <th className="px-6 py-5">User Type</th>
                <th className="px-6 py-5">Issue/Subject</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => {
                const role = ticket.requesterRole || "Client";
                const tone = ROLE_TONE[role] || ROLE_TONE.Client;
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/support/${ticket.id}`)}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={ticket.requesterName || ticket.requesterEmail || ticket.id}
                          tone={tone}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900">
                            {ticket.requesterName || "—"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {ticket.requesterEmail || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-700">{role}</td>
                    <td className="max-w-[280px] px-6 py-5">
                      <p className="truncate text-slate-700" title={ticket.subject}>
                        {ticket.subject}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-5 text-slate-600">{formatDate(ticket.updatedAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/support/${ticket.id}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Eye}
                          className="border-[#f97316] text-[#f97316] hover:bg-[#fff7ed]"
                        >
                          View Ticket
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {supportTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    {ticketsStatus === "loading"
                      ? "Loading tickets..."
                      : ticketsError || "No tickets found for the current filter."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {showingStart === 0 ? 0 : showingStart}–{showingEnd} of {pagination.totalItems} tickets
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages || 1}
            onPageChange={(next) => setPage(next)}
            disabled={ticketsStatus === "loading"}
          />
        </div>
      </Card>

      <div className="mt-8">
        <Button icon={PlusCircle} onClick={() => setCreateOpen(true)}>
          Create Support Ticket
        </Button>
      </div>

      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
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
    severity: "Normal",
    requesterName: "",
    requesterEmail: "",
    requesterRole: "Client",
  });

  useEffect(() => {
    if (open) {
      setForm({
        subject: "",
        body: "",
        severity: "Normal",
        requesterName: "",
        requesterEmail: "",
        requesterRole: "Client",
      });
    }
  }, [open]);

  const handleSubmit = () => {
    if (!form.subject || !form.body) {
      toast.error("Subject and description are required.");
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
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Requester Name"
            value={form.requesterName}
            onChange={(event) => setForm({ ...form, requesterName: event.target.value })}
          />
          <Field
            label="Requester Email"
            type="email"
            value={form.requesterEmail}
            onChange={(event) => setForm({ ...form, requesterEmail: event.target.value })}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            label="User Type"
            value={form.requesterRole}
            onChange={(event) => setForm({ ...form, requesterRole: event.target.value })}
          >
            <option value="Client">Client</option>
            <option value="Notary">Notary</option>
            <option value="System">System</option>
          </SelectField>
          <SelectField
            label="Severity"
            value={form.severity}
            onChange={(event) => setForm({ ...form, severity: event.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </SelectField>
        </div>
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

const AuditTrail = ({ entries = [] }) => {
  if (!entries.length) return null;
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => {
        const isToday = (() => {
          const created = new Date(entry.createdAt);
          if (Number.isNaN(created.getTime())) return false;
          const today = new Date();
          return (
            created.getUTCFullYear() === today.getUTCFullYear() &&
            created.getUTCMonth() === today.getUTCMonth() &&
            created.getUTCDate() === today.getUTCDate()
          );
        })();
        return (
          <div key={entry.id || `${entry.createdAt}-${index}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                  isToday ? "bg-[var(--color-brand-primary)]" : "bg-slate-300"
                }`}
              />
              {index < entries.length - 1 ? (
                <span className="mt-1 h-full w-px bg-slate-200" />
              ) : null}
            </div>
            <div className="pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {isToday ? "Today" : "Yesterday"}, {formatDateTime(entry.createdAt)}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">{entry.action}</p>
              {entry.note ? (
                <p className="mt-0.5 text-xs text-slate-500">{entry.note}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ConversationThread = ({ messages = [] }) => {
  if (!messages.length) {
    return (
      <p className="text-sm text-slate-500">
        No messages in this thread yet. Use the composer below to send the first reply.
      </p>
    );
  }
  // Group messages by date for the mockup-style separator.
  const grouped = messages.reduce((acc, message) => {
    const key = (message.createdAt || "").slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(message);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day}>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            <span>{formatDate(day || items[0].createdAt)}</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="mt-5 space-y-5">
            {items.map((message) => {
              const isAdmin = message.authorRole === "admin";
              const wrapperClass = isAdmin ? "flex justify-end" : "flex justify-start";
              const bubbleClass = isAdmin
                ? "rounded-2xl rounded-tr-sm bg-[var(--color-brand-primary)] text-white shadow-sm"
                : "rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-100 text-slate-800 shadow-sm";
              return (
                <div key={message.id} className={wrapperClass}>
                  <div className="flex max-w-[80%] items-start gap-3">
                    {!isAdmin ? (
                      <Avatar
                        name={message.author}
                        tone={ROLE_TONE.System}
                        size="sm"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p
                        className={`mb-1 px-2 text-[10px] font-bold uppercase tracking-widest ${
                          isAdmin ? "text-right text-[var(--color-brand-primary)]" : "text-slate-500"
                        }`}
                      >
                        {message.author}{" "}
                        <span className="ml-2 font-medium tracking-normal text-slate-400">
                          {formatDateTime(message.createdAt)}
                        </span>
                      </p>
                      <div className={`${bubbleClass} p-4`}>
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                          {message.body}
                        </p>
                      </div>
                    </div>
                    {isAdmin ? (
                      <Avatar
                        name="Support Team"
                        tone="bg-[var(--color-brand-primary)] text-white"
                        size="sm"
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const SupportDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { activeTicket, activeTicketStatus, activeTicketError, ticketActionStatus } =
    useAppSelector(selectAdminConsole);
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [statusDraft, setStatusDraft] = useState("Open");
  const [severityDraft, setSeverityDraft] = useState("Normal");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const conversationsScrollRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchSupportTicket(id));
      dispatch(fetchSupportTicketCounts());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!activeTicket) return;
    setStatusDraft(activeTicket.status || "Open");
    setSeverityDraft(activeTicket.severity || "Normal");
  }, [activeTicket]);

  useEffect(() => {
    if (conversationsScrollRef.current) {
      const node = conversationsScrollRef.current;
      node.scrollTo({ top: node.scrollHeight, behavior: "auto" });
    }
  }, [activeTicket?.messages?.length]);

  useSocket("support_ticket_updated", (payload) => {
    if (payload?.id === id) {
      dispatch(fetchSupportTicket(id));
      dispatch(fetchSupportTicketCounts());
    }
  });
  useSocket("support_ticket_created", () => dispatch(fetchSupportTicketCounts()));

  const handleReply = async () => {
    if (!id) return;
    if (!reply.trim() && attachments.length === 0) {
      toast.error("Type a reply or attach a file before sending.");
      return;
    }
    const patch = {};
    if (reply.trim()) patch.reply = reply.trim();
    if (attachments.length > 0) {
      patch.attachments = attachments.map((item) => ({
        name: item.name,
        size: item.size,
        mimeType: item.mimeType,
        kind: item.mimeType?.startsWith("image/") ? "image" : "file",
        url: item.previewUrl || "#",
      }));
    }
    if (statusDraft && statusDraft !== activeTicket?.status) {
      patch.status = statusDraft;
    }
    if (severityDraft && severityDraft !== activeTicket?.severity) {
      patch.severity = severityDraft;
    }
    const result = await dispatch(updateSupportTicket({ ticketId: id, patch }));
    if (updateSupportTicket.fulfilled.match(result)) {
      toast.success("Reply sent.");
      setReply("");
      setAttachments([]);
    } else {
      toast.error(result.payload || "Unable to send reply.");
    }
  };

  const handleMarkResolved = async () => {
    if (!id) return;
    const result = await dispatch(
      updateSupportTicket({ ticketId: id, patch: { status: "Resolved" } })
    );
    if (updateSupportTicket.fulfilled.match(result)) {
      toast.success("Ticket marked as resolved.");
    } else {
      toast.error(result.payload || "Unable to update ticket.");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target || {}).files || [];
    const next = files.map((file) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setAttachments(next);
    if (event?.target) event.target.value = "";
  };

  useEffect(() => {
    return () => {
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (activeTicketStatus === "loading" && !activeTicket) {
    return (
      <div>
        <PageHeader title="Support Ticket" description="Loading..." />
        <Card className="p-8 text-slate-500">
          {activeTicketError || "Loading ticket..."}
        </Card>
      </div>
    );
  }

  if (!activeTicket) {
    return (
      <div>
        <PageHeader title="Support Ticket" />
        <Card className="p-8 text-slate-500">
          {activeTicketError || "Ticket not found."}
        </Card>
      </div>
    );
  }

  const severity = activeTicket.severity || "Normal";
  const status = activeTicket.status || "Open";
  const statusBadgeClass =
    status === "Resolved"
      ? "bg-emerald-100 text-emerald-700"
      : status === "In Progress"
        ? "bg-blue-100 text-blue-700"
        : status === "Pending"
          ? "bg-amber-100 text-amber-700"
          : "bg-amber-100 text-amber-700";
  const severityBadgeClass = SEVERITY_BADGES[severity] || SEVERITY_BADGES.Normal;

  const ticketAttachmentList = activeTicket.attachments || [];
  const pendingAttachments = attachments;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link
            to="/support"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to support
          </Link>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Support Case · ID {activeTicket.caseCode || `#${activeTicket.id}`}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-normal text-[var(--color-ink)]">
            {activeTicket.subject}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Opened {formatDateTime(activeTicket.createdAt)} · Updated {formatDateTime(activeTicket.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusBadgeClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${severityBadgeClass}`}
          >
            {severity} Priority
          </span>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-7">
          <Card className="p-7">
            <SectionTitle icon={AlertTriangle} title="Issue Details" />
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
              {activeTicket.body || "No description provided."}
            </p>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Attachments ({ticketAttachmentList.length})
              </p>
              <div className="mt-4 space-y-3">
                {ticketAttachmentList.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No files have been attached to this ticket yet.
                  </p>
                ) : (
                  ticketAttachmentList.map((file) => {
                    const isImage = (file.mimeType || "").startsWith("image/");
                    const viewHref = file.url && file.url !== "#" ? file.url : null;
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[#f8f7ff] p-3"
                      >
                        {isImage && viewHref ? (
                          <img
                            src={buildApiUrl(viewHref, { skipPrefix: true, withToken: true })}
                            alt={file.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-[var(--color-brand-primary)]">
                            {isImage ? (
                              <ImageIcon className="h-6 w-6" />
                            ) : (
                              <FileText className="h-6 w-6" />
                            )}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {file.size ? formatFileSize(file.size) : "Attachment"} ·{" "}
                            {file.mimeType || "file"}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Download}
                          onClick={() => {
                            if (viewHref) window.open(viewHref, "_blank");
                            else toast.info("No attachment URL is available yet.");
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={Paperclip} title="Conversation" />
            <div
              ref={conversationsScrollRef}
              className="notarix-scrollbar mt-5 max-h-[520px] space-y-5 overflow-y-auto bg-slate-50/40 p-5"
            >
              <ConversationThread messages={activeTicket.messages || []} />
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <TextArea
                label="Your reply"
                placeholder="Type your reply..."
                value={reply}
                onChange={(event) => setReply(event.target.value)}
              />
              {pendingAttachments.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {pendingAttachments.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-slate-50 p-3"
                    >
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <FileText className="h-6 w-6 text-slate-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{formatFileSize(item.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <label className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-[var(--color-brand-primary)]">
                    <Paperclip className="h-5 w-5" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={ticketActionStatus === "loading"}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Emoji picker is not available yet.")}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-[var(--color-brand-primary)]"
                    aria-label="Insert emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Mention picker is not available yet.")
                    }
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-[var(--color-brand-primary)]"
                    aria-label="Mention user"
                  >
                    <AtSign className="h-5 w-5" />
                  </button>
                </div>
                <Button
                  icon={Send}
                  onClick={handleReply}
                  disabled={ticketActionStatus === "loading"}
                >
                  {ticketActionStatus === "loading" ? "Sending..." : "Send Reply"}
                </Button>
              </div>
              <p className="text-center text-xs text-slate-500">
                Replies are archived on the ticket record and visible to admins.
              </p>
            </div>
          </Card>
        </div>

        <aside className="space-y-7">
          <Card className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Ticket Actions
            </p>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                disabled={status === "Resolved"}
                onClick={handleMarkResolved}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-[var(--color-brand-primary)] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-600" />
                  Mark as Resolved
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </button>

              <div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={() => setStatusMenuOpen((value) => !value)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-slate-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-[var(--color-brand-primary)]" />
                    Change Status
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      statusMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {statusMenuOpen ? (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <SelectField
                      label="Status"
                      value={statusDraft}
                      onChange={(event) => setStatusDraft(event.target.value)}
                    >
                      {["Open", "In Progress", "Pending", "Resolved", "Closed"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      label="Severity"
                      value={severityDraft}
                      onChange={(event) => setSeverityDraft(event.target.value)}
                    >
                      {Object.keys(SEVERITY_BADGES).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </SelectField>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={async () => {
                        const result = await dispatch(
                          updateSupportTicket({
                            ticketId: id,
                            patch: {
                              status: statusDraft,
                              severity: severityDraft,
                            },
                          })
                        );
                        if (updateSupportTicket.fulfilled.match(result)) {
                          toast.success("Ticket updated.");
                        } else {
                          toast.error(result.payload || "Unable to update ticket.");
                        }
                      }}
                      disabled={ticketActionStatus === "loading"}
                    >
                      {ticketActionStatus === "loading" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Requester Details
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative">
                <Avatar
                  name={activeTicket.requesterName || activeTicket.requesterEmail || "Requester"}
                  tone={ROLE_TONE[activeTicket.requesterRole] || ROLE_TONE.Client}
                  size="lg"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-900">
                  {activeTicket.requesterName || "Anonymous requester"}
                </p>
                <span
                  className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    ROLE_TONE[activeTicket.requesterRole] || ROLE_TONE.Client
                  }`}
                >
                  {activeTicket.requesterRole === "Notary" ? "Licensed Notary" : activeTicket.requesterRole}
                </span>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Email Address
                </p>
                <p className="mt-1 truncate font-semibold text-slate-800">
                  {activeTicket.requesterEmail || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  User Type
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {activeTicket.requesterRole || "Client"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Opened
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(activeTicket.createdAt)}
                </p>
              </div>
            </div>
            {activeTicket.requesterUserId ? (
              <Link
                to={
                  activeTicket.requesterRole === "Notary"
                    ? `/users/notary/${activeTicket.requesterUserId}`
                    : `/users/client/${activeTicket.requesterUserId}`
                }
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-brand-primary)] hover:underline"
              >
                View Profile
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </Card>

          <Card className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Audit Trail
            </p>
            <div className="mt-4">
              <AuditTrail entries={activeTicket.auditTrail || []} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

const SupportPage = ({ detail = false }) => (detail ? <SupportDetail /> : <SupportList />);

export default SupportPage;