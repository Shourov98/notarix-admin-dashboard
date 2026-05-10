import { User, Upload, Calendar, Search } from "lucide-react";

const activities = [
  { icon: User, title: "Notary assigned to #NY-90210", time: "15 minutes ago", bg: "bg-blue-50", color: "text-[#1a4fdb]" },
  { icon: Upload, title: "Document uploaded successfully", time: "2 hours ago", bg: "bg-emerald-50", color: "text-emerald-500" },
  { icon: Calendar, title: "Appointment rescheduled for Oct 26", time: "Yesterday", bg: "bg-amber-50", color: "text-amber-500" },
  { icon: Search, title: "Audit trail generated for Q3", time: "2 days ago", bg: "bg-zinc-50", color: "text-zinc-500" },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
      <h3 className="text-xl font-bold text-zinc-900 mb-8">Activity Feed</h3>
      
      <div className="space-y-8 relative">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-zinc-50 z-0"></div>
        
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-4 relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.bg}`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 mb-1">{activity.title}</p>
              <p className="text-xs text-zinc-400 font-medium">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
