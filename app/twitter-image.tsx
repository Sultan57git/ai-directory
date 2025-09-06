// app/twitter-image.tsx
import OGImage, { alt, size, contentType } from "./opengraph-image";

// 👇 must be a literal here (Edge or "nodejs")
export const runtime = "edge";

export { alt, size, contentType };
export default OGImage;
