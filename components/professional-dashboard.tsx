"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import {
  Users,
  CalendarDays,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  CheckSquare,
  AlertCircle,
  Target,
  Award,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const attendanceData = [
  { month: "Jan", present: 92, absent: 8 },
  { month: "Feb", present: 88, absent: 12 },
  { month: "Mar", present: 95, absent: 5 },
  { month: "Apr", present: 90, absent: 10 },
  { month: "May", present: 93, absent: 7 },
  { month: "Jun", present: 89, absent: 11 },
]

const salaryData = [
  { department: "Engineering", average: 85000, count: 45 },
  { department: "Marketing", average: 65000, count: 23 },
  { department: "Sales", average: 70000, count: 32 },
  { department: "HR", average: 60000, count: 12 },
  { department: "Finance", average: 75000, count: 18 },
]

const performanceData = [
  { name: "Excellent", value: 35, color: "#10b981" },
  { name: "Good", value: 45, color: "#3b82f6" },
  { name: "Average", value: 15, color: "#f59e0b" },
  { name: "Needs Improvement", value: 5, color: "#ef4444" },
]

const taskCompletionData = [
  { week: "Week 1", completed: 85, pending: 15 },
  { week: "Week 2", completed: 78, pending: 22 },
  { week: "Week 3", completed: 92, pending: 8 },
  { week: "Week 4", completed: 88, pending: 12 },
]

export function ProfessionalDashboard() {
  const { user } = useAuth()
  const { employees, tasks, attendance } = useData()

  const getEmployeeStats = () => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) => emp.status === "active").length
    const newHires = employees.filter((emp) => {
      const hireDate = new Date(emp.hireDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return hireDate >= thirtyDaysAgo
    }).length

    return { totalEmployees, activeEmployees, newHires }
  }

  const getTaskStats = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const pendingTasks = tasks.filter((task) => task.status === "pending").length
    const overdueTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate)
      return dueDate < new Date() && task.status !== "completed"
    }).length

    return { totalTasks, completedTasks, pendingTasks, overdueTasks }
  }

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayAttendance = attendance.filter((att) => att.date === today)
    const presentToday = todayAttendance.filter((att) => att.status === "present").length
    const totalExpected = employees.length
    const attendanceRate = totalExpected > 0 ? Math.round((presentToday / totalExpected) * 100) : 0

    return { presentToday, totalExpected, attendanceRate }
  }

  const employeeStats = getEmployeeStats()
  const taskStats = getTaskStats()
  const attendanceStats = getAttendanceStats()

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{employeeStats.totalEmployees}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-700">+{employeeStats.newHires} new hires</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Attendance Today</CardTitle>
            <Clock className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-green-700">
              {attendanceStats.presentToday}/{attendanceStats.totalExpected} present
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Task Completion</CardTitle>
            <CheckSquare className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {taskStats.totalTasks > 0 ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-purple-700">
              {taskStats.completedTasks}/{taskStats.totalTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Overdue Tasks</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{taskStats.overdueTasks}</div>
            <p className="text-xs text-orange-700">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-gray-900">Attendance Trends</CardTitle>
            <CardDescription>Monthly attendance vs absence rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="present"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="absent"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-gray-900">Performance Distribution</CardTitle>
            <CardDescription>Employee performance ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Salary by Department */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-gray-900">Average Salary by Department</CardTitle>
            <CardDescription>Compensation analysis across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Average Salary"]} />
                  <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Trends */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-gray-900">Weekly Task Completion</CardTitle>
            <CardDescription>Task completion vs pending tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50">
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Engineering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Performance</span>
              <Badge className="bg-emerald-100 text-emerald-800">Excellent</Badge>
            </div>
            <Progress value={92} className="h-2" />
            <div className="flex justify-between text-xs text-emerald-600">
              <span>45 employees</span>
              <span>92% efficiency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Performance</span>
              <Badge className="bg-blue-100 text-blue-800">Good</Badge>
            </div>
            <Progress value={85} className="h-2" />
            <div className="flex justify-between text-xs text-blue-600">
              <span>23 employees</span>
              <span>85% efficiency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Performance</span>
              <Badge className="bg-purple-100 text-purple-800">Good</Badge>
            </div>
            <Progress value={88} className="h-2" />
            <div className="flex justify-between text-xs text-purple-600">
              <span>32 employees</span>
              <span>88% efficiency</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
          <CardDescription>Frequently used HR operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/50 hover:bg-white">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Add Employee</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/50 hover:bg-white">
              <CalendarDays className="h-6 w-6 text-green-600" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/50 hover:bg-white">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/50 hover:bg-white">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <span className="text-sm">Process Payroll</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
