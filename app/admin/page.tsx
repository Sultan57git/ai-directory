import { AdminStats } from "@/components/admin/admin-stats"
import { RecentSubmissions } from "@/components/admin/recent-submissions"
import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { QuickActions } from "@/components/admin/quick-actions"

export const metadata = {
  title: "Admin Dashboard | AI Directory",
  description: "Manage your AI directory with comprehensive admin tools.",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your AI directory.</p>
      </div>

      {/* Stats Overview */}
      <AdminStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Submissions */}
      <RecentSubmissions />
    </div>
  )
}
