import { Download, Paperclip, Search, Send, Smile, Type } from "lucide-react";
import { Avatar, Button, Card, StatusBadge } from "../components/ui";
import { messages } from "../data/notarixData";

const MessagesPage = () => {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] gap-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="border-r border-[var(--color-border)] bg-[#f8f7ff] p-6">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input className="h-12 w-full pl-12" placeholder="Search by name or Order ID" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Clients", "Notaries", "Unread"].map((item) => (
            <button key={item} type="button" className={`rounded-full px-4 py-1.5 text-sm font-semibold ${item === "All" ? "bg-[var(--color-brand-primary)] text-white" : "bg-[#e4e2ef] text-slate-600"}`}>{item}</button>
          ))}
        </div>
        <div className="mt-7 space-y-1">
          {messages.map((message) => (
            <button key={message.name} type="button" className={`flex w-full items-center gap-4 rounded-lg p-4 text-left ${message.active ? "border-l-4 border-[var(--color-brand-primary)] bg-[#efedfb]" : ""}`}>
              <Avatar name={message.name} tone={message.role === "NOTARY" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-bold">{message.name}</p>
                  <span className="text-xs text-slate-500">{message.time}</span>
                </div>
                <p className="truncate text-sm text-slate-500"><StatusBadge status={message.role} /> {message.preview}</p>
              </div>
              {message.unread ? <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-brand-primary)] text-xs font-bold text-white">{message.unread}</span> : null}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-7 py-4">
          <div className="flex items-center gap-4">
            <Avatar name="Sarah Jenkins" />
            <div>
              <p className="font-bold">Sarah Jenkins</p>
              <p className="text-sm text-emerald-600">Client · Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm">View Order #NTX-90124</Button>
            <span className="text-xl text-slate-500">⋮</span>
          </div>
        </div>
        <div className="notarix-scrollbar flex-1 overflow-y-auto p-7">
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 text-sm font-bold">Sarah Jenkins <span className="ml-3 font-normal text-slate-500">10:30 AM</span></p>
            <p className="rounded-lg border border-[var(--color-border)] bg-[#e8e6f5] p-5 text-lg">
              Hello! I'm having trouble with the document upload for the power of attorney form. Does it need to be a PDF or will a high-res JPG work?
            </p>
          </div>
          <div className="mb-6 ml-auto max-w-3xl">
            <p className="mb-2 text-right text-sm font-bold text-[var(--color-brand-primary)]">Admin Support <span className="mr-3 font-normal text-slate-500">10:32 AM</span></p>
            <p className="rounded-lg bg-[var(--color-brand-primary)] p-5 text-lg text-white">
              Hi Sarah! A high-res JPG is perfectly fine as long as all four corners of the document are visible and the text is legible.
            </p>
          </div>
          <div className="mb-6 max-w-3xl">
            <p className="mb-2 text-sm font-bold">Sarah Jenkins <span className="ml-3 font-normal text-slate-500">10:45 AM</span></p>
            <div className="rounded-lg border border-[var(--color-border)] bg-[#e8e6f5] p-5 text-lg">
              Great, thank you. I've uploaded the ID front here. Can you please verify if this quality is sufficient for the legal seal requirements?
              <div className="mt-5 flex items-center justify-between rounded-lg bg-white p-4">
                <div className="flex items-center gap-4">
                  <span className="h-12 w-12 rounded bg-slate-200" />
                  <div>
                    <p className="font-bold">ID_Front_Scan.jpg</p>
                    <p className="text-sm text-slate-500">2.4 MB · Image</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-[var(--color-brand-primary)]" />
              </div>
            </div>
          </div>
          <p className="text-sm italic text-slate-500">••• Sarah is typing...</p>
        </div>

        <div className="border-t border-[var(--color-border)] p-7">
          <Card className="p-5">
            <textarea className="min-h-[96px] w-full border-0 p-0 text-base focus:ring-0" placeholder="Type your message..." />
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-5 text-slate-600">
                <Paperclip className="h-5 w-5" />
                <Smile className="h-5 w-5" />
                <Type className="h-5 w-5" />
              </div>
              <Button icon={Send}>Send Message</Button>
            </div>
          </Card>
          <p className="mt-4 text-center text-sm text-slate-500">Messages are encrypted and legally archived for audit purposes.</p>
        </div>
      </section>
    </div>
  );
};

export default MessagesPage;
