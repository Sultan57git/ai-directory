"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Check, X, MessageSquare, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SubmissionsTable() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

  const submissions = [
    {
      id: "AI-2024-001",
      toolName: "CodeAssist Pro",
      submitter: "John Doe",
      email: "john@example.com",
      category: "Code Assistant",
      status: "pending",
      submittedAt: "2024-01-15",
      description: "An advanced AI-powered code completion and debugging assistant for developers.",
      website: "https://codeassist-pro.com",
      pricing: "Freemium",
      features: ["Code completion", "Bug detection", "Code optimization"],
    },
    {
      id: "AI-2024-002",
      toolName: "ImageGen AI",
      submitter: "Jane Smith",
      email: "jane@example.com",
      category: "Image Generation",
      status: "approved",
      submittedAt: "2024-01-14",
      description: "Create stunning images from text descriptions using advanced AI models.",
      website: "https://imagegen-ai.com",
      pricing: "Paid",
      features: ["Text-to-image", "Style transfer", "Image editing"],
    },
    // Add more submissions...
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
        <CardTitle>All Submissions</CardTitle>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{submission.toolName}</DialogTitle>
                          <DialogDescription>
                            Submitted by {submission.submitter} on {submission.submittedAt}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{submission.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Category</h4>
                              <Badge variant="outline">{submission.category}</Badge>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <Badge variant="outline">{submission.pricing}</Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Key Features</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {submission.features.map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Contact</h4>
                            <p className="text-sm text-muted-foreground">{submission.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" asChild>
                              <a href={submission.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Visit Website
                              </a>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

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

                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
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
