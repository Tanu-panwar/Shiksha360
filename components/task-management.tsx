"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useData, type Task } from "@/contexts/data-context"
import { Search, Plus, Eye, Calendar, Clock, User, AlertCircle, CheckCircle2, Circle } from "lucide-react"

interface TaskFormData {
  title: string
  description: string
  assignedTo: string
  priority: "low" | "medium" | "high"
  dueDate: string
}

export function TaskManagement() {
  const { user } = useAuth()
  const { tasks, employees, addTask, updateTask } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("my-tasks")
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  })

  // Sample tasks for demo
  useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Omit<Task, "id" | "createdAt">[] = [
        {
          title: "Complete Quarterly Report",
          description: "Prepare and submit the Q4 financial report",
          assignedTo: user?.id || "emp-1",
          assignedBy: "manager-hr",
          status: "in-progress",
          priority: "high",
          dueDate: "2024-12-31",
        },
        {
          title: "Update Employee Handbook",
          description: "Review and update company policies in the employee handbook",
          assignedTo: "emp-2",
          assignedBy: user?.id || "manager-hr",
          status: "pending",
          priority: "medium",
          dueDate: "2024-12-25",
        },
        {
          title: "Organize Team Building Event",
          description: "Plan and coordinate the annual team building event",
          assignedTo: "emp-3",
          assignedBy: "manager-hr",
          status: "completed",
          priority: "low",
          dueDate: "2024-12-15",
        },
      ]
      sampleTasks.forEach(addTask)
    }
  }, [tasks.length, addTask, user?.id])

  const getFilteredTasks = () => {
    let filteredTasks = tasks

    // Filter by tab
    if (activeTab === "my-tasks") {
      filteredTasks = tasks.filter((task) => task.assignedTo === user?.id)
    } else if (activeTab === "assigned-by-me") {
      filteredTasks = tasks.filter((task) => task.assignedBy === user?.id)
    }

    // Apply search and filters
    return filteredTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
  }

  const handleAddTask = () => {
    addTask({
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      assignedBy: user?.id || "",
      status: "pending",
      priority: formData.priority,
      dueDate: formData.dueDate,
    })
    setIsAddDialogOpen(false)
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    })
  }

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    updateTask(taskId, { status: newStatus })
  }

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    return employee?.name || "Unknown Employee"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Circle className="h-4 w-4 text-gray-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const canCreateTasks = user?.role === "manager" || user?.role === "hr" || user?.role === "admin"

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Manage your tasks and assignments</CardDescription>
            </div>
            {canCreateTasks && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Assign a new task to a team member</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        value={formData.assignedTo}
                        onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                      >
                        <SelectTrigger>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            setFormData({ ...formData, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>Create Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          {canCreateTasks && <TabsTrigger value="assigned-by-me">Assigned by Me</TabsTrigger>}
          <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Circle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getFilteredTasks().length}</div>
                <p className="text-xs text-muted-foreground">Active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getFilteredTasks().filter((t) => t.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting start</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getFilteredTasks().filter((t) => t.status === "in-progress").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently working</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getFilteredTasks().filter((t) => t.status === "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Finished tasks</p>
              </CardContent>
            </Card>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {getFilteredTasks().map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                          {isOverdue(task.dueDate) && task.status !== "completed" && (
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Assigned to: {getEmployeeName(task.assignedTo)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span
                              className={
                                isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600 font-medium" : ""
                              }
                            >
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Badge className={`${getPriorityColor(task.priority)} capitalize`}>{task.priority}</Badge>
                        <Badge className={`${getStatusColor(task.status)} capitalize`}>
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog
                      open={isViewDialogOpen && selectedTask?.id === task.id}
                      onOpenChange={(open) => {
                        setIsViewDialogOpen(open)
                        if (open) setSelectedTask(task)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            {task.title}
                          </DialogTitle>
                          <DialogDescription>Task details and information</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Status</Label>
                              <Badge className={`${getStatusColor(task.status)} capitalize mt-1`}>
                                {task.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Priority</Label>
                              <Badge className={`${getPriorityColor(task.priority)} capitalize mt-1`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Assigned To</Label>
                              <p className="text-sm text-gray-600 mt-1">{getEmployeeName(task.assignedTo)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Assigned By</Label>
                              <p className="text-sm text-gray-600 mt-1">{getEmployeeName(task.assignedBy)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Due Date</Label>
                              <p
                                className={`text-sm mt-1 ${isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600 font-medium" : "text-gray-600"}`}
                              >
                                {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Created</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {(task.assignedTo === user?.id || task.assignedBy === user?.id) && (
                      <Select
                        value={task.status}
                        onValueChange={(value: Task["status"]) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {getFilteredTasks().length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
