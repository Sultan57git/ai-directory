import { TrendingUp, Users, Star, Zap } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: TrendingUp,
      value: "10,000+",
      label: "AI Tools Listed",
      description: "Curated collection",
    },
    {
      icon: Users,
      value: "500K+",
      label: "Monthly Users",
      description: "Growing community",
    },
    {
      icon: Star,
      value: "50K+",
      label: "Reviews & Ratings",
      description: "Verified feedback",
    },
    {
      icon: Zap,
      value: "100+",
      label: "Categories",
      description: "Organized by use case",
    },
  ]

  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground lg:text-4xl">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
