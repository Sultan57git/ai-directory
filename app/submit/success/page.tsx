import { CheckCircle, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Submission Successful | AI Directory",
  description: "Your AI tool has been successfully submitted for review.",
}

export default function SubmissionSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Submission Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Thank you for submitting your AI tool to our directory. We've received your submission and will review
                it shortly.
              </p>

              <div className="rounded-lg bg-muted/50 p-4 text-left">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Initial review within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Full evaluation within 2-3 business days
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Email notification with approval status
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    Live on directory within 24 hours of approval
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                <h3 className="font-semibold mb-2 text-blue-900">Submission ID: #AI-2024-001</h3>
                <p className="text-sm text-blue-700">
                  Save this ID for your records. You can use it to track your submission status or contact support.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Directory
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/submit">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Submit Another Tool
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Questions? Contact us at{" "}
                <a href="mailto:submit@aidirectory.com" className="text-primary hover:underline">
                  submit@aidirectory.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
