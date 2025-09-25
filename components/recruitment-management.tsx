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
import {
  Briefcase,
  Users,
  CalendarIcon,
  Star,
  Plus,
  Eye,
  Edit,
  Search,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
} from "lucide-react"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  level: "entry" | "mid" | "senior" | "executive"
  description: string
  requirements: string[]
  responsibilities: string[]
  salary: {
    min: number
    max: number
    currency: string
  }
  status: "draft" | "active" | "paused" | "closed"
  postedBy: string
  postedByName: string
  postedDate: string
  applicationDeadline: string
  applicantCount: number
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  jobId: string
  jobTitle: string
  status: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"
  appliedDate: string
  experience: number
  location: string
  resumeUrl?: string
  coverLetter?: string
  rating: number
  notes: string
  interviewDate?: string
  interviewType?: "phone" | "video" | "in-person"
  interviewer?: string
  source: "website" | "referral" | "linkedin" | "indeed" | "other"
}

interface Interview {
  id: string
  candidateId: string
  candidateName: string
  jobId: string
  jobTitle: string
  type: "phone" | "video" | "in-person"
  date: string
  time: string
  duration: number
  interviewer: string
  interviewerName: string
  location?: string
  meetingLink?: string
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  feedback?: string
  rating?: number
}

export function RecruitmentManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewJob, setShowNewJob] = useState(false)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [showCandidateDetails, setShowCandidateDetails] = useState(false)
  const [showScheduleInterview, setShowScheduleInterview] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [interviewDate, setInterviewDate] = useState<Date>()

  // Mock recruitment data
  const [jobPostings] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "full-time",
      level: "senior",
      description:
        "We are looking for a Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications.",
      requirements: [
        "5+ years of software development experience",
        "Proficiency in React, Node.js, and TypeScript",
        "Experience with cloud platforms (AWS, GCP)",
        "Strong problem-solving skills",
      ],
      responsibilities: [
        "Design and develop scalable web applications",
        "Collaborate with cross-functional teams",
        "Mentor junior developers",
        "Participate in code reviews",
      ],
      salary: { min: 120000, max: 160000, currency: "USD" },
      status: "active",
      postedBy: "hr1",
      postedByName: "HR Manager",
      postedDate: "2024-10-15",
      applicationDeadline: "2024-12-15",
      applicantCount: 23,
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "full-time",
      level: "mid",
      description:
        "Join our product team to drive the development of innovative features and help shape the future of our platform.",
      requirements: [
        "3+ years of product management experience",
        "Strong analytical skills",
        "Experience with agile methodologies",
        "Excellent communication skills",
      ],
      responsibilities: [
        "Define product roadmap and strategy",
        "Work with engineering and design teams",
        "Analyze user feedback and metrics",
        "Manage product launches",
      ],
      salary: { min: 90000, max: 130000, currency: "USD" },
      status: "active",
      postedBy: "hr1",
      postedByName: "HR Manager",
      postedDate: "2024-10-20",
      applicationDeadline: "2024-12-20",
      applicantCount: 15,
    },
    {
      id: "3",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "New York, NY",
      type: "full-time",
      level: "entry",
      description:
        "We're seeking a creative Marketing Specialist to help grow our brand and drive customer acquisition.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "1-2 years of marketing experience",
        "Knowledge of digital marketing tools",
        "Creative thinking and attention to detail",
      ],
      responsibilities: [
        "Develop marketing campaigns",
        "Manage social media presence",
        "Create content for various channels",
        "Analyze campaign performance",
      ],
      salary: { min: 50000, max: 70000, currency: "USD" },
      status: "paused",
      postedBy: "hr1",
      postedByName: "HR Manager",
      postedDate: "2024-10-10",
      applicationDeadline: "2024-11-30",
      applicantCount: 8,
    },
  ])

  const [candidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "+1-555-0123",
      jobId: "1",
      jobTitle: "Senior Software Engineer",
      status: "interview",
      appliedDate: "2024-10-18",
      experience: 6,
      location: "San Francisco, CA",
      rating: 4.5,
      notes: "Strong technical background, excellent communication skills",
      interviewDate: "2024-11-15",
      interviewType: "video",
      interviewer: "tech-lead",
      source: "linkedin",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "+1-555-0124",
      jobId: "1",
      jobTitle: "Senior Software Engineer",
      status: "screening",
      appliedDate: "2024-10-20",
      experience: 4,
      location: "Remote",
      rating: 4.0,
      notes: "Good technical skills, needs assessment on leadership experience",
      source: "website",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "+1-555-0125",
      jobId: "2",
      jobTitle: "Product Manager",
      status: "offer",
      appliedDate: "2024-10-22",
      experience: 5,
      location: "Remote",
      rating: 4.8,
      notes: "Exceptional product sense, great cultural fit",
      source: "referral",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1-555-0126",
      jobId: "3",
      jobTitle: "Marketing Specialist",
      status: "applied",
      appliedDate: "2024-10-25",
      experience: 2,
      location: "New York, NY",
      rating: 0,
      notes: "",
      source: "indeed",
    },
  ])

  const [interviews] = useState<Interview[]>([
    {
      id: "1",
      candidateId: "1",
      candidateName: "Alice Johnson",
      jobId: "1",
      jobTitle: "Senior Software Engineer",
      type: "video",
      date: "2024-11-15",
      time: "14:00",
      duration: 60,
      interviewer: "tech-lead",
      interviewerName: "Tech Lead",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      status: "scheduled",
      rating: 0,
    },
    {
      id: "2",
      candidateId: "3",
      candidateName: "Carol Davis",
      jobId: "2",
      jobTitle: "Product Manager",
      type: "video",
      date: "2024-11-10",
      time: "10:00",
      duration: 45,
      interviewer: "product-manager",
      interviewerName: "Product Manager",
      meetingLink: "https://meet.google.com/xyz-abc-def",
      status: "completed",
      feedback: "Excellent product thinking and communication skills. Strong candidate.",
      rating: 5,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200"
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200"
      case "paused":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "closed":
        return "bg-red-50 text-red-700 border-red-200"
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "screening":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "interview":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "offer":
        return "bg-green-50 text-green-700 border-green-200"
      case "hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "part-time":
        return "bg-green-50 text-green-700 border-green-200"
      case "contract":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "internship":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-green-50 text-green-700 border-green-200"
      case "mid":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "senior":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "executive":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
  }

  const getRecruitmentStats = () => {
    return {
      totalJobs: jobPostings.length,
      activeJobs: jobPostings.filter((job) => job.status === "active").length,
      totalCandidates: candidates.length,
      interviewsScheduled: interviews.filter((interview) => interview.status === "scheduled").length,
      offersExtended: candidates.filter((candidate) => candidate.status === "offer").length,
      hiredThisMonth: candidates.filter((candidate) => candidate.status === "hired").length,
    }
  }

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateCandidateStatus = (candidateId: string, newStatus: string) => {
    console.log(`Updating candidate ${candidateId} status to ${newStatus}`)
    alert(`Candidate status updated to ${newStatus}`)
  }

  const NewJobModal = () => {
    const [formData, setFormData] = useState({
      title: "",
      department: "",
      location: "",
      type: "",
      level: "",
      description: "",
      requirements: "",
      responsibilities: "",
      salaryMin: "",
      salaryMax: "",
      deadline: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.department || !formData.type || !formData.level) {
        alert("Please fill all required fields")
        return
      }

      console.log("Creating new job posting:", formData)
      alert("Job posting created successfully!")
      setShowNewJob(false)
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "",
        level: "",
        description: "",
        requirements: "",
        responsibilities: "",
        salaryMin: "",
        salaryMax: "",
        deadline: "",
      })
    }

    return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job Posting</DialogTitle>
          <DialogDescription>Add a new job opening to attract candidates</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Engineering"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Employment Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Experience Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Min Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="50000"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Max Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="80000"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role and what the candidate will be doing..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              placeholder="5+ years of experience&#10;Bachelor's degree&#10;Strong communication skills"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
            <Textarea
              id="responsibilities"
              placeholder="Lead development projects&#10;Mentor junior team members&#10;Collaborate with stakeholders"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Job Posting
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewJob(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    )
  }

  const JobDetailsModal = ({ job }: { job: JobPosting }) => (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{job.title}</DialogTitle>
        <DialogDescription>
          {job.department} • {job.location}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-gray-700">Employment Type</p>
            <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
          </div>
          <div>
            <p className="font-medium text-gray-700">Experience Level</p>
            <Badge className={getLevelColor(job.level)}>{job.level}</Badge>
          </div>
          <div>
            <p className="font-medium text-gray-700">Salary Range</p>
            <p>{formatSalary(job.salary)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Application Deadline</p>
            <p>{new Date(job.applicationDeadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Job Description</p>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{job.description}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Requirements</p>
          <ul className="text-sm space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Responsibilities</p>
          <ul className="text-sm space-y-1">
            {job.responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            <p>
              Posted by {job.postedByName} on {new Date(job.postedDate).toLocaleDateString()}
            </p>
            <p>{job.applicantCount} applications received</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button>View Applications</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )

  const CandidateDetailsModal = ({ candidate }: { candidate: Candidate }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{candidate.name}</DialogTitle>
        <DialogDescription>Candidate for {candidate.jobTitle}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Email</p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {candidate.email}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Phone</p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {candidate.phone}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Location</p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {candidate.location}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Experience</p>
            <p>{candidate.experience} years</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Applied Date</p>
            <p>{new Date(candidate.appliedDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Source</p>
            <p className="capitalize">{candidate.source}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Current Status</p>
          <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
        </div>

        {candidate.rating > 0 && (
          <div>
            <p className="font-medium text-gray-700 mb-2">Rating</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= candidate.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{candidate.rating}/5</span>
            </div>
          </div>
        )}

        {candidate.notes && (
          <div>
            <p className="font-medium text-gray-700 mb-2">Notes</p>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidate.notes}</p>
          </div>
        )}

        {candidate.interviewDate && (
          <div>
            <p className="font-medium text-gray-700 mb-2">Interview Details</p>
            <div className="text-sm bg-blue-50 p-3 rounded-lg">
              <p>
                <strong>Date:</strong> {new Date(candidate.interviewDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Type:</strong> {candidate.interviewType}
              </p>
              <p>
                <strong>Interviewer:</strong> {candidate.interviewer}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Select onValueChange={(value) => updateCandidateStatus(candidate.id, value)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screening">Move to Screening</SelectItem>
              <SelectItem value="interview">Schedule Interview</SelectItem>
              <SelectItem value="offer">Extend Offer</SelectItem>
              <SelectItem value="hired">Mark as Hired</SelectItem>
              <SelectItem value="rejected">Reject</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowScheduleInterview(true)}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  const stats = getRecruitmentStats()

  // Only show recruitment management to HR and Admin roles
  if (user?.role !== "hr" && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Recruitment management is only available to HR and Admin users.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment Management</h2>
          <p className="text-gray-600">Manage job postings, candidates, and hiring pipeline</p>
        </div>
        <Button onClick={() => setShowNewJob(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Job Posting
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Active Jobs</CardTitle>
                <Briefcase className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stats.activeJobs}</div>
                <p className="text-xs text-blue-700">Out of {stats.totalJobs} total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Total Candidates</CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{stats.totalCandidates}</div>
                <p className="text-xs text-green-700">In pipeline</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Interviews</CardTitle>
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{stats.interviewsScheduled}</div>
                <p className="text-xs text-purple-700">Scheduled this week</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Offers Extended</CardTitle>
                <Star className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{stats.offersExtended}</div>
                <p className="text-xs text-orange-700">Pending acceptance</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-900">Hired This Month</CardTitle>
                <User className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900">{stats.hiredThisMonth}</div>
                <p className="text-xs text-emerald-700">New team members</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search job postings..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.department}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.location}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getTypeColor(job.type)} variant="outline">
                      {job.type}
                    </Badge>
                    <Badge className={getLevelColor(job.level)} variant="outline">
                      {job.level}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{formatSalary(job.salary)}</span>
                    <span>{job.applicantCount} applications</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedJob(job)
                        setShowJobDetails(true)
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      View Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search candidates..."
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
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.jobTitle}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {candidate.location}
                          </span>
                          <span>{candidate.experience} years exp.</span>
                          <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {candidate.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{candidate.rating}</span>
                        </div>
                      )}
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCandidate(candidate)
                          setShowCandidateDetails(true)
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

        <TabsContent value="interviews" className="space-y-6">
          <div className="space-y-4">
            {interviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{interview.candidateName}</h3>
                        <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(interview.date).toLocaleDateString()} at {interview.time}
                          </span>
                          <span className="capitalize">{interview.type} interview</span>
                          <span>{interview.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {interview.rating && interview.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{interview.rating}</span>
                        </div>
                      )}
                      <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                  {interview.feedback && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{interview.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Visual overview of candidates in different stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Pipeline Visualization</p>
                <p>Interactive hiring pipeline coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewJob} onOpenChange={setShowNewJob}>
        <NewJobModal />
      </Dialog>

      <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
        {selectedJob && <JobDetailsModal job={selectedJob} />}
      </Dialog>

      <Dialog open={showCandidateDetails} onOpenChange={setShowCandidateDetails}>
        {selectedCandidate && <CandidateDetailsModal candidate={selectedCandidate} />}
      </Dialog>
    </div>
  )
}
