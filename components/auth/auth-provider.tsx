"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userRole = localStorage.getItem("userRole")
      const userEmail = localStorage.getItem("userEmail")
      const userName = localStorage.getItem("userName")

      if (authStatus === "true") {
        setIsAuthenticated(true)
        setIsAdmin(userRole === "admin")
        setUser({
          email: userEmail,
          name: userName,
          role: userRole,
        })

        // Set cookies for middleware
        document.cookie = `isAuthenticated=true; path=/`
        document.cookie = `userRole=${userRole}; path=/`
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication logic
    const isAdminUser = email === "admin@aidirectory.com"
    const role = isAdminUser ? "admin" : "user"

    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", email.split("@")[0])

    // Set cookies for middleware
    document.cookie = `isAuthenticated=true; path=/`
    document.cookie = `userRole=${role}; path=/`

    setIsAuthenticated(true)
    setIsAdmin(isAdminUser)
    setUser({
      email,
      name: email.split("@")[0],
      role,
    })
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")

    // Clear cookies
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    setIsAuthenticated(false)
    setIsAdmin(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
