import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Check, X } from "lucide-react"

export function RecentSubmissions() {
  const submissions = [
    {
      id: "AI-2024-001",
      toolName: "CodeAssist Pro",
      submitter: "John Doe",
      category: "Code Assistant",
      status: "pending",
      submittedAt: "2024-01-15",
    },
    {
      id: "AI-2024-002",
      toolName: "ImageGen AI",
      submitter: "Jane Smith",
      category: "Image Generation",
      status: "approved",
      submittedAt: "2024-01-14",
    },
    {
      id: "AI-2024-003",
      toolName: "ChatBot Builder",
      submitter: "Mike Johnson",
      category: "Chatbots",
      status: "rejected",
      submittedAt: "2024-01-13",
    },
    {
      id: "AI-2024-004",
      toolName: "Voice Synthesizer",
      submitter: "Sarah Wilson",
      category: "Audio",
      status: "pending",
      submittedAt: "2024-01-12",
    },
    {
      id: "AI-2024-005",
      toolName: "Content Writer AI",
      submitter: "David Brown",
      category: "Writing",
      status: "under_review",
      submittedAt: "2024-01-11",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Under Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tool Name</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                <TableCell className="font-medium">{submission.toolName}</TableCell>
                <TableCell>{submission.submitter}</TableCell>
                <TableCell>{submission.category}</TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell>{submission.submittedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {submission.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
