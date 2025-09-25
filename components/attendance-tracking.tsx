"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useData, type AttendanceRecord } from "@/contexts/data-context"
import { Clock, Play, Pause, Square, Coffee, CalendarIcon, Timer, TrendingUp } from "lucide-react"

interface TimeState {
  isWorking: boolean
  isOnBreak: false
  startTime: string | null
  breakStartTime: string | null
  totalWorkTime: number
  totalBreakTime: number
}

export function AttendanceTracking() {
  const { user } = useAuth()
  const { attendance, addAttendance, employees } = useData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeState, setTimeState] = useState<TimeState>({
    isWorking: false,
    isOnBreak: false,
    startTime: null,
    breakStartTime: null,
    totalWorkTime: 0,
    totalBreakTime: 0,
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState<string>(user?.id || "")
  const [activeTab, setActiveTab] = useState("clock")

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load today's attendance state
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayRecord = attendance.find((record) => record.userId === user?.id && record.date === today)

    if (todayRecord) {
      const isCurrentlyWorking = todayRecord.clockIn && !todayRecord.clockOut
      const isCurrentlyOnBreak = todayRecord.breakStart && !todayRecord.breakEnd

      setTimeState({
        isWorking: isCurrentlyWorking,
        isOnBreak: isCurrentlyOnBreak,
        startTime: todayRecord.clockIn || null,
        breakStartTime: todayRecord.breakStart || null,
        totalWorkTime: calculateWorkTime(todayRecord),
        totalBreakTime: calculateBreakTime(todayRecord),
      })
    }
  }, [attendance, user?.id])

  // Sample attendance data for demo
  useEffect(() => {
    if (attendance.length === 0 && user?.id) {
      const sampleAttendance: Omit<AttendanceRecord, "id">[] = [
        {
          userId: user.id,
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
          clockIn: "09:00",
          clockOut: "17:30",
          breakStart: "12:00",
          breakEnd: "13:00",
          totalHours: 7.5,
          status: "present",
        },
        {
          userId: user.id,
          date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0], // 2 days ago
          clockIn: "09:15",
          clockOut: "17:45",
          breakStart: "12:30",
          breakEnd: "13:30",
          totalHours: 7.5,
          status: "late",
        },
      ]
      sampleAttendance.forEach(addAttendance)
    }
  }, [attendance.length, addAttendance, user?.id])

  const calculateWorkTime = (record: AttendanceRecord): number => {
    if (!record.clockIn) return 0

    const clockIn = new Date(`${record.date}T${record.clockIn}`)
    const clockOut = record.clockOut ? new Date(`${record.date}T${record.clockOut}`) : new Date()

    const breakTime = calculateBreakTime(record)
    const totalMinutes = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60) - breakTime
    return Math.max(0, totalMinutes)
  }

  const calculateBreakTime = (record: AttendanceRecord): number => {
    if (!record.breakStart) return 0

    const breakStart = new Date(`${record.date}T${record.breakStart}`)
    const breakEnd = record.breakEnd
      ? new Date(`${record.date}T${record.breakEnd}`)
      : timeState.isOnBreak
        ? new Date()
        : breakStart

    return (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60)
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const handleClockIn = () => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)

    addAttendance({
      userId: user?.id || "",
      date: today,
      clockIn: time,
      totalHours: 0,
      status: "present",
    })

    setTimeState({
      ...timeState,
      isWorking: true,
      startTime: time,
    })
  }

  const handleClockOut = () => {
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    const today = now.toISOString().split("T")[0]

    // Find today's record and update it
    const todayRecord = attendance.find((record) => record.userId === user?.id && record.date === today)

    if (todayRecord) {
      const workTime = calculateWorkTime({ ...todayRecord, clockOut: time })
      const totalHours = workTime / 60

      // In a real app, you'd update the existing record
      // For demo purposes, we'll add a new complete record
      addAttendance({
        ...todayRecord,
        clockOut: time,
        totalHours: Math.round(totalHours * 100) / 100,
      })
    }

    setTimeState({
      ...timeState,
      isWorking: false,
      isOnBreak: false,
    })
  }

  const handleBreakStart = () => {
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)

    setTimeState({
      ...timeState,
      isOnBreak: true,
      breakStartTime: time,
    })
  }

  const handleBreakEnd = () => {
    setTimeState({
      ...timeState,
      isOnBreak: false,
      breakStartTime: null,
    })
  }

  const getTodayRecord = (): AttendanceRecord | null => {
    const today = new Date().toISOString().split("T")[0]
    return attendance.find((record) => record.userId === user?.id && record.date === today) || null
  }

  const getSelectedDateRecords = (): AttendanceRecord[] => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    return attendance.filter((record) => record.date === dateStr)
  }

  const getUserAttendanceRecords = (userId: string): AttendanceRecord[] => {
    return attendance.filter((record) => record.userId === userId).slice(-30) // Last 30 records
  }

  const getAttendanceStats = (records: AttendanceRecord[]) => {
    const totalDays = records.length
    const presentDays = records.filter((r) => r.status === "present").length
    const lateDays = records.filter((r) => r.status === "late").length
    const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0)
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0

    return { totalDays, presentDays, lateDays, totalHours, avgHours }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "half-day":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canViewTeamAttendance = user?.role === "manager" || user?.role === "hr" || user?.role === "admin"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance & Time Tracking</CardTitle>
          <CardDescription>Track your work hours and attendance</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clock">Time Clock</TabsTrigger>
          <TabsTrigger value="history">My History</TabsTrigger>
          {canViewTeamAttendance && <TabsTrigger value="team">Team Attendance</TabsTrigger>}
        </TabsList>

        <TabsContent value="clock" className="space-y-6">
          {/* Current Time and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">{currentTime.toLocaleTimeString()}</div>
                <div className="text-center text-gray-600 mt-2">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Work Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      className={
                        timeState.isWorking
                          ? timeState.isOnBreak
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {timeState.isWorking ? (timeState.isOnBreak ? "On Break" : "Working") : "Not Clocked In"}
                    </Badge>
                  </div>
                  {timeState.startTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Started:</span>
                      <span className="text-sm">{timeState.startTime}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Work Time:</span>
                    <span className="text-sm font-mono">{formatTime(timeState.totalWorkTime)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clock Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Time Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {!timeState.isWorking ? (
                  <Button onClick={handleClockIn} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Clock In
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleClockOut} variant="destructive" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Clock Out
                    </Button>
                    {!timeState.isOnBreak ? (
                      <Button
                        onClick={handleBreakStart}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Coffee className="h-4 w-4" />
                        Start Break
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBreakEnd}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Pause className="h-4 w-4" />
                        End Break
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          {getTodayRecord() && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{getTodayRecord()?.clockIn || "--:--"}</div>
                    <div className="text-sm text-gray-600">Clock In</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{getTodayRecord()?.clockOut || "--:--"}</div>
                    <div className="text-sm text-gray-600">Clock Out</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(calculateBreakTime(getTodayRecord()!))}
                    </div>
                    <div className="text-sm text-gray-600">Break Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatTime(calculateWorkTime(getTodayRecord()!))}
                    </div>
                    <div className="text-sm text-gray-600">Work Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Personal Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(() => {
              const userRecords = getUserAttendanceRecords(user?.id || "")
              const stats = getAttendanceStats(userRecords)
              return (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalDays}</div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalDays > 0 ? Math.round((stats.presentDays / stats.totalDays) * 100) : 0}% attendance
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.round(stats.totalHours * 10) / 10}</div>
                      <p className="text-xs text-muted-foreground">Hours worked</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Hours/Day</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.round(stats.avgHours * 10) / 10}</div>
                      <p className="text-xs text-muted-foreground">Average per day</p>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>

          {/* Attendance History */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUserAttendanceRecords(user?.id || "")
                  .reverse()
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "long" })}
                          </div>
                        </div>
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{record.totalHours}h</div>
                        <div className="text-sm text-gray-600">
                          {record.clockIn} - {record.clockOut || "In Progress"}
                        </div>
                      </div>
                    </div>
                  ))}

                {getUserAttendanceRecords(user?.id || "").length === 0 && (
                  <div className="text-center py-8 text-gray-500">No attendance records found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewTeamAttendance && (
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Attendance</CardTitle>
                <CardDescription>View attendance for your team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedEmployee && (
                    <div className="space-y-4">
                      {/* Employee Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {(() => {
                          const employeeRecords = getUserAttendanceRecords(selectedEmployee)
                          const stats = getAttendanceStats(employeeRecords)
                          return (
                            <>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{stats.totalDays}</div>
                                  <div className="text-sm text-gray-600">Total Days</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
                                  <div className="text-sm text-gray-600">Present Days</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{Math.round(stats.totalHours * 10) / 10}</div>
                                  <div className="text-sm text-gray-600">Total Hours</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-2xl font-bold">{Math.round(stats.avgHours * 10) / 10}</div>
                                  <div className="text-sm text-gray-600">Avg Hours/Day</div>
                                </CardContent>
                              </Card>
                            </>
                          )
                        })()}
                      </div>

                      {/* Employee Records */}
                      <div className="space-y-2">
                        {getUserAttendanceRecords(selectedEmployee)
                          .reverse()
                          .slice(0, 10)
                          .map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{record.totalHours}h</div>
                                <div className="text-sm text-gray-600">
                                  {record.clockIn} - {record.clockOut || "In Progress"}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
