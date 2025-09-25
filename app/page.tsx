"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import Dashboard  from "@/components/dashboard"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function HomePage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "admin" | "govt">("student")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password, role)
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border border-blue-200 rounded-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-blue-800">Shiksha360</CardTitle>
                <p className="text-sm text-blue-600">Education Dashboard</p>
              </div>
            </div>
            <CardDescription className="text-blue-700">Login to your personalized dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-blue-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-blue-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-sm font-medium text-blue-800">Role</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="w-full rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-blue-200 rounded-md shadow-md">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="govt">Govt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-2">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-sm text-blue-700 text-center">
              <p className="font-medium">Demo Credentials</p>
              <p>Email: any@email.com | Password: any | Role: Select any</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}