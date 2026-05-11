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
import { users } from "../data/notarixData";

const UserManagementPage = () => {
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
        <MetricCard label="Total Users" value="2,450" icon={Users} />
        <MetricCard label="Active Clients" value="184" icon={UserRound} />
        <MetricCard label="Total Notaries" value="2,140" icon={UserCheck} />
        <MetricCard label="Pending Approvals" value="126" icon={UserX} tone="danger" />
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,380px)_160px_220px]">
          <input placeholder="Search users..." className="h-12 w-full" />
          <select className="h-12 w-full">
            <option>Role: All</option>
            <option>Client</option>
            <option>Notary</option>
          </select>
          <select className="h-12 w-full">
            <option>Status: All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
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
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Showing 3 of 124 documents</p>
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;
