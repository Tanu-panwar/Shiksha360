"use client"
import { useState, useEffect } from "react"
import { userSchema } from "@/lib/validation/userSchema";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, type User, type UserRole } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Search, Plus, Edit, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react"

interface EmployeeFormData {
  name: string
  email: string
  password: string
  role: UserRole
  departmentId: string
  managerId: string
  phone: string
  address: string
  joinDate: string
  salary: string
  notes: string
}

export function EmployeeManagement() {
  const { user } = useAuth()
  const { employees, departments, addEmployee } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    departmentId: "",
    managerId: "",
    phone: "",
    address: "",
    joinDate: "",
    salary: "",
    notes: "",
  })
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validateForm = () => {
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      for(let i=0; i<result.error.errors.length; i++){
        console.log(result.error.errors[i])
      }
      
      alert(result.error.errors[0].message);
      return false;
    }
    return true;
  };

  // Sample employees for demo
  // useEffect(() => {
  //   if (employees.length === 0) {
  //     const sampleEmployees: User[] = [
  //       {
  //         id: "emp-1",
  //         name: "John Smith",
  //         email: "john.smith@company.com",
  //         role: "employee",
  //         departmentId: "dept-general",
  //         managerId: "manager-1",
  //       },
  //       {
  //         id: "emp-2",
  //         name: "Sarah Johnson",
  //         email: "sarah.johnson@company.com",
  //         role: "manager",
  //         departmentId: "dept-general",
  //       },
  //       {
  //         id: "emp-3",
  //         name: "Mike Davis",
  //         email: "mike.davis@company.com",
  //         role: "employee",
  //         departmentId: "dept-hr",
  //         managerId: "manager-hr",
  //       },
  //       {
  //         id: "manager-hr",
  //         name: "Lisa Wilson",
  //         email: "lisa.wilson@company.com",
  //         role: "hr",
  //         departmentId: "dept-hr",
  //       },
  //     ]
  //     sampleEmployees.forEach(addEmployee)
  //   }
  // }, [employees.length, addEmployee])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || employee.role === filterRole
    const matchesDepartment = filterDepartment === "all" || employee.departmentId === filterDepartment
    return matchesSearch && matchesRole && matchesDepartment
  })

  const handleAddEmployee = async () => {
    // Validate form
    if (!validateForm()) return;

    // Convert optional UUID fields properly
    const normalizeUUID = (value?: string) => {
      if (!value || value.trim() === "" || value === "none") return null;
      return value; // assume dropdown gives valid UUID if selected
    };

    // Prepare the payload
    const payload = {
      ...formData,
      managerId: normalizeUUID(formData.managerId),
      departmentId: normalizeUUID(formData.departmentId),
      salary: parseFloat(formData.salary || "0"),
      joinDate: formData.joinDate ? new Date(formData.joinDate).toISOString() : null,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        addEmployee(data);
        setIsAddDialogOpen(false);

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "employee",
          departmentId: "",
          managerId: "",
          phone: "",
          address: "",
          joinDate: "",
          salary: "",
          notes: "",
        });
      } else {
        alert(data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Something went wrong");
    }
  };

  // const handleAddEmployee = () => {
  //   const newEmployee: User = {
  //     id: `emp-${Date.now()}`,
  //     name: formData.name,
  //     email: formData.email,
  //     role: formData.role,
  //     departmentId: formData.departmentId,
  //     managerId: formData.managerId || undefined,
  //   }
  //   addEmployee(newEmployee)
  //   setIsAddDialogOpen(false)
  //   setFormData({
  //     name: "",
  //     email: "",
  //     password: "",
  //     role: "employee",
  //     departmentId: "",
  //     managerId: "",
  //     phone: "",
  //     address: "",
  //     joinDate: "",
  //     salary: "",
  //     notes: "",
  //   })
  // }

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find((d) => d.id === departmentId)
    return dept?.name || "Unknown Department"
  }

  const getManagerName = (managerId: string) => {
    const manager = employees.find((e) => e.id === managerId)
    return manager?.name || "No Manager"
  }

  const canManageEmployees = user?.role === "hr" || user?.role === "admin" || user?.role === "manager"

  if (!canManageEmployees) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
          <CardDescription>Access restricted</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">You don't have permission to access employee management.</p>
        </CardContent>
      </Card>
    )
  }
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      // setErrorMessage(JSON.stringify(errors));
    }
  }, [errors]);
  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>Manage team members and their information</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Enter the employee details below</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                        <SelectItem value="MANAGER">MANAGER</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Manager */}
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Select
                      value={formData.managerId}
                      onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Manager</SelectItem>
                        {employees
                          .filter((e) => e.role === "manager" || e.role === "hr" || e.role === "admin")
                          .map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Address (full width) */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Join Date */}
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="Enter salary"
                    />
                  </div>

                  {/* Notes (full width) */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes about the employee"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
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
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {employee.role}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{getDepartmentName(employee.departmentId || "")}</span>
                </div>
                {employee.managerId && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Manager: {getManagerName(employee.managerId)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={isViewDialogOpen && selectedEmployee?.id === employee.id}
                  onOpenChange={(open) => {
                    setIsViewDialogOpen(open)
                    if (open) setSelectedEmployee(employee)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Employee Profile</DialogTitle>
                      <DialogDescription>Detailed information about {employee.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{employee.name}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {employee.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{employee.phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{getDepartmentName(employee.departmentId || "")}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Joined: {employee.joinDate ? formatDate(employee.joinDate) : "N/A"}</span>
                          </div>
                          {employee.managerId && (
                            <div>
                              <span className="text-sm font-medium">Manager: </span>
                              <span className="text-sm">{getManagerName(employee.managerId)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
