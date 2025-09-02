"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Submissions",
      href: "/admin/submissions",
      icon: FileText,
    },
    {
      name: "Tools",
      href: "/admin/tools",
      icon: Database,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Moderation",
      href: "/admin/moderation",
      icon: Shield,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("bg-card border-r transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          {!collapsed && <span className="font-semibold text-lg">Directory Admin</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="absolute bottom-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
