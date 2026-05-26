import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { primaryNavItems } from "../data/notarixData";
import { clearAdminSession } from "../../utils/auth";
import { cn } from "../utils/cn";
import { selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppSelector } from "../../store/hooks";

const isSectionActive = (pathname, path) => {
  if (path === "/dashboard") return pathname === "/" || pathname.startsWith("/dashboard");
  if (path === "/settings/profile") return pathname.startsWith("/settings");
  return pathname.startsWith(path);
};

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { currentAdmin } = useAppSelector(selectAdminConsole);
  const navItems = primaryNavItems.filter(
    (item) => !item.superAdminOnly || currentAdmin?.role === "SUPER ADMIN"
  );

  const handleSignOut = () => {
    clearAdminSession();
    navigate("/sign-in", { replace: true });
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-[#f8fbff]">
      <div className="flex h-20 items-center border-b border-[var(--color-border)] px-8">
        <BrandLogo />
      </div>

      <nav className="notarix-scrollbar flex-1 overflow-y-auto px-4 py-7">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex h-12 items-center gap-3 rounded-lg px-4 text-base font-semibold text-slate-900 transition-colors",
                  (isActive || isSectionActive(window.location.pathname, item.path))
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "hover:bg-blue-50 hover:text-[var(--color-brand-primary)]"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-base font-semibold text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
