"use client"
import { Sparkles, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdvancedSearch } from "@/components/advanced-search"
import { ToolComparison } from "@/components/tool-comparison"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            Discover 10,000+ AI Tools
          </Badge>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance lg:text-6xl">
            The Ultimate{" "}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">AI Directory</span>{" "}
            for Modern Innovators
          </h1>

          {/* Subheading */}
          <p className="mb-8 text-lg text-muted-foreground text-pretty lg:text-xl">
            Discover, compare, and integrate the world's most powerful AI tools. From productivity boosters to creative
            companions, find your perfect AI match.
          </p>

          {/* Advanced Search Component */}
          <div className="mx-auto mb-8 max-w-4xl">
            <AdvancedSearch />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base">
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore Top Tools
            </Button>
            <ToolComparison />
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
              <Zap className="mr-2 h-5 w-5" />
              Submit Your Tool
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
