"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function AddTeacherModal({ open, setOpen, onAdded }: any) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    schoolName: "",
    name: "",
    email: "",
    contactNo: "",
    subjects: "",
    classes: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async () => {
    // 🔹 Required validation
    if (!form.schoolName || !form.name || !form.email || !form.contactNo || !form.password || !form.confirmPassword) {
      toast.error("Please fill all required fields")
      return
    }

    // 🔹 Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format")
      return
    }

    // 🔹 Phone validation
    if (form.contactNo.length < 10) {
      toast.error("Invalid contact number")
      return
    }

    // 🔹 Password validation
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: form.schoolName,
          name: form.name,
          email: form.email,
          contactNo: form.contactNo,
          subjects: form.subjects
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
          classes: form.classes
            .split(",")
            .map(c => c.trim())
            .filter(Boolean),
          password: form.password, // send password to backend for hashing
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to add teacher")
        return
      }

      toast.success("Teacher added successfully")
      setOpen(false)
      setForm({
        schoolName: "",
        name: "",
        email: "",
        contactNo: "",
        subjects: "",
        classes: "",
        password: "",
        confirmPassword: "",
      })
      onAdded()
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>Add Teacher & Set Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>School Name *</Label>
            <Input
              placeholder="Shri Ram Public School"
              value={form.schoolName}
              onChange={e => setForm({ ...form, schoolName: e.target.value })}
            />
          </div>

          <div>
            <Label>Teacher Name *</Label>
            <Input
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="teacher@mail.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Contact Number *</Label>
            <Input
              placeholder="9876543210"
              value={form.contactNo}
              onChange={e => setForm({ ...form, contactNo: e.target.value })}
            />
          </div>

          <div>
            <Label>Subjects (comma separated)</Label>
            <Input
              placeholder="Maths, Science"
              value={form.subjects}
              onChange={e => setForm({ ...form, subjects: e.target.value })}
            />
          </div>

          <div>
            <Label>Classes (comma separated)</Label>
            <Input
              placeholder="6A, 7B, 8C"
              value={form.classes}
              onChange={e => setForm({ ...form, classes: e.target.value })}
            />
          </div>

          <div>
            <Label>Password *</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <Label>Confirm Password *</Label>
            <Input
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>

          <Button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save Teacher & Set Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
