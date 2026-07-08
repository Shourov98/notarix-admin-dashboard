import { io } from "socket.io-client";
import { getAdminSession } from "../utils/auth";

const resolveSocketUrl = () => {
  const explicit = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicit) return explicit;
  const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (apiBase) return apiBase;
  return "http://localhost:5191";
};

const DEFAULT_SOCKET_URL = resolveSocketUrl();

let socket = null;
const subscribers = new Map();

const notify = (event, payload) => {
  const set = subscribers.get(event);
  if (!set) return;
  set.forEach((handler) => {
    try {
      handler(payload);
    } catch (error) {
      // Subscribers handle their own errors; swallow to keep other handlers alive.
      console.error(`socket handler for ${event} threw`, error);
    }
  });
};

const ensureSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }

  const session = getAdminSession();
  const token = session?.accessToken;

  socket = io(DEFAULT_SOCKET_URL, {
    transports: ["websocket", "polling"],
    auth: token ? { token } : undefined,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    // No-op; consumers subscribe via subscribe().
  });

  socket.on("disconnect", () => {
    // No-op.
  });

  [
    "new_message",
    "new_notification",
    "order_status_updated",
    "assignment_updated",
    "support_ticket_created",
    "support_ticket_updated",
  ].forEach((event) => {
    socket.on(event, (payload) => notify(event, payload));
  });

  return socket;
};

export const getSocket = () => ensureSocket();

export const joinConversation = (conversationId) => {
  if (!conversationId) return;
  ensureSocket().emit("join_conversation", conversationId);
};

export const subscribe = (event, handler) => {
  if (!event || typeof handler !== "function") {
    return () => {};
  }

  ensureSocket();
  let set = subscribers.get(event);
  if (!set) {
    set = new Set();
    subscribers.set(event, set);
  }
  set.add(handler);

  return () => {
    set.delete(handler);
    if (set.size === 0) {
      subscribers.delete(event);
    }
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  subscribers.clear();
};
