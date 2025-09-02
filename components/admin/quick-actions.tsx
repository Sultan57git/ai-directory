import { Plus, FileText, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const actions = [
    {
      title: "Add New Tool",
      description: "Manually add a tool to the directory",
      icon: Plus,
      href: "/admin/tools/new",
    },
    {
      title: "Review Submissions",
      description: "Review pending tool submissions",
      icon: FileText,
      href: "/admin/submissions",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "System Settings",
      description: "Configure directory settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="w-full justify-start h-auto p-4 bg-transparent"
            asChild
          >
            <a href={action.href}>
              <div className="flex items-start gap-3">
                <action.icon className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
