import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { Avatar } from "../components/ui";
import { selectAdminConsole, clearSession } from "../../store/adminConsoleSlice";
import {
  markAllRead,
  pushNotification,
  selectNotifications,
} from "../../store/notificationsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutAdmin } from "../../services/authApi";
import { clearAdminSession, getAdminSession } from "../../utils/auth";
import { useSocket } from "../../hooks/useSocket";

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const Topbar = ({ onMenu }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentAdmin } = useAppSelector(selectAdminConsole);
  const { items, unread } = useAppSelector(selectNotifications);

  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bellRef = useRef(null);
  const menuRef = useRef(null);

  useSocket("new_notification", (payload) => {
    dispatch(
      pushNotification({
        title: payload?.title || "Notification",
        body: payload?.body || payload?.message || "",
        level: payload?.level || "info",
        createdAt: payload?.createdAt || new Date().toISOString(),
      })
    );
  });

  useSocket("order_status_updated", (payload) => {
    dispatch(
      pushNotification({
        title: "Order updated",
        body: `Order #${payload?.orderId || ""} is now ${payload?.status || "updated"}.`,
        level: "info",
      })
    );
  });

  useSocket("support_ticket_created", (payload) => {
    dispatch(
      pushNotification({
        title: "New support ticket",
        body: payload?.subject || "A new support ticket was opened.",
        level: "warning",
      })
    );
  });

  useEffect(() => {
    const handleClickAway = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, []);

  useEffect(() => {
    if (bellOpen) {
      dispatch(markAllRead());
    }
  }, [bellOpen, dispatch]);

  const handleSignOut = async () => {
    const session = getAdminSession();
    try {
      await logoutAdmin({ refreshToken: session?.refreshToken });
    } catch (error) {
      // Even if the server logout fails, we still clear the local session.
      console.warn("Server logout failed; clearing local session anyway.", error);
    } finally {
      clearAdminSession();
      dispatch(clearSession());
      navigate("/sign-in", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
      <button
        type="button"
        onClick={onMenu}
        className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-border)] text-slate-700 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-5">
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setBellOpen((current) => !current)}
            className="relative text-slate-900 hover:text-[var(--color-brand-primary)]"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </button>
          {bellOpen ? (
            <div className="absolute right-0 z-40 mt-3 w-80 rounded-lg border border-slate-200 bg-white shadow-panel">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                Notifications
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <li className="px-4 py-6 text-center text-sm text-slate-500">
                    You are all caught up.
                  </li>
                ) : (
                  items.map((item) => (
                    <li key={item.id} className="border-t border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      {item.body ? (
                        <p className="mt-1 text-xs text-slate-600">{item.body}</p>
                      ) : null}
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {formatRelative(item.createdAt)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </div>

        <span className="h-8 w-px bg-slate-200" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex items-center gap-3"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-slate-950">{currentAdmin?.name || "Admin"}</p>
              <p className="text-xs font-bold uppercase text-slate-500">{currentAdmin?.role || "Admin"}</p>
            </div>
            <Avatar name={currentAdmin?.name || "Admin"} src={currentAdmin?.avatar} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-40 mt-3 w-56 rounded-lg border border-slate-200 bg-white shadow-panel">
              <Link
                to="/settings/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Profile
              </Link>
              <Link
                to="/settings/notifications"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Notification settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
