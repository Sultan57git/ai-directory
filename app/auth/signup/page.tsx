import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Sign Up | AI Directory",
  description: "Create your AI Directory account.",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Join AI Directory</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
