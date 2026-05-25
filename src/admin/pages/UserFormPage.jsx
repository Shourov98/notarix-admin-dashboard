import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Building2,
  Camera,
  FileCheck2,
  FolderUp,
  LockKeyhole,
  MapPin,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  Button,
  Card,
  CheckboxLine,
  Field,
  PageHeader,
  SectionTitle,
  SegmentedControl,
  SelectField,
  StatusBadge,
  TextArea,
} from "../components/ui";
import { createClient, selectAdminConsole } from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";

const requiredClientDocs = [
  ["Service Agreement", "Signed contract for services."],
  ["W-9 Form", "Tax identification number."],
  ["Business License", "City or State certificate."],
  ["Billing Setup Form", "Payment & invoicing details."],
  ["Portal Authorization", "Access control permission."],
];

const requiredNotaryDocs = [
  ["Commission Certificate", "Upload PDF/JPG"],
  ["E&O Insurance", "EO_Insurance_2024.pdf"],
  ["Background Check", "Upload Report"],
  ["Government ID", "Upload Front & Back"],
];

const UserFormPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "notary" ? "notary" : "client";
  const [type, setType] = useState(initialType);
  const { createClientStatus } = useAppSelector(selectAdminConsole);
  const isClient = type === "client";
  const documentList = useMemo(() => (isClient ? requiredClientDocs : requiredNotaryDocs), [isClient]);
  const [formState, setFormState] = useState({
    organization: {
      companyName: "",
      companyType: "",
      website: "",
      mainOfficePhone: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    primaryContact: {
      name: "",
      email: "",
      phone: "",
    },
    secondaryContact: {
      name: "",
      email: "",
      phone: "",
    },
    loginEmail: "",
    sendInviteEmail: true,
    requirePasswordReset: true,
  });

  const updateSection = (section, field, value) => {
    setFormState((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleClientSubmit = async () => {
    if (!isClient) {
      toast.info("Notary creation stays in the next module pass.");
      return;
    }

    try {
      const result = await dispatch(
        createClient({
          loginEmail: formState.loginEmail || formState.primaryContact.email,
          organization: formState.organization,
          address: formState.address,
          primaryContact: formState.primaryContact,
          secondaryContact: formState.secondaryContact,
          sendInviteEmail: formState.sendInviteEmail,
        })
      ).unwrap();

      toast.success("Client created successfully.", {
        description: result?.temporaryPassword
          ? `Temporary password: ${result.temporaryPassword}`
          : "The client can now sign in after receiving the invite email.",
      });

      navigate("/users");
    } catch (error) {
      toast.error(error || "Unable to create client.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New User"
        description="Create a new identity within the Notarix platform."
        actions={
          <SegmentedControl
            options={[
              { label: "Client", value: "client" },
              { label: "Notary", value: "notary" },
            ]}
            active={type}
            onChange={setType}
          />
        }
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,820px)_360px]">
        <div className="space-y-7">
          {isClient ? (
            <>
              <Card className="p-6">
                <SectionTitle icon={Building2} title="Organization Information" />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Company Name"
                    required
                    placeholder="e.g. Global Logistics Inc."
                    value={formState.organization.companyName}
                    onChange={(event) => updateSection("organization", "companyName", event.target.value)}
                  />
                  <SelectField
                    label="Company Type"
                    value={formState.organization.companyType}
                    onChange={(event) => updateSection("organization", "companyType", event.target.value)}
                  >
                    <option>Select Type</option>
                    <option>LLC</option>
                    <option>Corporation</option>
                    <option>Title Company</option>
                  </SelectField>
                  <Field
                    label="Website"
                    placeholder="https://www.example.com"
                    value={formState.organization.website}
                    onChange={(event) => updateSection("organization", "website", event.target.value)}
                  />
                  <Field
                    label="Main Office Phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formState.organization.mainOfficePhone}
                    onChange={(event) => updateSection("organization", "mainOfficePhone", event.target.value)}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Business Address" />
                <div className="grid gap-5 md:grid-cols-6">
                  <Field
                    label="Address Line 1"
                    required
                    placeholder="Street Address"
                    className="md:col-span-4"
                    value={formState.address.line1}
                    onChange={(event) => updateSection("address", "line1", event.target.value)}
                  />
                  <Field
                    label="Address Line 2"
                    placeholder="Suite / Unit"
                    className="md:col-span-2"
                    value={formState.address.line2}
                    onChange={(event) => updateSection("address", "line2", event.target.value)}
                  />
                  <Field
                    label="City"
                    required
                    placeholder="City"
                    className="md:col-span-2"
                    value={formState.address.city}
                    onChange={(event) => updateSection("address", "city", event.target.value)}
                  />
                  <SelectField
                    label="State"
                    required
                    className="md:col-span-2"
                    value={formState.address.state}
                    onChange={(event) => updateSection("address", "state", event.target.value)}
                  >
                    <option>Select State</option>
                    <option>Texas</option>
                    <option>New York</option>
                  </SelectField>
                  <Field
                    label="ZIP Code"
                    required
                    placeholder="00000"
                    className="md:col-span-2"
                    value={formState.address.zip}
                    onChange={(event) => updateSection("address", "zip", event.target.value)}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={UserRound} title="Contact Details" />
                <p className="mb-4 text-xs font-bold uppercase text-slate-400">Primary Contact</p>
                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="Name"
                    required
                    placeholder="Full Name"
                    value={formState.primaryContact.name}
                    onChange={(event) => updateSection("primaryContact", "name", event.target.value)}
                  />
                  <Field
                    label="Email"
                    required
                    placeholder="email@company.com"
                    value={formState.primaryContact.email}
                    onChange={(event) => updateSection("primaryContact", "email", event.target.value)}
                  />
                  <Field
                    label="Phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formState.primaryContact.phone}
                    onChange={(event) => updateSection("primaryContact", "phone", event.target.value)}
                  />
                </div>
                <div className="my-7 h-px bg-slate-100" />
                <p className="mb-4 text-xs font-bold uppercase text-slate-400">Secondary Contact (Optional)</p>
                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="Name"
                    placeholder="Full Name"
                    value={formState.secondaryContact.name}
                    onChange={(event) => updateSection("secondaryContact", "name", event.target.value)}
                  />
                  <Field
                    label="Email"
                    placeholder="email@company.com"
                    value={formState.secondaryContact.email}
                    onChange={(event) => updateSection("secondaryContact", "email", event.target.value)}
                  />
                  <Field
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    value={formState.secondaryContact.phone}
                    onChange={(event) => updateSection("secondaryContact", "phone", event.target.value)}
                  />
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6">
                <SectionTitle icon={UserRound} title="Personal Information" />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full Name" required placeholder="e.g. Johnathan Smith" />
                  <Field label="Email Address" required placeholder="john@example.com" />
                  <Field label="Phone Number" required placeholder="+1 (555) 000-0000" />
                  <div>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Profile Photo</span>
                    <button type="button" className="flex h-11 items-center gap-3 rounded-lg text-[var(--color-brand-primary)]">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-slate-500">
                        <Camera className="h-5 w-5" />
                      </span>
                      <span className="font-semibold">Upload photo</span>
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Address Information" />
                <div className="grid gap-5 md:grid-cols-6">
                  <Field label="Address Line 1" required placeholder="123 Legal Way" className="md:col-span-4" />
                  <Field label="Address Line 2" placeholder="Suite 400" className="md:col-span-2" />
                  <Field label="City" required placeholder="Austin" className="md:col-span-2" />
                  <SelectField label="State" required className="md:col-span-2">
                    <option>Select State</option>
                    <option>Texas</option>
                    <option>New York</option>
                  </SelectField>
                  <Field label="ZIP Code" required placeholder="78701" className="md:col-span-2" />
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={ShieldCheck} title="Commission Details" />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Commission Number" required placeholder="TX-99283-A" />
                  <Field label="Commission State" required placeholder="Texas" />
                  <Field label="Commission Expiration Date" required placeholder="mm/dd/yyyy" type="date" />
                  <Field label="Travel Radius (miles)" placeholder="25" />
                  <TextArea label="Coverage Areas (Counties or Cities)" required placeholder="Travis, Williamson, Hays..." className="md:col-span-2" />
                </div>
              </Card>
            </>
          )}

          <Card className="p-6">
            <SectionTitle icon={LockKeyhole} title="Account Setup" />
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Login Email"
                required
                placeholder="admin@company.com"
                className="md:col-span-2"
                value={formState.loginEmail}
                onChange={(event) => updateField("loginEmail", event.target.value)}
              />
              <Field label="Password" placeholder="Auto-generated on save" type="password" disabled />
              <Field label="Confirm Password" placeholder="Auto-generated on save" type="password" disabled />
            </div>
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-[var(--color-border)] p-0"
                  checked={formState.sendInviteEmail}
                  onChange={(event) => updateField("sendInviteEmail", event.target.checked)}
                />
                Send Invite Email to primary contact immediately
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-[var(--color-border)] p-0"
                  checked={formState.requirePasswordReset}
                  onChange={(event) => updateField("requirePasswordReset", event.target.checked)}
                  disabled
                />
                Require password reset on first login
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={FileCheck2} title="Required Documents" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {documentList.map(([title, description], index) => (
                <div key={title} className="rounded-lg border border-[var(--color-border)] p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="text-sm text-slate-600">{description}</p>
                    </div>
                    <StatusBadge status={index === 1 && !isClient ? "Uploaded" : "Missing"} />
                  </div>
                  <Button variant="secondary" size="sm" icon={FolderUp} className="w-full text-[var(--color-brand-primary)]">
                    Upload
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="sticky top-24 p-6">
            {isClient ? (
              <>
                <h2 className="text-lg font-semibold">Client Summary</h2>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-slate-600">Onboarding Progress</p>
                  <p className="font-bold text-[var(--color-brand-primary)]">0%</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200" />
                <div className="mt-5 space-y-3 text-sm text-slate-400">
                  <p>Organization Profile</p>
                  <p>Verification Documents</p>
                  <p>Account Credentials</p>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-600">New notary records are held in pending status until commission and E&O documents are verified.</p>
              </div>
            )}
            <div className="mt-6 space-y-3">
              <Button
                icon={Save}
                className="w-full"
                onClick={handleClientSubmit}
                disabled={isClient && createClientStatus === "loading"}
              >
                {createClientStatus === "loading" && isClient
                  ? "Saving Client..."
                  : `Save ${isClient ? "Client" : "Notary"}`}
              </Button>
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </div>
          </Card>

          {isClient ? (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
              Adding a new client will trigger the automated onboarding workflow. Ensure all required documents are flagged if not available immediately.
            </div>
          ) : (
            <Card className="p-4">
              <CheckboxLine
                checked
                label="RON eligible profile"
                description="Enable online session review once identity checks pass."
              />
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
};

export default UserFormPage;
