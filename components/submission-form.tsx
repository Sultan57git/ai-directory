"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export function SubmissionForm() {
  const [formData, setFormData] = useState({
    toolName: "",
    tagline: "",
    description: "",
    website: "",
    category: "",
    pricing: "",
    features: [""],
    tags: [],
    contactEmail: "",
    submitterName: "",
    logo: null,
    screenshots: [],
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Chatbots & Conversational AI",
    "Image Generation",
    "Video & Animation",
    "Audio & Music",
    "Writing & Content",
    "Code & Development",
    "Design & Creative",
    "Data & Analytics",
    "Productivity",
    "Marketing & Sales",
    "Education & Learning",
    "Healthcare & Medical",
    "Finance & Business",
    "Other",
  ]

  const pricingOptions = ["Free", "Freemium", "Paid", "One-time Purchase", "Enterprise"]

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)

    setIsSubmitting(false)
    // Redirect to success page or show success message
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="toolName">Tool Name *</Label>
              <Input
                id="toolName"
                value={formData.toolName}
                onChange={(e) => setFormData((prev) => ({ ...prev, toolName: e.target.value }))}
                placeholder="Enter your AI tool name"
                required
              />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="A brief, catchy description (max 100 characters)"
                maxLength={100}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">{formData.tagline.length}/100 characters</p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of your AI tool, its capabilities, and use cases"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Website URL *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                placeholder="https://your-tool.com"
                required
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pricing">Pricing Model *</Label>
              <Select
                value={formData.pricing}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, pricing: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  {pricingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Key Features *</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.features.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., machine learning, NLP)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <div>
              <Label>Logo *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Upload your tool's logo (PNG, JPG, SVG)</p>
                <p className="text-xs text-muted-foreground mb-4">Recommended: 512x512px, max 2MB</p>
                <Button type="button" variant="outline">
                  Choose File
                </Button>
              </div>
            </div>

            <div>
              <Label>Screenshots</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Upload screenshots of your tool in action</p>
                <p className="text-xs text-muted-foreground mb-4">PNG or JPG, max 5MB each, up to 5 images</p>
                <Button type="button" variant="outline">
                  Choose Files
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="submitterName">Your Name *</Label>
              <Input
                id="submitterName"
                value={formData.submitterName}
                onChange={(e) => setFormData((prev) => ({ ...prev, submitterName: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I confirm that I have the right to submit this tool and agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="updates" />
              <Label htmlFor="updates" className="text-sm leading-relaxed">
                I would like to receive updates about my submission and occasional newsletters
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Tool for Review"}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              Your submission will be reviewed within 2-3 business days
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
