"use client"

import { useState } from "react"
import { Star, ExternalLink, Bookmark, Filter, SortAsc, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ToolsGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [filterBy, setFilterBy] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (toolId: number) => {
    setFavorites((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const tools = [
    {
      id: 5,
      name: "Notion AI",
      description: "AI-powered writing assistant integrated into your Notion workspace.",
      category: "Writing",
      rating: 4.5,
      reviews: 3400,
      pricing: "Freemium",
      image: "/notion-ai-workspace.png",
      isNew: false,
      isTrending: true,
    },
    {
      id: 6,
      name: "Runway ML",
      description: "Creative AI tools for video editing, image generation, and content creation.",
      category: "Video",
      rating: 4.7,
      reviews: 2100,
      pricing: "Freemium",
      image: "/runway-ml-video-editing.png",
      isNew: true,
      isTrending: false,
    },
    {
      id: 7,
      name: "Stable Diffusion",
      description: "Open-source AI model for generating images from text descriptions.",
      category: "Image Generation",
      rating: 4.6,
      reviews: 5600,
      pricing: "Free",
      image: "/stable-diffusion-ai-art.png",
      isNew: false,
      isTrending: true,
    },
    {
      id: 8,
      name: "Grammarly",
      description: "AI-powered writing assistant for grammar, spelling, and style improvements.",
      category: "Writing",
      rating: 4.4,
      reviews: 18900,
      pricing: "Freemium",
      image: "/grammarly-writing-interface.png",
      isNew: false,
      isTrending: false,
    },
    {
      id: 9,
      name: "Murf AI",
      description: "AI voice generator for creating realistic voiceovers and speech synthesis.",
      category: "Audio",
      rating: 4.3,
      reviews: 1800,
      pricing: "Paid",
      image: "/murf-ai-voice-generation.png",
      isNew: true,
      isTrending: true,
    },
    {
      id: 10,
      name: "Figma AI",
      description: "AI-powered design tools integrated into the Figma design platform.",
      category: "Design",
      rating: 4.8,
      reviews: 4200,
      pricing: "Freemium",
      image: "/figma-ai-design-interface.png",
      isNew: false,
      isTrending: false,
    },
  ]

  return (
    <section className="py-16 bg-muted/30" id="tools">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Explore All AI Tools</h2>
          <p className="text-muted-foreground text-pretty">
            Browse our complete collection of AI tools and find your next favorite
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="image">Image Generation</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SortAsc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.id} className="group overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={tool.image || "/placeholder.svg"}
                    alt={tool.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 flex gap-2">
                    <Badge className="bg-background/90 text-foreground">{tool.pricing}</Badge>
                    {tool.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                    {tool.isTrending && <Badge className="bg-orange-500 text-white">Trending</Badge>}
                  </div>
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => toggleFavorite(tool.id)}>
                      <Bookmark className={`h-4 w-4 ${favorites.includes(tool.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => toggleFavorite(tool.id)}>
                      <Heart className={`h-4 w-4 ${favorites.includes(tool.id) ? "fill-current text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {tool.category}
                  </Badge>
                </div>

                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{tool.description}</p>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tool.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({tool.reviews.toLocaleString()} reviews)</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex w-full gap-2">
                  <Button className="flex-1" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Tool
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            Load More Tools
          </Button>
        </div>
      </div>
    </section>
  )
}
