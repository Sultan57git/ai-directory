"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, ImageIcon, MessageSquare, Code, Video, Music, FileText, BarChart3, Palette, Mic } from "lucide-react"

export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Tools", icon: Brain, count: 10000 },
    { id: "chatbots", name: "Chatbots", icon: MessageSquare, count: 1250 },
    { id: "image", name: "Image Generation", icon: ImageIcon, count: 890 },
    { id: "code", name: "Code Assistant", icon: Code, count: 650 },
    { id: "writing", name: "Writing", icon: FileText, count: 780 },
    { id: "video", name: "Video", icon: Video, count: 420 },
    { id: "audio", name: "Audio", icon: Mic, count: 340 },
    { id: "design", name: "Design", icon: Palette, count: 560 },
    { id: "analytics", name: "Analytics", icon: BarChart3, count: 290 },
    { id: "music", name: "Music", icon: Music, count: 180 },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Browse by Category</h2>
          <p className="text-muted-foreground text-pretty">Find the perfect AI tool for your specific needs</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveCategory(category.id)}
              className="h-auto flex-col gap-2 p-4 text-center"
            >
              <category.icon className="h-6 w-6" />
              <div>
                <div className="font-medium">{category.name}</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {category.count.toLocaleString()}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
