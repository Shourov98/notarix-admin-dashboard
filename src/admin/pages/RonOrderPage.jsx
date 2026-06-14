import { VideoOff } from "lucide-react";
import { Card, PageHeader } from "../components/ui";

const RonOrderPage = () => {
  return (
    <div>
      <PageHeader
        title="RON Session"
        description="This page no longer renders sample session participants or mock signing data."
      />
      <Card className="grid min-h-[420px] place-items-center p-10 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
            <VideoOff className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Live RON session view not connected</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            The old version of this route displayed mock participants and placeholder signing activity.
            It now stays neutral until a real session experience is connected to live backend data.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RonOrderPage;
