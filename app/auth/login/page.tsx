import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Login | AI Directory",
  description: "Sign in to your AI Directory account.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
