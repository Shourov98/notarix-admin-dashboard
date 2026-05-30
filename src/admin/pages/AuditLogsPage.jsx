import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Card, PageHeader, StatusBadge } from "../components/ui";
import { apiRequest } from "../../services/httpClient";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const AuditLogsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");

  const loadLogs = useCallback(async (next = {}) => {
    setLoading(true);
    try {
      const payload = await apiRequest("/admin/audit-logs", {
        query: {
          search: next.search ?? search,
          action: next.action ?? action,
          entityType: next.entityType ?? entityType,
        },
      });
      setItems(payload?.data || payload || []);
    } catch (error) {
      toast.error(error?.message || "Unable to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [search, action, entityType]);

  useEffect(() => {
    loadLogs({ search: "", action: "", entityType: "" });
  }, [loadLogs]);

  const actionOptions = useMemo(
    () => [...new Set(items.map((item) => item.action).filter(Boolean))].sort(),
    [items]
  );

  const entityOptions = useMemo(
    () => [...new Set(items.map((item) => item.entityType).filter(Boolean))].sort(),
    [items]
  );

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable activity history for user requests, orders, documents, and payments."
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="h-12 w-full bg-[#f0eefb] pl-11"
              placeholder="Search by action, entity, or actor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="h-12" value={action} onChange={(event) => setAction(event.target.value)}>
              <option value="">All Actions</option>
              {actionOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select className="h-12" value={entityType} onChange={(event) => setEntityType(event.target.value)}>
              <option value="">All Entities</option>
              {entityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => loadLogs()}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-5">When</th>
                <th className="px-6 py-5">Action</th>
                <th className="px-6 py-5">Entity</th>
                <th className="px-6 py-5">Actor</th>
                <th className="px-6 py-5">Summary</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-6 py-6 text-slate-600">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-6">
                    <StatusBadge status={item.action} />
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{item.entityType}</p>
                    <p className="text-sm text-slate-500">{item.entityId}</p>
                  </td>
                  <td className="px-6 py-6 text-slate-600">
                    <p>{item.actorRole || item.actorType || "system"}</p>
                    <p className="text-sm text-slate-500">{item.actorId || "n/a"}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.summary}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <p className="px-6 py-5 text-sm text-slate-500">Loading audit logs...</p>
        ) : items.length === 0 ? (
          <p className="px-6 py-5 text-sm text-slate-500">No audit log entries found.</p>
        ) : null}
      </Card>
    </div>
  );
};

export default AuditLogsPage;
