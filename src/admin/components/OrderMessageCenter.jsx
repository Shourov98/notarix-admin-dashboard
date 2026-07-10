import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Paperclip,
  Send,
  ShieldUser,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Button, Card } from "./ui";
import { apiRequest, buildApiUrl } from "../../services/httpClient";

const formatMessageTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const isImageMime = (mimeType) => Boolean(mimeType && mimeType.startsWith("image/"));

const initialsFromName = (name = "") =>
  String(name)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "NX";

const resolveAttachmentUrl = (attachment) => {
  const raw = attachment?.url;
  if (!raw) return null;
  return buildApiUrl(raw, { skipPrefix: true, withToken: true });
};

const resolveDownloadUrl = (attachment) => {
  if (attachment?.downloadUrl) {
    return buildApiUrl(attachment.downloadUrl, { skipPrefix: true, withToken: true });
  }
  const viewUrl = resolveAttachmentUrl(attachment);
  if (!viewUrl) return null;
  if (/^https?:\/\//i.test(viewUrl)) {
    return viewUrl.replace("/upload/", "/upload/fl_attachment/");
  }
  return viewUrl;
};

const triggerAttachmentDownload = async (attachment) => {
  const downloadHref = resolveDownloadUrl(attachment);
  if (!downloadHref) return;
  try {
    const link = document.createElement("a");
    link.href = downloadHref;
    if (attachment?.name) {
      link.download = attachment.name;
    }
    link.rel = "noreferrer";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    toast.error("Unable to start download.");
  }
};

const AVATAR_TONES = {
  Admin: "bg-rose-100 text-rose-700",
  Notary: "bg-orange-100 text-orange-700",
  Client: "bg-blue-100 text-blue-700",
};

const toneForRole = (role) => {
  if (!role) return "bg-slate-200 text-slate-700";
  const match = Object.keys(AVATAR_TONES).find((key) =>
    role.toLowerCase().includes(key.toLowerCase())
  );
  return AVATAR_TONES[match] || "bg-slate-200 text-slate-700";
};

const OrderMessageCenter = ({ orderId, orderLabel }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const rawSocketUrl =
    import.meta.env.VITE_SOCKET_URL?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    "http://localhost:5191";
  const socketUrl = rawSocketUrl.replace(/^http/i, "ws");

  const loadConversation = async () => {
    if (!orderId) return;
    setLoading(true);
    setLoadError("");
    try {
      const payload = await apiRequest(`/conversations/order/${orderId}`);
      const conversation = payload?.data || payload || null;
      if (!conversation?.id) {
        setLoadError("Conversation not found for this order.");
        setConversation(null);
        setMessages([]);
        setParticipants([]);
        return;
      }
      setConversation(conversation);
      setParticipants(conversation.participants || []);
      await loadMessages(conversation.id);
    } catch (error) {
      if (error?.status === 404) {
        setLoadError(
          "Conversation not found for this order."
        );
      } else {
        setLoadError(error?.message || "Unable to load order messages.");
        toast.error(error?.message || "Unable to load order messages.");
      }
      setConversation(null);
      setMessages([]);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    try {
      const payload = await apiRequest(`/conversations/${conversationId}/messages`);
      const data = payload?.data || payload || {};
      setMessages(data.messages || []);

      const unreadMessages = (data.messages || []).filter(
        (item) => !item.isOwnMessage && !item.isRead
      );
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map((message) =>
            apiRequest(`/messages/${message.id}/read`, { method: "PATCH" }).catch(() => null)
          )
        );
      }
    } catch (error) {
      toast.error(error?.message || "Unable to load messages.");
    }
  };

  useEffect(() => {
    loadConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Connect once on mount; the conversation id can change, so we (re)join
  // whenever it updates via the effect below.
  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketUrl]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversation?.id) return undefined;

    socket.emit("join_conversation", conversation.id);

    const handleNewMessage = (message) => {
      if (message?.conversationId !== conversation.id) return;
      loadMessages(conversation.id);
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [conversation?.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const participantChips = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    return participants.map((participant) => ({
      id: participant.actorId,
      name: participant.name,
      role: participant.role,
      initials: initialsFromName(participant.name),
      tone: toneForRole(participant.role),
    }));
  }, [participants]);

  const handleSend = async () => {
    if (!conversation?.id) return;
    if (!draft.trim() && attachments.length === 0) {
      toast.error("Write a message or attach a file first.");
      return;
    }

    setSending(true);
    try {
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((item) => formData.append("attachments", item.file));
        if (draft.trim()) {
          formData.append("body", draft.trim());
        }
        await apiRequest(`/conversations/${conversation.id}/attachments`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      } else {
        await apiRequest(`/conversations/${conversation.id}/messages`, {
          method: "POST",
          body: { body: draft.trim() },
        });
      }

      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setDraft("");
      setAttachments([]);
      await loadMessages(conversation.id);
    } catch (error) {
      toast.error(error?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.files || []);
    const next = files.map((file) => ({
      id: `local-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      file,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: isImageMime(file.type) ? URL.createObjectURL(file) : null,
    }));
    setAttachments(next);
    event.target.value = "";
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-6 py-5">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Message Center</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Conversation thread for this order — admin, client, and (once assigned) notary.
              Pre-assignment messages stay private between admin and client.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {participantChips.map((chip) => (
            <div
              key={chip.id}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
              title={chip.role}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${chip.tone}`}
              >
                {chip.initials}
              </span>
              <span className="max-w-[120px] truncate">{chip.name}</span>
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                {chip.role || "Member"}
              </span>
            </div>
          ))}
          {participantChips.length === 0 && !loading ? (
            <span className="text-xs text-slate-500">No participants yet.</span>
          ) : null}
        </div>
      </div>

      <div className="notarix-scrollbar max-h-[480px] min-h-[260px] space-y-4 overflow-y-auto bg-slate-50/40 p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading order messages…</p>
        ) : loadError ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            {loadError}
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No messages yet for order {orderLabel || `#${orderId}`}. Start the conversation below.
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = Boolean(message.isOwnMessage);
            const wrapperClass = isOwn ? "flex justify-end" : "flex justify-start";
            const bubbleClass = isOwn
              ? "rounded-2xl rounded-tr-sm bg-[var(--color-brand-primary)] text-white shadow-sm"
              : "rounded-2xl rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm";
            const metaClass = isOwn
              ? "text-[var(--color-brand-primary)] text-right"
              : "text-slate-500 text-left";
            const role = message.senderRole || "Member";
            const roleTone = toneForRole(role);

            return (
              <div key={message.id} className={`${wrapperClass}`}>
                <div className="flex max-w-[80%] items-start gap-3">
                  {!isOwn ? (
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${roleTone}`}
                    >
                      {initialsFromName(message.senderName)}
                    </span>
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className={`px-1 text-[10px] font-bold uppercase tracking-widest ${metaClass}`}>
                      {message.senderName}
                      <span className="ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-normal text-slate-500">
                        {role}
                      </span>
                      <span className="ml-2 font-medium tracking-normal text-slate-400">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </p>
                    <div className={`${bubbleClass} p-4`}>
                      {message.body ? (
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                          {message.body}
                        </p>
                      ) : null}
                      {message.attachments?.length ? (
                        <div className={`${message.body ? "mt-3" : ""} flex flex-col gap-2`}>
                          {message.attachments.map((attachment) => {
                            const imageLike = isImageMime(attachment.mimeType);
                            const viewHref = resolveAttachmentUrl(attachment);
                            const downloadHref = resolveDownloadUrl(attachment);
                            const tileClass = isOwn
                              ? "border-white/25 bg-white/10 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700";

                            return (
                              <div
                                key={attachment.id}
                                className={`flex items-center gap-3 rounded-xl border p-3 ${tileClass}`}
                              >
                                {imageLike && viewHref ? (
                                  <a
                                    href={viewHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/20"
                                  >
                                    <img
                                      src={viewHref}
                                      alt={attachment.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </a>
                                ) : (
                                  <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${
                                      isOwn ? "bg-white/15" : "bg-white text-slate-500"
                                    }`}
                                  >
                                    {imageLike ? (
                                      <ImageIcon className="h-7 w-7" />
                                    ) : (
                                      <FileText className="h-7 w-7" />
                                    )}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold">
                                    {attachment.name}
                                  </p>
                                  <p
                                    className={`mt-0.5 text-xs ${
                                      isOwn ? "text-white/70" : "text-slate-500"
                                    }`}
                                  >
                                    {attachment.size ? formatFileSize(attachment.size) : "Attachment"}
                                  </p>
                                </div>
                                {downloadHref ? (
                                  <button
                                    type="button"
                                    onClick={() => triggerAttachmentDownload(attachment)}
                                    aria-label={`Download ${attachment.name}`}
                                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                      isOwn
                                        ? "bg-white/15 text-white hover:bg-white/25"
                                        : "bg-white text-slate-600 hover:bg-[var(--color-brand-primary)] hover:text-white"
                                    }`}
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {isOwn ? (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-brand-primary)] text-xs font-bold text-white">
                      <ShieldUser className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[var(--color-border)] bg-white p-5">
        {attachments.length > 0 ? (
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {attachments.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3"
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    {isImageMime(item.mimeType) ? (
                      <ImageIcon className="h-6 w-6" />
                    ) : (
                      <FileText className="h-6 w-6" />
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1 pr-6">
                  <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatFileSize(item.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex items-end gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-[var(--color-border)] bg-slate-50 px-4 py-2">
            <label className="cursor-pointer text-slate-500 transition-colors hover:text-[var(--color-brand-primary)]">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(event) => handleFileChange(event.target)}
                disabled={!conversation?.id || sending}
              />
            </label>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                conversation?.id
                  ? "Type your message..."
                  : "Loading conversation..."
              }
              disabled={!conversation?.id || sending}
              className="h-10 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
          <Button
            icon={Send}
            onClick={handleSend}
            disabled={!conversation?.id || sending}
            className="rounded-full"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Messages before a notary is assigned stay private to admin and client. The notary only sees messages sent after they join.
        </p>
      </div>
    </Card>
  );
};

export default OrderMessageCenter;