"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Video, Calendar, Clock, Users, Copy, Check, Plus, Edit, CalendarPlus, Link, UserPlus } from "lucide-react"

interface GoogleMeeting {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  attendees: string[]
  meetLink: string
  calendarLink: string
  organizer: string
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  createdAt: string
}

const meetingTemplates = [
  {
    title: "Team Standup",
    description: "Daily team synchronization meeting",
    duration: 30,
    type: "recurring",
  },
  {
    title: "Project Review",
    description: "Weekly project progress review",
    duration: 60,
    type: "weekly",
  },
  {
    title: "One-on-One",
    description: "Individual performance discussion",
    duration: 45,
    type: "monthly",
  },
  {
    title: "All Hands",
    description: "Company-wide meeting",
    duration: 90,
    type: "monthly",
  },
]

export function GoogleMeetScheduler() {
  const { user } = useAuth()
  const { employees } = useData()
  const [meetings, setMeetings] = useState<GoogleMeeting[]>([
    {
      id: "1",
      title: "Team Standup",
      description: "Daily team synchronization meeting",
      date: "2024-12-20",
      startTime: "09:00",
      endTime: "09:30",
      attendees: ["john@company.com", "jane@company.com", "mike@company.com"],
      meetLink: "https://meet.google.com/abc-defg-hij",
      calendarLink: "https://calendar.google.com/calendar/event?eid=abc123",
      organizer: user?.email || "organizer@company.com",
      status: "scheduled",
      createdAt: "2024-12-18T10:00:00Z",
    },
    {
      id: "2",
      title: "Project Review",
      description: "Quarterly project review and planning session",
      date: "2024-12-22",
      startTime: "14:00",
      endTime: "16:00",
      attendees: ["manager@company.com", "lead@company.com"],
      meetLink: "https://meet.google.com/xyz-uvwx-yz",
      calendarLink: "https://calendar.google.com/calendar/event?eid=xyz789",
      organizer: user?.email || "organizer@company.com",
      status: "scheduled",
      createdAt: "2024-12-18T11:30:00Z",
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showMeetingDetails, setShowMeetingDetails] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<GoogleMeeting | null>(null)
  const [copiedLink, setCopiedLink] = useState("")
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: [] as string[],
    template: "",
  })

  const generateMeetLink = () => {
    const randomId = Math.random().toString(36).substr(2, 9)
    return `https://meet.google.com/${randomId.slice(0, 3)}-${randomId.slice(3, 7)}-${randomId.slice(7)}`
  }

  const generateCalendarLink = (meeting: Partial<GoogleMeeting>) => {
    const startDateTime = new Date(`${meeting.date}T${meeting.startTime}:00`)
    const endDateTime = new Date(`${meeting.date}T${meeting.endTime}:00`)

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: meeting.title || "",
      dates: `${startDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      details: `${meeting.description}\n\nJoin Google Meet: ${generateMeetLink()}`,
      location: "Google Meet",
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const handleCreateMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.startTime && newMeeting.endTime) {
      const meetLink = generateMeetLink()
      const meeting: GoogleMeeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        attendees: newMeeting.attendees,
        meetLink,
        calendarLink: generateCalendarLink({ ...newMeeting, meetLink }),
        organizer: user?.email || "organizer@company.com",
        status: "scheduled",
        createdAt: new Date().toISOString(),
      }

      setMeetings((prev) => [...prev, meeting])
      setNewMeeting({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        attendees: [],
        template: "",
      })
      setShowCreateDialog(false)
    }
  }

  const handleTemplateSelect = (template: (typeof meetingTemplates)[0]) => {
    const now = new Date()
    const startTime = "09:00"
    const endTime = new Date(new Date(`2000-01-01T${startTime}:00`).getTime() + template.duration * 60000)
      .toTimeString()
      .slice(0, 5)

    setNewMeeting((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      startTime,
      endTime,
    }))
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLink(type)
    setTimeout(() => setCopiedLink(""), 2000)
  }

  const addAttendee = (email: string) => {
    if (email && !newMeeting.attendees.includes(email)) {
      setNewMeeting((prev) => ({
        ...prev,
        attendees: [...prev.attendees, email],
      }))
    }
  }

  const removeAttendee = (email: string) => {
    setNewMeeting((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a !== email),
    }))
  }

  const getUpcomingMeetings = () => {
    const now = new Date()
    return meetings
      .filter((meeting) => {
        const meetingDateTime = new Date(`${meeting.date}T${meeting.startTime}:00`)
        return meetingDateTime > now && meeting.status === "scheduled"
      })
      .sort(
        (a, b) => new Date(`${a.date}T${a.startTime}:00`).getTime() - new Date(`${b.date}T${b.startTime}:00`).getTime(),
      )
  }

  const getTodaysMeetings = () => {
    const today = new Date().toISOString().split("T")[0]
    return meetings.filter((meeting) => meeting.date === today)
  }

  const upcomingMeetings = getUpcomingMeetings()
  const todaysMeetings = getTodaysMeetings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Video className="h-8 w-8 text-blue-600" />
                Google Meet Scheduler
              </CardTitle>
              <CardDescription>Schedule and manage Google Meet meetings with ease</CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Today's Meetings</CardTitle>
            <Calendar className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{todaysMeetings.length}</div>
            <p className="text-xs text-green-700">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Upcoming</CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{upcomingMeetings.length}</div>
            <p className="text-xs text-blue-700">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Meetings</CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{meetings.length}</div>
            <p className="text-xs text-purple-700">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Meetings */}
      {todaysMeetings.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">{meeting.title}</h3>
                    <p className="text-sm text-blue-700">
                      {meeting.startTime} - {meeting.endTime}
                    </p>
                    <p className="text-xs text-blue-600">{meeting.attendees.length} attendees</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(meeting.meetLink, "_blank")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMeeting(meeting)
                        setShowMeetingDetails(true)
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Meetings */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-gray-900">All Meetings</CardTitle>
          <CardDescription>Manage your scheduled Google Meet meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <Badge variant={meeting.status === "scheduled" ? "default" : "secondary"} className="capitalize">
                      {meeting.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{meeting.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {meeting.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meeting.startTime} - {meeting.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {meeting.attendees.length} attendees
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(meeting.meetLink, `meet-${meeting.id}`)}
                  >
                    {copiedLink === `meet-${meeting.id}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMeeting(meeting)
                      setShowMeetingDetails(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Meeting Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Schedule Google Meet Meeting
            </DialogTitle>
            <DialogDescription>Create a new Google Meet meeting with calendar integration</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Meeting Templates */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {meetingTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="text-left justify-start h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">{template.title}</div>
                      <div className="text-xs text-gray-500">{template.duration} min</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter meeting description"
                  rows={3}
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newMeeting.startTime}
                  onChange={(e) => setNewMeeting((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newMeeting.endTime}
                  onChange={(e) => setNewMeeting((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Attendees */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Attendees</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Select onValueChange={(email) => addAttendee(email)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select employee to invite" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((emp) => !newMeeting.attendees.includes(emp.email))
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.email}>
                            {employee.name} ({employee.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const email = prompt("Enter email address:")
                      if (email) addAttendee(email)
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>

                {newMeeting.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newMeeting.attendees.map((email) => (
                      <Badge key={email} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <button onClick={() => removeAttendee(email)} className="ml-1 hover:text-red-600">
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleCreateMeeting} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Details Dialog */}
      <Dialog open={showMeetingDetails} onOpenChange={setShowMeetingDetails}>
        <DialogContent className="max-w-md">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  {selectedMeeting.title}
                </DialogTitle>
                <DialogDescription>Meeting Details & Links</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm text-gray-900">{selectedMeeting.description || "No description"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="text-sm text-gray-900">{selectedMeeting.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Time</Label>
                    <p className="text-sm text-gray-900">
                      {selectedMeeting.startTime} - {selectedMeeting.endTime}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Attendees ({selectedMeeting.attendees.length})
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMeeting.attendees.map((email) => (
                      <Badge key={email} variant="secondary" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(selectedMeeting.meetLink, "_blank")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Google Meet
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMeeting.meetLink, "meet-link")}
                    >
                      {copiedLink === "meet-link" ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                      {copiedLink === "meet-link" ? "Copied!" : "Copy Link"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedMeeting.calendarLink, "_blank")}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setShowMeetingDetails(false)} className="w-full">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
