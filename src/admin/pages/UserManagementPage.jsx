import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  MoreVertical,
  Plus,
  ShieldOff,
  UserCheck,
  UserRound,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Button,
  Card,
  MetricCard,
  PageHeader,
  Pagination,
  StatusBadge,
} from "../components/ui";
import {
  fetchAdminUsers,
  selectAdminConsole,
  suspendUser,
  activateUser,
  updateUserStatus,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const UserManagementPage = () => {
  const dispatch = useAppDispatch();
  const { users, metrics, usersPagination, usersStatus, usersError } = useAppSelector(selectAdminConsole);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        page: filters.page,
      })
    );
  }, [dispatch, filters]);

  // Close the row menu when clicking anywhere outside it.
  useEffect(() => {
    if (!openMenuId) return undefined;
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenuId]);

  const handleRowAction = async (user, action) => {
    setOpenMenuId(null);
    try {
      if (action === "view") {
        window.location.href = `/users/${String(user.role).toLowerCase()}/${user.id}`;
        return;
      }
      if (action === "approve") {
        await dispatch(updateUserStatus({ userId: user.id, status: "Active" })).unwrap();
        toast.success(`${user.name} approved.`);
        return;
      }
      if (action === "suspend") {
        const confirmed = window.confirm(`Suspend ${user.name}? They will not be able to sign in.`);
        if (!confirmed) return;
        await dispatch(suspendUser(user.id)).unwrap();
        toast.success(`${user.name} suspended.`);
        return;
      }
      if (action === "activate") {
        await dispatch(activateUser(user.id)).unwrap();
        toast.success(`${user.name} reactivated.`);
        return;
      }
    } catch (error) {
      toast.error(error?.message || "Action failed.");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage clients, notaries, verification status, and platform access."
        actions={
          <Link to="/users/new?type=client">
            <Button icon={Plus} size="lg">
              Add User
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Users" value={String(metrics.totalUsers || users.length)} icon={Users} />
        <MetricCard label="Active Clients" value={String(metrics.activeClients || 0)} icon={UserRound} />
        <MetricCard label="Total Notaries" value={String(metrics.totalNotaries || 0)} icon={UserCheck} />
        <MetricCard label="Pending Approvals" value={String(metrics.pendingApprovals || 0)} icon={UserX} tone="danger" />
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,380px)_160px_220px]">
          <input
            placeholder="Search users..."
            className="h-12 w-full"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
          />
          <select className="h-12 w-full" value={filters.role} onChange={(event) => handleFilterChange("role", event.target.value)}>
            <option value="">Role: All</option>
            <option value="Client">Client</option>
            <option value="Notary">Notary</option>
          </select>
          <select className="h-12 w-full" value={filters.status} onChange={(event) => handleFilterChange("status", event.target.value)}>
            <option value="">Status: All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">User</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Company / Area</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Verification</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const profilePath =
                  user.role === "Notary" ? `/users/notary/${user.id}` : `/users/client/${user.id}`;

                return (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar name={user.name} tone={user.avatarTone} />
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <StatusBadge status={user.role} className={user.role === "Notary" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"} />
                    </td>
                    <td className="px-6 py-6">
                      <p>{user.company}</p>
                      <p className="text-sm text-slate-500">{user.area}</p>
                    </td>
                    <td className="px-6 py-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-6">
                      <StatusBadge status={user.verification} />
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <Link to={profilePath} className="text-[var(--color-brand-primary)]" aria-label={`View ${user.name}`}>
                          <Eye className="h-5 w-5" />
                        </Link>
                        <div className="relative" ref={openMenuId === user.id ? menuRef : null}>
                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-700"
                            aria-label="More actions"
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === user.id}
                            onClick={() =>
                              setOpenMenuId((current) => (current === user.id ? null : user.id))
                            }
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {openMenuId === user.id ? (
                            <div
                              role="menu"
                              className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                                onClick={() => handleRowAction(user, "view")}
                              >
                                <Eye className="h-4 w-4" /> View profile
                              </button>
                              {user.status !== "Active" ? (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                                  onClick={() => handleRowAction(user, "approve")}
                                >
                                  <UserCheck className="h-4 w-4" /> Approve
                                </button>
                              ) : null}
                              {user.status === "Suspended" ? (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                                  onClick={() => handleRowAction(user, "activate")}
                                >
                                  <CheckCircle2 className="h-4 w-4" /> Reactivate
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => handleRowAction(user, "suspend")}
                                >
                                  <ShieldOff className="h-4 w-4" /> Suspend
                                </button>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">
                    {usersStatus === "loading"
                      ? "Loading users..."
                      : usersError || "No users found for the current filters."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            {usersPagination.totalItems === 0
              ? "0"
              : `${(usersPagination.page - 1) * usersPagination.pageSize + 1}-${Math.min(
                  usersPagination.page * usersPagination.pageSize,
                  usersPagination.totalItems
                )}`}{" "}
            of {usersPagination.totalItems} users
          </p>
          <Pagination
            page={usersPagination.page}
            totalPages={usersPagination.totalPages}
            onPageChange={(page) => handleFilterChange("page", page)}
            disabled={usersStatus === "loading"}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;
