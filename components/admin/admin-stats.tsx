import { TrendingUp, Users, FileText, CheckCircle, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminStats() {
  const stats = [
    {
      title: "Total Tools",
      value: "10,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Active Users",
      value: "524,891",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Pending Submissions",
      value: "23",
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
    },
    {
      title: "Approved Today",
      value: "12",
      change: "+15%",
      changeType: "positive" as const,
      icon: CheckCircle,
    },
    {
      title: "Rejected Today",
      value: "3",
      change: "-20%",
      changeType: "negative" as const,
      icon: XCircle,
    },
    {
      title: "Total Submissions",
      value: "1,847",
      change: "+6%",
      changeType: "positive" as const,
      icon: FileText,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
