import StatsOverview from "@/components/dashboard-client/StatsOverview";
import ActiveOrderCard from "@/components/dashboard-client/ActiveOrderCard";
import RecentOrders from "@/components/dashboard-client/RecentOrders";
import OrderDistribution from "@/components/dashboard-client/OrderDistribution";
import ActivityFeed from "@/components/dashboard-client/ActivityFeed";

export default function DashboardClientPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Overview</h1>
        <p className="text-zinc-500 font-medium">Track and manage your legal document notarizations.</p>
      </div>

      {/* Stats Cards */}
      <StatsOverview />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="xl:col-span-2 space-y-8">
          <ActiveOrderCard />
          <RecentOrders />
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-8">
          <OrderDistribution />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
