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
  fetchCompanySettings,
  fetchNotificationPreferences,
  fetchSecuritySettings,
  revokeSecuritySession,
  selectAdminConsole,
  suspendAdmin,
  updateCompanySettings,
  updateNotificationPreferences,
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

const CompanySettings = () => {
  const dispatch = useAppDispatch();
  const { companySettings, companySettingsStatus, companySettingsError } =
    useAppSelector(selectAdminConsole);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanySettings());
  }, [dispatch]);

  useEffect(() => {
    if (companySettings && !form) {
      setForm({
        name: companySettings.name || "",
        legalName: companySettings.legalName || "",
        taxId: companySettings.taxId || "",
        supportEmail: companySettings.supportEmail || "",
        supportPhone: companySettings.supportPhone || "",
        address: { ...(companySettings.address || {}) },
        branding: { ...(companySettings.branding || {}) },
      });
    }
  }, [companySettings, form]);

  const update = (path, value) =>
    setForm((current) => {
      if (!current) return current;
      const next = { ...current };
      const [head, ...rest] = path.split(".");
      if (rest.length === 0) {
        next[head] = value;
      } else {
        next[head] = { ...(next[head] || {}), [rest.join(".")]: value };
      }
      return next;
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) return;
    const result = await dispatch(updateCompanySettings(form));
    if (updateCompanySettings.fulfilled.match(result)) {
      toast.success("Company settings saved.");
    } else {
      toast.error(result.payload || "Unable to save company settings.");
    }
  };

  if (!form) {
    return (
      <SettingsShell
        title="Company Settings"
        description="Organization-level settings backed by the live admin settings endpoint."
      >
        <Card className="p-8 text-slate-500">
          {companySettingsStatus === "loading" ? "Loading..." : companySettingsError || "No data."}
        </Card>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell
      title="Company Settings"
      description="Organization-level settings backed by the live admin settings endpoint."
    >
      <form onSubmit={handleSubmit}>
        <Card className="space-y-7 p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Display Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <Field label="Legal Name" value={form.legalName} onChange={(e) => update("legalName", e.target.value)} />
            <Field label="Tax ID" value={form.taxId} onChange={(e) => update("taxId", e.target.value)} />
            <Field
              label="Support Email"
              type="email"
              value={form.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
            />
            <Field
              label="Support Phone"
              value={form.supportPhone}
              onChange={(e) => update("supportPhone", e.target.value)}
            />
          </div>
          <div>
            <SectionTitle icon={MapPin} title="Office Address" />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Street" value={form.address?.line1 || ""} onChange={(e) => update("address.line1", e.target.value)} />
              <Field label="Suite / Unit" value={form.address?.line2 || ""} onChange={(e) => update("address.line2", e.target.value)} />
              <Field label="City" value={form.address?.city || ""} onChange={(e) => update("address.city", e.target.value)} />
              <Field label="State" value={form.address?.state || ""} onChange={(e) => update("address.state", e.target.value)} />
              <Field label="ZIP" value={form.address?.zip || ""} onChange={(e) => update("address.zip", e.target.value)} />
              <Field label="Country" value={form.address?.country || ""} onChange={(e) => update("address.country", e.target.value)} />
            </div>
          </div>
          <div>
            <SectionTitle icon={Building2} title="Branding" />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Primary Color" value={form.branding?.primaryColor || ""} onChange={(e) => update("branding.primaryColor", e.target.value)} />
              <Field label="Accent Color" value={form.branding?.accentColor || ""} onChange={(e) => update("branding.accentColor", e.target.value)} />
              <Field label="Logo URL" value={form.branding?.logoUrl || ""} onChange={(e) => update("branding.logoUrl", e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" icon={Save} disabled={companySettingsStatus === "loading"}>
              {companySettingsStatus === "loading" ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </form>
    </SettingsShell>
  );
};

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

const NotificationSettings = () => {
  const dispatch = useAppDispatch();
  const { notificationPreferences, notificationPreferencesStatus, notificationPreferencesError } =
    useAppSelector(selectAdminConsole);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchNotificationPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (notificationPreferences && !form) {
      setForm({ ...notificationPreferences });
    }
  }, [notificationPreferences, form]);

  const toggle = (key) =>
    setForm((current) => (current ? { ...current, [key]: !current[key] } : current));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) return;
    const result = await dispatch(updateNotificationPreferences(form));
    if (updateNotificationPreferences.fulfilled.match(result)) {
      toast.success("Notification preferences saved.");
    } else {
      toast.error(result.payload || "Unable to save preferences.");
    }
  };

  if (!form) {
    return (
      <SettingsShell title="Notification Settings" description="Channel and topic preferences are stored per admin.">
        <Card className="p-8 text-slate-500">
          {notificationPreferencesStatus === "loading" ? "Loading..." : notificationPreferencesError || "No data."}
        </Card>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell title="Notification Settings" description="Channel and topic preferences are stored per admin.">
      <form onSubmit={handleSubmit}>
        <Card className="space-y-5 p-8">
          <CheckboxLine
            checked={Boolean(form.email)}
            onChange={() => toggle("email")}
            label="Email notifications"
            description="Receive order and message alerts via email."
          />
          <CheckboxLine
            checked={Boolean(form.inApp)}
            onChange={() => toggle("inApp")}
            label="In-app notifications"
            description="Show notifications in the dashboard bell."
          />
          <CheckboxLine
            checked={Boolean(form.orderEvents)}
            onChange={() => toggle("orderEvents")}
            label="Order events"
            description="Status changes, assignments, and completion alerts."
          />
          <CheckboxLine
            checked={Boolean(form.messageEvents)}
            onChange={() => toggle("messageEvents")}
            label="Message events"
            description="Alerts for new messages and replies."
          />
          <CheckboxLine
            checked={Boolean(form.weeklyDigest)}
            onChange={() => toggle("weeklyDigest")}
            label="Weekly digest"
            description="A summary email every Monday."
          />
          <div className="flex justify-end">
            <Button type="submit" icon={Save} disabled={notificationPreferencesStatus === "loading"}>
              {notificationPreferencesStatus === "loading" ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </Card>
      </form>
    </SettingsShell>
  );
};

const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const { securitySettings, securitySettingsStatus, securitySettingsError } =
    useAppSelector(selectAdminConsole);

  useEffect(() => {
    dispatch(fetchSecuritySettings());
  }, [dispatch]);

  const handleRevoke = async (session) => {
    const result = await dispatch(revokeSecuritySession(session.id));
    if (revokeSecuritySession.fulfilled.match(result)) {
      toast.success("Session revoked.");
      dispatch(fetchSecuritySettings());
    } else {
      toast.error(result.payload || "Unable to revoke session.");
    }
  };

  return (
    <SettingsShell
      title="Security Settings"
      description="Active sessions and account security state for the current admin."
    >
      <Card className="space-y-5 p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Password last changed</p>
            <p className="mt-1 text-sm text-slate-700">
              {securitySettings?.passwordLastChanged
                ? new Date(securitySettings.passwordLastChanged).toLocaleString()
                : "Not available"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Two-factor authentication</p>
            <p className="mt-1 text-sm text-slate-700">
              {securitySettings?.twoFactorEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
        <div>
          <SectionTitle icon={LockKeyhole} title="Active Sessions" />
          {securitySettingsStatus === "loading" ? (
            <p className="text-sm text-slate-500">Loading sessions...</p>
          ) : securitySettingsError ? (
            <p className="text-sm text-red-600">{securitySettingsError}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(securitySettings?.sessions || []).map((session) => (
                <li key={session.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{session.device}</p>
                    <p className="text-xs text-slate-500">
                      {session.ip} · last active {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  {session.current ? (
                    <StatusBadge status="Current" />
                  ) : (
                    <Button variant="danger" size="sm" onClick={() => handleRevoke(session)}>
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </SettingsShell>
  );
};

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
