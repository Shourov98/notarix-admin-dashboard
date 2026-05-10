export default function NotaryNotificationsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Notifications</h2>
        <p className="text-zinc-500 font-medium text-xs mt-1">Configure alerts for new assignments and messages.</p>
      </div>
      <div className="p-8">
        <p className="text-sm text-zinc-500">Notification preferences content goes here.</p>
      </div>
    </div>
  );
}
