"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Mock authentication - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock admin check
      const isAdmin = formData.email === "admin@aidirectory.com"

      // Store auth state (in real app, use proper session management)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", isAdmin ? "admin" : "user")
      localStorage.setItem("userEmail", formData.email)

      // Redirect based on role
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: !!checked }))}
          />
          <Label htmlFor="remember" className="text-sm">
            Remember me
          </Label>
        </div>
        <a href="/auth/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>Demo credentials:</p>
        <p>Admin: admin@aidirectory.com / password</p>
        <p>User: user@example.com / password</p>
      </div>
    </form>
  )
}
