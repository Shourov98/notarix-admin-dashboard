import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  ProgressBar,
  SectionTitle,
  StatusBadge,
} from "../components/ui";
import { clientDocuments, notaryDocuments } from "../data/notarixData";
import {
  fetchAdminUser,
  selectAdminConsole,
  updateUserDocumentStatus,
} from "../../store/adminConsoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toast } from "sonner";

const InfoLine = ({ label, value, link }) => (
  <div>
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-1 font-medium ${link ? "text-[var(--color-brand-primary)]" : "text-slate-900"}`}>{value}</p>
  </div>
);

const ClientOverview = ({ client }) => (
  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <SectionTitle icon={Building2} title="Organization Information" />
        <div className="space-y-5">
          <InfoLine label="Company Name" value={client?.organization?.companyName || "Not provided"} />
          <InfoLine label="Company Type" value={client?.organization?.companyType || "Not provided"} />
          <InfoLine label="Website" value={client?.organization?.website || "Not provided"} link />
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={MapPin} title="Business Address" />
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoLine label="Address Line 1" value={client?.address?.line1 || "Not provided"} />
          <InfoLine label="City" value={client?.address?.city || "Not provided"} />
          <InfoLine
            label="State / ZIP"
            value={
              [client?.address?.state, client?.address?.zip].filter(Boolean).join(", ") ||
              "Not provided"
            }
          />
          <InfoLine label="Country" value={client?.address?.country || "United States"} />
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={UserRound} title="Primary Contact" action={<StatusBadge status="Principal" />} />
        <div className="space-y-5">
          <InfoLine label="Full Name" value={client?.primaryContact?.name || "Not provided"} />
          <InfoLine label="Email Address" value={client?.primaryContact?.email || "Not provided"} />
          <InfoLine label="Phone Number" value={client?.primaryContact?.phone || "Not provided"} />
        </div>
      </Card>
      <Card className="p-6">
        <SectionTitle icon={UserRound} title="Secondary Contact" />
        <div className="space-y-5">
          <InfoLine label="Full Name" value={client?.secondaryContact?.name || "Not provided"} />
          <InfoLine label="Email Address" value={client?.secondaryContact?.email || "Not provided"} />
          <InfoLine label="Phone Number" value={client?.secondaryContact?.phone || "Not provided"} />
        </div>
      </Card>
      <Card className="p-6 md:col-span-2">
        <SectionTitle icon={Landmark} title="Bank Information" action={<StatusBadge status="Masked" />} />
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoLine label="Bank Name" value={client?.bankInfo?.bankName || "Not provided"} />
          <InfoLine
            label="Account Holder"
            value={client?.bankInfo?.accountHolderName || "Not provided"}
          />
          <InfoLine label="Routing Number" value={client?.bankInfo?.routingNumber || "Not provided"} />
          <InfoLine label="Account Number" value={client?.bankInfo?.accountNumber || "Not provided"} />
        </div>
      </Card>
    </div>
    <aside className="space-y-6">
      <Card className="p-7 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Verification Status</p>
        <div className="mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full border-[14px] border-[var(--color-brand-primary)]">
          <div>
            <p className="text-4xl font-extrabold text-[var(--color-brand-primary)]">75%</p>
            <p className="text-sm uppercase text-slate-400">Complete</p>
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-[260px] text-slate-600">
          Pending document verification for legal compliance.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <StatusBadge status="Identity" />
          <StatusBadge status="Tax ID" />
          <StatusBadge status="Business License" />
        </div>
      </Card>
      <Card className="p-6">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Administrative Actions</p>
        <div className="space-y-3">
          <Button className="w-full" icon={ShieldCheck}>Approve Client</Button>
          <Button className="w-full" variant="danger">Suspend Client</Button>
          <div className="h-px bg-slate-200" />
          <Button className="w-full" variant="subtle">Request Missing Documents</Button>
          <Button className="w-full" variant="subtle" icon={MessageSquare}>Send Message</Button>
        </div>
      </Card>
    </aside>
  </div>
);

const ClientDocuments = ({ documents = [], onApprove, onMarkMissing }) => (
  <div>
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      {[
        ["Missing Documents", String(documents.filter((doc) => doc.status === "Missing").length)],
        ["Pending Review", String(documents.filter((doc) => doc.status === "Pending").length)],
        ["Verified Documents", String(documents.filter((doc) => doc.status === "Verified").length)],
      ].map(([label, value]) => (
        <Card key={label} className="flex items-center justify-between p-7">
          <div>
            <p className="text-sm font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-extrabold">{value}</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]">
            <FileText className="h-6 w-6" />
          </span>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {(documents.length ? documents : clientDocuments).map((doc) => (
        <Card key={doc.title} className={`p-6 ${doc.status === "Rejected" ? "border-red-200 bg-red-50" : ""}`}>
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-bold">{doc.title}</h3>
            <StatusBadge status={doc.status} />
          </div>
          <div className="mb-5 flex gap-4">
            <span className="grid h-20 w-16 place-items-center rounded border border-slate-200 bg-slate-50 text-[var(--color-brand-primary)]">
              <FileText className="h-7 w-7" />
            </span>
            <div className="text-sm text-slate-600">
              <p>{doc.status === "Missing" ? "Professional Liability insurance certificate." : "Document used for compliance review."}</p>
              {doc.file ? <p className="mt-2 font-semibold">File: <span className="font-normal text-slate-500">{doc.file}</span></p> : null}
            </div>
          </div>
          {doc.status === "Rejected" ? (
            <div className="mb-4 rounded-lg border border-red-100 bg-white p-3 text-sm text-red-700">
              "Document watermark is obscuring the legal stamp. Please re-upload a clear copy."
            </div>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {doc.status === "Missing" ? (
              <Button variant="subtle" className="sm:col-span-2" disabled>
                Marked Missing
              </Button>
            ) : (
              <>
                <Button onClick={() => onApprove?.(doc.id)}>Approve</Button>
                <Button variant="danger" onClick={() => onMarkMissing?.(doc.id)}>
                  Mark Missing
                </Button>
                <Button variant="secondary" className="sm:col-span-2">View Document</Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const NotaryOverview = ({ notary }) => (
  <div className="space-y-7">
    <Card className="p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <Avatar
            name={notary?.name || "Sarah Jenkins"}
            size="lg"
            tone={notary?.avatarTone || "bg-rose-100 text-rose-700"}
          />
          <div>
            <h2 className="text-2xl font-bold">{notary?.name || "Sarah Jenkins"}</h2>
            <div className="mt-2 flex flex-wrap gap-5 text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> {notary?.email || "m.thorne@legalnotary.com"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> {notary?.personalInfo?.phone || "(555) 012-3456"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-6 text-right sm:grid-cols-4">
          <InfoLine label="Status" value={notary?.status || "Pending"} />
          <InfoLine label="Verification" value={notary?.verification || "In Review"} />
          <InfoLine label="Coverage Area" value={notary?.commission?.coverageAreas || "FL, GA"} />
          <InfoLine label="Last Active" value="2 hours ago" />
        </div>
      </div>
    </Card>

    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Card className="p-7">
        <h2 className="text-2xl font-semibold">Profile Completion</h2>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-bold text-[var(--color-brand-primary)]">85% Complete</p>
          <p className="text-sm text-slate-600">2 items pending</p>
        </div>
        <div className="mt-3"><ProgressBar value={85} /></div>
        <p className="mt-3 text-sm text-slate-600">Required documents and payment setup are needed for full approval.</p>
      </Card>
      <Card className="p-7">
        <h2 className="text-2xl font-semibold">Completion Checklist</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {[
            ["Profile Fields", ["Profile Photo", "Commission Number", "Commission State", "Payment Method"]],
            ["Required Documents", ["Commission Certificate", "Background Check", "Government ID", "ACH / Void Check"]],
          ].map(([title, rows]) => (
            <div key={title}>
              <p className="mb-4 text-sm uppercase text-slate-500">{title}</p>
              {rows.map((row, index) => (
                <div key={row} className="flex items-center justify-between border-b border-slate-100 py-3">
                  <span>{row}</span>
                  <span className={index === rows.length - 1 ? "h-3 w-3 rounded-full bg-amber-400" : "text-emerald-600"}>
                    {index === rows.length - 1 ? null : <CheckCircle2 className="h-5 w-5" />}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-7">
        <SectionTitle icon={BriefcaseIcon} title="Notary Information" />
        {[
          ["Commission Number", notary?.commission?.number || "NY-88291"],
          ["Commission State", notary?.commission?.state || "New York"],
          ["Expiration Date", notary?.commission?.expirationDate || "Oct 24, 2026"],
          ["Travel Radius", notary?.commission?.travelRadius || "25 miles"],
          ["Coverage Areas", notary?.commission?.coverageAreas || "Manhattan, Brooklyn"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-slate-100 py-3 last:border-b-0">
            <span className="text-slate-600">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </Card>
      <Card className="p-7">
        <SectionTitle icon={ShieldCheck} title="Professional Details" />
        <div className="space-y-5">
          <div className="flex justify-between"><span className="text-slate-600">RON Approval</span><strong className="text-emerald-600">Approved</strong></div>
          <div className="flex justify-between"><span className="text-slate-600">Background Check Date</span><strong>Feb 15, 2026</strong></div>
          <div>
            <p className="text-slate-600">Specialties</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["RON", "HELOC", "Purchase", "Seller Package"].map((tag) => <StatusBadge key={tag} status={tag} />)}
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-7">
        <SectionTitle icon={MapPin} title="Address Information" />
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoLine label="Address Line 1" value={notary?.address?.line1 || "725 5th Ave"} />
          <InfoLine label="City" value={notary?.address?.city || "New York"} />
          <InfoLine label="State" value={notary?.address?.state || "NY"} />
          <InfoLine label="ZIP Code" value={notary?.address?.zip || "10022"} />
        </div>
      </Card>
      <Card className="p-7">
        <SectionTitle icon={Landmark} title="Payment Details" action={<StatusBadge status="Super Admin Only" />} />
        <div className="space-y-5">
          <div className="flex justify-between"><span className="text-slate-600">Bank Name</span><strong>{notary?.bankInfo?.bankName || "Not provided"}</strong></div>
          <div className="flex justify-between"><span className="text-slate-600">Account Holder</span><strong>{notary?.bankInfo?.accountHolderName || "Not provided"}</strong></div>
          <div className="flex justify-between"><span className="text-slate-600">Routing Number</span><strong>{notary?.bankInfo?.routingNumber || "Not provided"}</strong></div>
          <div className="flex justify-between"><span className="text-slate-600">Account Number</span><strong>{notary?.bankInfo?.accountNumber || "Not provided"}</strong></div>
        </div>
      </Card>
    </div>
  </div>
);

const BriefcaseIcon = (props) => <ShieldCheck {...props} />;

const NotaryDocuments = ({ documents = [], onApprove, onMarkMissing }) => (
  <div>
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      {[
        ["Missing Documents", String(documents.filter((doc) => doc.status === "Missing").length)],
        ["Pending Review", String(documents.filter((doc) => doc.status === "Pending").length)],
        ["Verified Documents", String(documents.filter((doc) => doc.status === "Verified").length)],
      ].map(([label, value]) => (
        <Card key={label} className="flex items-center justify-between p-7">
          <div>
            <p className="text-sm font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-extrabold">{value}</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-100 text-[var(--color-brand-primary)]">
            <FileText className="h-6 w-6" />
          </span>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {(documents.length ? documents : notaryDocuments).map((doc, index) => (
        <Card key={doc.title} className="flex min-h-[270px] flex-col overflow-hidden">
          <div className="border-b border-[var(--color-border)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{doc.title}</h3>
                <p className="text-slate-600">{index === 0 ? "Official state appointment" : index === 1 ? "Errors & Omissions Policy" : index === 2 ? "Annual criminal screening" : "Passport or Driver's License"}</p>
              </div>
              <StatusBadge status={doc.status} />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between p-5">
            {doc.file ? (
              <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[#f6f4ff] p-4 font-semibold">
                {doc.file}
                <p className="mt-1 text-sm font-normal text-slate-500">
                  {doc.status === "Verified" ? "Verified Oct 05, 2023" : "Uploaded Oct 12, 2023"}
                </p>
              </div>
            ) : (
              <p className="py-12 text-center text-slate-600">No file has been uploaded yet. The notary has been notified via email.</p>
            )}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {doc.status === "Missing" ? (
                <Button variant="secondary" className="sm:col-span-2" disabled>
                  Marked Missing
                </Button>
              ) : (
                <>
                  <Button variant="secondary">View</Button>
                  <Button
                    variant={doc.status === "Verified" ? "secondary" : "primary"}
                    onClick={() =>
                      doc.status === "Verified" ? null : onApprove?.(doc.id)
                    }
                  >
                    {doc.status === "Verified" ? "Verified" : "Approve"}
                  </Button>
                  {doc.status === "Verified" ? null : (
                    <Button variant="danger" className="sm:col-span-2" onClick={() => onMarkMissing?.(doc.id)}>
                      Mark Missing
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
      <Card className="flex min-h-[300px] flex-col items-center justify-center bg-[var(--color-brand-primary)] p-8 text-center text-white">
        <ShieldCheck className="h-16 w-16 rounded-full bg-white/20 p-4" />
        <h3 className="mt-6 text-xl font-semibold">Final Review</h3>
        <p className="mt-2 text-blue-100">Ready for final administrative sign-off? Ensure all flags are resolved.</p>
        <Button variant="secondary" className="mt-6 w-full text-[var(--color-brand-primary)]">Approve Notary Profile</Button>
      </Card>
    </div>
  </div>
);

const UserProfilePage = ({ type = "client" }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { activeUser, activeUserStatus } = useAppSelector(selectAdminConsole);
  const isDocuments = location.pathname.endsWith("/documents");
  const isNotary = type === "notary";
  const basePath = `/users/${type}/${id || (isNotary ? "sarah-jenkins" : "michael-chen")}`;
  const currentUser = activeUser?.id === id ? activeUser : null;
  const client = !isNotary ? currentUser : null;
  const notary = isNotary ? currentUser : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminUser(id));
    }
  }, [dispatch, id]);

  const handleApproveDocument = async (documentId) => {
    if (!id || !documentId) {
      return;
    }

    try {
      await dispatch(
        updateUserDocumentStatus({
          userId: id,
          documentId,
          status: "Verified",
        })
      ).unwrap();
      toast.success("Document marked as verified.");
    } catch (error) {
      toast.error(error || "Unable to verify document.");
    }
  };

  const handleMarkMissing = async (documentId) => {
    if (!id || !documentId) {
      return;
    }

    try {
      await dispatch(
        updateUserDocumentStatus({
          userId: id,
          documentId,
          status: "Missing",
        })
      ).unwrap();
      toast.success("Document marked as missing.");
    } catch (error) {
      toast.error(error || "Unable to mark document as missing.");
    }
  };

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{isNotary ? "Notary Overview" : isDocuments ? "Client Documents" : "Client Details"}</h1>
          {isNotary ? <p className="mt-1 text-slate-600">View notary profile, credentials, and status</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">{isNotary ? "Edit Notary" : "Edit Client"}</Button>
          <Button variant="danger">Suspend</Button>
          <Button variant="secondary">Approve</Button>
          {isNotary ? <Button>Send Message</Button> : null}
        </div>
      </div>

      {!isNotary ? (
        <Card className="mb-7 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar
                name={client?.name || "Michael Chen"}
                size="lg"
                tone={client?.avatarTone || "bg-slate-200 text-slate-700"}
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{client?.name || "Michael Chen"}</h2>
                  <StatusBadge status={client?.status || "Pending"} />
                </div>
                <p className="mt-1 text-slate-500">
                  {activeUserStatus === "loading" ? "Loading profile..." : `Code: ${id || "AXM-4410"}`}
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-slate-600">Profile Completion</span>
                <strong className="text-2xl text-[var(--color-brand-primary)]">75%</strong>
              </div>
              <ProgressBar value={75} />
            </div>
          </div>
        </Card>
      ) : null}

      <div className="mb-8 border-b border-[var(--color-border)]">
        <div className="flex gap-8">
          <Link
            to={basePath}
            className={`border-b-2 px-0 py-4 font-semibold ${
              !isDocuments ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]" : "border-transparent text-slate-500"
            }`}
          >
            Overview
          </Link>
          <Link
            to={`${basePath}/documents`}
            className={`border-b-2 px-0 py-4 font-semibold ${
              isDocuments ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]" : "border-transparent text-slate-500"
            }`}
          >
            Documents
          </Link>
        </div>
      </div>

      {isNotary ? (
        isDocuments ? (
          <NotaryDocuments
            documents={notary?.requiredDocuments || []}
            onApprove={handleApproveDocument}
            onMarkMissing={handleMarkMissing}
          />
        ) : (
          <NotaryOverview notary={notary} />
        )
      ) : isDocuments ? (
        <ClientDocuments
          documents={client?.requiredDocuments || []}
          onApprove={handleApproveDocument}
          onMarkMissing={handleMarkMissing}
        />
      ) : (
        <ClientOverview client={client} />
      )}
    </div>
  );
};

export default UserProfilePage;
