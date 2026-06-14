import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MoreVertical, Plus, UserCheck, UserRound, Users, UserX } from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  MetricCard,
  PageHeader,
  Pagination,
  StatusBadge,
} from "../components/ui";
import { fetchAdminUsers, selectAdminConsole } from "../../store/adminConsoleSlice";
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
                        <button type="button" className="text-slate-400" aria-label="More actions">
                          <MoreVertical className="h-5 w-5" />
                        </button>
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
