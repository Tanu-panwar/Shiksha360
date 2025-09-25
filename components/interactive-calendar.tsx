"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { ChevronLeft, ChevronRight, Plus, MapPin, Trash2, Video } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: "meeting" | "task" | "leave" | "training" | "other"
  attendees: string[]
  location?: string
  meetLink?: string
  createdBy: string
}

const eventTypes = [
  { value: "meeting", label: "Meeting", color: "bg-blue-500" },
  { value: "task", label: "Task", color: "bg-green-500" },
  { value: "leave", label: "Leave", color: "bg-red-500" },
  { value: "training", label: "Training", color: "bg-purple-500" },
  { value: "other", label: "Other", color: "bg-gray-500" },
]

export function InteractiveCalendar() {
  const { user } = useAuth()
  const { employees } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      description: "Daily team synchronization meeting",
      date: "2024-12-20",
      startTime: "09:00",
      endTime: "09:30",
      type: "meeting",
      attendees: ["john@company.com", "jane@company.com"],
      location: "Conference Room A",
      meetLink: "https://meet.google.com/abc-defg-hij",
      createdBy: user?.id || "1",
    },
    {
      id: "2",
      title: "Project Review",
      description: "Quarterly project review and planning",
      date: "2024-12-22",
      startTime: "14:00",
      endTime: "16:00",
      type: "meeting",
      attendees: ["manager@company.com"],
      location: "Virtual",
      meetLink: "https://meet.google.com/xyz-uvwx-yz",
      createdBy: user?.id || "1",
    },
    {
      id: "3",
      title: "HR Training",
      description: "New employee onboarding training",
      date: "2024-12-25",
      startTime: "10:00",
      endTime: "12:00",
      type: "training",
      attendees: ["hr@company.com"],
      location: "Training Room",
      createdBy: user?.id || "1",
    },
  ])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "meeting",
    attendees: [],
    location: "",
  })

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateString)
  }

  const getEventTypeColor = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.color || "bg-gray-500"
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime && newEvent.endTime) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description || "",
        date: newEvent.date,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        type: newEvent.type as CalendarEvent["type"],
        attendees: newEvent.attendees || [],
        location: newEvent.location,
        meetLink:
          newEvent.type === "meeting"
            ? `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`
            : undefined,
        createdBy: user?.id || "1",
      }

      setEvents((prev) => [...prev, event])
      setNewEvent({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "meeting",
        attendees: [],
        location: "",
      })
      setShowCreateDialog(false)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setShowEventDialog(false)
    setSelectedEvent(null)
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-3 h-24"></div>
          }

          const dayEvents = getEventsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div
              key={index}
              className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
              }`}
              onClick={() => {
                setNewEvent((prev) => ({ ...prev, date: day.toISOString().split("T")[0] }))
                setShowCreateDialog(true)
              }}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                      setShowEventDialog(true)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayEvents = getEventsForDate(date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div key={index} className="space-y-2">
              <div className={`text-center p-2 rounded-lg ${isToday ? "bg-blue-100 text-blue-600" : "bg-gray-50"}`}>
                <div className="text-sm font-medium">{weekDays[date.getDay()]}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
              <div className="space-y-2 min-h-[300px]">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-white text-sm cursor-pointer ${getEventTypeColor(event.type)}`}
                    onClick={() => {
                      setSelectedEvent(event)
                      setShowEventDialog(true)
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold">{currentDate.getDate()}</div>
          <div className="text-gray-600">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>

        <div className="space-y-2">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter((event) => {
              const eventHour = Number.parseInt(event.startTime.split(":")[0])
              return eventHour === hour
            })

            return (
              <div key={hour} className="flex items-start gap-4 p-2 border-b border-gray-100">
                <div className="w-16 text-sm text-gray-500 font-medium">{hour.toString().padStart(2, "0")}:00</div>
                <div className="flex-1 space-y-1">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg text-white cursor-pointer ${getEventTypeColor(event.type)}`}
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventDialog(true)
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-90">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="text-xs opacity-75 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Calendar</CardTitle>
              <CardDescription>Manage your events and meetings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Controls */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
                Month
              </Button>
              <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
                Week
              </Button>
              <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
                Day
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardContent className="p-6">
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </CardContent>
      </Card>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Add a new event to your calendar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title || ""}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date || ""}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newEvent.type || "meeting"}
                  onValueChange={(value) => setNewEvent((prev) => ({ ...prev, type: value as CalendarEvent["type"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime || ""}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime || ""}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newEvent.location || ""}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location or 'Virtual'"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateEvent} className="flex-1">
                Create Event
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(selectedEvent.type)}`}></div>
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>Event Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm text-gray-900">{selectedEvent.description || "No description"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="text-sm text-gray-900">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Time</Label>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Location</Label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedEvent.location}
                    </p>
                  </div>
                )}

                {selectedEvent.meetLink && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Meeting Link</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2 bg-transparent"
                      onClick={() => window.open(selectedEvent.meetLink, "_blank")}
                    >
                      <Video className="h-4 w-4" />
                      Join Google Meet
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button variant="outline" onClick={() => setShowEventDialog(false)} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
