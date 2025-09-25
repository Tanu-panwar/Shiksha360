"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Plus,
  Search,
  Download,
  Target,
  Brain,
  Zap,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: number // in hours
  instructor: string
  rating: number
  enrolledCount: number
  skills: string[]
  status: "draft" | "published" | "archived"
  createdAt: string
}

interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number
  status: "enrolled" | "in-progress" | "completed" | "dropped"
  enrolledAt: string
  completedAt?: string
  certificateIssued?: boolean
}

interface Skill {
  id: string
  name: string
  category: string
  level: number // 1-5
  userId: string
  lastUpdated: string
}

interface Certificate {
  id: string
  userId: string
  courseId: string
  courseName: string
  issuedAt: string
  expiresAt?: string
  certificateNumber: string
}

export function TrainingDevelopment() {
  const { user } = useAuth()
  const { employees } = useData()
  const [activeTab, setActiveTab] = useState("courses")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  // Mock data - in real app, this would come from API/database
  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: "Leadership Fundamentals",
      description: "Learn the core principles of effective leadership and team management.",
      category: "Leadership",
      level: "intermediate",
      duration: 8,
      instructor: "Sarah Johnson",
      rating: 4.8,
      enrolledCount: 156,
      skills: ["Leadership", "Team Management", "Communication"],
      status: "published",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Data Analysis with Excel",
      description: "Master advanced Excel techniques for data analysis and reporting.",
      category: "Technical",
      level: "beginner",
      duration: 12,
      instructor: "Mike Chen",
      rating: 4.6,
      enrolledCount: 203,
      skills: ["Excel", "Data Analysis", "Reporting"],
      status: "published",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      title: "Project Management Professional",
      description: "Comprehensive PMP certification preparation course.",
      category: "Project Management",
      level: "advanced",
      duration: 40,
      instructor: "David Wilson",
      rating: 4.9,
      enrolledCount: 89,
      skills: ["Project Management", "Planning", "Risk Management"],
      status: "published",
      createdAt: "2024-02-01",
    },
  ])

  const [enrollments] = useState<Enrollment[]>([
    {
      id: "1",
      userId: user?.id || "1",
      courseId: "1",
      progress: 75,
      status: "in-progress",
      enrolledAt: "2024-02-15",
    },
    {
      id: "2",
      userId: user?.id || "1",
      courseId: "2",
      progress: 100,
      status: "completed",
      enrolledAt: "2024-01-10",
      completedAt: "2024-02-10",
      certificateIssued: true,
    },
  ])

  const [skills] = useState<Skill[]>([
    {
      id: "1",
      name: "Leadership",
      category: "Soft Skills",
      level: 4,
      userId: user?.id || "1",
      lastUpdated: "2024-02-15",
    },
    { id: "2", name: "Excel", category: "Technical", level: 5, userId: user?.id || "1", lastUpdated: "2024-02-10" },
    {
      id: "3",
      name: "Communication",
      category: "Soft Skills",
      level: 3,
      userId: user?.id || "1",
      lastUpdated: "2024-02-01",
    },
    {
      id: "4",
      name: "Project Management",
      category: "Management",
      level: 2,
      userId: user?.id || "1",
      lastUpdated: "2024-01-20",
    },
  ])

  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      userId: user?.id || "1",
      courseId: "2",
      courseName: "Data Analysis with Excel",
      issuedAt: "2024-02-10",
      certificateNumber: "CERT-2024-001",
    },
  ])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const myEnrollments = enrollments.filter((enrollment) => enrollment.userId === user?.id)
  const mySkills = skills.filter((skill) => skill.userId === user?.id)
  const myCertificates = certificates.filter((cert) => cert.userId === user?.id)

  const getCourseById = (courseId: string) => courses.find((course) => course.id === courseId)

  const getSkillLevelText = (level: number) => {
    const levels = ["Novice", "Beginner", "Intermediate", "Advanced", "Expert"]
    return levels[level - 1] || "Unknown"
  }

  const getSkillLevelColor = (level: number) => {
    const colors = ["text-red-600", "text-orange-600", "text-yellow-600", "text-blue-600", "text-green-600"]
    return colors[level - 1] || "text-gray-600"
  }

  const CourseCard = ({ course }: { course: Course }) => {
    const enrollment = myEnrollments.find((e) => e.courseId === course.id)
    const isEnrolled = !!enrollment

    return (
      <Card className="hover:shadow-lg transition-all duration-200 bg-white/60 backdrop-blur-sm border-gray-200/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">{course.title}</CardTitle>
              <CardDescription className="mt-2">{course.description}</CardDescription>
            </div>
            <Badge
              variant={
                course.level === "beginner" ? "secondary" : course.level === "intermediate" ? "default" : "destructive"
              }
            >
              {course.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolledCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {course.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            {isEnrolled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">by {course.instructor}</span>
              {isEnrolled ? (
                <Button size="sm" className="flex items-center gap-2">
                  {enrollment.status === "completed" ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Continue
                    </>
                  )}
                </Button>
              ) : (
                <Button size="sm" variant="outline">
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training & Development</h2>
          <p className="text-gray-600">Enhance your skills and advance your career</p>
        </div>
        {(user?.role === "hr" || user?.role === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>Add a new training course to the catalog</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" placeholder="Enter course title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="project-management">Project Management</SelectItem>
                        <SelectItem value="soft-skills">Soft Skills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter course description" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input id="duration" type="number" placeholder="8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input id="instructor" placeholder="Instructor name" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Course</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="my-learning" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            My Learning
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Course Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search courses..."
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
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Project Management">Project Management</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/50">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-learning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Enrolled Courses</CardTitle>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{myEnrollments.length}</div>
                <p className="text-xs text-blue-700">Active learning paths</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Completed</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {myEnrollments.filter((e) => e.status === "completed").length}
                </div>
                <p className="text-xs text-green-700">Courses finished</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Certificates</CardTitle>
                <Award className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{myCertificates.length}</div>
                <p className="text-xs text-purple-700">Earned credentials</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEnrollments.map((enrollment) => {
                  const course = getCourseById(enrollment.courseId)
                  if (!course) return null

                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">
                          {course.category} • {course.duration}h
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                My Skills Profile
              </CardTitle>
              <CardDescription>Track your skill development and identify areas for growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mySkills.map((skill) => (
                  <div key={skill.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{skill.name}</h4>
                      <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                        {getSkillLevelText(skill.level)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Level {skill.level}/5</span>
                        <span className="text-gray-500">{skill.category}</span>
                      </div>
                      <Progress value={skill.level * 20} className="h-2" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(skill.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Development Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Improve Project Management</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Consider taking "Project Management Professional" to advance from level 2 to 4
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        View Course
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Enhance Communication Skills</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Build on your current level 3 communication skills with advanced courses
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Explore Options
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                My Certificates
              </CardTitle>
              <CardDescription>Your earned certifications and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Certificate
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{certificate.courseName}</h4>
                        <p className="text-sm text-gray-600 mb-3">Certificate #{certificate.certificateNumber}</p>
                        <p className="text-xs text-gray-500">
                          Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                        </p>
                        {certificate.expiresAt && (
                          <p className="text-xs text-gray-500">
                            Expires: {new Date(certificate.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {myCertificates.length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                  <p className="text-gray-600 mb-4">Complete courses to earn your first certificate</p>
                  <Button onClick={() => setActiveTab("courses")}>Browse Courses</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
