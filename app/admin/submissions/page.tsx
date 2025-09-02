import { SubmissionsTable } from "@/components/admin/submissions-table"
import { SubmissionFilters } from "@/components/admin/submission-filters"

export const metadata = {
  title: "Submissions | Admin Dashboard",
  description: "Manage and review AI tool submissions.",
}

export default function SubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">Review and manage AI tool submissions from the community.</p>
      </div>

      <SubmissionFilters />
      <SubmissionsTable />
    </div>
  )
}
