"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckSquare,
  AlertTriangle,
  Target,
  Award,
  Activity,
  PieChart,
  FileText,
} from "lucide-react"

export function ManagerHRDashboard() {
  const { user } = useAuth()
  const { employees, departments, tasks, attendance, messages } = useData()
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Calculate team metrics
  const getTeamMetrics = () => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) =>
      attendance.some((att) => att.userId === emp.id && att.status === "present"),
    ).length

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const overdueTasks = tasks.filter(
      (task) => new Date(task.dueDate) < new Date() && task.status !== "completed",
    ).length

    const totalMessages = messages.length
    const recentMessages = messages.filter(
      (msg) => new Date(msg.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length

    return {
      totalEmployees,
      activeEmployees,
      totalTasks,
      completedTasks,
      overdueTasks,
      totalMessages,
      recentMessages,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      attendanceRate: totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
    }
  }

  // Get department performance
  const getDepartmentPerformance = () => {
    return departments.map((dept) => {
      const deptEmployees = employees.filter((emp) => emp.departmentId === dept.id)
      const deptTasks = tasks.filter((task) => deptEmployees.some((emp) => emp.id === task.assignedTo))
      const completedDeptTasks = deptTasks.filter((task) => task.status === "completed")

      return {
        id: dept.id,
        name: dept.name,
        employeeCount: deptEmployees.length,
        taskCount: deptTasks.length,
        completedTasks: completedDeptTasks.length,
        completionRate: deptTasks.length > 0 ? Math.round((completedDeptTasks.length / deptTasks.length) * 100) : 0,
      }
    })
  }

  // Get top performers
  const getTopPerformers = () => {
    return employees
      .map((emp) => {
        const empTasks = tasks.filter((task) => task.assignedTo === emp.id)
        const completedTasks = empTasks.filter((task) => task.status === "completed")
        const empAttendance = attendance.filter((att) => att.userId === emp.id)
        const avgHours =
          empAttendance.length > 0
            ? empAttendance.reduce((sum, att) => sum + att.totalHours, 0) / empAttendance.length
            : 0

        return {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          tasksCompleted: completedTasks.length,
          totalTasks: empTasks.length,
          completionRate: empTasks.length > 0 ? Math.round((completedTasks.length / empTasks.length) * 100) : 0,
          avgHours: Math.round(avgHours * 10) / 10,
          attendanceCount: empAttendance.length,
        }
      })
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)
  }

  // Get recent activities
  const getRecentActivities = () => {
    const activities = []

    // Recent tasks
    const recentTasks = tasks
      .filter((task) => new Date(task.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .slice(0, 3)

    recentTasks.forEach((task) => {
      const assignee = employees.find((emp) => emp.id === task.assignedTo)
      activities.push({
        type: "task",
        message: `New task "${task.title}" assigned to ${assignee?.name}`,
        time: task.createdAt,
        priority: task.priority,
      })
    })

    // Recent attendance
    const recentAttendance = attendance
      .filter((att) => new Date(att.date) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
      .slice(0, 2)

    recentAttendance.forEach((att) => {
      const employee = employees.find((emp) => emp.id === att.userId)
      activities.push({
        type: "attendance",
        message: `${employee?.name} logged ${att.totalHours} hours`,
        time: att.date,
        status: att.status,
      })
    })

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
  }

  const metrics = getTeamMetrics()
  const deptPerformance = getDepartmentPerformance()
  const topPerformers = getTopPerformers()
  const recentActivities = getRecentActivities()

  const isManager = user?.role === "manager" || user?.role === "hr" || user?.role === "admin"

  if (!isManager) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Management Dashboard</CardTitle>
          <CardDescription>Access restricted to managers and HR personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">You don't have permission to access management analytics.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Management Dashboard</CardTitle>
              <CardDescription>Advanced analytics and team insights</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {metrics.activeEmployees} active today
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.taskCompletionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.completedTasks} of {metrics.totalTasks} tasks completed
                </p>
                <Progress value={metrics.taskCompletionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.attendanceRate}%</div>
                <p className="text-xs text-muted-foreground">{metrics.activeEmployees} employees present</p>
                <Progress value={metrics.attendanceRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{metrics.overdueTasks}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Task completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptPerformance.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-gray-600">
                          {dept.employeeCount} employees • {dept.taskCount} tasks
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{dept.completionRate}%</div>
                      <div className="text-sm text-gray-600">completion rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest team updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {activity.type === "task" ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-green-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-600">{new Date(activity.time).toLocaleDateString()}</p>
                    </div>
                    {activity.priority && (
                      <Badge
                        className={
                          activity.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : activity.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {activity.priority}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Employees with highest task completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{performer.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{performer.completionRate}%</div>
                      <div className="text-sm text-gray-600">
                        {performer.tasksCompleted}/{performer.totalTasks} tasks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Current task status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{tasks.filter((t) => t.status === "completed").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{tasks.filter((t) => t.status === "in-progress").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">{tasks.filter((t) => t.status === "pending").length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Productivity</CardTitle>
                <CardDescription>Average hours and task completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Hours/Day</span>
                    <span className="font-medium">7.2h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasks/Employee</span>
                    <span className="font-medium">{Math.round(tasks.length / employees.length)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">{metrics.taskCompletionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Weekly attendance patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Attendance chart visualization</p>
                    <p className="text-sm">Would integrate with charting library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trends</CardTitle>
                <CardDescription>Monthly task completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Task trends chart visualization</p>
                    <p className="text-sm">Would integrate with charting library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Workload</CardTitle>
                <CardDescription>Task distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Workload distribution chart</p>
                    <p className="text-sm">Would integrate with charting library</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Activity</CardTitle>
                <CardDescription>Message volume and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Messages</span>
                    <span className="font-medium">{metrics.totalMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">{metrics.recentMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg/Day</span>
                    <span className="font-medium">{Math.round(metrics.recentMessages / 7)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Employee Report
                </CardTitle>
                <CardDescription>Comprehensive employee performance and attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Task Analytics
                </CardTitle>
                <CardDescription>Task completion rates and productivity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Tracking
                </CardTitle>
                <CardDescription>Detailed time and attendance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Summary
                </CardTitle>
                <CardDescription>Department-wise performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Review
                </CardTitle>
                <CardDescription>Individual and team performance assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
                <CardDescription>Recent activities and system usage</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
