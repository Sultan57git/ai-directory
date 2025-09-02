import { CheckCircle, Clock, Star, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SubmissionGuidelines() {
  const guidelines = [
    {
      icon: CheckCircle,
      title: "Quality Standards",
      items: [
        "Tool must be functional and publicly accessible",
        "Clear value proposition and use cases",
        "Professional presentation and documentation",
        "Active development or maintenance",
      ],
    },
    {
      icon: Clock,
      title: "Review Process",
      items: [
        "Initial review within 24 hours",
        "Full evaluation within 2-3 business days",
        "Email notification of approval/feedback",
        "Live on directory within 24 hours of approval",
      ],
    },
    {
      icon: Star,
      title: "Best Practices",
      items: [
        "Use high-quality screenshots and logos",
        "Write clear, compelling descriptions",
        "Include relevant tags and categories",
        "Provide accurate pricing information",
      ],
    },
    {
      icon: Shield,
      title: "Requirements",
      items: [
        "Must be an AI-powered tool or service",
        "No adult, illegal, or harmful content",
        "Functional website with working features",
        "Accurate and truthful information only",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {guidelines.map((section) => (
            <div key={section.title}>
              <div className="mb-3 flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Have questions about the submission process? We're here to help!
          </p>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Email:</strong>{" "}
              <a href="mailto:submit@aidirectory.com" className="text-primary hover:underline">
                submit@aidirectory.com
              </a>
            </div>
            <div>
              <strong>Response time:</strong> Within 24 hours
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
