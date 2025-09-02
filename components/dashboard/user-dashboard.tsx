"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Star, Plus, Settings, LogOut } from "lucide-react"

export function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")

    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    setUser({
      email: userEmail,
      name: userName || "User",
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const savedTools = [
    { id: 1, name: "ChatGPT", category: "Chatbot", rating: 4.8 },
    { id: 2, name: "Midjourney", category: "Image Generation", rating: 4.9 },
    { id: 3, name: "GitHub Copilot", category: "Code Assistant", rating: 4.7 },
  ]

  const recentActivity = [
    { action: "Bookmarked", tool: "Notion AI", date: "2 hours ago" },
    { action: "Reviewed", tool: "Jasper AI", date: "1 day ago" },
    { action: "Submitted", tool: "My AI Tool", date: "3 days ago" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Manage your AI tools and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Tools</CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+1 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tools Submitted</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">1 pending review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Saved Tools */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Saved Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedTools.map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{tool.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{tool.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Visit
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Saved Tools
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p>
                        <span className="font-medium">{activity.action}</span> {activity.tool}
                      </p>
                      <p className="text-muted-foreground text-xs">{activity.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Tool
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Browse Tools
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
