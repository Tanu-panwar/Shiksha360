"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function TeacherAuthModal({
  open,
  setOpen,
  teacher,
  onLoginSuccess,
}: any) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (open) {
      setPassword("")
      setShowPassword(false)
    }
  }, [open])

  if (!teacher) return null

  const handleLogin = async () => {
    if (!password) {
      toast.error("Please enter your password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/teachers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: teacher.email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Invalid password")
        return
      }

      toast.success("Login successful")
      setOpen(false)

      // ✅ SAME PAGE DASHBOARD OPEN
      onLoginSuccess(teacher)

    } catch (err) {
      toast.error("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl max-w-sm p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Teacher Login
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <Label>Email</Label>
            <Input value={teacher.email} disabled />
          </div>

          <div className="relative">
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />

            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
