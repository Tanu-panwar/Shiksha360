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
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Target, TrendingUp, Star, Users, Plus, Eye, Edit, Award, Calendar, Search, BarChart3 } from "lucide-react"

interface Goal {
  id: string
  employeeId: string
  employeeName: string
  title: string
  description: string
  category: "performance" | "development" | "behavioral" | "project"
  priority: "low" | "medium" | "high"
  progress: number
  targetDate: string
  status: "active" | "completed" | "overdue" | "cancelled"
  createdDate: string
  managerId: string
}

interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  reviewerId: string
  reviewerName: string
  reviewPeriod: string
  reviewType: "annual" | "quarterly" | "mid-year" | "probation"
  overallRating: number
  ratings: {
    technical: number
    communication: number
    teamwork: number
    leadership: number
    initiative: number
  }
  strengths: string
  areasForImprovement: string
  goals: string
  comments: string
  status: "draft" | "submitted" | "approved" | "completed"
  createdDate: string
  dueDate: string
}

interface Feedback {
  id: string
  employeeId: string
  employeeName: string
  feedbackFrom: string
  feedbackFromName: string
  feedbackType: "peer" | "subordinate" | "manager" | "self"
  rating: number
  feedback: string
  anonymous: boolean
  createdDate: string
}

export function PerformanceManagement() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [showNewReview, setShowNewReview] = useState(false)
  const [showGoalDetails, setShowGoalDetails] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // Mock performance data
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      title: "Improve Code Quality",
      description: "Reduce code review comments by 50% and implement best practices",
      category: "performance",
      priority: "high",
      progress: 75,
      targetDate: "2024-12-31",
      status: "active",
      createdDate: "2024-01-15",
      managerId: "2",
    },
    {
      id: "2",
      employeeId: "1",
      employeeName: "John Doe",
      title: "Complete React Certification",
      description: "Obtain React Developer certification to enhance frontend skills",
      category: "development",
      priority: "medium",
      progress: 40,
      targetDate: "2024-11-30",
      status: "active",
      createdDate: "2024-02-01",
      managerId: "2",
    },
    {
      id: "3",
      employeeId: "2",
      employeeName: "Jane Smith",
      title: "Lead Team Project",
      description: "Successfully lead the Q4 product launch project",
      category: "project",
      priority: "high",
      progress: 90,
      targetDate: "2024-12-15",
      status: "active",
      createdDate: "2024-09-01",
      managerId: "3",
    },
  ])

  const [reviews] = useState<PerformanceReview[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      reviewerId: "2",
      reviewerName: "Jane Smith",
      reviewPeriod: "Q3 2024",
      reviewType: "quarterly",
      overallRating: 4.2,
      ratings: {
        technical: 4.5,
        communication: 4.0,
        teamwork: 4.2,
        leadership: 3.8,
        initiative: 4.3,
      },
      strengths: "Strong technical skills, proactive problem-solving, excellent code quality",
      areasForImprovement: "Leadership skills, presentation abilities, cross-team collaboration",
      goals: "Focus on mentoring junior developers and improving public speaking skills",
      comments: "John has shown consistent improvement and is ready for more leadership responsibilities",
      status: "completed",
      createdDate: "2024-09-15",
      dueDate: "2024-10-15",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Jane Smith",
      reviewerId: "3",
      reviewerName: "HR Manager",
      reviewPeriod: "Q3 2024",
      reviewType: "quarterly",
      overallRating: 4.6,
      ratings: {
        technical: 4.3,
        communication: 4.8,
        teamwork: 4.7,
        leadership: 4.9,
        initiative: 4.5,
      },
      strengths: "Exceptional leadership, excellent communication, strategic thinking",
      areasForImprovement: "Technical depth in emerging technologies, delegation skills",
      goals: "Develop technical expertise in AI/ML and improve team delegation",
      comments: "Outstanding performance with strong leadership qualities",
      status: "completed",
      createdDate: "2024-09-15",
      dueDate: "2024-10-15",
    },
  ])

  const [feedback] = useState<Feedback[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      feedbackFrom: "2",
      feedbackFromName: "Jane Smith",
      feedbackType: "manager",
      rating: 4.5,
      feedback:
        "John consistently delivers high-quality work and is always willing to help team members. His technical expertise is valuable to the team.",
      anonymous: false,
      createdDate: "2024-10-15",
    },
    {
      id: "2",
      employeeId: "1",
      employeeName: "John Doe",
      feedbackFrom: "3",
      feedbackFromName: "Anonymous",
      feedbackType: "peer",
      rating: 4.2,
      feedback: "Great team player, always responsive to questions and provides helpful insights during code reviews.",
      anonymous: true,
      createdDate: "2024-10-10",
    },
  ])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "development":
        return "bg-green-50 text-green-700 border-green-200"
      case "behavioral":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "project":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200"
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getMyGoals = () => {
    return goals.filter((goal) => goal.employeeId === user?.id)
  }

  const getMyReviews = () => {
    return reviews.filter((review) => review.employeeId === user?.id)
  }

  const getMyFeedback = () => {
    return feedback.filter((fb) => fb.employeeId === user?.id)
  }

  const getTeamGoals = () => {
    if (user?.role === "manager" || user?.role === "hr" || user?.role === "admin") {
      return goals
    }
    return []
  }

  const calculateOverallProgress = (userGoals: Goal[]) => {
    if (userGoals.length === 0) return 0
    const totalProgress = userGoals.reduce((sum, goal) => sum + goal.progress, 0)
    return Math.round(totalProgress / userGoals.length)
  }

  const getAverageRating = (userReviews: PerformanceReview[]) => {
    if (userReviews.length === 0) return 0
    const totalRating = userReviews.reduce((sum, review) => sum + review.overallRating, 0)
    return Math.round((totalRating / userReviews.length) * 10) / 10
  }

  const NewGoalModal = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      category: "",
      priority: "",
      targetDate: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (
        !formData.title ||
        !formData.description ||
        !formData.category ||
        !formData.priority ||
        !formData.targetDate
      ) {
        alert("Please fill all required fields")
        return
      }

      console.log("Creating new goal:", formData)
      alert("Goal created successfully!")
      setShowNewGoal(false)
      setFormData({ title: "", description: "", category: "", priority: "", targetDate: "" })
    }

    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>Set a new performance or development goal</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="Enter goal title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the goal and success criteria"
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
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Goal
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewGoal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    )
  }

  const GoalDetailsModal = ({ goal }: { goal: Goal }) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{goal.title}</DialogTitle>
        <DialogDescription>{goal.employeeName}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <p className="font-medium text-gray-700 mb-2">Description</p>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{goal.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Category</p>
            <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
          </div>
          <div>
            <p className="font-medium text-gray-700">Priority</p>
            <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
          </div>
          <div>
            <p className="font-medium text-gray-700">Status</p>
            <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
          </div>
          <div>
            <p className="font-medium text-gray-700">Target Date</p>
            <p>{new Date(goal.targetDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-2">Progress</p>
          <div className="space-y-2">
            <Progress value={goal.progress} className="h-2" />
            <p className="text-sm text-gray-600">{goal.progress}% completed</p>
          </div>
        </div>

        {user?.role !== "employee" && (
          <div className="flex gap-2 pt-4">
            <Button size="sm" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Goal
            </Button>
            <Button size="sm" variant="outline">
              Update Progress
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  )

  if (user?.role === "employee") {
    const myGoals = getMyGoals()
    const myReviews = getMyReviews()
    const myFeedback = getMyFeedback()
    const overallProgress = calculateOverallProgress(myGoals)
    const averageRating = getAverageRating(myReviews)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Performance</h2>
            <p className="text-gray-600">Track your goals, reviews, and feedback</p>
          </div>
          <Button onClick={() => setShowNewGoal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Active Goals</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {myGoals.filter((g) => g.status === "active").length}
              </div>
              <p className="text-xs text-blue-700">Out of {myGoals.length} total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Overall Progress</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{overallProgress}%</div>
              <p className="text-xs text-green-700">Average goal completion</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Average Rating</CardTitle>
              <Star className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{averageRating}</div>
              <p className="text-xs text-yellow-700">Based on {myReviews.length} reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Feedback</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{myFeedback.length}</div>
              <p className="text-xs text-purple-700">Recent feedback received</p>
            </CardContent>
          </Card>
        </div>

        {/* My Goals */}
        <Card>
          <CardHeader>
            <CardTitle>My Goals</CardTitle>
            <CardDescription>Your current performance and development goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myGoals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{goal.title}</p>
                        <Badge className={getPriorityColor(goal.priority)} variant="outline">
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={goal.progress} className="h-2" />
                        <p className="text-sm text-gray-600">
                          {goal.progress}% complete • Due: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedGoal(goal)
                      setShowGoalDetails(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
              {myGoals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No goals set yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Your latest performance reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{review.reviewPeriod} Review</p>
                      <p className="text-sm text-gray-600">
                        By {review.reviewerName} • Overall: {review.overallRating}/5.0
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                </div>
              ))}
              {myReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
          <NewGoalModal />
        </Dialog>

        <Dialog open={showGoalDetails} onOpenChange={setShowGoalDetails}>
          {selectedGoal && <GoalDetailsModal goal={selectedGoal} />}
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Management</h2>
          <p className="text-gray-600">Manage team performance, goals, and reviews</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewGoal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
          <Button onClick={() => setShowNewReview(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Goals</CardTitle>
                <Target className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{getTeamGoals().length}</div>
                <p className="text-xs text-blue-700">Across all employees</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Completed Goals</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {getTeamGoals().filter((g) => g.status === "completed").length}
                </div>
                <p className="text-xs text-green-700">This quarter</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">Reviews Due</CardTitle>
                <Calendar className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">
                  {reviews.filter((r) => r.status === "draft").length}
                </div>
                <p className="text-xs text-yellow-700">Pending completion</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Avg Rating</CardTitle>
                <Star className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">4.3</div>
                <p className="text-xs text-purple-700">Team average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search goals..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getTeamGoals().map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                        <Target className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.employeeName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(goal.priority)} variant="outline">
                        {goal.priority}
                      </Badge>
                      <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setShowGoalDetails(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{review.employeeName}</h3>
                        <p className="text-sm text-gray-600">
                          {review.reviewPeriod} • {review.reviewType}
                        </p>
                        <p className="text-sm text-gray-500">By {review.reviewerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{review.overallRating}</div>
                      <p className="text-sm text-gray-500">Overall Rating</p>
                      <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{review.ratings.technical}</div>
                      <p className="text-xs text-gray-500">Technical</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{review.ratings.communication}</div>
                      <p className="text-xs text-gray-500">Communication</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{review.ratings.teamwork}</div>
                      <p className="text-xs text-gray-500">Teamwork</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{review.ratings.leadership}</div>
                      <p className="text-xs text-gray-500">Leadership</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{review.ratings.initiative}</div>
                      <p className="text-xs text-gray-500">Initiative</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Strengths:</strong> {review.strengths}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="space-y-4">
            {feedback.map((fb) => (
              <Card key={fb.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{fb.employeeName}</h3>
                        <p className="text-sm text-gray-600">
                          From: {fb.anonymous ? "Anonymous" : fb.feedbackFromName} ({fb.feedbackType})
                        </p>
                        <p className="text-sm text-gray-500">{new Date(fb.createdDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{fb.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{fb.feedback}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed performance insights and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Advanced Analytics</p>
                <p>Performance charts and insights coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <NewGoalModal />
      </Dialog>

      <Dialog open={showGoalDetails} onOpenChange={setShowGoalDetails}>
        {selectedGoal && <GoalDetailsModal goal={selectedGoal} />}
      </Dialog>
    </div>
  )
}
