import { ExternalLink, Video } from "lucide-react";
import { Card, PageHeader } from "../components/ui";

const RonOrderPage = () => {
  return (
    <div>
      <PageHeader
        title="RON Session"
        description="Remote Online Notarization sessions are hosted on our partner platform, BlueNotary."
      />
      <Card className="grid min-h-[420px] place-items-center p-10 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-[#1a4fdb]">
            <Video className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Open the live RON session on BlueNotary</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            RON video sessions are no longer hosted inside this admin dashboard. Sign in to BlueNotary
            to monitor and join the secure video room for an order in progress.
          </p>
          <a
            href="https://app.bluenotary.us/login"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#1a4fdb] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#1541b8] active:scale-95"
          >
            <ExternalLink className="h-5 w-5" />
            Continue on BlueNotary
          </a>
        </div>
      </Card>
    </div>
  );
};

export default RonOrderPage;
