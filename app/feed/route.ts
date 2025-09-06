// app/feed/route.ts
import { NextResponse } from "next/server";
import { TOOLS } from "@/lib/tools";

export async function GET() {
  const site = "https://browseai.online";
  const items = TOOLS.slice(0, 50)
    .map(t => `
      <item>
        <title><![CDATA[${t.name}]]></title>
        <link>${t.url}</link>
        <guid isPermaLink="false">${site}/tools/${t.id}</guid>
        <description><![CDATA[${t.description}]]></description>
      </item>
    `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>BrowseAI Online - New Tools</title>
      <link>${site}</link>
      <description>Latest AI tools indexed by BrowseAI Online</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
