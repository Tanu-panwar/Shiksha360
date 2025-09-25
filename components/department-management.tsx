"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/contexts/auth-context"
import { useData, type Department } from "@/contexts/data-context"
import { Search, Plus, Edit, Eye, Users, Calendar, Building2, UserCheck } from "lucide-react"

interface DepartmentFormData {
  name: string
  description: string
  managerId: string
}

export function DepartmentManagement() {
  const { user } = useAuth()
  const { departments, employees, addDepartment } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
    managerId: "",
  })

  // Sample departments for demo (already initialized in data-context)
  useEffect(() => {
    if (departments.length === 2) {
      // Add more sample departments
      const additionalDepts = [
        {
          name: "Engineering",
          description: "Software development and technical operations",
          managerId: "emp-2", // Sarah Johnson
        },
        {
          name: "Marketing",
          description: "Brand management and customer acquisition",
          managerId: "manager-hr", // Lisa Wilson
        },
        {
          name: "Sales",
          description: "Revenue generation and client relationships",
          managerId: "emp-2", // Sarah Johnson
        },
      ]
      additionalDepts.forEach(addDepartment)
    }
  }, [departments.length, addDepartment])

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDepartment = () => {
    addDepartment({
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId,
    })
    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      description: "",
      managerId: "",
    })
  }

  const getManagerName = (managerId: string) => {
    const manager = employees.find((e) => e.id === managerId)
    return manager?.name || "No Manager Assigned"
  }

  const getDepartmentEmployeeCount = (departmentId: string) => {
    return employees.filter((e) => e.departmentId === departmentId).length
  }

  const getDepartmentEmployees = (departmentId: string) => {
    return employees.filter((e) => e.departmentId === departmentId)
  }

  const canManageDepartments = user?.role === "hr" || user?.role === "admin"

  if (!canManageDepartments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>Access restricted</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">You don't have permission to access department management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Manage departments and organizational structure</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>Create a new department in your organization</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter department name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter department description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manager">Department Manager</Label>
                    <Select
                      value={formData.managerId}
                      onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Manager</SelectItem>
                        {employees
                          .filter((e) => e.role === "manager" || e.role === "hr" || e.role === "admin")
                          .map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name} ({manager.role})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDepartment}>Add Department</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Department Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Employees per department</p>
          </CardContent>
        </Card>
      </div>

      {/* Department List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{department.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{department.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {getDepartmentEmployeeCount(department.id)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck className="h-4 w-4" />
                  <span>Manager: {getManagerName(department.managerId)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {new Date(department.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={isViewDialogOpen && selectedDepartment?.id === department.id}
                  onOpenChange={(open) => {
                    setIsViewDialogOpen(open)
                    if (open) setSelectedDepartment(department)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {department.name}
                      </DialogTitle>
                      <DialogDescription>{department.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Department Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Department Manager</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getManagerName(department.managerId)
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{getManagerName(department.managerId)}</p>
                                <p className="text-sm text-gray-600">Department Manager</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Department Stats</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Employees:</span>
                                <span className="font-medium">{getDepartmentEmployeeCount(department.id)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Created:</span>
                                <span className="font-medium">
                                  {new Date(department.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Department Employees */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Department Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {getDepartmentEmployees(department.id).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {getDepartmentEmployees(department.id).map((employee) => (
                                <div key={employee.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {employee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{employee.name}</p>
                                    <p className="text-xs text-gray-600 capitalize">{employee.role}</p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {employee.role}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-4">
                              No employees assigned to this department yet.
                            </p>
                          )}
                        </CardContent>
                      </Card>
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

      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No departments found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
