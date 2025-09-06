// app/submit/page.tsx
import SubmissionForm from "@/components/submission-form";
import { SubmissionGuidelines } from "@/components/submission-guidelines";

export const metadata = {
  title: "Submit a Tool",
  description: "Share your AI tool with the BrowseAI Online directory.",
};

export default function SubmitPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Submit Your Tool</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2">
          <SubmissionForm />
        </section>

        <aside className="md:col-span-1">
          <SubmissionGuidelines />
        </aside>
      </div>
    </main>
  );
}
