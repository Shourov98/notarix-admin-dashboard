const orders = [
  { id: "#26NC4999", type: "Remote Notarization", status: "In Progress", name: "John Smith", date: "Apr 24, 26" },
  { id: "#26NC4999", type: "Document Signing", status: "Completed", name: "Sarah Connor", date: "Apr 25, 26" },
  { id: "#26NC4999", type: "Affidavit Verification", status: "Pending", name: "Not Assigned", date: "Apr 26, 26" },
];

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed": return "bg-emerald-50 text-emerald-600";
    case "In Progress": return "bg-blue-50 text-[#1a4fdb]";
    case "Pending": return "bg-amber-50 text-amber-600";
    default: return "bg-zinc-50 text-zinc-600";
  }
};

export default function RecentOrders() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-zinc-900">Recent Orders</h3>
        <button className="text-sm font-bold text-[#1a4fdb] hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-zinc-50">
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type</th>
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Borrower's Name</th>
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
              <th className="pb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {orders.map((order, i) => (
              <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                <td className="py-5 font-bold text-zinc-900 text-sm">{order.id}</td>
                <td className="py-5 text-sm text-zinc-600">{order.type}</td>
                <td className="py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyles(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-5 text-sm text-zinc-900 font-medium">{order.name}</td>
                <td className="py-5 text-sm text-zinc-500">{order.date}</td>
                <td className="py-5">
                  <button className="text-[10px] font-bold text-[#1a4fdb] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-[#1a4fdb] hover:text-white transition-all uppercase tracking-widest">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
