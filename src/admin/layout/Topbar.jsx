import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "../components/ui";
import { selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppSelector } from "../../store/hooks";

const Topbar = ({ onMenu }) => {
  const { currentAdmin } = useAppSelector(selectAdminConsole);

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
        <button type="button" aria-label="Notifications" className="text-slate-900 hover:text-[var(--color-brand-primary)]">
          <Bell className="h-5 w-5" />
        </button>
        <span className="h-8 w-px bg-slate-200" />
        <Link to="/settings/profile" className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-950">{currentAdmin.name}</p>
            <p className="text-xs font-bold uppercase text-slate-500">{currentAdmin.role}</p>
          </div>
          <Avatar name={currentAdmin.name} src={currentAdmin.avatar} />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
