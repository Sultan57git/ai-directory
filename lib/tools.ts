// lib/tools.ts
export type Tool = {
  id: string;
  name: string;
  description: string;
  url: string;
  categories: string[];
};

export const TOOLS: Tool[] = [
  {
    id: "t1",
    name: "ChatGenius",
    description: "Conversational AI for customer support.",
    url: "https://example.com",
    categories: ["chatbots", "productivity"],
  },
  {
    id: "t2",
    name: "ImageCraft",
    description: "Generate images from text prompts.",
    url: "https://example.com",
    categories: ["image", "design"],
  },
  {
    id: "t3",
    name: "VideoMind",
    description: "AI-assisted video creation and editing.",
    url: "https://example.com",
    categories: ["video", "marketing"],
  },
  {
    id: "t4",
    name: "CodePilot",
    description: "Code completion and refactor suggestions.",
    url: "https://example.com",
    categories: ["code", "devops"],
  },
];
