"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select"

export function AddCalendarEvent({ open, setOpen, onSave }: any) {
  const [form, setForm] = useState({
    title: "",
    type: "event",
    startDate: "",
    endDate: "",
    description: "",
  })

  const submit = () => {
    onSave(form)
    setOpen(false)
    setForm({
      title: "",
      type: "event",
      startDate: "",
      endDate: "",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Calendar Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Event Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <Select
            value={form.type}
            onValueChange={(v) => setForm({ ...form, type: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="ptm">PTM</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input type="date" onChange={(e) => setForm({ ...form, endDate: e.target.value })} />

          <Input placeholder="Description (optional)"
            onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <Button onClick={submit} className="w-full">Save Event</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
