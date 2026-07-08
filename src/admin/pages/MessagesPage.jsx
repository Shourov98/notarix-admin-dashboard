import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Search,
  Send,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Avatar, Button, Card, StatusBadge } from "../components/ui";
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
  } catch (error) {
    toast.error("Unable to start download.");
  }
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const rawSocketUrl =
    import.meta.env.VITE_SOCKET_URL?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    "http://localhost:5191";
  const socketUrl = rawSocketUrl.replace(/^http/i, "ws");

  const loadConversations = async (preferredConversationId = "") => {
    setLoadingConversations(true);
    try {
      const payload = await apiRequest("/conversations");
      const nextConversations = payload?.data || payload || [];
      setConversations(nextConversations);

      const nextActiveId =
        preferredConversationId && nextConversations.some((item) => item.id === preferredConversationId)
          ? preferredConversationId
          : nextConversations[0]?.id || "";

      setActiveConversationId(nextActiveId);
    } catch (error) {
      toast.error(error?.message || "Unable to load conversations.");
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    try {
      const payload = await apiRequest(`/conversations/${conversationId}/messages`);
      const data = payload?.data || payload || {};
      setActiveConversation(data.conversation || null);
      setMessages(data.messages || []);

      const unreadMessages = (data.messages || []).filter((item) => !item.isOwnMessage && !item.isRead);
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map((message) =>
            apiRequest(`/messages/${message.id}/read`, { method: "PATCH" }).catch(() => null)
          )
        );
      }
    } catch (error) {
      toast.error(error?.message || "Unable to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

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
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setActiveConversation(null);
      setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeConversationId) {
      return undefined;
    }

    socket.emit("join_conversation", activeConversationId);

    const handleNewMessage = (message) => {
      if (message?.conversationId !== activeConversationId) {
        return;
      }

      loadMessages(activeConversationId);
      loadConversations(activeConversationId);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [activeConversationId]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter((conversation) =>
      [conversation.title, conversation.orderId, conversation.counterpart?.name, conversation.counterpart?.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [conversations, search]);

  const handleSend = async () => {
    if (!activeConversationId) return;
    if (!draft.trim() && attachments.length === 0) {
      toast.error("Write a message or attach files first.");
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

        await apiRequest(`/conversations/${activeConversationId}/attachments`, {
          method: "POST",
          body: formData,
          contentType: null,
        });
      } else {
        await apiRequest(`/conversations/${activeConversationId}/messages`, {
          method: "POST",
          body: { body: draft.trim() },
        });
      }

      await Promise.all([
        loadMessages(activeConversationId),
        loadConversations(activeConversationId),
      ]);
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setDraft("");
      setAttachments([]);
    } catch (error) {
      toast.error(error?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
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
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
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

  const counterpartRole = activeConversation?.counterpart?.role || "";
  const counterpartName = activeConversation?.counterpart?.name || "Select a conversation";

  return (
    <div className="grid h-[calc(100vh-10rem)] min-h-0 gap-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-r border-[var(--color-border)] bg-[#f8f7ff] p-6">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <div className="relative mt-5">
          <Search className="notarix-search-icon absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            className="notarix-search-field h-12 w-full"
            placeholder="Search by name or order ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="notarix-scrollbar mt-7 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {filteredConversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveConversationId(conversation.id)}
                className={`flex w-full items-center gap-4 rounded-lg p-4 text-left ${
                  isActive
                    ? "border-l-4 border-[var(--color-brand-primary)] bg-[#efedfb]"
                    : "hover:bg-white/80"
                }`}
              >
                <Avatar
                  name={conversation.counterpart?.name || conversation.title}
                  tone={
                    conversation.counterpart?.role === "Notary"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-bold">
                      {conversation.counterpart?.name || conversation.title}
                    </p>
                    <span className="text-xs text-slate-500">
                      {formatMessageTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">
                    #{conversation.orderId}
                  </p>
                  <p className="mt-2 truncate text-sm text-slate-500">
                    {conversation.lastMessagePreview || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}

          {filteredConversations.length === 0 ? (
            <p className="rounded-lg bg-white p-4 text-sm text-slate-500">
              {loadingConversations ? "Loading conversations..." : "No conversations available yet."}
            </p>
          ) : null}
        </div>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-7 py-4">
          <div className="flex items-center gap-4">
            <Avatar
              name={counterpartName}
              tone={counterpartRole === "Notary" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}
            />
            <div>
              <p className="font-bold">{counterpartName}</p>
              <div className="mt-1 flex items-center gap-2">
                {counterpartRole ? <StatusBadge status={counterpartRole} /> : null}
                {activeConversation?.orderId ? (
                  <span className="text-sm text-slate-500">Order #{activeConversation.orderId}</span>
                ) : null}
              </div>
            </div>
          </div>
          {activeConversation?.orderId ? (
            <Link to={`/orders/${activeConversation.orderId}`}>
              <Button variant="secondary" size="sm">View Order</Button>
            </Link>
          ) : null}
        </div>

        <div className="notarix-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-50/40 p-7">
          {messages.map((message) => {
            const isOwn = Boolean(message.isOwnMessage);
            const wrapperClass = isOwn ? "flex justify-end" : "flex justify-start";
            const bubbleClass = isOwn
              ? "rounded-2xl rounded-tr-sm bg-[var(--color-brand-primary)] text-white shadow-sm"
              : "rounded-2xl rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm";
            const metaTextClass = isOwn ? "text-[var(--color-brand-primary)]" : "text-slate-500";

            return (
              <div key={message.id} className={`${wrapperClass} mb-5`}>
                <div className="flex max-w-[80%] flex-col gap-1.5">
                  <p className={`px-2 text-[10px] font-bold uppercase tracking-widest ${metaTextClass} ${isOwn ? "text-right" : "text-left"}`}>
                    {message.senderName}
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
              </div>
            );
          })}

          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">
              {loadingMessages ? "Loading messages..." : "No messages yet. Start the conversation."}
            </p>
          ) : null}
        </div>

        <div className="border-t border-[var(--color-border)] p-7">
          <Card className="p-5">
            <textarea
              className="min-h-[96px] w-full border-0 p-0 text-base focus:ring-0"
              placeholder="Type your message..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            {attachments.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
            <div className="mt-5 flex items-center justify-between gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
                <Paperclip className="h-5 w-5" />
                <span className="text-sm font-medium">Attach files</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
              <Button icon={Send} onClick={handleSend} disabled={sending || !activeConversationId}>
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </Card>
          <p className="mt-4 text-center text-sm text-slate-500">
            Messages are archived for the order record and only visible to conversation participants.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MessagesPage;
