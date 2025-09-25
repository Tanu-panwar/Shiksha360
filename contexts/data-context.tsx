"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./auth-context"

export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  date: string
  clockIn?: string
  clockOut?: string
  breakStart?: string
  breakEnd?: string
  totalHours: number
  status: "present" | "absent" | "late" | "half-day"
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId?: string
  departmentId?: string
  message: string
  timestamp: string
  type: "direct" | "department" | "announcement"
}

interface DataContextType {
  departments: Department[]
  tasks: Task[]
  attendance: AttendanceRecord[]
  messages: ChatMessage[]
  employees: User[]
  addDepartment: (dept: Omit<Department, "id" | "createdAt">) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addAttendance: (record: Omit<AttendanceRecord, "id">) => void
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  addEmployee: (employee: User) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [employees, setEmployees] = useState<User[]>([])

  useEffect(() => {
    // Load data from localStorage
    const savedDepartments = localStorage.getItem("hr-departments")
    const savedTasks = localStorage.getItem("hr-tasks")
    const savedAttendance = localStorage.getItem("hr-attendance")
    const savedMessages = localStorage.getItem("hr-messages")
    const savedEmployees = localStorage.getItem("hr-employees")

    if (savedDepartments) setDepartments(JSON.parse(savedDepartments))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance))
    if (savedMessages) setMessages(JSON.parse(savedMessages))
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees))

    // Initialize with sample data if empty
    if (!savedDepartments) {
      const sampleDepts: Department[] = [
        {
          id: "dept-hr",
          name: "Human Resources",
          description: "Manages employee relations and policies",
          managerId: "manager-hr",
          createdAt: new Date().toISOString(),
        },
        {
          id: "dept-general",
          name: "General",
          description: "General department for all employees",
          managerId: "manager-1",
          createdAt: new Date().toISOString(),
        },
      ]
      setDepartments(sampleDepts)
      localStorage.setItem("hr-departments", JSON.stringify(sampleDepts))
    }
  }, [])

  const addDepartment = (dept: Omit<Department, "id" | "createdAt">) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    const updated = [...departments, newDept]
    setDepartments(updated)
    localStorage.setItem("hr-departments", JSON.stringify(updated))
  }

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    const updated = [...tasks, newTask]
    setTasks(updated)
    localStorage.setItem("hr-tasks", JSON.stringify(updated))
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    setTasks(updated)
    localStorage.setItem("hr-tasks", JSON.stringify(updated))
  }

  const addAttendance = (record: Omit<AttendanceRecord, "id">) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
    }
    const updated = [...attendance, newRecord]
    setAttendance(updated)
    localStorage.setItem("hr-attendance", JSON.stringify(updated))
  }

  const addMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    const updated = [...messages, newMessage]
    setMessages(updated)
    localStorage.setItem("hr-messages", JSON.stringify(updated))
  }

  const addEmployee = (employee: User) => {
    const updated = [...employees, employee]
    setEmployees(updated)
    localStorage.setItem("hr-employees", JSON.stringify(updated))
  }

  return (
    <DataContext.Provider
      value={{
        departments,
        tasks,
        attendance,
        messages,
        employees,
        addDepartment,
        addTask,
        updateTask,
        addAttendance,
        addMessage,
        addEmployee,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
