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

export default function StudentLogin() {
  const { login } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await login({
      role: "STUDENT",
      name,
      rollNo,
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
        {/* Background Image */}
        <Image
          src="/school-bg.webp"
          alt="School Background"
          fill
          className="object-cover opacity-20 pointer-events-none"
        />
        <Card className="w-full max-w-md shadow-xl border border-blue-200 rounded-2xl bg-white/20 backdrop-blur">
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-3xl text-blue-800 font-bold mt-5">
              Student Login
            </CardTitle>
            <p className="text-sm text-blue-700 italic">
              Government School Student Portal
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <div>
                <Label className="text-blue-800 mb-2">Student Name</Label>
                <Input className="border border-blue-800 rounded-lg p-2" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label className="text-blue-800 mb-2">Roll Number</Label>
                <Input className="border border-blue-800 rounded-lg p-2" placeholder="Enter roll number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl mt-4 mb-5">
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
