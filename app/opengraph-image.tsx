// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "BrowseAI Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, opacity: 0.9 }}>browseai.online</div>
        <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1.05 }}>
          BrowseAI Online
        </div>
        <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9 }}>
          Discover AI tools by category.
        </div>
      </div>
    ),
    { ...size }
  );
}
