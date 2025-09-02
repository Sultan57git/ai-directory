import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /dashboard)
  const { pathname } = request.nextUrl

  // Check if the path is for admin routes
  if (pathname.startsWith("/admin")) {
    // In a real app, you'd check the JWT token or session
    // For now, we'll check a simple header or cookie
    const isAuthenticated = request.cookies.get("isAuthenticated")?.value
    const userRole = request.cookies.get("userRole")?.value

    if (!isAuthenticated || userRole !== "admin") {
      // Redirect to login if not authenticated or not admin
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Check if the path is for user dashboard
  if (pathname.startsWith("/dashboard")) {
    const isAuthenticated = request.cookies.get("isAuthenticated")?.value

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
