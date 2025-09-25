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
  Monitor,
  Laptop,
  Smartphone,
  Car,
  Wrench,
  Package,
  Plus,
  Search,
  Download,
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Eye,
  Edit,
  ArrowUpDown,
} from "lucide-react"

interface Asset {
  id: string
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  status: "available" | "assigned" | "maintenance" | "retired" | "lost"
  condition: "excellent" | "good" | "fair" | "poor"
  assignedTo?: string
  assignedToName?: string
  assignedDate?: string
  location: string
  description: string
  warrantyExpiry?: string
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  createdAt: string
}

interface MaintenanceRecord {
  id: string
  assetId: string
  assetName: string
  type: "routine" | "repair" | "upgrade" | "inspection"
  description: string
  cost: number
  performedBy: string
  performedDate: string
  nextDueDate?: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  createdAt: string
}

export function AssetManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("assets")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock data - in real app, this would come from API/database
  const [assets] = useState<Asset[]>([
    {
      id: "1",
      name: "MacBook Pro 16-inch",
      category: "Laptop",
      brand: "Apple",
      model: "MacBook Pro",
      serialNumber: "MBP2024001",
      purchaseDate: "2024-01-15",
      purchasePrice: 2499.0,
      currentValue: 2200.0,
      status: "assigned",
      condition: "excellent",
      assignedTo: user?.id || "1",
      assignedToName: user?.name || "John Doe",
      assignedDate: "2024-01-20",
      location: "Office - Floor 2",
      description: "High-performance laptop for development work",
      warrantyExpiry: "2027-01-15",
      lastMaintenanceDate: "2024-02-01",
      nextMaintenanceDate: "2024-08-01",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Dell Monitor 27-inch",
      category: "Monitor",
      brand: "Dell",
      model: "UltraSharp U2723QE",
      serialNumber: "DM2024002",
      purchaseDate: "2024-01-10",
      purchasePrice: 599.0,
      currentValue: 520.0,
      status: "available",
      condition: "good",
      location: "Storage Room A",
      description: "4K monitor for workstation setup",
      warrantyExpiry: "2027-01-10",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "iPhone 15 Pro",
      category: "Mobile Device",
      brand: "Apple",
      model: "iPhone 15 Pro",
      serialNumber: "IP2024003",
      purchaseDate: "2024-02-01",
      purchasePrice: 999.0,
      currentValue: 850.0,
      status: "assigned",
      condition: "excellent",
      assignedTo: "2",
      assignedToName: "Jane Smith",
      assignedDate: "2024-02-05",
      location: "Remote - Employee Home",
      description: "Company mobile phone for business use",
      warrantyExpiry: "2026-02-01",
      createdAt: "2024-02-01",
    },
    {
      id: "4",
      name: "Office Chair - Ergonomic",
      category: "Furniture",
      brand: "Herman Miller",
      model: "Aeron",
      serialNumber: "HM2024004",
      purchaseDate: "2024-01-05",
      purchasePrice: 1395.0,
      currentValue: 1200.0,
      status: "maintenance",
      condition: "good",
      location: "Maintenance Workshop",
      description: "Ergonomic office chair with lumbar support",
      warrantyExpiry: "2036-01-05",
      lastMaintenanceDate: "2024-02-10",
      createdAt: "2024-01-05",
    },
  ])

  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: "1",
      assetId: "1",
      assetName: "MacBook Pro 16-inch",
      type: "routine",
      description: "Software updates and system cleaning",
      cost: 0,
      performedBy: "IT Support",
      performedDate: "2024-02-01",
      nextDueDate: "2024-08-01",
      status: "completed",
      createdAt: "2024-02-01",
    },
    {
      id: "2",
      assetId: "4",
      assetName: "Office Chair - Ergonomic",
      type: "repair",
      description: "Replace hydraulic cylinder",
      cost: 150.0,
      performedBy: "Facilities Team",
      performedDate: "2024-02-10",
      status: "in-progress",
      createdAt: "2024-02-08",
    },
    {
      id: "3",
      assetId: "3",
      assetName: "iPhone 15 Pro",
      type: "inspection",
      description: "Quarterly device inspection and security update",
      cost: 0,
      performedBy: "IT Security",
      performedDate: "2024-02-15",
      nextDueDate: "2024-05-15",
      status: "scheduled",
      createdAt: "2024-02-12",
    },
  ])

  const myAssets = assets.filter((asset) => asset.assignedTo === user?.id)
  const allAssets = user?.role === "manager" || user?.role === "hr" || user?.role === "admin" ? assets : myAssets

  const filteredAssets = allAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || asset.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      case "lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "assigned":
        return <User className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "retired":
        return <Package className="h-4 w-4" />
      case "lost":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "laptop":
        return <Laptop className="h-5 w-5" />
      case "monitor":
        return <Monitor className="h-5 w-5" />
      case "mobile device":
        return <Smartphone className="h-5 w-5" />
      case "vehicle":
        return <Car className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getTotalAssetValue = () => {
    return allAssets.reduce((sum, asset) => sum + asset.currentValue, 0)
  }

  const getAssetsByStatus = (status: string) => {
    return allAssets.filter((asset) => asset.status === status).length
  }

  const AssetCard = ({ asset }: { asset: Asset }) => (
    <Card className="hover:shadow-lg transition-all duration-200 bg-white/60 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getCategoryIcon(asset.category)}
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">{asset.name}</CardTitle>
              <CardDescription className="mt-1">
                {asset.brand} {asset.model} • {asset.serialNumber}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(asset.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(asset.status)}
                {asset.status}
              </div>
            </Badge>
            <Badge className={getConditionColor(asset.condition)} variant="outline">
              {asset.condition}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Purchase Date:</span>
              <div className="font-medium">{new Date(asset.purchaseDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Current Value:</span>
              <div className="font-medium">${asset.currentValue.toFixed(2)}</div>
            </div>
          </div>

          {asset.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Assigned to:</span>
              <span className="font-medium">{asset.assignedToName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{asset.location}</span>
          </div>

          {asset.warrantyExpiry && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Warranty expires:</span>
              <span className="font-medium">{new Date(asset.warrantyExpiry).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">{asset.description}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
              {(user?.role === "manager" || user?.role === "hr" || user?.role === "admin") && (
                <>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {asset.status === "available" && (
                    <Button size="sm" variant="outline">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  )}
                </>
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
          <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
          <p className="text-gray-600">Track and manage company assets and equipment</p>
        </div>
        {(user?.role === "manager" || user?.role === "hr" || user?.role === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>Register a new company asset</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Asset Name</Label>
                    <Input id="name" placeholder="Enter asset name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="monitor">Monitor</SelectItem>
                        <SelectItem value="mobile-device">Mobile Device</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" placeholder="Enter brand" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="Enter model" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number</Label>
                    <Input id="serial" placeholder="Enter serial number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Enter location" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Purchase Date</Label>
                    <Input id="purchase-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-price">Purchase Price</Label>
                    <Input id="purchase-price" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty Expiry</Label>
                    <Input id="warranty" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter asset description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Asset</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Assets</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{allAssets.length}</div>
                <p className="text-xs text-blue-700">Company-wide</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Available</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{getAssetsByStatus("available")}</div>
                <p className="text-xs text-green-700">Ready for assignment</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">In Maintenance</CardTitle>
                <Wrench className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">{getAssetsByStatus("maintenance")}</div>
                <p className="text-xs text-yellow-700">Under repair</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">${getTotalAssetValue().toFixed(0)}</div>
                <p className="text-xs text-purple-700">Current valuation</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Asset Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/50"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Monitor">Monitor</SelectItem>
                    <SelectItem value="Mobile Device">Mobile Device</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Records
              </CardTitle>
              <CardDescription>Track asset maintenance and service history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRecords.map((record) => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{record.assetName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Type: {record.type}</span>
                          <span>Cost: ${record.cost.toFixed(2)}</span>
                          <span>By: {record.performedBy}</span>
                          <span>Date: {new Date(record.performedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge
                        className={
                          record.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : record.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle>Asset Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Laptop", "Monitor", "Mobile Device", "Furniture"].map((category) => {
                    const count = allAssets.filter((asset) => asset.category === category).length
                    const percentage = allAssets.length > 0 ? (count / allAssets.length) * 100 : 0
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="text-gray-600">
                            {count} assets ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <CardTitle>Asset Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["available", "assigned", "maintenance", "retired"].map((status) => {
                    const count = getAssetsByStatus(status)
                    const percentage = allAssets.length > 0 ? (count / allAssets.length) * 100 : 0
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{status}</span>
                          <span className="text-gray-600">
                            {count} assets ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              status === "available"
                                ? "bg-green-600"
                                : status === "assigned"
                                  ? "bg-blue-600"
                                  : status === "maintenance"
                                    ? "bg-yellow-600"
                                    : "bg-gray-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
