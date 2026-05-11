import {
  CameraOff,
  CheckCircle2,
  FileText,
  MessageSquare,
  Mic,
  MonitorUp,
  Send,
  UserPlus,
  Video,
} from "lucide-react";
import { Avatar, Button, Card, PageHeader, ProgressBar, StatusBadge } from "../components/ui";

const RonOrderPage = () => {
  return (
    <div>
      <PageHeader
        title="RON Order Details"
        description="Order updated 2 mins ago"
        actions={
          <>
            <Button variant="secondary" icon={MessageSquare}>Open Chat</Button>
            <Button variant="secondary" icon={UserPlus}>Change Notary</Button>
            <Button icon={Video}>Start Video Session</Button>
          </>
        }
      />
      <div className="-mt-5 mb-8"><StatusBadge status="Ready for Session" className="bg-emerald-100 text-emerald-700" /></div>

      <Card className="mb-7 grid gap-5 p-6 md:grid-cols-4">
        {[
          ["Order ID", "#RON-260427"],
          ["Service Type", "Remote Online Notarization"],
          ["Date", "Apr 28, 2026"],
          ["Time", "2:00 PM EST"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-2 font-bold">{value}</p>
          </div>
        ))}
      </Card>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="space-y-7">
          <Card className="overflow-hidden bg-[#081126] p-4 text-white">
            <div className="flex gap-2">
              <StatusBadge status="Notary: Robert Vance" className="bg-slate-950 text-white" />
              <StatusBadge status="Borrower: Sarah Jenkins Joined" className="bg-slate-950 text-white" />
            </div>
            <div className="grid min-h-[470px] place-items-center text-center">
              <div>
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-900 text-blue-200">
                  <CameraOff className="h-9 w-9" />
                </span>
                <p className="mt-5 text-xl font-bold">Waiting for participants...</p>
                <p className="text-sm text-slate-400">Video stream will begin when the session starts</p>
              </div>
            </div>
            <div className="mx-auto mb-4 flex w-max items-center gap-3 rounded-xl bg-slate-950 px-5 py-3">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-800" aria-label="Microphone"><Mic className="h-5 w-5" /></button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-800" aria-label="Camera"><Video className="h-5 w-5" /></button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-800" aria-label="Screen"><MonitorUp className="h-5 w-5" /></button>
              <Button variant="dangerSolid" size="sm">END</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-[var(--color-brand-primary)]">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Signing Workspace</h2>
                  <p className="text-sm text-slate-500">Loan_Agreement_v2.pdf</p>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <div className="mb-2 flex justify-between text-sm font-bold text-[var(--color-brand-primary)]">
                  <span />
                  <span>45% Complete</span>
                </div>
                <ProgressBar value={45} />
              </div>
            </div>
            <div className="grid min-h-[760px] place-items-center rounded-lg border border-dashed border-[var(--color-border)] bg-slate-50 p-8">
              <div className="relative h-[640px] w-full max-w-[560px] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.12)]">
                <div className="absolute left-10 right-10 top-16 space-y-4">
                  <span className="block h-4 w-72 rounded bg-slate-100" />
                  <span className="block h-3 w-full rounded bg-slate-100" />
                  <span className="block h-3 w-5/6 rounded bg-slate-100" />
                  <span className="block h-3 w-3/4 rounded bg-slate-100" />
                </div>
                <div className="absolute bottom-16 left-10 right-10 grid grid-cols-2 gap-10">
                  <div>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-[var(--color-brand-primary)]">SIGN HERE</span>
                    <div className="mt-8 h-px bg-blue-200" />
                  </div>
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="text-lg font-semibold">10/28/2024</p>
                    <div className="mt-3 h-px bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-semibold">Active Participants</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {["Robert Vance Notary Public", "Sarah Jenkins Borrower", "Marcus Wright Witness 1"].map((item, index) => (
                <div key={item} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <Avatar name={item} />
                  <p className="mt-3 font-bold">{item.split(" ").slice(0, 2).join(" ")}</p>
                  <p className="text-sm text-slate-500">{item.split(" ").slice(2).join(" ")}</p>
                  <p className={index < 2 ? "mt-2 text-xs font-bold text-emerald-600" : "mt-2 text-xs font-bold text-slate-400"}>
                    {index < 2 ? "JOINED" : "WAITING..."}
                  </p>
                </div>
              ))}
              <button type="button" className="rounded-lg border border-dashed border-[var(--color-border)] p-4 font-bold text-slate-500">
                Invite Participant
              </button>
            </div>
          </Card>
        </div>

        <aside className="space-y-7">
          <Card className="p-5">
            <h2 className="mb-5 text-xl font-semibold">Identity Verification</h2>
            {["ID Uploaded", "Face Match", "KBA Questions"].map((item, index) => (
              <div key={item} className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <span className="flex items-center gap-3 font-semibold">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" /> {item}
                </span>
                <span className="text-sm font-bold text-[var(--color-brand-primary)]">{index === 0 ? "VIEW" : "VERIFIED"}</span>
              </div>
            ))}
            <div className="mt-4 h-28 rounded-lg bg-slate-200" />
          </Card>
          <Card className="overflow-hidden">
            <div className="border-b border-[var(--color-border)] p-5">
              <h2 className="text-xl font-semibold">Live Session Chat</h2>
            </div>
            <div className="space-y-4 p-5">
              <p className="rounded-lg bg-[#f0eefb] p-4">Hello Sarah, I have verified your identity documents. We are ready to begin the signing portion.</p>
              <StatusBadge status="System: Session Recorded For Compliance" />
              <div className="rounded-lg border border-slate-200 p-4 font-semibold">Instructions.pdf <span className="block text-sm font-normal text-slate-500">1.2 MB</span></div>
              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <input className="h-11 flex-1" placeholder="Type a message..." />
                <Button className="w-11 px-0" aria-label="Send"><Send className="h-5 w-5" /></Button>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="mb-5 text-xl font-semibold">Session Audit Trail</h2>
            {["Order Created", "ID Verified", "Session Started", "Current Step: Signing Workspace"].map((item) => (
              <div key={item} className="mb-5 flex gap-3 last:mb-0">
                <span className="mt-1 h-3 w-3 rounded-full bg-[var(--color-brand-primary)]" />
                <div>
                  <p className="font-bold">{item}</p>
                  <p className="text-sm text-slate-500">Apr 28, 2026 • 01:45 PM</p>
                </div>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default RonOrderPage;
