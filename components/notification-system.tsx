"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  category: "task" | "attendance" | "chat" | "system" | "hr"
}

export function NotificationSystem() {
  const { user } = useAuth()
  const { tasks, attendance } = useData()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Create beep sound effect
  useEffect(() => {
    const audio = new Audio()
    // Simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    audioRef.current = { play: createBeepSound } as any
  }, [])

  // Generate sample notifications based on user role and data
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = []

      // Welcome notification
      newNotifications.push({
        id: `welcome-${Date.now()}`,
        title: "Welcome to HR System!",
        message: `Hello ${user?.name}, you're logged in as ${user?.role}. Explore all the features available to you.`,
        type: "info",
        timestamp: new Date(),
        read: false,
        category: "system",
      })

      // Role-specific notifications
      if (user?.role === "Admin" || user?.role === "HR") {
        newNotifications.push({
          id: `hr-${Date.now()}`,
          title: "System Update",
          message: "New employee onboarding process has been updated. Please review the changes.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          category: "hr",
        })
      }

      if (user?.role === "Manager" || user?.role === "Admin") {
        newNotifications.push({
          id: `manager-${Date.now()}`,
          title: "Team Performance Report",
          message: "Weekly team performance report is ready for review.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          category: "system",
        })
      }

      // Task-related notifications
      if (tasks.length > 0) {
        const overdueTasks = tasks.filter(
          (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed",
        )

        if (overdueTasks.length > 0) {
          newNotifications.push({
            id: `overdue-${Date.now()}`,
            title: "Overdue Tasks",
            message: `You have ${overdueTasks.length} overdue task(s). Please review and update them.`,
            type: "warning",
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            read: false,
            category: "task",
          })
        }
      }

      // Attendance notifications
      const today = new Date().toDateString()
      const todayAttendance = attendance.find((a) => a.userId === user?.id && new Date(a.date).toDateString() === today)

      if (!todayAttendance?.clockIn) {
        newNotifications.push({
          id: `attendance-${Date.now()}`,
          title: "Clock In Reminder",
          message: "Don't forget to clock in for today!",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
          category: "attendance",
        })
      }

      // Chat notifications
      newNotifications.push({
        id: `chat-${Date.now()}`,
        title: "New Message",
        message: "You have new messages in the team chat.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        read: false,
        category: "chat",
      })

      setNotifications(newNotifications)
    }

    generateNotifications()
  }, [user, tasks, attendance])

  // Play beep sound for new notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read)
    if (unreadNotifications.length > 0 && audioRef.current) {
      audioRef.current.play()
    }
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
