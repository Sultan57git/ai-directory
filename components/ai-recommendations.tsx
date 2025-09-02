"use client"

import { useState, useEffect } from "react"
import { Sparkles, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI recommendation generation
    const generateRecommendations = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setRecommendations([
        {
          id: 1,
          name: "Cursor AI",
          reason: "Based on your interest in code assistants",
          category: "Code Assistant",
          rating: 4.9,
          confidence: 95,
          trending: true,
          newUsers: 1200,
        },
        {
          id: 2,
          name: "Perplexity AI",
          reason: "Perfect for research and analysis tasks",
          category: "Research",
          rating: 4.7,
          confidence: 88,
          trending: false,
          newUsers: 800,
        },
        {
          id: 3,
          name: "RunwayML Gen-3",
          reason: "Matches your creative workflow needs",
          category: "Video Generation",
          rating: 4.8,
          confidence: 92,
          trending: true,
          newUsers: 2100,
        },
      ])
      setLoading(false)
    }

    generateRecommendations()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommendations
          <Badge variant="secondary" className="ml-auto">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((tool) => (
            <div key={tool.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{tool.name}</h3>
                    {tool.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tool.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {tool.newUsers}+ new users
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 mb-1">{tool.confidence}% match</div>
                  <div className="text-xs text-muted-foreground">⭐ {tool.rating}</div>
                </div>
              </div>
              <Button size="sm" className="w-full">
                Explore Tool
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            <Sparkles className="mr-2 h-4 w-4" />
            Get More Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
