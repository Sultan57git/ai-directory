import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench, Bot, Repeat, FileText, Brain, Database, Github, Package,
  Gauge, FlaskConical, Rocket, DollarSign, Building2, Users,
  GraduationCap, Briefcase, CalendarDays, Newspaper, Cpu, Shield
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Directory • Preview",
  description: "Live preview of the 20-category AI Directory homepage",
};

type Cat = {
  key: string;
  name: string;
  desc: string;
  href: string;
  Icon: React.ComponentType<any>;
};

const CATEGORIES: Cat[] = [
  { key: "tool",        name: "AI Tools",              desc: "Write, design, code, create",         href: "/tools",        Icon: Wrench },
  { key: "agent",       name: "AI Agents",             desc: "Autonomous copilots & task bots",     href: "/agents",       Icon: Bot },
  { key: "workflow",    name: "Workflows",             desc: "Zapier / n8n / Make templates",       href: "/workflows",    Icon: Repeat },
  { key: "prompt",      name: "Prompts",               desc: "Ready-to-use prompt packs",           href: "/prompts",      Icon: FileText },
  { key: "model",       name: "Models",                desc: "LLM, vision, speech",                 href: "/models",       Icon: Brain },
  { key: "dataset",     name: "Datasets",              desc: "Training & evaluation data",          href: "/datasets",     Icon: Database },
  { key: "open_source", name: "Open Source",           desc: "Trending AI repos",                   href: "/open_source",  Icon: Github },
  { key: "library",     name: "Libraries",             desc: "SDKs & frameworks",                   href: "/library",      Icon: Package },
  { key: "benchmark",   name: "Benchmarks",            desc: "Compare accuracy & cost",             href: "/benchmarks",   Icon: Gauge },
  { key: "research",    name: "Research",              desc: "Latest papers & findings",            href: "/research",     Icon: FlaskConical },
  { key: "startup",     name: "Startups",              desc: "New AI companies",                    href: "/startups",     Icon: Rocket },
  { key: "investor",    name: "Investors",             desc: "VCs & funds in AI",                   href: "/investors",    Icon: DollarSign },
  { key: "company",     name: "Companies",             desc: "Established AI players",              href: "/companies",    Icon: Building2 },
  { key: "community",   name: "Communities",           desc: "Discords, forums, groups",            href: "/communities",  Icon: Users },
  { key: "learning",    name: "Education",             desc: "Courses & tutorials",                 href: "/learning",     Icon: GraduationCap },
  { key: "job",         name: "Jobs",                  desc: "Roles in AI/ML/DS",                   href: "/jobs",         Icon: Briefcase },
  { key: "event",       name: "Events",                desc: "Confs, meetups, hackathons",          href: "/events",       Icon: CalendarDays },
  { key: "news",        name: "News",                  desc: "Product launches & updates",          href: "/news",         Icon: Newspaper },
  { key: "hardware",    name: "Hardware",              desc: "GPUs, TPUs, servers",                 href: "/hardware",     Icon: Cpu },
  { key: "policy",      name: "Policy",                desc: "Regulation & compliance",             href: "/policy",       Icon: Shield },
];

const TRENDING_TOOLS = [
  { name: "Code Copilot X",    desc: "AI pair-programmer for TypeScript",  href: "#", logo: "/placeholder-logo.png", tags: ["Dev", "VS Code"] },
  { name: "WriteWise",         desc: "Long-form content assistant",        href: "#", logo: "/placeholder-logo.png", tags: ["Content", "SEO"] },
  { name: "DesignFlow",        desc: "UI mockups from wireframes",         href: "#", logo: "/placeholder-logo.png", tags: ["Design"] },
  { name: "SalesGenie",        desc: "Personalized outreach at scale",     href: "#", logo: "/placeholder-logo.png", tags: ["Sales", "Email"] },
  { name: "VoiceCraft",        desc: "Ultra-realistic voice cloning",      href: "#", logo: "/placeholder-logo.png", tags: ["Audio"] },
  { name: "DataLens",          desc: "Ask questions over your DB",         href: "#", logo: "/placeholder-logo.png", tags: ["BI", "SQL"] },
];

const HOT_JOBS = [
  { role: "ML Engineer (LLMs)", company: "Nova AI", location: "Remote", href: "#" },
  { role: "Research Scientist", company: "Quantum Labs", location: "Berlin", href: "#" },
  { role: "Data Engineer", company: "VectorWorks", location: "SF, CA", href: "#" },
  { role: "Prompt Engineer", company: "StoryForge", location: "Remote", href: "#" },
];

const EVENTS = [
  { name: "Global AI Summit", date: "Nov 15–17", location: "Dubai", href: "#" },
  { name: "LLM DevCon", date: "Dec 3–4", location: "NYC", href: "#" },
  { name: "Voice AI Expo", date: "Jan 20", location: "Online", href: "#" },
];

const INVESTORS = [
  { name: "Alpha Capital", focus: "Applied AI, Infra", href: "#" },
  { name: "Lightning Ventures", focus: "Dev tools, Agents", href: "#" },
  { name: "Orchid Fund", focus: "Healthcare AI", href: "#" },
];

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">AI <span className="text-muted-foreground">Directory</span></Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/tools" className="hover:underline">Tools</Link>
            <Link href="/agents" className="hover:underline">Agents</Link>
            <Link href="/jobs" className="hover:underline">Jobs</Link>
            <Link href="/news" className="hover:underline">News</Link>
            <Link href="/events" className="hover:underline">Events</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm hover:underline">Login</Link>
            <Link href="/signup" className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
            Auto-updated • 20 Categories • Free to Explore
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight">
            The Ultimate AI Directory for <span className="text-muted-foreground">Modern Innovators</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover tools, agents, datasets, jobs, investors, events, and more—curated and enriched automatically.
          </p>

          <div className="mt-8 flex items-center gap-3 max-w-xl mx-auto">
            <input
              className="flex-1 rounded-lg border bg-background px-4 py-3"
              placeholder="Describe what you need… (e.g., ‘voice agent for support’)"
            />
            <button className="rounded-lg bg-primary text-primary-foreground px-4 py-3 font-medium">
              AI Search
            </button>
          </div>
        </div>
      </section>

      {/* 20-category grid */}
      <section className="container mx-auto px-4 pb-4">
        <h2 className="text-xl font-semibold mb-4">Explore All Categories</h2>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map(({ key, name, desc, href, Icon }) => (
            <li key={key} className="rounded-2xl border bg-card p-4 hover:shadow-md transition">
              <Link href={href} className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 ring-1 ring-border">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold leading-tight">{name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Trending Tools */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending Tools</h2>
          <Link href="/tools" className="text-sm text-primary hover:underline">See all</Link>
        </div>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TRENDING_TOOLS.map((t) => (
            <li key={t.name} className="rounded-2xl border bg-card p-4 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.logo} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-border" />
                <div className="min-w-0">
                  <Link href={t.href} className="font-semibold hover:underline line-clamp-1">{t.name}</Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">{t.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-xs rounded-full bg-muted px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Jobs & Events two-column */}
      <section className="container mx-auto px-4 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Hot AI Jobs</h2>
              <Link href="/jobs" className="text-sm text-primary hover:underline">Browse jobs</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {HOT_JOBS.map((j) => (
                <li key={j.role} className="rounded-xl border bg-card p-4 flex items-center justify-between hover:shadow-sm">
                  <div>
                    <div className="font-medium">{j.role}</div>
                    <div className="text-sm text-muted-foreground">{j.company} • {j.location}</div>
                  </div>
                  <Link href={j.href} className="text-sm rounded-md border px-3 py-1.5 hover:bg-muted">Apply</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-primary hover:underline">All events</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {EVENTS.map((e) => (
                <li key={e.name} className="rounded-xl border bg-card p-4 flex items-center justify-between hover:shadow-sm">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-sm text-muted-foreground">{e.date} • {e.location}</div>
                  </div>
                  <Link href={e.href} className="text-sm rounded-md border px-3 py-1.5 hover:bg-muted">Details</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Investor spotlight */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Investor Spotlight</h2>
          <Link href="/investors" className="text-sm text-primary hover:underline">All investors</Link>
        </div>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {INVESTORS.map((f) => (
            <li key={f.name} className="rounded-2xl border bg-card p-4 hover:shadow-md">
              <div className="font-semibold">{f.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.focus}</div>
              <Link href={f.href} className="mt-3 inline-block text-sm rounded-md border px-3 py-1.5 hover:bg-muted">View</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-2xl font-semibold">Get weekly AI updates</h3>
          <p className="mt-2 text-muted-foreground">Tools, jobs, investors, research — straight to your inbox.</p>
          <div className="mt-6 mx-auto max-w-md flex gap-3">
            <input className="flex-1 rounded-lg border bg-background px-3 py-2" placeholder="you@example.com" />
            <button className="rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} AI Directory</div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/advertise" className="hover:underline">Advertise</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
