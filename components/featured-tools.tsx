import { Star, ExternalLink, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedTools() {
  const featuredTools = [
    {
      id: 1,
      name: "ChatGPT",
      description: "Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.",
      category: "Chatbot",
      rating: 4.8,
      reviews: 12500,
      pricing: "Freemium",
      image: "/chatgpt-ai-interface.png",
      featured: true,
    },
    {
      id: 2,
      name: "Midjourney",
      description: "Create stunning, high-quality images from text descriptions using advanced AI.",
      category: "Image Generation",
      rating: 4.9,
      reviews: 8900,
      pricing: "Paid",
      image: "/midjourney-ai-art-generation.png",
      featured: true,
    },
    {
      id: 3,
      name: "GitHub Copilot",
      description: "AI-powered code completion and programming assistant for developers.",
      category: "Code Assistant",
      rating: 4.7,
      reviews: 15600,
      pricing: "Paid",
      image: "/github-copilot-coding-interface.png",
      featured: true,
    },
    {
      id: 4,
      name: "Jasper AI",
      description: "Professional AI writing assistant for marketing copy, blogs, and content creation.",
      category: "Writing",
      rating: 4.6,
      reviews: 6700,
      pricing: "Paid",
      image: "/jasper-ai-writing-interface.png",
      featured: true,
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance">Featured AI Tools</h2>
          <p className="text-muted-foreground text-pretty">
            Hand-picked tools that are making waves in the AI community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="group overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={tool.image || "/placeholder.svg"}
                    alt={tool.name}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute right-3 top-3">{tool.pricing}</Badge>
                  <Button size="icon" variant="secondary" className="absolute left-3 top-3 h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
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
      </div>
    </section>
  )
}
