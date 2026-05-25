import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    setSidebarOpen(false);
    contentRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-dashboard-bg)] lg:grid lg:grid-cols-[284px_minmax(0,1fr)]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[284px] lg:block">
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full w-[284px]">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0 lg:col-start-2">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <div ref={contentRef} className="notarix-scrollbar h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-5 py-8 lg:px-9 lg:py-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
