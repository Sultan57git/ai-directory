import { SubmissionForm } from "@/components/submission-form"
import { SubmissionGuidelines } from "@/components/submission-guidelines"

export const metadata = {
  title: "Submit Your AI Tool | AI Directory",
  description: "Submit your AI tool to our directory and reach thousands of potential users.",
}

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-balance">Submit Your AI Tool</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Share your AI innovation with our community of 500,000+ users and developers
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Guidelines Sidebar */}
            <div className="lg:col-span-1">
              <SubmissionGuidelines />
            </div>

            {/* Submission Form */}
            <div className="lg:col-span-2">
              <SubmissionForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
