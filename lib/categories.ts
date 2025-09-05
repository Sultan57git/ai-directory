// lib/categories.ts
export type Category = {
  slug: string;
  name: string;
  icon?: string;  // optional: if you want to show icons later
  count?: number; // optional: if you want to show number of tools/items
};

export const CATEGORIES: Category[] = [
  { slug: "chatbots", name: "Chatbots" },
  { slug: "image", name: "Image Generation" },
  { slug: "video", name: "Video" },
  { slug: "audio", name: "Audio / Voice" },
  { slug: "code", name: "Code Assist" },
  { slug: "writing", name: "Writing" },
  { slug: "marketing", name: "Marketing" },
  { slug: "productivity", name: "Productivity" },
  { slug: "data", name: "Data / Analytics" },
  { slug: "search", name: "Search" },
  { slug: "education", name: "Education" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "finance", name: "Finance" },
  { slug: "legal", name: "Legal" },
  { slug: "design", name: "Design / UI" },
  { slug: "devops", name: "DevOps" },
  { slug: "security", name: "Security" },
  { slug: "agents", name: "AI Agents" },
  { slug: "travel", name: "Travel" },
  { slug: "ecommerce", name: "E-commerce" },
  { slug: "gaming", name: "Gaming" },
  { slug: "hr", name: "HR / Hiring" },
  { slug: "sales", name: "Sales" },
  { slug: "other", name: "Other" }
];
