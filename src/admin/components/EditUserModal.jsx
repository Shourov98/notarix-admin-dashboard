import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Field,
  Modal,
  SelectField,
  TextArea,
} from "./ui";
import {
  selectAdminConsole,
  updateAdminUser,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const STATUS_VALUES = ["Active", "Pending", "Suspended", "Inactive"];

// Build a working copy of the user so we never mutate Redux state in place.
const buildInitialState = (user) => ({
  name: user?.name || "",
  company: user?.company || user?.organization?.companyName || "",
  area: user?.area || user?.address?.state || "",
  status: user?.status || "Active",
  organization: {
    companyName: user?.organization?.companyName || user?.company || "",
    companyType: user?.organization?.companyType || "",
    website: user?.organization?.website || "",
    mainOfficePhone: user?.organization?.mainOfficePhone || "",
  },
  address: {
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "United States",
  },
  primaryContact: {
    name: user?.primaryContact?.name || user?.name || "",
    email: user?.primaryContact?.email || user?.email || "",
    phone: user?.primaryContact?.phone || user?.personalInfo?.phone || "",
  },
  secondaryContact: {
    name: user?.secondaryContact?.name || "",
    email: user?.secondaryContact?.email || "",
    phone: user?.secondaryContact?.phone || "",
  },
  personalInfo: {
    fullName: user?.personalInfo?.fullName || user?.name || "",
    email: user?.personalInfo?.email || user?.email || "",
    phone: user?.personalInfo?.phone || "",
  },
  commission: {
    number: user?.commission?.number || "",
    state: user?.commission?.state || "",
    expirationDate: user?.commission?.expirationDate || "",
    travelRadius: user?.commission?.travelRadius || "",
    coverageAreas: user?.commission?.coverageAreas || "",
  },
  ronEligible: Boolean(user?.ronEligible),
  specialtiesText: Array.isArray(user?.specialties)
    ? user.specialties.join(", ")
    : "",
});

const EditUserModal = ({ open, onClose, onSaved, user, role = "client" }) => {
  const dispatch = useAppDispatch();
  const { updateUserStatusFlag, updateUserError } = useAppSelector(
    selectAdminConsole
  );
  const isNotary = role === "notary";

  const [formState, setFormState] = useState(() => buildInitialState(user));
  const [missingFields, setMissingFields] = useState([]);

  // Re-seed the form whenever a different user is opened.
  useEffect(() => {
    if (open) {
      setFormState(buildInitialState(user));
      setMissingFields([]);
    }
  }, [open, user]);

  const updateField = (field, value) =>
    setFormState((current) => ({ ...current, [field]: value }));

  const updateNestedField = (group, field, value) =>
    setFormState((current) => ({
      ...current,
      [group]: { ...(current[group] || {}), [field]: value },
    }));

  const isSubmitting = updateUserStatusFlag === "loading";

  const requiredFields = useMemo(() => {
    const common = [
      ["name", "Name"],
      ["status", "Status"],
    ];
    if (isNotary) {
      return [
        ...common,
        ["personalInfo.fullName", "Full name"],
        ["personalInfo.email", "Email"],
        ["personalInfo.phone", "Phone"],
        ["address.line1", "Street address"],
        ["address.city", "City"],
        ["address.state", "State"],
        ["address.zip", "ZIP code"],
        ["commission.number", "Commission number"],
        ["commission.state", "Commission state"],
        ["commission.expirationDate", "Commission expiration"],
      ];
    }
    return [
      ...common,
      ["primaryContact.name", "Primary contact name"],
      ["primaryContact.email", "Primary contact email"],
      ["primaryContact.phone", "Primary contact phone"],
      ["organization.companyName", "Company name"],
      ["address.line1", "Street address"],
      ["address.city", "City"],
      ["address.state", "State"],
      ["address.zip", "ZIP code"],
    ];
  }, [isNotary]);

  const getFieldValue = (fieldPath) =>
    fieldPath.split(".").reduce((value, key) => value?.[key], formState);

  const computeMissing = () =>
    requiredFields
      .filter(([fieldPath]) => {
        const value = getFieldValue(fieldPath);
        if (typeof value === "string") return value.trim() === "";
        return value === null || value === undefined;
      })
      .map(([, label]) => label);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    const nextMissing = computeMissing();
    setMissingFields(nextMissing);
    if (nextMissing.length > 0) {
      toast.error(`Please fill: ${nextMissing.join(", ")}`);
      return;
    }

    const specialties = formState.specialtiesText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const changes = {
      name: formState.name.trim(),
      company: formState.company.trim(),
      area: formState.area.trim(),
      status: formState.status,
      organization: {
        companyName: formState.organization.companyName.trim(),
        companyType: formState.organization.companyType.trim(),
        website: formState.organization.website.trim(),
        mainOfficePhone: formState.organization.mainOfficePhone.trim(),
      },
      address: {
        line1: formState.address.line1.trim(),
        line2: formState.address.line2.trim(),
        city: formState.address.city.trim(),
        state: formState.address.state.trim(),
        zip: formState.address.zip.trim(),
        country: formState.address.country.trim(),
      },
      primaryContact: {
        name: formState.primaryContact.name.trim(),
        email: formState.primaryContact.email.trim(),
        phone: formState.primaryContact.phone.trim(),
      },
      secondaryContact: {
        name: formState.secondaryContact.name.trim(),
        email: formState.secondaryContact.email.trim(),
        phone: formState.secondaryContact.phone.trim(),
      },
    };

    if (isNotary) {
      changes.personalInfo = {
        fullName: formState.personalInfo.fullName.trim(),
        email: formState.personalInfo.email.trim(),
        phone: formState.personalInfo.phone.trim(),
      };
      changes.commission = {
        number: formState.commission.number.trim(),
        state: formState.commission.state.trim(),
        expirationDate: formState.commission.expirationDate.trim(),
        travelRadius: formState.commission.travelRadius.trim(),
        coverageAreas: formState.commission.coverageAreas.trim(),
      };
      changes.ronEligible = formState.ronEligible;
      changes.specialties = specialties;
    }

    try {
      const result = await dispatch(
        updateAdminUser({ userId: user.id, changes })
      ).unwrap();

      toast.success(`${isNotary ? "Notary" : "Client"} profile updated.`);
      onSaved?.(result);
    } catch (error) {
      const message =
        (typeof error === "string" && error) ||
        error?.message ||
        updateUserError ||
        "Unable to update profile.";
      toast.error(message);
    }
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={UserCog}
      title={isNotary ? "Edit Notary" : "Edit Client"}
      subtitle={
        isNotary
          ? "Update profile, commission, and address details for this notary."
          : "Update organization, contact, and address details for this client."
      }
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {missingFields.length > 0 ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Missing required fields: {missingFields.join(", ")}
          </div>
        ) : null}

        {/* Account-level fields */}
        <section>
          <SectionHeading icon={User} title="Account" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={isNotary ? "Display Name" : "Display Name"}
              required
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            <SelectField
              label="Account Status"
              required
              value={formState.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectField>
            <Field
              label="Coverage Area / Region"
              placeholder="e.g. Texas"
              value={formState.area}
              onChange={(event) => updateField("area", event.target.value)}
            />
            <Field
              label="Display Company"
              placeholder="Shown in lists"
              value={formState.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </div>
        </section>

        {/* Organization (Client) / Personal Info (Notary) */}
        {isNotary ? (
          <section>
            <SectionHeading icon={User} title="Personal Info" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Full Name"
                required
                value={formState.personalInfo.fullName}
                onChange={(event) =>
                  updateNestedField("personalInfo", "fullName", event.target.value)
                }
              />
              <Field
                label="Email"
                required
                type="email"
                value={formState.personalInfo.email}
                onChange={(event) =>
                  updateNestedField("personalInfo", "email", event.target.value)
                }
              />
              <Field
                label="Phone"
                required
                type="tel"
                value={formState.personalInfo.phone}
                onChange={(event) =>
                  updateNestedField("personalInfo", "phone", event.target.value)
                }
              />
              <label className="flex items-center gap-3 self-end text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
                  checked={formState.ronEligible}
                  onChange={(event) =>
                    updateField("ronEligible", event.target.checked)
                  }
                />
                Eligible for Remote Online Notarization (RON)
              </label>
              <TextArea
                label="Specialties (comma separated)"
                placeholder="Loan Signing, Estate Planning, RON"
                className="md:col-span-2"
                value={formState.specialtiesText}
                onChange={(event) =>
                  updateField("specialtiesText", event.target.value)
                }
              />
            </div>
          </section>
        ) : (
          <>
            <section>
              <SectionHeading icon={Building2} title="Organization" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Company Name"
                  required
                  value={formState.organization.companyName}
                  onChange={(event) =>
                    updateNestedField(
                      "organization",
                      "companyName",
                      event.target.value
                    )
                  }
                />
                <Field
                  label="Company Type"
                  placeholder="Corporation, LLC, etc."
                  value={formState.organization.companyType}
                  onChange={(event) =>
                    updateNestedField(
                      "organization",
                      "companyType",
                      event.target.value
                    )
                  }
                />
                <Field
                  label="Website"
                  value={formState.organization.website}
                  onChange={(event) =>
                    updateNestedField("organization", "website", event.target.value)
                  }
                />
                <Field
                  label="Main Office Phone"
                  type="tel"
                  value={formState.organization.mainOfficePhone}
                  onChange={(event) =>
                    updateNestedField(
                      "organization",
                      "mainOfficePhone",
                      event.target.value
                    )
                  }
                />
              </div>
            </section>
            <section>
              <SectionHeading icon={User} title="Primary Contact" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Full Name"
                  required
                  value={formState.primaryContact.name}
                  onChange={(event) =>
                    updateNestedField("primaryContact", "name", event.target.value)
                  }
                />
                <Field
                  label="Email"
                  required
                  type="email"
                  value={formState.primaryContact.email}
                  onChange={(event) =>
                    updateNestedField(
                      "primaryContact",
                      "email",
                      event.target.value
                    )
                  }
                />
                <Field
                  label="Phone"
                  required
                  type="tel"
                  value={formState.primaryContact.phone}
                  onChange={(event) =>
                    updateNestedField(
                      "primaryContact",
                      "phone",
                      event.target.value
                    )
                  }
                />
              </div>
            </section>
            <section>
              <SectionHeading icon={User} title="Secondary Contact" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Full Name"
                  value={formState.secondaryContact.name}
                  onChange={(event) =>
                    updateNestedField(
                      "secondaryContact",
                      "name",
                      event.target.value
                    )
                  }
                />
                <Field
                  label="Email"
                  type="email"
                  value={formState.secondaryContact.email}
                  onChange={(event) =>
                    updateNestedField(
                      "secondaryContact",
                      "email",
                      event.target.value
                    )
                  }
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={formState.secondaryContact.phone}
                  onChange={(event) =>
                    updateNestedField(
                      "secondaryContact",
                      "phone",
                      event.target.value
                    )
                  }
                />
              </div>
            </section>
          </>
        )}

        {/* Address */}
        <section>
          <SectionHeading icon={MapPin} title="Address" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Address Line 1"
              required
              className="md:col-span-2"
              value={formState.address.line1}
              onChange={(event) =>
                updateNestedField("address", "line1", event.target.value)
              }
            />
            <Field
              label="Address Line 2"
              className="md:col-span-2"
              value={formState.address.line2}
              onChange={(event) =>
                updateNestedField("address", "line2", event.target.value)
              }
            />
            <Field
              label="City"
              required
              value={formState.address.city}
              onChange={(event) =>
                updateNestedField("address", "city", event.target.value)
              }
            />
            <Field
              label="State"
              required
              value={formState.address.state}
              onChange={(event) =>
                updateNestedField("address", "state", event.target.value)
              }
            />
            <Field
              label="ZIP Code"
              required
              value={formState.address.zip}
              onChange={(event) =>
                updateNestedField("address", "zip", event.target.value)
              }
            />
            <Field
              label="Country"
              value={formState.address.country}
              onChange={(event) =>
                updateNestedField("address", "country", event.target.value)
              }
            />
          </div>
        </section>

        {/* Commission — notary only */}
        {isNotary ? (
          <section>
            <SectionHeading icon={ShieldCheck} title="Commission" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Commission Number"
                required
                value={formState.commission.number}
                onChange={(event) =>
                  updateNestedField("commission", "number", event.target.value)
                }
              />
              <Field
                label="Commission State"
                required
                value={formState.commission.state}
                onChange={(event) =>
                  updateNestedField("commission", "state", event.target.value)
                }
              />
              <Field
                label="Expiration Date"
                required
                type="date"
                value={formState.commission.expirationDate}
                onChange={(event) =>
                  updateNestedField(
                    "commission",
                    "expirationDate",
                    event.target.value
                  )
                }
              />
              <Field
                label="Travel Radius"
                placeholder="e.g. 50 miles"
                value={formState.commission.travelRadius}
                onChange={(event) =>
                  updateNestedField(
                    "commission",
                    "travelRadius",
                    event.target.value
                  )
                }
              />
              <TextArea
                label="Coverage Areas"
                placeholder="Texas, Oklahoma, Louisiana"
                className="md:col-span-2"
                value={formState.commission.coverageAreas}
                onChange={(event) =>
                  updateNestedField(
                    "commission",
                    "coverageAreas",
                    event.target.value
                  )
                }
              />
            </div>
          </section>
        ) : null}

        {/* Silent helper for unused param linting */}
        <span className="sr-only">{isNotary ? "notary" : "client"}</span>
      </form>
    </Modal>
  );
};

const SectionHeading = ({ icon: IconProp, title }) => {
  const HeadingIcon = IconProp;
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-[var(--color-brand-primary)]">
        {HeadingIcon ? <HeadingIcon className="h-5 w-5" /> : null}
      </span>
      <h3 className="text-lg font-bold text-[var(--color-ink)]">{title}</h3>
    </div>
  );
};

export default EditUserModal;