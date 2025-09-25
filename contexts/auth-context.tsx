"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "student" | "teacher" | "admin" | "govt"

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
  login: (email: string, password: string, role: UserRole) => void
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

  const login = (email: string, password: string, role: UserRole) => {
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      role,
      phone: "0000000000",
      joinDate: new Date().toISOString(),
      schoolId: role === "student" || role === "teacher" ? "school-123" : undefined,
      departmentId: role === "govt" ? "dept-edu" : role === "admin" ? "dept-admin" : undefined,
      assignedClasses: role === "teacher" ? ["class-1", "class-2"] : undefined,
      assignedStudents: role === "teacher" ? ["student-1", "student-2"] : undefined,
    }

    setUser(mockUser)
    localStorage.setItem("shiksha-user", JSON.stringify(mockUser))
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