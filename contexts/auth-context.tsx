"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string
  joinDate: string
  schoolId?: string         // for student/teacher
  departmentId?: string     // for govt/admin
  assignedClasses?: string[] // for teacher
  assignedStudents?: string[] // for teacher
}

interface AuthContextType {
  user: User | null
  login: (data: any) => Promise<any>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("shiksha-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (data: {
  role: "STUDENT" | "TEACHER" | "ADMIN"
  name: string
  rollNo?: string
  teacherId?: string
  adminId?: string
}) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error || "Login failed")
    }

    localStorage.setItem("shiksha-token", result.token)
    localStorage.setItem("shiksha-user", JSON.stringify(result.user))

    setUser(result.user)
    return { success: true }
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}


  const logout = () => {
    setUser(null)
    localStorage.removeItem("shiksha-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("shiksha-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
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