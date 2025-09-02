"use client"

import { useState } from "react"
import { Plus, X, Star, ExternalLink, Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ToolComparison() {
  const [selectedTools, setSelectedTools] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const availableTools = [
    {
      id: 1,
      name: "ChatGPT",
      category: "Chatbot",
      rating: 4.8,
      pricing: "Freemium",
      features: ["Natural Language", "Code Generation", "Multiple Languages", "API Access"],
      pros: ["Excellent conversation quality", "Wide knowledge base", "Regular updates"],
      cons: ["Can be expensive for heavy use", "Sometimes generates incorrect info"],
    },
    {
      id: 2,
      name: "Claude",
      category: "Chatbot",
      rating: 4.7,
      pricing: "Freemium",
      features: ["Natural Language", "Document Analysis", "Code Review", "Safety Focused"],
      pros: ["Strong reasoning abilities", "Good at analysis", "Safety-focused"],
      cons: ["Smaller knowledge cutoff", "Limited availability"],
    },
    {
      id: 3,
      name: "Midjourney",
      category: "Image Generation",
      rating: 4.9,
      pricing: "Paid",
      features: ["Text-to-Image", "Style Control", "High Quality", "Community"],
      pros: ["Exceptional image quality", "Great artistic styles", "Active community"],
      cons: ["Discord-only interface", "No free tier", "Limited control"],
    },
  ]

  const addTool = (tool: any) => {
    if (selectedTools.length < 3 && !selectedTools.find((t) => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool])
    }
  }

  const removeTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter((t) => t.id !== toolId))
  }

  const comparisonFeatures = [
    "Natural Language",
    "Code Generation",
    "API Access",
    "Text-to-Image",
    "Style Control",
    "Document Analysis",
    "Code Review",
    "Safety Focused",
    "High Quality",
    "Community",
    "Multiple Languages",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Compare Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tool Comparison</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tool Selection */}
          {selectedTools.length < 3 && (
            <div>
              <h3 className="font-semibold mb-3">Add Tools to Compare (Max 3)</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {availableTools
                  .filter((tool) => !selectedTools.find((t) => t.id === tool.id))
                  .map((tool) => (
                    <Card
                      key={tool.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addTool(tool)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{tool.name}</h4>
                          <Badge variant="outline">{tool.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{tool.rating}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {tool.pricing}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Comparison ({selectedTools.length} tools)</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedTools([])}>
                  Clear All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Feature</th>
                      {selectedTools.map((tool) => (
                        <th key={tool.id} className="text-center p-4 min-w-[200px]">
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-medium">{tool.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeTool(tool.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Badge variant="outline">{tool.category}</Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Basic Info */}
                    <tr className="border-b">
                      <td className="p-4 font-medium">Rating</td>
                      {selectedTools.map((tool) => (
                        <td key={tool.id} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{tool.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Pricing</td>
                      {selectedTools.map((tool) => (
                        <td key={tool.id} className="p-4 text-center">
                          <Badge variant="secondary">{tool.pricing}</Badge>
                        </td>
                      ))}
                    </tr>

                    {/* Features Comparison */}
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature} className="border-b">
                        <td className="p-4 font-medium">{feature}</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="p-4 text-center">
                            {tool.features.includes(feature) ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Pros */}
                    <tr className="border-b">
                      <td className="p-4 font-medium">Pros</td>
                      {selectedTools.map((tool) => (
                        <td key={tool.id} className="p-4">
                          <ul className="text-sm space-y-1">
                            {tool.pros.map((pro: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Cons */}
                    <tr className="border-b">
                      <td className="p-4 font-medium">Cons</td>
                      {selectedTools.map((tool) => (
                        <td key={tool.id} className="p-4">
                          <ul className="text-sm space-y-1">
                            {tool.cons.map((con: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Actions */}
                    <tr>
                      <td className="p-4 font-medium">Actions</td>
                      {selectedTools.map((tool) => (
                        <td key={tool.id} className="p-4 text-center">
                          <Button size="sm" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Tool
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
