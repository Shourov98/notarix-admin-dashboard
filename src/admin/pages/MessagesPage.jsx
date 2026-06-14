import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Paperclip, Search, Send } from "lucide-react";
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
  const socketUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5191";

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
      transports: ["websocket"],
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
        attachments.forEach((file) => formData.append("attachments", file));
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
      setDraft("");
      setAttachments([]);
    } catch (error) {
      toast.error(error?.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (event) => {
    setAttachments(Array.from(event.target.files || []));
  };

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

        <div className="notarix-scrollbar min-h-0 flex-1 overflow-y-auto p-7">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 ${message.isOwnMessage ? "ml-auto max-w-3xl" : "max-w-3xl"}`}
            >
              <p className={`mb-2 text-sm font-bold ${message.isOwnMessage ? "text-right text-[var(--color-brand-primary)]" : ""}`}>
                {message.senderName}
                <span className={`${message.isOwnMessage ? "mr-3" : "ml-3"} font-normal text-slate-500`}>
                  {formatMessageTime(message.createdAt)}
                </span>
              </p>
              <div
                className={`rounded-lg p-5 ${
                  message.isOwnMessage
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[#e8e6f5]"
                }`}
              >
                {message.body ? <p className="text-base leading-relaxed">{message.body}</p> : null}
                {message.attachments?.length ? (
                  <div className={`${message.body ? "mt-4" : ""} space-y-2`}>
                    {message.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={buildApiUrl(attachment.url, { skipPrefix: true })}
                        target="_blank"
                        rel="noreferrer"
                        className={`block rounded-lg border px-3 py-2 text-sm ${
                          message.isOwnMessage
                            ? "border-white/25 bg-white/10 text-white"
                            : "border-[var(--color-border)] bg-white text-slate-700"
                        }`}
                      >
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

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
              <p className="mt-3 text-sm text-slate-500">
                {attachments.length} attachment{attachments.length === 1 ? "" : "s"} selected
              </p>
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
