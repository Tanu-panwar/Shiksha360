"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function TeacherSignup() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "TEACHER",
          name,
          schoolName,
          teacherId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
      } else {
        localStorage.setItem("shiksha-token", data.token)
        router.push("/teacher/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative">
        <Image
          src="/school-bg.webp"
          alt="School Background"
          fill
          className="object-cover opacity-20"
        />

        <Card className="w-full max-w-md shadow-xl border border-blue-200 rounded-2xl bg-white/20 backdrop-blur relative z-10">
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-3xl text-blue-800 font-bold mt-5">
              Teacher Registration
            </CardTitle>
            <p className="text-sm text-blue-700 italic">
              Government School Teacher Signup
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <div>
                <Label className="text-blue-800 mb-2">Teacher Name</Label>
                <Input
                  className="border border-blue-800 rounded-lg p-2"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-blue-800 mb-2">School Name</Label>
                <Input
                  className="border border-blue-800 rounded-lg p-2"
                  placeholder="Enter school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-blue-800 mb-2">Teacher ID</Label>
                <Input
                  className="border border-blue-800 rounded-lg p-2"
                  placeholder="Enter teacher ID"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl mt-4 mb-5 cursor-pointer"
              >
                {loading ? "Registering..." : "Register Teacher"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
