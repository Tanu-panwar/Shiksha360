"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLogin() {
  const { login } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [adminId, setAdminId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await login({
      role: "ADMIN",
      name,
      adminId,
    })

    setLoading(false)

    if (!res.success) {
      setError(res.message)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <Image
          src="/school-bg.webp"
          alt="School Background"
          fill
          className="object-cover opacity-20 pointer-events-none"
        />

        <Card className="w-full max-w-md shadow-xl border border-blue-200 rounded-2xl bg-white/20 backdrop-blur">
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-3xl text-blue-800 font-bold mt-5">
              Admin Login
            </CardTitle>
            <p className="text-sm text-blue-700 italic">
              Education Department Portal
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <div>
                <Label className="text-blue-800 mb-2">Admin Name</Label>
                <Input
                  className="border border-blue-800 rounded-lg p-2"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-blue-800 mb-2">Admin ID</Label>
                <Input
                  className="border border-blue-800 rounded-lg p-2"
                  placeholder="Enter admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl mt-4 mb-5"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
