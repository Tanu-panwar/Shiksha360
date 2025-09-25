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
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { FileText, Upload, Download, Eye, Edit, Share, Lock, Unlock, Folder, Search, Plus, Tag } from "lucide-react"

interface Document {
  id: string
  name: string
  description: string
  category: "policy" | "contract" | "form" | "manual" | "certificate" | "report" | "other"
  type: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "txt" | "image"
  size: number
  uploadedBy: string
  uploadedByName: string
  uploadedDate: string
  lastModified: string
  version: number
  status: "active" | "archived" | "draft"
  accessLevel: "public" | "internal" | "confidential" | "restricted"
  tags: string[]
  downloadCount: number
  sharedWith: string[]
}

interface DocumentFolder {
  id: string
  name: string
  description: string
  parentId?: string
  createdBy: string
  createdDate: string
  accessLevel: "public" | "internal" | "confidential" | "restricted"
  documentCount: number
}

export function DocumentManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [accessFilter, setAccessFilter] = useState("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [showDocumentDetails, setShowDocumentDetails] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  // Mock document data
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Employee Handbook 2024",
      description: "Complete guide for all employees covering policies, procedures, and benefits",
      category: "manual",
      type: "pdf",
      size: 2048000,
      uploadedBy: "hr1",
      uploadedByName: "HR Manager",
      uploadedDate: "2024-01-15",
      lastModified: "2024-10-15",
      version: 3,
      status: "active",
      accessLevel: "internal",
      tags: ["handbook", "policies", "2024"],
      downloadCount: 156,
      sharedWith: ["all"],
    },
    {
      id: "2",
      name: "Code of Conduct",
      description: "Company code of conduct and ethical guidelines",
      category: "policy",
      type: "pdf",
      size: 1024000,
      uploadedBy: "hr1",
      uploadedByName: "HR Manager",
      uploadedDate: "2024-02-01",
      lastModified: "2024-02-01",
      version: 1,
      status: "active",
      accessLevel: "public",
      tags: ["conduct", "ethics", "policy"],
      downloadCount: 89,
      sharedWith: ["all"],
    },
    {
      id: "3",
      name: "Employment Contract Template",
      description: "Standard employment contract template for new hires",
      category: "contract",
      type: "docx",
      size: 512000,
      uploadedBy: "hr1",
      uploadedByName: "HR Manager",
      uploadedDate: "2024-03-10",
      lastModified: "2024-09-20",
      version: 2,
      status: "active",
      accessLevel: "confidential",
      tags: ["contract", "template", "hiring"],
      downloadCount: 34,
      sharedWith: ["hr", "manager"],
    },
    {
      id: "4",
      name: "Leave Application Form",
      description: "Standard form for requesting time off",
      category: "form",
      type: "pdf",
      size: 256000,
      uploadedBy: "hr1",
      uploadedByName: "HR Manager",
      uploadedDate: "2024-01-20",
      lastModified: "2024-01-20",
      version: 1,
      status: "active",
      accessLevel: "internal",
      tags: ["form", "leave", "application"],
      downloadCount: 203,
      sharedWith: ["all"],
    },
    {
      id: "5",
      name: "Q3 Performance Report",
      description: "Quarterly performance analysis and metrics",
      category: "report",
      type: "xlsx",
      size: 1536000,
      uploadedBy: "manager1",
      uploadedByName: "Department Manager",
      uploadedDate: "2024-10-01",
      lastModified: "2024-10-01",
      version: 1,
      status: "active",
      accessLevel: "restricted",
      tags: ["report", "performance", "Q3"],
      downloadCount: 12,
      sharedWith: ["hr", "admin"],
    },
  ])

  const [folders] = useState<DocumentFolder[]>([
    {
      id: "1",
      name: "HR Policies",
      description: "All company policies and procedures",
      createdBy: "hr1",
      createdDate: "2024-01-01",
      accessLevel: "internal",
      documentCount: 15,
    },
    {
      id: "2",
      name: "Employee Contracts",
      description: "Employment contracts and agreements",
      createdBy: "hr1",
      createdDate: "2024-01-01",
      accessLevel: "confidential",
      documentCount: 8,
    },
    {
      id: "3",
      name: "Training Materials",
      description: "Training documents and resources",
      createdBy: "hr1",
      createdDate: "2024-02-01",
      accessLevel: "internal",
      documentCount: 23,
    },
    {
      id: "4",
      name: "Reports",
      description: "Company reports and analytics",
      createdBy: "manager1",
      createdDate: "2024-03-01",
      accessLevel: "restricted",
      documentCount: 12,
    },
  ])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "policy":
        return <Lock className="h-4 w-4" />
      case "contract":
        return <FileText className="h-4 w-4" />
      case "form":
        return <FileText className="h-4 w-4" />
      case "manual":
        return <FileText className="h-4 w-4" />
      case "certificate":
        return <FileText className="h-4 w-4" />
      case "report":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "policy":
        return "bg-red-50 text-red-700 border-red-200"
      case "contract":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "form":
        return "bg-green-50 text-green-700 border-green-200"
      case "manual":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "certificate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "report":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "public":
        return "bg-green-50 text-green-700 border-green-200"
      case "internal":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "confidential":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "restricted":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case "public":
        return <Unlock className="h-3 w-3" />
      case "internal":
        return <Lock className="h-3 w-3" />
      case "confidential":
        return <Lock className="h-3 w-3" />
      case "restricted":
        return <Lock className="h-3 w-3" />
      default:
        return <Lock className="h-3 w-3" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const canAccessDocument = (doc: Document) => {
    if (user?.role === "admin") return true
    if (doc.accessLevel === "public") return true
    if (doc.accessLevel === "internal" && user?.role !== "employee") return true
    if (doc.accessLevel === "confidential" && (user?.role === "hr" || user?.role === "admin")) return true
    if (doc.accessLevel === "restricted" && (user?.role === "hr" || user?.role === "admin")) return true
    return doc.uploadedBy === user?.id
  }

  const filteredDocuments = documents.filter((doc) => {
    if (!canAccessDocument(doc)) return false

    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    const matchesAccess = accessFilter === "all" || doc.accessLevel === accessFilter

    return matchesSearch && matchesCategory && matchesAccess
  })

  const getDocumentStats = () => {
    const accessible = documents.filter(canAccessDocument)
    return {
      total: accessible.length,
      byCategory: {
        policy: accessible.filter((d) => d.category === "policy").length,
        contract: accessible.filter((d) => d.category === "contract").length,
        form: accessible.filter((d) => d.category === "form").length,
        manual: accessible.filter((d) => d.category === "manual").length,
        certificate: accessible.filter((d) => d.category === "certificate").length,
        report: accessible.filter((d) => d.category === "report").length,
        other: accessible.filter((d) => d.category === "other").length,
      },
      totalSize: accessible.reduce((sum, doc) => sum + doc.size, 0),
    }
  }

  const downloadDocument = (doc: Document) => {
    console.log("Downloading document:", doc.name)
    // In a real app, this would trigger the actual download
    alert(`Downloading ${doc.name}...`)
  }

  const shareDocument = (doc: Document) => {
    console.log("Sharing document:", doc.name)
    alert(`Sharing options for ${doc.name}`)
  }

  const UploadDocumentModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      category: "",
      accessLevel: "",
      tags: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.category || !formData.accessLevel) {
        alert("Please fill all required fields")
        return
      }

      console.log("Uploading document:", formData)
      alert("Document uploaded successfully!")
      setShowUploadDialog(false)
      setFormData({ name: "", description: "", category: "", accessLevel: "", tags: "" })
    }

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Add a new document to the system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              placeholder="Enter document name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., policy, handbook, 2024"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    )
  }

  const DocumentDetailsModal = ({ document }: { document: Document }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{document.name}</DialogTitle>
        <DialogDescription>Document Details and Information</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Category</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`p-1 rounded ${getCategoryColor(document.category)}`}>
                {getCategoryIcon(document.category)}
              </div>
              <span className="capitalize">{document.category}</span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700">Access Level</p>
            <div className="flex items-center gap-2 mt-1">
              {getAccessLevelIcon(document.accessLevel)}
              <Badge className={getAccessLevelColor(document.accessLevel)}>{document.accessLevel}</Badge>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700">File Size</p>
            <p>{formatFileSize(document.size)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Version</p>
            <p>v{document.version}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Uploaded By</p>
            <p>{document.uploadedByName}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Upload Date</p>
            <p>{new Date(document.uploadedDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Last Modified</p>
            <p>{new Date(document.lastModified).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Downloads</p>
            <p>{document.downloadCount}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Description</p>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{document.description}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => downloadDocument(document)} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => shareDocument(document)} variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          {(user?.role === "hr" || user?.role === "admin" || document.uploadedBy === user?.id) && (
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  )

  const stats = getDocumentStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600">Organize and manage company documents</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button onClick={() => setShowNewFolderDialog(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Documents</CardTitle>
                <FileText className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                <p className="text-xs text-blue-700">Accessible to you</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Storage Used</CardTitle>
                <Folder className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{formatFileSize(stats.totalSize)}</div>
                <p className="text-xs text-green-700">Total file size</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Policies</CardTitle>
                <Lock className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats.byCategory.policy}</div>
                <p className="text-xs text-purple-700">Policy documents</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Forms</CardTitle>
                <FileText className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.byCategory.form}</div>
                <p className="text-xs text-orange-700">Available forms</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Categories</CardTitle>
                <CardDescription>Distribution by document type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getCategoryColor(category)}`}>{getCategoryIcon(category)}</div>
                        <span className="capitalize">{category}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Frequently used documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents
                    .filter(canAccessDocument)
                    .sort((a, b) => b.downloadCount - a.downloadCount)
                    .slice(0, 5)
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded ${getCategoryColor(doc.category)}`}>
                            {getCategoryIcon(doc.category)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.downloadCount} downloads</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => downloadDocument(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Access Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(document.category)}`}>
                        {getCategoryIcon(document.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{document.name}</h3>
                        <p className="text-sm text-gray-600">v{document.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getAccessLevelIcon(document.accessLevel)}
                      <Badge className={getAccessLevelColor(document.accessLevel)} variant="outline">
                        {document.accessLevel}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{document.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatFileSize(document.size)}</span>
                    <span>{new Date(document.uploadedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDocument(document)
                        setShowDocumentDetails(true)
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" onClick={() => downloadDocument(document)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No documents found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <Card key={folder.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
                      <Folder className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{folder.name}</h3>
                      <p className="text-sm text-gray-600">{folder.documentCount} documents</p>
                    </div>
                    <Badge className={getAccessLevelColor(folder.accessLevel)} variant="outline">
                      {folder.accessLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{folder.description}</p>
                  <div className="text-xs text-gray-500">
                    Created {new Date(folder.createdDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Accessed</CardTitle>
              <CardDescription>Documents you've viewed or downloaded recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter(canAccessDocument)
                  .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                  .slice(0, 10)
                  .map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getCategoryColor(document.category)}`}>
                          {getCategoryIcon(document.category)}
                        </div>
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-gray-600">
                            Modified {new Date(document.lastModified).toLocaleDateString()} •{" "}
                            {formatFileSize(document.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessLevelColor(document.accessLevel)} variant="outline">
                          {document.accessLevel}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => downloadDocument(document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <UploadDocumentModal />
      </Dialog>

      <Dialog open={showDocumentDetails} onOpenChange={setShowDocumentDetails}>
        {selectedDocument && <DocumentDetailsModal document={selectedDocument} />}
      </Dialog>
    </div>
  )
}
