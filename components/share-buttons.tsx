import Link from "next/link";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, label: "Twitter/X" },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: "Facebook" },
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: "LinkedIn" },
  ];

  return (
    <div className="flex gap-3">
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          target="_blank"
          className="text-sm underline underline-offset-4"
        >
          Share on {l.label}
        </Link>
      ))}
    </div>
  );
}
