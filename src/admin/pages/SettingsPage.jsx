import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  Info,
  LockKeyhole,
  MapPin,
  Pencil,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  UserCog,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  CheckboxLine,
  Field,
  Modal,
  PageHeader,
  SectionTitle,
  SelectField,
  StatusBadge,
} from "../components/ui";
import { settingsNavItems } from "../data/navigation";
import {
  activateAdmin,
  createAdmin,
  fetchAdmins,
  selectAdminConsole,
  suspendAdmin,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";

const SettingsShell = ({ title, description, children, actions }) => (
  <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
    <aside className="space-y-2">
      <SettingsNav />
    </aside>
    <section>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </section>
  </div>
);

const ADMIN_PERMISSION_OPTIONS = [
  {
    key: "manage_orders",
    label: "Manage Orders",
    description: "Can create and edit notarization records.",
  },
  {
    key: "manage_payments",
    label: "Manage Payments",
    description: "Can review payment activity and transaction records.",
  },
  {
    key: "manage_users",
    label: "Manage Users",
    description: "Can create and manage client and notary accounts.",
  },
  {
    key: "access_reports",
    label: "Access Reports",
    description: "Full access to analytics and audit trails.",
  },
];

const ALL_ADMIN_PERMISSIONS = ADMIN_PERMISSION_OPTIONS.map((item) => item.key);

const SettingsNav = () => {
  const { currentAdmin } = useAppSelector(selectAdminConsole);
  const navItems = useMemo(
    () =>
      settingsNavItems.filter(
        (item) =>
          item.path !== "/settings/admins" || currentAdmin?.role === "SUPER ADMIN"
      ),
    [currentAdmin?.role]
  );

  return navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) =>
            `flex h-12 items-center gap-3 rounded-lg px-4 font-semibold ${
              isActive ? "bg-white text-slate-700 shadow-panel ring-1 ring-[var(--color-border)]" : "text-slate-600 hover:bg-white"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ));
};

const LiveSettingsNotice = ({ title, description }) => (
  <Card className="p-8">
    <p className="text-lg font-bold text-slate-900">{title}</p>
    <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
  </Card>
);

const CompanySettings = () => (
  <SettingsShell
    title="Company Settings"
    description="Organization-level settings should only appear when backed by real platform configuration."
  >
    <LiveSettingsNotice
      title="Company settings are not connected yet"
      description="This dashboard does not currently have a live backend endpoint for organization profile, branding, or office settings. The old sample company data has been removed so this section stays honest."
    />
  </SettingsShell>
);

const ProfileSettings = () => {
  const { currentAdmin } = useAppSelector(selectAdminConsole);

  return (
    <SettingsShell title="Profile Settings" description="Current authenticated administrator details.">
      <Card className="p-8">
        <div className="grid gap-10 xl:grid-cols-[220px_minmax(0,1fr)]">
          <div className="text-center">
            <Avatar name={currentAdmin?.name || "Admin"} size="lg" />
          </div>
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name" value={currentAdmin?.name || ""} disabled />
              <Field label="Email Address" value={currentAdmin?.email || ""} disabled />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="bg-[#f0eefb] p-5">
                <SectionTitle icon={Shield} title="Role" />
                <p className="text-slate-600">{currentAdmin?.role || "Unknown"}</p>
              </Card>
              <Card className="bg-[#f0eefb] p-5">
                <SectionTitle icon={CheckCircle2} title="Last Sign-in" />
                <p className="text-slate-600">
                  {currentAdmin?.lastSignInAt
                    ? new Date(currentAdmin.lastSignInAt).toLocaleString()
                    : "Not available"}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </SettingsShell>
  );
};

const NotificationSettings = () => (
  <SettingsShell title="Notification Settings" description="Notification policy controls should only appear when backed by live admin settings.">
    <LiveSettingsNotice
      title="Admin notification settings are not connected yet"
      description="The previous notification toggles were hardcoded. They have been removed until the dashboard has real persisted admin notification preferences."
    />
  </SettingsShell>
);

const SecuritySettings = () => (
  <SettingsShell title="Security Settings" description="Security preferences should only display live account and session data.">
    <LiveSettingsNotice
      title="Admin security settings are not connected yet"
      description="The old security page showed made-up devices, sessions, 2FA state, and audit events. Those sample rows have been removed until the admin backend exposes real security settings and session records."
    />
  </SettingsShell>
);

const AddAdminModal = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { createAdminStatus } = useAppSelector(selectAdminConsole);
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    role: "admin",
    permissions: ["manage_users", "access_reports"],
  };
  const [formState, setFormState] = useState(initialFormState);

  const updateField = (field, value) =>
    setFormState((current) => {
      if (field === "role") {
        return {
          ...current,
          role: value,
          permissions:
            value === "super_admin"
              ? [...ALL_ADMIN_PERMISSIONS]
              : current.permissions.filter((permission) =>
                  ALL_ADMIN_PERMISSIONS.includes(permission)
                ),
        };
      }

      return { ...current, [field]: value };
    });

  const togglePermission = (permissionKey) =>
    setFormState((current) => {
      if (current.role === "super_admin") {
        return current;
      }

      const hasPermission = current.permissions.includes(permissionKey);
      return {
        ...current,
        permissions: hasPermission
          ? current.permissions.filter((item) => item !== permissionKey)
          : [...current.permissions, permissionKey],
      };
    });

  const toggleFullAccess = () =>
    setFormState((current) => {
      if (current.role === "super_admin") {
        return {
          ...current,
          role: "admin",
          permissions: [...ALL_ADMIN_PERMISSIONS],
        };
      }

      return {
        ...current,
        role: "super_admin",
        permissions: [...ALL_ADMIN_PERMISSIONS],
      };
    });

  const handleSubmit = async () => {
    if (!formState.name || !formState.email) {
      toast.error("Name and email are required.");
      return;
    }

    if (formState.role === "admin" && formState.permissions.length === 0) {
      toast.error("Select at least one permission for this admin.");
      return;
    }

    const result = await dispatch(
      createAdmin({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        role: formState.role,
        permissions: formState.permissions,
      })
    );

    if (createAdmin.fulfilled.match(result)) {
      toast.success("Admin created successfully.", {
        description: result.payload?.temporaryPassword
          ? `Temporary password: ${result.payload.temporaryPassword}`
          : undefined,
      });
      setFormState(initialFormState);
      onClose();
      return;
    }

    toast.error(result.payload || "Unable to create admin.");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Admin"
      icon={UserPlus}
      footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button icon={Save} onClick={handleSubmit} disabled={createAdminStatus === "loading"}>{createAdminStatus === "loading" ? "Creating..." : "Create Admin"}</Button></div>}
    >
      <div className="space-y-5">
        <Field label="Full Name" required placeholder="e.g., Jonathan Harker" value={formState.name} onChange={(event) => updateField("name", event.target.value)} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email Address" required placeholder="jonathan@notarix.com" value={formState.email} onChange={(event) => updateField("email", event.target.value)} />
          <Field label="Phone Number" placeholder="+1 (555) 000-0000" value={formState.phone} onChange={(event) => updateField("phone", event.target.value)} />
        </div>
        <SelectField label="Role Selection" required value={formState.role} onChange={(event) => updateField("role", event.target.value)}><option value="admin">Admin</option><option value="super_admin">Super Admin</option></SelectField>
        <Card className="bg-slate-50 p-5">
          <p className="text-sm text-slate-600">A temporary password will be auto-generated when the admin is created. They must reset it on first login.</p>
        </Card>
        <div>
          <h3 className="mb-3 text-lg font-bold">Granular Permissions</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {ADMIN_PERMISSION_OPTIONS.map((item) => (
              <CheckboxLine
                key={item.key}
                checked={formState.permissions.includes(item.key)}
                disabled={formState.role === "super_admin"}
                label={item.label}
                description={item.description}
                onChange={() => togglePermission(item.key)}
              />
            ))}
            <CheckboxLine
              checked={formState.role === "super_admin"}
              className="md:col-span-2"
              label="Full Access (Super Admin)"
              description="Grants total system control including admin management."
              onChange={toggleFullAccess}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const AdminSettings = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { currentAdmin, admins, adminsStatus, adminsError } = useAppSelector(selectAdminConsole);

  useEffect(() => {
    if (currentAdmin?.role === "SUPER ADMIN") {
      dispatch(fetchAdmins());
    }
  }, [currentAdmin?.role, dispatch]);

  const handleToggleStatus = async (admin) => {
    const action = admin.status === "Suspended" ? activateAdmin : suspendAdmin;
    const result = await dispatch(action(admin.id));

    if (action.fulfilled.match(result)) {
      toast.success(
        admin.status === "Suspended"
          ? "Admin activated successfully."
          : "Admin suspended successfully."
      );
      return;
    }

    toast.error(result.payload || "Unable to update admin status.");
  };

  if (currentAdmin?.role !== "SUPER ADMIN") {
    return (
      <SettingsShell
        title="Admin Management"
        description="Restricted to super admins."
      >
        <Card className="p-8">
          <p className="text-slate-600">You do not have permission to access Admin Management.</p>
        </Card>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell
      title="Admin Management"
      description="Manage admin users and internal permissions for your enterprise platform."
      actions={<Button icon={Plus} onClick={() => setOpen(true)}>Add Admin</Button>}
    >
      <Card className="overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-[#f0eefb] text-xs uppercase text-slate-500">
            <tr><th className="px-6 py-5">Name</th><th className="px-6 py-5">Email</th><th className="px-6 py-5">Role</th><th className="px-6 py-5">Permissions</th><th className="px-6 py-5">Status</th><th className="px-6 py-5">Last Login</th><th className="px-6 py-5">Actions</th></tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.email} className="border-t border-slate-200">
                <td className="px-6 py-5"><div className="flex items-center gap-3"><Avatar name={admin.name} /><strong>{admin.name}</strong></div></td>
                <td className="px-6 py-5 text-slate-600">{admin.email}</td>
                <td className="px-6 py-5"><StatusBadge status={String(admin.role).replaceAll("_", " ")} /></td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {admin.role === "super_admin" || admin.role === "SUPER ADMIN"
                    ? "Full access"
                    : admin.permissions?.length
                      ? admin.permissions.map((permission) => permission.replaceAll("_", " ")).join(", ")
                      : "No custom permissions"}
                </td>
                <td className="px-6 py-5"><StatusBadge status={admin.status} /></td>
                <td className="px-6 py-5 text-slate-600">{admin.lastSignInAt ? new Date(admin.lastSignInAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Never"}</td>
                <td className="px-6 py-5">
                  <div className="flex gap-4 text-slate-600">
                    <Eye className="h-5 w-5" />
                    <Pencil className="h-5 w-5" />
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(admin)}
                      disabled={currentAdmin.id === admin.id}
                      className={admin.status === "Suspended" ? "text-emerald-600" : "text-red-600"}
                      title={currentAdmin.id === admin.id ? "You cannot change your own status here." : undefined}
                    >
                      {admin.status === "Suspended" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {admins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                  {adminsStatus === "loading" ? "Loading admins..." : adminsError || "No admins found."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="border-t border-slate-200 bg-[#f0eefb] p-5 text-sm text-slate-600">Showing {admins.length} internal administrators</div>
      </Card>
      <Card className="mt-7 bg-[#e8e6f5] p-7">
        <SectionTitle icon={Info} title="About Admin Roles" />
        <p className="text-slate-600">Super Admins have full access to billing, legal entity settings, and platform-wide security protocols. Standard Admins can manage users, view document histories, and handle notary validation tasks.</p>
        <div className="mt-5 flex gap-6 font-bold text-[var(--color-brand-primary)]"><button type="button">View Permissions Matrix</button><button type="button">Download Audit Trail</button></div>
      </Card>
      <AddAdminModal open={open} onClose={() => setOpen(false)} />
    </SettingsShell>
  );
};

const SettingsPage = ({ section = "profile" }) => {
  if (section === "company") return <CompanySettings />;
  if (section === "notifications") return <NotificationSettings />;
  if (section === "security") return <SecuritySettings />;
  if (section === "admins") return <AdminSettings />;
  return <ProfileSettings />;
};

export default SettingsPage;
