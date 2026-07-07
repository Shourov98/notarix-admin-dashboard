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
import {
  fetchAdminUser,
  selectAdminConsole,
  suspendUser,
  activateUser,
  updateUserStatus,
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

const formatCompletion = (documents = []) => {
  if (!documents.length) {
    return 0;
  }

  const completedStatuses = new Set(["Verified", "Approved", "Completed", "Uploaded"]);
  const completed = documents.filter((doc) => completedStatuses.has(doc?.status)).length;
  return Math.round((completed / documents.length) * 100);
};

const countPendingDocuments = (documents = []) =>
  documents.filter((doc) => !["Verified", "Approved", "Completed"].includes(doc?.status)).length;

const ClientOverview = ({
  client,
  onApprove,
  onSuspend,
  onReactivate,
  onRequestMissing,
  onSendMessage,
}) => (
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
            <p className="text-4xl font-extrabold text-[var(--color-brand-primary)]">
              {formatCompletion(client?.requiredDocuments)}%
            </p>
            <p className="text-sm uppercase text-slate-400">
              {client?.verification || "Pending"}
            </p>
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-[260px] text-slate-600">
          {client?.requiredDocuments?.length
            ? "Completion is based on the live document statuses currently stored for this client."
            : "No client documents have been uploaded yet."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <StatusBadge status={client?.status || "Pending"} />
          <StatusBadge status={client?.verification || "Pending Review"} />
        </div>
      </Card>
      <Card className="p-6">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Administrative Actions</p>
        <div className="space-y-3">
          <Button className="w-full" icon={ShieldCheck} onClick={onApprove}>
            {client?.status === "Active" ? "Mark as Approved" : "Approve Client"}
          </Button>
          <Button className="w-full" variant="danger" onClick={onSuspend}>
            Suspend Client
          </Button>
          {client?.status === "Suspended" ? (
            <Button className="w-full" variant="secondary" onClick={onReactivate}>
              Reactivate Client
            </Button>
          ) : null}
          <div className="h-px bg-slate-200" />
          <Button className="w-full" variant="subtle" onClick={onRequestMissing}>
            Request Missing Documents
          </Button>
          <Button className="w-full" variant="subtle" icon={MessageSquare} onClick={onSendMessage}>
            Send Message
          </Button>
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
      {documents.length ? documents.map((doc) => (
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
                {doc.url || doc.downloadUrl ? (
                  <Button
                    variant="secondary"
                    className="sm:col-span-2"
                    onClick={() => window.open(doc.downloadUrl || doc.url, "_blank", "noopener")}
                  >
                    View Document
                  </Button>
                ) : (
                  <Button variant="secondary" className="sm:col-span-2" disabled>
                    View Document
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>
      )) : (
        <Card className="p-8 text-center text-slate-500 lg:col-span-2 xl:col-span-3">
          No client documents found for this user.
        </Card>
      )}
    </div>
  </div>
);

const NotaryOverview = ({ notary }) => (
  <div className="space-y-7">
    <Card className="p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <Avatar
            name={notary?.name || "Notary User"}
            size="lg"
            src={notary?.avatar || undefined}
            tone={notary?.avatarTone || "bg-rose-100 text-rose-700"}
          />
          <div>
            <h2 className="text-2xl font-bold">{notary?.name || "Notary User"}</h2>
            <div className="mt-2 flex flex-wrap gap-5 text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /> {notary?.email || "Not provided"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> {notary?.personalInfo?.phone || "Not provided"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-6 text-right sm:grid-cols-4">
          <InfoLine label="Status" value={notary?.status || "Pending"} />
          <InfoLine label="Verification" value={notary?.verification || "In Review"} />
          <InfoLine label="Coverage Area" value={notary?.commission?.coverageAreas || "Not provided"} />
          <InfoLine label="Last Active" value={notary?.lastActiveAt || "Not available"} />
        </div>
      </div>
    </Card>

    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Card className="p-7">
        <h2 className="text-2xl font-semibold">Profile Completion</h2>
        <div className="mt-6 flex items-center justify-between">
          <p className="font-bold text-[var(--color-brand-primary)]">
            {formatCompletion(notary?.requiredDocuments)}% Complete
          </p>
          <p className="text-sm text-slate-600">
            {countPendingDocuments(notary?.requiredDocuments)} items pending
          </p>
        </div>
        <div className="mt-3"><ProgressBar value={formatCompletion(notary?.requiredDocuments)} /></div>
        <p className="mt-3 text-sm text-slate-600">
          Completion reflects the live notary document statuses currently available in the backend.
        </p>
      </Card>
      <Card className="p-7">
        <h2 className="text-2xl font-semibold">Completion Checklist</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm uppercase text-slate-500">Profile Fields</p>
            {[
              ["Profile Photo", Boolean(notary?.avatar)],
              ["Commission Number", Boolean(notary?.commission?.number)],
              ["Commission State", Boolean(notary?.commission?.state)],
              ["Payment Method", Boolean(notary?.bankInfo?.bankName || notary?.bankInfo?.accountNumber)],
            ].map(([label, complete]) => (
              <div key={label} className="flex items-center justify-between border-b border-slate-100 py-3">
                <span>{label}</span>
                <span className={complete ? "text-emerald-600" : "h-3 w-3 rounded-full bg-amber-400"}>
                  {complete ? <CheckCircle2 className="h-5 w-5" /> : null}
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-4 text-sm uppercase text-slate-500">Required Documents</p>
            {(notary?.requiredDocuments?.length ? notary.requiredDocuments : []).map((doc) => {
              const complete = ["Verified", "Approved", "Completed"].includes(doc?.status);
              return (
                <div key={doc.id || doc.title} className="flex items-center justify-between border-b border-slate-100 py-3">
                  <span>{doc.title || "Untitled document"}</span>
                  <span className={complete ? "text-emerald-600" : "h-3 w-3 rounded-full bg-amber-400"}>
                    {complete ? <CheckCircle2 className="h-5 w-5" /> : null}
                  </span>
                </div>
              );
            })}
            {!notary?.requiredDocuments?.length ? (
              <p className="py-3 text-sm text-slate-500">No required documents are on file yet.</p>
            ) : null}
          </div>
        </div>
      </Card>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-7">
        <SectionTitle icon={BriefcaseIcon} title="Notary Information" />
        {[
          ["Commission Number", notary?.commission?.number || "Not provided"],
          ["Commission State", notary?.commission?.state || "Not provided"],
          ["Expiration Date", notary?.commission?.expirationDate || "Not provided"],
          ["Travel Radius", notary?.commission?.travelRadius || "Not provided"],
          ["Coverage Areas", notary?.commission?.coverageAreas || "Not provided"],
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
          <div className="flex justify-between"><span className="text-slate-600">RON Approval</span><strong className={notary?.verification === "Verified" ? "text-emerald-600" : ""}>{notary?.verification || "Pending"}</strong></div>
          <div className="flex justify-between"><span className="text-slate-600">Background Check Date</span><strong>{notary?.backgroundCheckDate || "Not provided"}</strong></div>
          <div>
            <p className="text-slate-600">Specialties</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {notary?.specialties?.length ? (
                notary.specialties.map((tag) => <StatusBadge key={tag} status={tag} />)
              ) : (
                <span className="text-sm text-slate-500">No specialties on record.</span>
              )}
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-7">
        <SectionTitle icon={MapPin} title="Address Information" />
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoLine label="Address Line 1" value={notary?.address?.line1 || "Not provided"} />
          <InfoLine label="City" value={notary?.address?.city || "Not provided"} />
          <InfoLine label="State" value={notary?.address?.state || "Not provided"} />
          <InfoLine label="ZIP Code" value={notary?.address?.zip || "Not provided"} />
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
      {documents.length ? documents.map((doc, index) => (
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
                  {doc.url || doc.downloadUrl ? (
                    <Button
                      variant="secondary"
                      onClick={() => window.open(doc.downloadUrl || doc.url, "_blank", "noopener")}
                    >
                      View
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled>
                      View
                    </Button>
                  )}
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
      )) : (
        <Card className="p-8 text-center text-slate-500 lg:col-span-2 xl:col-span-3">
          No notary documents found for this user.
        </Card>
      )}
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

  const handleApproveUser = async () => {
    if (!id) return;
    try {
      await dispatch(updateUserStatus({ userId: id, status: "Active" })).unwrap();
      toast.success(`${isNotary ? "Notary" : "Client"} approved.`);
    } catch (error) {
      toast.error(error || "Unable to approve user.");
    }
  };

  const handleSuspendUser = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      `Suspend ${currentUser?.name || "this user"}? They will not be able to sign in.`
    );
    if (!confirmed) return;
    try {
      await dispatch(suspendUser(id)).unwrap();
      toast.success("User suspended.");
    } catch (error) {
      toast.error(error || "Unable to suspend user.");
    }
  };

  const handleReactivateUser = async () => {
    if (!id) return;
    try {
      await dispatch(activateUser(id)).unwrap();
      toast.success("User reactivated.");
    } catch (error) {
      toast.error(error || "Unable to reactivate user.");
    }
  };

  const handleRequestMissingDocs = async () => {
    if (!id) return;
    const documents = currentUser?.requiredDocuments || [];
    const missingDocs = documents.filter((doc) => doc?.status === "Missing");
    if (missingDocs.length === 0) {
      toast.info("All documents are already uploaded for this user.");
      return;
    }
    try {
      // Re-flag Missing docs to send the user a fresh review request via audit log.
      await Promise.all(
        missingDocs.map((doc) =>
          dispatch(
            updateUserDocumentStatus({
              userId: id,
              documentId: doc.id,
              status: "Pending",
            })
          ).unwrap()
        )
      );
      toast.success(`Requested ${missingDocs.length} missing document(s).`);
    } catch (error) {
      toast.error(error || "Unable to request missing documents.");
    }
  };

  const handleSendMessage = () => {
    if (!currentUser?.email) {
      toast.error("This user has no email on file.");
      return;
    }
    const subject = encodeURIComponent(
      `${isNotary ? "Notary" : "Client"} account — message from Notarix admin`
    );
    const body = encodeURIComponent(
      `Hello ${currentUser.name || ""},\n\n`
    );
    window.location.href = `mailto:${currentUser.email}?subject=${subject}&body=${body}`;
  };

  const handleEditUser = () => {
    if (!id) return;
    // Profile editing surface is not built yet; route the admin back to the
    // user-management list so they can use existing filters/actions there.
    toast.info(
      "Inline profile editing opens in a future release. Use the documents tab to review records."
    );
    window.location.href = `/users/${type}/${id}/documents`;
  };

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">{isNotary ? "Notary Overview" : isDocuments ? "Client Documents" : "Client Details"}</h1>
          {isNotary ? <p className="mt-1 text-slate-600">View notary profile, credentials, and status</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleEditUser}>
            {isNotary ? "Edit Notary" : "Edit Client"}
          </Button>
          {currentUser?.status === "Suspended" ? (
            <Button variant="secondary" onClick={handleReactivateUser}>
              Reactivate
            </Button>
          ) : (
            <Button variant="danger" onClick={handleSuspendUser}>
              Suspend
            </Button>
          )}
          <Button variant="secondary" onClick={handleApproveUser}>
            Approve
          </Button>
          {isNotary ? <Button onClick={handleSendMessage}>Send Message</Button> : null}
          {!isNotary ? <Button onClick={handleSendMessage}>Send Message</Button> : null}
        </div>
      </div>

      {!isNotary ? (
        <Card className="mb-7 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar
                name={client?.name || "Client User"}
                size="lg"
                src={client?.avatar || undefined}
                tone={client?.avatarTone || "bg-slate-200 text-slate-700"}
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{client?.name || "Client User"}</h2>
                  <StatusBadge status={client?.status || "Pending"} />
                </div>
                <p className="mt-1 text-slate-500">
                  {activeUserStatus === "loading" ? "Loading profile..." : `Code: ${id || "Not available"}`}
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-slate-600">Profile Completion</span>
                <strong className="text-2xl text-[var(--color-brand-primary)]">{formatCompletion(client?.requiredDocuments)}%</strong>
              </div>
              <ProgressBar value={formatCompletion(client?.requiredDocuments)} />
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
        <ClientOverview
          client={client}
          onApprove={handleApproveUser}
          onSuspend={handleSuspendUser}
          onReactivate={handleReactivateUser}
          onRequestMissing={handleRequestMissingDocs}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
