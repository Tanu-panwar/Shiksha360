"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { DollarSign, Download, FileText, Calculator, TrendingUp, Users, Search, Plus, Eye } from "lucide-react"

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  month: string
  year: number
  basicSalary: number
  allowances: number
  deductions: number
  tax: number
  netSalary: number
  status: "draft" | "processed" | "paid"
  payDate?: string
}

interface SalaryStructure {
  id: string
  employeeId: string
  basicSalary: number
  hra: number
  transportAllowance: number
  medicalAllowance: number
  specialAllowance: number
  providentFund: number
  professionalTax: number
  incomeTax: number
}

export function PayrollManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [showSalarySlip, setShowSalarySlip] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null)
  const [showAddSalary, setShowAddSalary] = useState(false)

  // Mock payroll data
  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      month: "November",
      year: 2024,
      basicSalary: 50000,
      allowances: 15000,
      deductions: 5000,
      tax: 8000,
      netSalary: 52000,
      status: "paid",
      payDate: "2024-11-30",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Jane Smith",
      month: "November",
      year: 2024,
      basicSalary: 45000,
      allowances: 12000,
      deductions: 4500,
      tax: 6500,
      netSalary: 46000,
      status: "processed",
    },
    {
      id: "3",
      employeeId: "3",
      employeeName: "Mike Johnson",
      month: "November",
      year: 2024,
      basicSalary: 55000,
      allowances: 18000,
      deductions: 5500,
      tax: 9500,
      netSalary: 58000,
      status: "draft",
    },
  ])

  const [salaryStructures] = useState<SalaryStructure[]>([
    {
      id: "1",
      employeeId: "1",
      basicSalary: 50000,
      hra: 10000,
      transportAllowance: 3000,
      medicalAllowance: 2000,
      specialAllowance: 0,
      providentFund: 6000,
      professionalTax: 2000,
      incomeTax: 8000,
    },
  ])

  const calculateTotalPayroll = () => {
    return payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)
  }

  const getPayrollStats = () => {
    const total = payrollRecords.length
    const paid = payrollRecords.filter((r) => r.status === "paid").length
    const processed = payrollRecords.filter((r) => r.status === "processed").length
    const draft = payrollRecords.filter((r) => r.status === "draft").length

    return { total, paid, processed, draft }
  }

  const generateSalarySlip = (payroll: PayrollRecord) => {
    const salaryStructure = salaryStructures.find((s) => s.employeeId === payroll.employeeId)

    return {
      ...payroll,
      structure: salaryStructure || {
        basicSalary: payroll.basicSalary,
        hra: payroll.allowances * 0.6,
        transportAllowance: payroll.allowances * 0.2,
        medicalAllowance: payroll.allowances * 0.2,
        specialAllowance: 0,
        providentFund: payroll.deductions * 0.6,
        professionalTax: payroll.deductions * 0.4,
        incomeTax: payroll.tax,
      },
    }
  }

  const downloadSalarySlip = (payroll: PayrollRecord) => {
    // In a real app, this would generate and download a PDF
    const slip = generateSalarySlip(payroll)
    console.log("Downloading salary slip for:", slip)
    alert(`Salary slip for ${payroll.employeeName} - ${payroll.month} ${payroll.year} would be downloaded as PDF`)
  }

  const filteredPayroll = payrollRecords.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth =
      selectedMonth === "" ||
      record.month === new Date(2024, Number.parseInt(selectedMonth)).toLocaleString("default", { month: "long" })
    const matchesYear = selectedYear === "" || record.year.toString() === selectedYear

    return matchesSearch && matchesMonth && matchesYear
  })

  const stats = getPayrollStats()

  const SalarySlipModal = ({ payroll }: { payroll: PayrollRecord }) => {
    const slip = generateSalarySlip(payroll)

    return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Salary Slip - {payroll.month} {payroll.year}
          </DialogTitle>
          <DialogDescription>Employee: {payroll.employeeName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-4 bg-white border rounded-lg">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">Company Name</h2>
            <p className="text-sm text-gray-600">
              Salary Slip for {payroll.month} {payroll.year}
            </p>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Employee Name:</strong> {payroll.employeeName}
              </p>
              <p>
                <strong>Employee ID:</strong> {payroll.employeeId}
              </p>
            </div>
            <div>
              <p>
                <strong>Pay Period:</strong> {payroll.month} {payroll.year}
              </p>
              <p>
                <strong>Pay Date:</strong> {payroll.payDate || "Pending"}
              </p>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-3">Earnings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>₹{slip.structure.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span>₹{slip.structure.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Allowance</span>
                  <span>₹{slip.structure.transportAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Allowance</span>
                  <span>₹{slip.structure.medicalAllowance.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total Earnings</span>
                  <span>₹{(payroll.basicSalary + payroll.allowances).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-red-700 mb-3">Deductions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provident Fund</span>
                  <span>₹{slip.structure.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span>₹{slip.structure.professionalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span>₹{slip.structure.incomeTax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total Deductions</span>
                  <span>₹{(payroll.deductions + payroll.tax).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Net Salary</span>
              <span className="text-green-600">₹{payroll.netSalary.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => downloadSalarySlip(payroll)} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => setShowSalarySlip(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  if (user?.role === "employee") {
    // Employee view - only their own payroll
    const myPayroll = payrollRecords.filter((record) => record.employeeId === user.id)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Payroll</h2>
            <p className="text-gray-600">View your salary slips and payment history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myPayroll.map((payroll) => (
            <Card key={payroll.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {payroll.month} {payroll.year}
                    </CardTitle>
                    <CardDescription>Net Salary: ₹{payroll.netSalary.toLocaleString()}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      payroll.status === "paid" ? "default" : payroll.status === "processed" ? "secondary" : "outline"
                    }
                  >
                    {payroll.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Basic + Allowances</span>
                    <span>₹{(payroll.basicSalary + payroll.allowances).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Deductions</span>
                    <span>-₹{(payroll.deductions + payroll.tax).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPayroll(payroll)
                      setShowSalarySlip(true)
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" onClick={() => downloadSalarySlip(payroll)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-600">Manage employee salaries and generate pay slips</p>
        </div>
        <Button onClick={() => setShowAddSalary(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Process Payroll
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Records</TabsTrigger>
          <TabsTrigger value="salary-structure">Salary Structure</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Total Payroll</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">₹{calculateTotalPayroll().toLocaleString()}</div>
                <p className="text-xs text-green-700">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Employees Paid</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.paid}</div>
                <p className="text-xs text-blue-700">Out of {stats.total} employees</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Processed</CardTitle>
                <Calculator className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats.processed}</div>
                <p className="text-xs text-purple-700">Ready for payment</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Draft</CardTitle>
                <FileText className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.draft}</div>
                <p className="text-xs text-orange-700">Pending processing</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(2024, i).toLocaleString("default", { month: "long" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPayroll.map((payroll) => (
              <Card key={payroll.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{payroll.employeeName}</CardTitle>
                      <CardDescription>
                        {payroll.month} {payroll.year}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        payroll.status === "paid" ? "default" : payroll.status === "processed" ? "secondary" : "outline"
                      }
                    >
                      {payroll.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Salary</span>
                      <span>₹{(payroll.basicSalary + payroll.allowances).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Deductions</span>
                      <span>-₹{(payroll.deductions + payroll.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 border-t pt-2">
                      <span>Net Salary</span>
                      <span>₹{payroll.netSalary.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPayroll(payroll)
                        setShowSalarySlip(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" onClick={() => downloadSalarySlip(payroll)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salary-structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Salary Structures</CardTitle>
              <CardDescription>Manage salary components for each employee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Salary structure management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate comprehensive payroll reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced reporting features coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showSalarySlip} onOpenChange={setShowSalarySlip}>
        {selectedPayroll && <SalarySlipModal payroll={selectedPayroll} />}
      </Dialog>
    </div>
  )
}
