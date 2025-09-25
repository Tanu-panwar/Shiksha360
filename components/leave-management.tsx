"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { CalendarDays, Plus, Eye, Check, X, Clock, Plane, Heart, User, Search, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: "vacation" | "sick" | "personal" | "maternity" | "emergency"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  comments?: string
}

interface LeaveBalance {
  employeeId: string
  vacation: { total: number; used: number; remaining: number }
  sick: { total: number; used: number; remaining: number }
  personal: { total: number; used: number; remaining: number }
  maternity: { total: number; used: number; remaining: number }
}

export function LeaveManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Mock leave data
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      leaveType: "vacation",
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      days: 6,
      reason: "Family vacation during holidays",
      status: "approved",
      appliedDate: "2024-11-15",
      approvedBy: "Jane Smith",
      approvedDate: "2024-11-16",
      comments: "Approved for holiday season",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Jane Smith",
      leaveType: "sick",
      startDate: "2024-11-25",
      endDate: "2024-11-26",
      days: 2,
      reason: "Medical appointment and recovery",
      status: "pending",
      appliedDate: "2024-11-20",
    },
    {
      id: "3",
      employeeId: "3",
      employeeName: "Mike Johnson",
      leaveType: "personal",
      startDate: "2024-12-15",
      endDate: "2024-12-15",
      days: 1,
      reason: "Personal matters",
      status: "rejected",
      appliedDate: "2024-11-18",
      approvedBy: "HR Team",
      approvedDate: "2024-11-19",
      comments: "Insufficient notice period",
    },
  ])

  const [leaveBalances] = useState<LeaveBalance[]>([
    {
      employeeId: "1",
      vacation: { total: 20, used: 8, remaining: 12 },
      sick: { total: 10, used: 2, remaining: 8 },
      personal: { total: 5, used: 1, remaining: 4 },
      maternity: { total: 90, used: 0, remaining: 90 },
    },
    {
      employeeId: "2",
      vacation: { total: 20, used: 5, remaining: 15 },
      sick: { total: 10, used: 3, remaining: 7 },
      personal: { total: 5, used: 0, remaining: 5 },
      maternity: { total: 90, used: 0, remaining: 90 },
    },
  ])

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "vacation":
        return <Plane className="h-4 w-4" />
      case "sick":
        return <Heart className="h-4 w-4" />
      case "personal":
        return <User className="h-4 w-4" />
      case "maternity":
        return <CalendarDays className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "sick":
        return "bg-red-50 text-red-700 border-red-200"
      case "personal":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "maternity":
        return "bg-pink-50 text-pink-700 border-pink-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getMyLeaveBalance = () => {
    return (
      leaveBalances.find((balance) => balance.employeeId === user?.id) || {
        employeeId: user?.id || "",
        vacation: { total: 20, used: 0, remaining: 20 },
        sick: { total: 10, used: 0, remaining: 10 },
        personal: { total: 5, used: 0, remaining: 5 },
        maternity: { total: 90, used: 0, remaining: 90 },
      }
    )
  }

  const getMyRequests = () => {
    return leaveRequests.filter((request) => request.employeeId === user?.id)
  }

  const getPendingRequests = () => {
    return leaveRequests.filter((request) => request.status === "pending")
  }

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const approveRequest = (requestId: string) => {
    console.log("Approving request:", requestId)
    // In a real app, this would update the database
    alert("Leave request approved!")
  }

  const rejectRequest = (requestId: string) => {
    console.log("Rejecting request:", requestId)
    // In a real app, this would update the database
    alert("Leave request rejected!")
  }

  const NewRequestModal = () => {
    const [formData, setFormData] = useState({
      leaveType: "",
      reason: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!startDate || !endDate || !formData.leaveType || !formData.reason) {
        alert("Please fill all required fields")
        return
      }

      const days = calculateDays(startDate, endDate)
      console.log("Submitting leave request:", {
        ...formData,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        days,
      })

      alert("Leave request submitted successfully!")
      setShowNewRequest(false)
      setFormData({ leaveType: "", reason: "" })
      setStartDate(undefined)
      setEndDate(undefined)
    }

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new leave request</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              value={formData.leaveType}
              onValueChange={(value) => setFormData({ ...formData, leaveType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <div className="text-sm text-gray-600">Duration: {calculateDays(startDate, endDate)} day(s)</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    )
  }

  const RequestDetailsModal = ({ request }: { request: LeaveRequest }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogDescription>
          {request.employeeName} - {request.leaveType}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Employee</p>
            <p>{request.employeeName}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Leave Type</p>
            <div className="flex items-center gap-2">
              {getLeaveTypeIcon(request.leaveType)}
              <span className="capitalize">{request.leaveType}</span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700">Start Date</p>
            <p>{format(new Date(request.startDate), "PPP")}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">End Date</p>
            <p>{format(new Date(request.endDate), "PPP")}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Duration</p>
            <p>{request.days} day(s)</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Status</p>
            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Reason</p>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.reason}</p>
        </div>

        {request.comments && (
          <div>
            <p className="font-medium text-gray-700 mb-2">Comments</p>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.comments}</p>
          </div>
        )}

        {request.status === "pending" &&
          (user?.role === "manager" || user?.role === "hr" || user?.role === "admin") && (
            <div className="flex gap-2 pt-4">
              <Button onClick={() => approveRequest(request.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => rejectRequest(request.id)}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
      </div>
    </DialogContent>
  )

  if (user?.role === "employee") {
    const myBalance = getMyLeaveBalance()
    const myRequests = getMyRequests()

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Leave</h2>
            <p className="text-gray-600">Manage your leave requests and view balances</p>
          </div>
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Leave
          </Button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Vacation</CardTitle>
              <Plane className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{myBalance.vacation.remaining}</div>
              <p className="text-xs text-blue-700">
                {myBalance.vacation.used} used of {myBalance.vacation.total}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Sick Leave</CardTitle>
              <Heart className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{myBalance.sick.remaining}</div>
              <p className="text-xs text-red-700">
                {myBalance.sick.used} used of {myBalance.sick.total}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Personal</CardTitle>
              <User className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{myBalance.personal.remaining}</div>
              <p className="text-xs text-purple-700">
                {myBalance.personal.used} used of {myBalance.personal.total}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-900">Maternity</CardTitle>
              <CalendarDays className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">{myBalance.maternity.remaining}</div>
              <p className="text-xs text-pink-700">
                {myBalance.maternity.used} used of {myBalance.maternity.total}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
            <CardDescription>Your recent and upcoming leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getLeaveTypeColor(request.leaveType)}`}>
                      {getLeaveTypeIcon(request.leaveType)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{request.leaveType} Leave</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(request.startDate), "MMM dd")} -{" "}
                        {format(new Date(request.endDate), "MMM dd, yyyy")} ({request.days} days)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowRequestDetails(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {myRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No leave requests found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <NewRequestModal />
        </Dialog>

        <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
          {selectedRequest && <RequestDetailsModal request={selectedRequest} />}
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Manage employee leave requests and balances</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending ({getPendingRequests().length})</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Requests</CardTitle>
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{leaveRequests.length}</div>
                <p className="text-xs text-blue-700">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">{getPendingRequests().length}</div>
                <p className="text-xs text-yellow-700">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Approved</CardTitle>
                <Check className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {leaveRequests.filter((r) => r.status === "approved").length}
                </div>
                <p className="text-xs text-green-700">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-900">Rejected</CardTitle>
                <X className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">
                  {leaveRequests.filter((r) => r.status === "rejected").length}
                </div>
                <p className="text-xs text-red-700">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getLeaveTypeColor(request.leaveType)}`}>
                        {getLeaveTypeIcon(request.leaveType)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{request.leaveType} Leave</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(request.startDate), "MMM dd")} -{" "}
                          {format(new Date(request.endDate), "MMM dd, yyyy")} ({request.days} days)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div className="space-y-4">
            {getPendingRequests().map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getLeaveTypeColor(request.leaveType)}`}>
                        {getLeaveTypeIcon(request.leaveType)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{request.leaveType} Leave</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(request.startDate), "MMM dd")} -{" "}
                          {format(new Date(request.endDate), "MMM dd, yyyy")} ({request.days} days)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Applied: {format(new Date(request.appliedDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectRequest(request.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getPendingRequests().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No pending requests</p>
                <p>All leave requests have been processed</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>Visual overview of all leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <CalendarDays className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Calendar View</p>
                <p>Interactive leave calendar coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        {selectedRequest && <RequestDetailsModal request={selectedRequest} />}
      </Dialog>
    </div>
  )
}
