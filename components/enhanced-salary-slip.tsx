"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Download, Mail, FileText, User, Eye, Settings, X, Edit, Save } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EnhancedPayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  designation: string
  department: string
  month: string
  year: number
  payDate: string
  basicSalary: number
  allowances: {
    hra: number // House Rent Allowance
    conveyanceAllowance: number // Conveyance Allowance
    otherAllowances: number // Other Allowances
  }
  deductions: {
    providentFund: number // PF - Deductible amount
    professionalTax: number // PT - Deductible amount
    tds: number // TDS - Tax Deducted at Source
    otherDeductions: number
  }
  grossSalary: number
  totalDeductions: number
  netSalary: number // Final Salary (Gross - Deductions)
  workingDays: number
  presentDays: number
  leaves: number
  bankAccount: string
  panNumber: string
}

const samplePayrollData: EnhancedPayrollRecord[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "John Doe",
    employeeCode: "ZR001",
    designation: "Software Engineer",
    department: "Engineering",
    month: "December",
    year: 2024,
    payDate: "2024-12-31",
    basicSalary: 50000,
    allowances: {
      hra: 20000,
      conveyanceAllowance: 3000,
      otherAllowances: 7500,
    },
    deductions: {
      providentFund: 6000,
      professionalTax: 200,
      tds: 8000,
      otherDeductions: 2000,
    },
    grossSalary: 80500,
    totalDeductions: 16200,
    netSalary: 64300,
    workingDays: 22,
    presentDays: 21,
    leaves: 1,
    bankAccount: "XXXX-XXXX-1234",
    panNumber: "ABCDE1234F",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    employeeCode: "ZR002",
    designation: "HR Manager",
    department: "Human Resources",
    month: "December",
    year: 2024,
    payDate: "2024-12-31",
    basicSalary: 60000,
    allowances: {
      hra: 24000,
      conveyanceAllowance: 3500,
      otherAllowances: 8500,
    },
    deductions: {
      providentFund: 7200,
      professionalTax: 200,
      tds: 12000,
      otherDeductions: 0,
    },
    grossSalary: 96000,
    totalDeductions: 19400,
    netSalary: 76600,
    workingDays: 22,
    presentDays: 22,
    leaves: 0,
    bankAccount: "XXXX-XXXX-5678",
    panNumber: "FGHIJ5678K",
  },
]

export function EnhancedSalarySlip() {
  const { user } = useAuth()
  const [payrollData, setPayrollData] = useState<EnhancedPayrollRecord[]>(samplePayrollData)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("December")
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [showSalarySlip, setShowSalarySlip] = useState(false)
  const [currentPayroll, setCurrentPayroll] = useState<EnhancedPayrollRecord | null>(null)
  const [showHRPanel, setShowHRPanel] = useState(false)
  const [editingPayroll, setEditingPayroll] = useState<EnhancedPayrollRecord | null>(null)

  const recalculateSalary = (payroll: EnhancedPayrollRecord): EnhancedPayrollRecord => {
    const grossSalary =
      payroll.basicSalary +
      payroll.allowances.hra +
      payroll.allowances.conveyanceAllowance +
      payroll.allowances.otherAllowances
    const totalDeductions =
      payroll.deductions.providentFund +
      payroll.deductions.professionalTax +
      payroll.deductions.tds +
      payroll.deductions.otherDeductions
    const netSalary = grossSalary - totalDeductions

    return {
      ...payroll,
      grossSalary,
      totalDeductions,
      netSalary,
    }
  }

  const openHRPanel = (payroll: EnhancedPayrollRecord) => {
    setEditingPayroll({ ...payroll })
    setShowHRPanel(true)
  }

  const updateSalaryComponent = (field: string, value: number) => {
    if (!editingPayroll) return

    const updatedPayroll = { ...editingPayroll }
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      ;(updatedPayroll as any)[parent][child] = value
    } else {
      ;(updatedPayroll as any)[field] = value
    }

    setEditingPayroll(recalculateSalary(updatedPayroll))
  }

  const saveSalaryChanges = () => {
    if (!editingPayroll) return

    const updatedData = payrollData.map((p) => (p.id === editingPayroll.id ? editingPayroll : p))
    setPayrollData(updatedData)
    setShowHRPanel(false)
    setEditingPayroll(null)
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = [2022, 2023, 2024, 2025]

  const numberToWords = (num: number): string => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]

    if (num === 0) return "Zero"

    function convertLessThanOneThousand(n: number): string {
      if (n < 10) return ones[n]
      if (n < 20) return teens[n - 10]

      const ten = Math.floor(n / 10)
      const one = n % 10
      if (one > 0) {
        return tens[ten] + " " + ones[one]
      } else {
        return tens[ten]
      }
    }

    if (num >= 10000000) return "Number too large"

    let result = ""

    if ((num / 100000) % 100 < 100) {
      result += convertLessThanOneThousand(Math.floor((num / 100000) % 100)) + " Lakh "
    }

    if ((num / 1000) % 100 < 100) {
      result += convertLessThanOneThousand(Math.floor((num / 1000) % 100)) + " Thousand "
    }

    if ((num / 100) % 10 < 10) {
      result += convertLessThanOneThousand(Math.floor((num / 100) % 10)) + " Hundred "
    }

    if (num % 100 < 100 && num >= 100) {
      result += "and "
    }

    if (num % 100 < 100) {
      result += convertLessThanOneThousand(num % 100)
    }

    return result
  }

  const generatePDF = (payroll: EnhancedPayrollRecord) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Slip - ${payroll.employeeName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .salary-slip { max-width: 800px; margin: 0 auto; background: white; border: 2px solid #ddd; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .company-tagline { font-size: 14px; opacity: 0.9; }
            .employee-info { padding: 20px; background: #f8f9fa; border-bottom: 1px solid #ddd; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { display: flex; justify-content: space-between; padding: 5px 0; }
            .info-label { font-weight: 600; color: #555; }
            .salary-breakdown { display: grid; grid-template-columns: 1fr 1fr; }
            .earnings, .deductions { padding: 20px; }
            .earnings { border-right: 1px solid #ddd; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #667eea; }
            .amount-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .amount-label { color: #555; }
            .amount-value { font-weight: 600; color: #333; }
            .total-row { background: #f8f9fa; font-weight: bold; border: none; margin-top: 10px; padding: 12px 0; }
            .net-salary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .net-amount { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .footer { padding: 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #ddd; }
            @media print { body { background: white; } .salary-slip { border: none; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="salary-slip">
            <div class="header">
              <div class="company-name">Zrosis HR System</div>
              <div class="company-tagline">Salary Slip for ${payroll.month} ${payroll.year}</div>
            </div>
            
            <div class="employee-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Employee Name:</span>
                  <span>${payroll.employeeName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Employee Code:</span>
                  <span>${payroll.employeeCode}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Designation:</span>
                  <span>${payroll.designation}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Department:</span>
                  <span>${payroll.department}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Pay Date:</span>
                  <span>${payroll.payDate}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">PAN Number:</span>
                  <span>${payroll.panNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Working Days:</span>
                  <span>${payroll.workingDays}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Present Days:</span>
                  <span>${payroll.presentDays}</span>
                </div>
              </div>
            </div>
            
            <div class="salary-breakdown">
              <div class="earnings">
                <div class="section-title">Earnings</div>
                <div class="amount-item">
                  <span class="amount-label">Basic Salary</span>
                  <span class="amount-value">₹${payroll.basicSalary.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">HRA (House Rent Allowance)</span>
                  <span class="amount-value">₹${payroll.allowances.hra.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">Conveyance Allowance</span>
                  <span class="amount-value">₹${payroll.allowances.conveyanceAllowance.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">Other Allowances</span>
                  <span class="amount-value">₹${payroll.allowances.otherAllowances.toLocaleString()}</span>
                </div>
                <div class="amount-item total-row">
                  <span class="amount-label">Gross Salary</span>
                  <span class="amount-value">₹${payroll.grossSalary.toLocaleString()}</span>
                </div>
              </div>
              
              <div class="deductions">
                <div class="section-title">Deductions</div>
                <div class="amount-item">
                  <span class="amount-label">Provident Fund (PF)</span>
                  <span class="amount-value">₹${payroll.deductions.providentFund.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">Professional Tax (PT)</span>
                  <span class="amount-value">₹${payroll.deductions.professionalTax.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">TDS (Tax Deducted at Source)</span>
                  <span class="amount-value">₹${payroll.deductions.tds.toLocaleString()}</span>
                </div>
                <div class="amount-item">
                  <span class="amount-label">Other Deductions</span>
                  <span class="amount-value">₹${payroll.deductions.otherDeductions.toLocaleString()}</span>
                </div>
                <div class="amount-item total-row">
                  <span class="amount-label">Total Deductions</span>
                  <span class="amount-value">₹${payroll.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div class="net-salary">
              <div class="net-amount">Net Pay / Final Salary: ₹${payroll.netSalary.toLocaleString()}</div>
              <div>Amount in Words: ${numberToWords(payroll.netSalary)} Rupees Only</div>
            </div>
            
            <div class="footer">
              <p><strong>This is a computer-generated salary slip and does not require a signature.</strong></p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  const sendSalarySlipEmail = (payroll: EnhancedPayrollRecord) => {
    // Simulate email sending
    const emailContent = `
      Subject: Salary Slip - ${payroll.month} ${payroll.year}
      
      Dear ${payroll.employeeName},
      
      Please find attached your salary slip for ${payroll.month} ${payroll.year}.
      
      Net Salary: ₹${payroll.netSalary.toLocaleString()}
      Pay Date: ${payroll.payDate}
      
      If you have any questions, please contact HR.
      
      Best regards,
      Zrosis HR Team
    `

    console.log("Email content:", emailContent)
    alert(`Salary slip email sent to ${payroll.employeeName}`)
  }

  const filteredPayroll = payrollData.filter((payroll) => {
    const monthMatch = payroll.month === selectedMonth
    const yearMatch = payroll.year === selectedYear
    const employeeMatch = !selectedEmployee || payroll.employeeId === selectedEmployee

    return monthMatch && yearMatch && employeeMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Enhanced Salary Slips</h2>
        {(user?.role === "hr" || user?.role === "admin") && (
          <Button onClick={() => setShowHRPanel(true)} className="bg-purple-600 hover:bg-purple-700">
            <Settings className="w-4 h-4 mr-2" />
            HR Salary Management
          </Button>
        )}
      </div>

      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-600" />
                Enhanced Salary Slip System
              </CardTitle>
              <CardDescription>
                Generate and download professional salary slips with detailed breakdowns
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-gray-900">Filter Salary Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employee">Employee (Optional)</Label>
              <Select value={selectedEmployee || "All Employees"} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees</SelectItem>
                  {payrollData.map((payroll) => (
                    <SelectItem key={payroll.employeeId} value={payroll.employeeId}>
                      {payroll.employeeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Slips List */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-gray-900">Salary Slips</CardTitle>
          <CardDescription>
            {filteredPayroll.length} salary slip{filteredPayroll.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayroll.map((payroll) => (
              <div
                key={payroll.id}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{payroll.employeeName}</h3>
                      <p className="text-sm text-gray-600">
                        {payroll.designation} • {payroll.department}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Period:</span>
                      <p className="font-medium">
                        {payroll.month} {payroll.year}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Gross Salary:</span>
                      <p className="font-medium text-green-600">₹{payroll.grossSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deductions:</span>
                      <p className="font-medium text-red-600">₹{payroll.totalDeductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Net Salary:</span>
                      <p className="font-medium text-blue-600 text-lg">₹{payroll.netSalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentPayroll(payroll)
                      setShowSalarySlip(true)
                    }}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => generatePDF(payroll)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendSalarySlipEmail(payroll)}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  {(user?.role === "hr" || user?.role === "admin") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openHRPanel(payroll)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredPayroll.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No salary slips found for the selected criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* HR Panel Modal */}
      {showHRPanel && editingPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">HR Salary Management - {editingPayroll.employeeName}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHRPanel(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Basic Information</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Basic Salary</Label>
                    <Input
                      type="number"
                      value={editingPayroll.basicSalary}
                      onChange={(e) => updateSalaryComponent("basicSalary", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Allowances */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Allowances</h4>
                <div className="space-y-3">
                  <div>
                    <Label>HRA (House Rent Allowance)</Label>
                    <Input
                      type="number"
                      value={editingPayroll.allowances.hra}
                      onChange={(e) => updateSalaryComponent("allowances.hra", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Conveyance Allowance</Label>
                    <Input
                      type="number"
                      value={editingPayroll.allowances.conveyanceAllowance}
                      onChange={(e) => updateSalaryComponent("allowances.conveyanceAllowance", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Other Allowances</Label>
                    <Input
                      type="number"
                      value={editingPayroll.allowances.otherAllowances}
                      onChange={(e) => updateSalaryComponent("allowances.otherAllowances", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Deductions</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Provident Fund (PF)</Label>
                    <Input
                      type="number"
                      value={editingPayroll.deductions.providentFund}
                      onChange={(e) => updateSalaryComponent("deductions.providentFund", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Professional Tax (PT)</Label>
                    <Input
                      type="number"
                      value={editingPayroll.deductions.professionalTax}
                      onChange={(e) => updateSalaryComponent("deductions.professionalTax", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>TDS (Tax Deducted at Source)</Label>
                    <Input
                      type="number"
                      value={editingPayroll.deductions.tds}
                      onChange={(e) => updateSalaryComponent("deductions.tds", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Other Deductions</Label>
                    <Input
                      type="number"
                      value={editingPayroll.deductions.otherDeductions}
                      onChange={(e) => updateSalaryComponent("deductions.otherDeductions", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Salary Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Salary Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Salary:</span>
                    <span className="font-semibold">₹{editingPayroll.grossSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span className="font-semibold text-red-600">
                      ₹{editingPayroll.totalDeductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Net Pay / Final Salary:</span>
                    <span className="text-green-600">₹{editingPayroll.netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowHRPanel(false)}>
                Cancel
              </Button>
              <Button onClick={() => generatePDF(editingPayroll)} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Preview PDF
              </Button>
              <Button onClick={saveSalaryChanges} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Slip Preview Dialog */}
      <Dialog open={showSalarySlip} onOpenChange={setShowSalarySlip}>
        {currentPayroll && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Salary Slip Preview - {currentPayroll.employeeName}
              </DialogTitle>
              <DialogDescription>
                {currentPayroll.month} {currentPayroll.year} • Net Salary: ₹{currentPayroll.netSalary.toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            {/* Enhanced Salary Slip Display */}
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
                <h2 className="text-2xl font-bold">Zrosis HR System</h2>
                <p className="text-blue-100">
                  Salary Slip for {currentPayroll.month} {currentPayroll.year}
                </p>
              </div>

              {/* Employee Information */}
              <div className="p-6 bg-gray-50 border-b">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee Name</p>
                    <p className="font-semibold">{currentPayroll.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee Code</p>
                    <p className="font-semibold">{currentPayroll.employeeCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-semibold">{currentPayroll.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">{currentPayroll.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pay Date</p>
                    <p className="font-semibold">{currentPayroll.payDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAN Number</p>
                    <p className="font-semibold">{currentPayroll.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Working Days</p>
                    <p className="font-semibold">{currentPayroll.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Present Days</p>
                    <p className="font-semibold">{currentPayroll.presentDays}</p>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Earnings */}
                <div className="p-6 border-r">
                  <h3 className="text-lg font-bold text-green-600 mb-4 border-b pb-2">Earnings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span className="font-semibold">₹{currentPayroll.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA (House Rent Allowance)</span>
                      <span className="font-semibold">₹{currentPayroll.allowances.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance Allowance</span>
                      <span className="font-semibold">
                        ₹{currentPayroll.allowances.conveyanceAllowance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Allowances</span>
                      <span className="font-semibold">
                        ₹{currentPayroll.allowances.otherAllowances.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between bg-green-50 p-3 rounded font-bold text-green-700">
                      <span>Gross Salary</span>
                      <span>₹{currentPayroll.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-red-600 mb-4 border-b pb-2">Deductions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Provident Fund (PF)</span>
                      <span className="font-semibold">₹{currentPayroll.deductions.providentFund.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax (PT)</span>
                      <span className="font-semibold">
                        ₹{currentPayroll.deductions.professionalTax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS (Tax Deducted at Source)</span>
                      <span className="font-semibold">₹{currentPayroll.deductions.tds.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Deductions</span>
                      <span className="font-semibold">
                        ₹{currentPayroll.deductions.otherDeductions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between bg-red-50 p-3 rounded font-bold text-red-700">
                      <span>Total Deductions</span>
                      <span>₹{currentPayroll.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Net Pay / Final Salary</h3>
                <p className="text-3xl font-bold">₹{currentPayroll.netSalary.toLocaleString()}</p>
                <p className="text-blue-100 mt-2">
                  Amount in Words: {numberToWords(currentPayroll.netSalary)} Rupees Only
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                <p>
                  <strong>This is a computer-generated salary slip and does not require a signature.</strong>
                </p>
                <p>Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
