"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddStudentModalProps {
  onStudentAdded: (student: any) => void
}

export default function AddStudentModal({ onStudentAdded }: AddStudentModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    roll: "",
    class: "",
    section: "",
    status: "active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        onStudentAdded(data.student)
        setOpen(false)
        setForm({ name: "", roll: "", class: "", section: "", status: "active" })
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 rounded-xl">
          ➕ Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl border border-gray-200 p-6 bg-white hover:shadow-lg transition">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add New Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg border-gray-300"
          />
          <Input
            placeholder="Roll No"
            name="roll"
            type="number"
            value={form.roll}
            onChange={handleChange}
            className="rounded-lg border-gray-300"
          />
          <Input
            placeholder="Class"
            name="class"
            value={form.class}
            onChange={handleChange}
            className="rounded-lg border-gray-300"
          />
          <Input
            placeholder="Section"
            name="section"
            value={form.section}
            onChange={handleChange}
            className="rounded-lg border-gray-300"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button className="w-full bg-green-600 text-white hover:bg-green-700 rounded-xl" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
