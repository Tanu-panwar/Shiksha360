"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  Upload,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Eye,
} from "lucide-react"

interface Expense {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  category: string
  amount: number
  currency: string
  date: string
  status: "draft" | "submitted" | "approved" | "rejected" | "reimbursed"
  receiptUrl?: string
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  reimbursedAt?: string
  createdAt: string
}

interface ExpensePolicy {
  id: string
  category: string
  maxAmount: number
  requiresReceipt: boolean
  requiresApproval: boolean
  description: string
}

export function ExpenseManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("my-expenses")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock data - in real app, this would come from API/database
  const [expenses] = useState<Expense[]>([
    {
      id: "1",
      userId: user?.id || "1",
      userName: user?.name || "John Doe",
      title: "Client Lunch Meeting",
      description: "Business lunch with potential client to discuss project requirements",
      category: "Meals & Entertainment",
      amount: 85.5,
      currency: "USD",
      date: "2024-02-15",
      status: "approved",
      receiptUrl: "/restaurant-receipt.png",
      submittedAt: "2024-02-15T10:30:00Z",
      approvedAt: "2024-02-16T09:15:00Z",
      approvedBy: "Sarah Johnson",
      createdAt: "2024-02-15T10:00:00Z",
    },
    {
      id: "2",
      userId: user?.id || "1",
      userName: user?.name || "John Doe",
      title: "Office Supplies",
      description: "Notebooks, pens, and sticky notes for team",
      category: "Office Supplies",
      amount: 45.2,
      currency: "USD",
      date: "2024-02-14",
      status: "submitted",
      receiptUrl: "/office-supplies-receipt.png",
      submittedAt: "2024-02-14T14:20:00Z",
      createdAt: "2024-02-14T14:00:00Z",
    },
    {
      id: "3",
      userId: "2",
      userName: "Jane Smith",
      title: "Conference Registration",
      description: "Annual HR Conference 2024 registration fee",
      category: "Training & Development",
      amount: 299.0,
      currency: "USD",
      date: "2024-02-13",
      status: "submitted",
      submittedAt: "2024-02-13T11:45:00Z",
      createdAt: "2024-02-13T11:30:00Z",
    },
    {
      id: "4",
      userId: user?.id || "1",
      userName: user?.name || "John Doe",
      title: "Travel Accommodation",
      description: "Hotel stay for business trip to Chicago",
      category: "Travel",
      amount: 180.0,
      currency: "USD",
      date: "2024-02-12",
      status: "reimbursed",
      receiptUrl: "/hotel-receipt.png",
      submittedAt: "2024-02-12T16:00:00Z",
      approvedAt: "2024-02-13T10:30:00Z",
      approvedBy: "Mike Wilson",
      reimbursedAt: "2024-02-14T12:00:00Z",
      createdAt: "2024-02-12T15:45:00Z",
    },
  ])

  const [expensePolicies] = useState<ExpensePolicy[]>([
    {
      id: "1",
      category: "Meals & Entertainment",
      maxAmount: 100,
      requiresReceipt: true,
      requiresApproval: true,
      description: "Business meals and client entertainment",
    },
    {
      id: "2",
      category: "Travel",
      maxAmount: 500,
      requiresReceipt: true,
      requiresApproval: true,
      description: "Transportation, accommodation, and travel-related expenses",
    },
    {
      id: "3",
      category: "Office Supplies",
      maxAmount: 50,
      requiresReceipt: false,
      requiresApproval: false,
      description: "Basic office supplies and materials",
    },
    {
      id: "4",
      category: "Training & Development",
      maxAmount: 1000,
      requiresReceipt: true,
      requiresApproval: true,
      description: "Professional development, courses, and conferences",
    },
  ])

  const myExpenses = expenses.filter((expense) => expense.userId === user?.id)
  const allExpenses = user?.role === "manager" || user?.role === "hr" || user?.role === "admin" ? expenses : myExpenses

  const filteredExpenses = allExpenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || expense.status === selectedStatus
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "reimbursed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "reimbursed":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTotalExpenses = (status?: string) => {
    const expensesToCalculate = status ? myExpenses.filter((e) => e.status === status) : myExpenses
    return expensesToCalculate.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const ExpenseCard = ({ expense }: { expense: Expense }) => (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white/60 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">{expense.title}</CardTitle>
            <CardDescription className="mt-1">{expense.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(expense.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(expense.status)}
              {expense.status}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(expense.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                <span>{expense.category}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{expense.currency}</div>
            </div>
          </div>

          {expense.receiptUrl && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Receipt className="h-4 w-4" />
              <span>Receipt attached</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {expense.status === "submitted" && expense.submittedAt && (
                <span>Submitted {new Date(expense.submittedAt).toLocaleDateString()}</span>
              )}
              {expense.status === "approved" && expense.approvedAt && expense.approvedBy && (
                <span>
                  Approved by {expense.approvedBy} on {new Date(expense.approvedAt).toLocaleDateString()}
                </span>
              )}
              {expense.status === "reimbursed" && expense.reimbursedAt && (
                <span>Reimbursed on {new Date(expense.reimbursedAt).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {expense.receiptUrl && (
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {(user?.role === "manager" || user?.role === "hr" || user?.role === "admin") &&
                expense.status === "submitted" && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 bg-transparent">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
          <p className="text-gray-600">Track and manage your business expenses</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Expense</DialogTitle>
              <DialogDescription>Add a new expense for reimbursement</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Expense Title</Label>
                  <Input id="title" placeholder="Enter expense title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expensePolicies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.category}>
                          {policy.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter expense description" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt</Label>
                <div className="flex items-center gap-2">
                  <Input id="receipt" type="file" accept="image/*,.pdf" />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Submit for Approval</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <TabsTrigger value="my-expenses" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            My Expenses
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Policies
          </TabsTrigger>
          {(user?.role === "manager" || user?.role === "hr" || user?.role === "admin") && (
            <TabsTrigger value="all-expenses" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              All Expenses
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="my-expenses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Expenses</CardTitle>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">${getTotalExpenses().toFixed(2)}</div>
                <p className="text-xs text-blue-700">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
                <Clock className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">${getTotalExpenses("submitted").toFixed(2)}</div>
                <p className="text-xs text-yellow-700">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Approved</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">${getTotalExpenses("approved").toFixed(2)}</div>
                <p className="text-xs text-green-700">Ready for reimbursement</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Reimbursed</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">${getTotalExpenses("reimbursed").toFixed(2)}</div>
                <p className="text-xs text-purple-700">Completed</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                My Expense History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="reimbursed">Reimbursed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expensePolicies.map((policy) => (
                      <SelectItem key={policy.id} value={policy.category}>
                        {policy.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Expense Policies
              </CardTitle>
              <CardDescription>Guidelines and limits for expense submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensePolicies.map((policy) => (
                  <div key={policy.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{policy.category}</h4>
                        <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Max: ${policy.maxAmount}</span>
                          {policy.requiresReceipt && <Badge variant="outline">Receipt Required</Badge>}
                          {policy.requiresApproval && <Badge variant="outline">Approval Required</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(user?.role === "manager" || user?.role === "hr" || user?.role === "admin") && (
          <TabsContent value="all-expenses" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  All Employee Expenses
                </CardTitle>
                <CardDescription>Review and approve expense submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search all expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="reimbursed">Reimbursed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredExpenses.map((expense) => (
                    <ExpenseCard key={expense.id} expense={expense} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
