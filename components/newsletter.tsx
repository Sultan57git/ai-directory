import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-balance">Stay Ahead of the AI Revolution</h2>

          <p className="mb-8 text-muted-foreground text-pretty">
            Get weekly updates on the latest AI tools, trends, and insights. Join 50,000+ innovators who trust our
            curated newsletter.
          </p>

          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
