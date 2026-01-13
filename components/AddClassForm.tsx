"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export type ClassFormData = {
  className: string
  section: string
  teacher: string
  students: number
}

export function AddClassForm({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  onSubmit: (data: ClassFormData) => void
}) {
  const [form, setForm] = useState<ClassFormData>({
    className: "",
    section: "",
    teacher: "",
    students: 0,
  })

  const handleSubmit = () => {
    if (!form.className || !form.section || !form.teacher) {
      alert("Please fill all required fields")
      return
    }

    onSubmit(form)
    setForm({ className: "", section: "", teacher: "", students: 0 })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Class (e.g. 6, 7, 8)"
            value={form.className}
            onChange={(e) =>
              setForm({ ...form, className: e.target.value })
            }
          />

          <Input
            placeholder="Section (A, B)"
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
          />

          <Input
            placeholder="Class Teacher Name"
            value={form.teacher}
            onChange={(e) =>
              setForm({ ...form, teacher: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Total Students"
            value={form.students}
            onChange={(e) =>
              setForm({ ...form, students: Number(e.target.value) })
            }
          />

          <Button className="w-full" onClick={handleSubmit}>
            Save Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
