"use client";

import { useState } from "react";
import { Search, Sparkles, Filter, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type FiltersState = {
  category: string;
  pricing: string;
  rating: number[];      // Slider expects number[]
  features: string[];
};

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: "any",
    pricing: "any",
    rating: [4],
    features: [],
  });

  const aiSuggestions: string[] = [
    "AI writing tools for marketing content",
    "Code completion tools like GitHub Copilot",
    "Image generators for social media",
    "Voice synthesis for podcasts",
    "Data analysis tools with AI insights",
  ];

  const popularFeatures: string[] = [
    "API Integration",
    "Real-time Processing",
    "Multi-language",
    "Cloud-based",
    "Open Source",
    "Enterprise Ready",
    "Mobile App",
    "Browser Extension",
  ];

  const handleFeatureToggle = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Describe what you need... AI will find the perfect tools"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 pl-12 pr-32 text-lg"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button size="lg" className="h-10 px-6">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Search
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      {searchQuery.length === 0 && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI-powered suggestions:
          </p>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-8 text-xs hover:bg-primary hover:text-primary-foreground bg-transparent"
                onClick={() => setSearchQuery(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Advanced Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value: string) => setFilters((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any category</SelectItem>
                    <SelectItem value="chatbots">Chatbots</SelectItem>
                    <SelectItem value="image">Image Generation</SelectItem>
                    <SelectItem value="code">Code Assistant</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pricing Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Pricing</label>
                <Select
                  value={filters.pricing}
                  onValueChange={(value: string) => setFilters((prev) => ({ ...prev, pricing: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any pricing</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Rating: {filters.rating[0]}.0+
                </label>
                <Slider
                  value={filters.rating}
                  onValueChange={(value: number[]) =>
                    setFilters((prev) => ({ ...prev, rating: value }))
                  }
                  max={5}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() =>
                    setFilters({ category: "any", pricing: "any", rating: [4], features: [] })
                  }
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Feature Tags */}
            <div>
              <label className="text-sm font-medium mb-3 block">Required Features</label>
              <div className="flex flex-wrap gap-2">
                {popularFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    {feature}
                    {filters.features.includes(feature) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.category !== "any" || filters.pricing !== "any" || filters.features.length > 0) && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== "any" && (
                    <Badge variant="secondary">
                      Category: {filters.category}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => setFilters((prev) => ({ ...prev, category: "any" }))}
                      />
                    </Badge>
                  )}
                  {filters.pricing !== "any" && (
                    <Badge variant="secondary">
                      Pricing: {filters.pricing}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => setFilters((prev) => ({ ...prev, pricing: "any" }))}
                      />
                    </Badge>
                  )}
                  {filters.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleFeatureToggle(feature)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
