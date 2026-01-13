"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  ClipboardList,
  PartyPopper,
  GraduationCap,
  Calendar as CalIcon,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const EVENT_TYPES: any = {
  meeting: {
    label: "Meeting / PTM",
    dot: "bg-blue-500",
    color: "bg-blue-100 text-blue-700",
    icon: Users,
  },
  exam: {
    label: "Exam",
    dot: "bg-red-500",
    color: "bg-red-100 text-red-700",
    icon: ClipboardList,
  },
  cultural: {
    label: "Cultural Event",
    dot: "bg-purple-500",
    color: "bg-purple-100 text-purple-700",
    icon: PartyPopper,
  },
  training: {
    label: "Training",
    dot: "bg-green-500",
    color: "bg-green-100 text-green-700",
    icon: GraduationCap,
  },
  other: {
    label: "Other",
    dot: "bg-gray-500",
    color: "bg-gray-100 text-gray-700",
    icon: CalIcon,
  },
}

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const addEvent = (event: any) => {
    setEvents([...events, { ...event, id: Date.now() }])
    setOpen(false)
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  return (
    <div className="p-6 grid grid-cols-12 gap-6">

      {/* LEFT PANEL */}
      <div className="col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>School Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Meetings, PTM, exams & cultural events
            </p>
            <Button className="w-full mt-4" onClick={() => setOpen(true)}>
              Add Event
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.length === 0 && (
              <p className="text-sm text-gray-500">No events added</p>
            )}

            {events.map((e) => {
              const Icon = EVENT_TYPES[e.type].icon
              return (
                <div
                  key={e.id}
                  className={`p-3 rounded-lg flex gap-3 items-center ${EVENT_TYPES[e.type].color}`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-xs">{e.date}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT CALENDAR */}
      <div className="col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {today.toLocaleString("default", { month: "long" })} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {calendarDays.map((d, i) =>
                !d ? (
                  <div key={i} />
                ) : (
                  <div key={i} className="border rounded-lg p-1 h-16">
                    <div className="font-semibold">{d}</div>

                    <div className="flex gap-1 mt-1">
                      {events
                        .filter(
                          (e) =>
                            new Date(e.date).getDate() === d &&
                            new Date(e.date).getMonth() === month
                        )
                        .map((e, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-2 h-2 rounded-full cursor-pointer ${EVENT_TYPES[e.type].dot}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">{e.title}</p>
                              <p className="text-xs">{e.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEventModal open={open} setOpen={setOpen} onAdd={addEvent} />
    </div>
  )
}

/* ================= ADD EVENT MODAL ================= */

function AddEventModal({ open, setOpen, onAdd }: any) {
  const [event, setEvent] = useState<any>({
    title: "",
    description: "",
    date: "",
    type: "meeting",
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Event title"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />

        <Input
          placeholder="Description"
          value={event.description}
          onChange={(e) =>
            setEvent({ ...event, description: e.target.value })
          }
        />

        <Input
          type="date"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
        />

        <Select
          value={event.type}
          onValueChange={(v) => setEvent({ ...event, type: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_TYPES).map(([k, v]: any) => (
              <SelectItem key={k} value={k}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (!event.title || !event.date) return
            onAdd(event)
            setEvent({
              title: "",
              description: "",
              date: "",
              type: "meeting",
            })
          }}
        >
          Save Event
        </button>

      </DialogContent>
    </Dialog>
  )
}
