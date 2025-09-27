"use client"
import { useState } from "react"
import {
  Home, Calendar, Clock, BookOpen, ClipboardList, Utensils, BarChart2, Megaphone, Settings, LogOut, Menu, Bot, School,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { AttendanceTracking } from "@/components/attendance-tracking"
import { InteractiveCalendar } from "@/components/interactive-calendar"
import { Settings as SettingsComponent } from "@/components/settings"
import { NotificationSystem } from "@/components/notification-system"
import { Chatbot } from "@/components/chatbot"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { StudentDashboard } from "@/components/student-dashboard"
import TeacherClasses from "@/components/TeacherClasses";
import TeacherAssignment from "@/components/TeacherAssignment";
import AddAssignment from "@/components/AddAssignment"
import AssignmentDetails from "./AssignmentDetails"
import ClassDetails from "./ClassDetails"
import MidDayMeal from "@/components/MidDayMeal";
import TeacherReports from "@/components/TeacherReports";
import MyClasses from "./MyClasses"
import StudentAssignments from "./StudentAssignments"
import StudentExams from "./StudentExam"
import StudentPerformance from "./StudentPerformance"
import StudentCalendar from "./StudentCalendar"
import StudentMidDayMeal from "./StudentMidDayMeal"
import StudentGrades from "./StudentGrades"
import StudentAnnouncements from "./StudentAnnouncements"
import GovernmentDashboard from "./GovernmentDashboard"
import InstitutionPage from "./InstitutionPage"
import UserManagement from "./UserManagement"
import PerformanceReports from "./PerformanceReports"
import ContentCurriculum from "./ContentCurriculum "
import FeedbackGrievances from "./FeedbackGrievances"
import GovernmentAnnouncement from "./GovernmentAnnouncement"
import SchemesScholarships from "./SchemesScholarships"


export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);


  const teacherTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: ClipboardList },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "calender", label: "Calender", icon: Calendar },
    { id: "meals", label: "Mid-Day Meal", icon: Utensils },
    { id: "reports", label: "Reports", icon: BarChart2 },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const studentTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "classes", label: "My Classes", icon: BookOpen },
    { id: "assignments", label: "Assignments/Homework", icon: ClipboardList },
    { id: "attendance", label: "My Attendance", icon: Clock },
    { id: "exams", label: "Exams/Tests", icon: BookOpen },
    { id: "performance", label: "Performance/Reports", icon: BarChart2 },
    { id: "calender", label: "Calendar/Schedule", icon: Calendar },
    { id: "meals", label: "Mid-Day Meal", icon: Utensils },
    { id: "grades", label: "Grades", icon: BarChart2 },
    { id: "announcements", label: "Announcements/Notices", icon: Megaphone },
    { id: "settings", label: "Settings", icon: Settings },
  ]
  const governmentTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "schools", label: "Schools", icon: School },
    { id: "users", label: "User Management", icon: User },
    { id: "reports", label: "Performance/Reports", icon: BarChart2 },
    { id: "curriculumn", label: "Content & Curriculum", icon: BookOpen },
    { id: "feedback", label: "Feedback & Grievances", icon: ClipboardList },
    { id: "announcement", label: "Announcements & Notifications", icon: Megaphone },
    { id: "schemes", label: "Schemes & Scholarships", icon: ClipboardList },
    { id: "settings", label: "Settings", icon: Settings },
  ]
  const tabs =
    user?.role === "teacher"
      ? teacherTabs
      : user?.role === "student"
        ? studentTabs
        : user?.role === "govt"
          ? governmentTabs
          : []

  const renderContent = () => {
    if (user?.role === "teacher") {
      switch (activeTab) {
        case "dashboard": return <TeacherDashboard />
        case "attendance": return <AttendanceTracking />
        case "calender": return <InteractiveCalendar />
        case "settings": return <SettingsComponent />
        case "classes": return <TeacherClasses setActiveTab={setActiveTab} setSelectedClass={setSelectedClass} />
        case "assignments": return <TeacherAssignment setActiveTab={setActiveTab} setSelectedAssignment={setSelectedAssignment} />
        case "add-assignment": return <AddAssignment />
        case "assignment-details": return <AssignmentDetails assignment={selectedAssignment} setActiveTab={setActiveTab} />
        case "class-details": return <ClassDetails selectedClass={selectedClass} setActiveTab={setActiveTab} />
        case "reports": return <TeacherReports />
        case "meals": return <MidDayMeal />
        default: return <div className="p-8 text-center text-gray-500">Coming soon...</div>
      }
    }

    if (user?.role === "student") {
      switch (activeTab) {
        case "dashboard": return <StudentDashboard />
        case "classes": return <MyClasses />
        case "assignments": return <StudentAssignments />
        case "exams": return <StudentExams />
        case "attendance": return <AttendanceTracking />
        case "calender": return <StudentCalendar />
        case "performance": return <StudentPerformance />
        case "settings": return <SettingsComponent />
        case "grades": return <StudentGrades />
        case "meals": return <StudentMidDayMeal />
        case "announcements": return <StudentAnnouncements />
        default: return <div className="p-8 text-center text-gray-500">Coming soon...</div>
      }
    }

    if (user?.role === "govt") {
      switch (activeTab) {
        case "dashboard": return <GovernmentDashboard />
        case "schools": return <InstitutionPage />
        case "users": return <UserManagement />
        case "reports": return <PerformanceReports />
        case "curriculumn": return <ContentCurriculum />
        case "feedback": return <FeedbackGrievances />
        case "announcement": return <GovernmentAnnouncement />
        case "schemes": return <SchemesScholarships />
        case "reports": return <div className="p-8">Reports view coming soon</div>
        case "settings": return <SettingsComponent />
        default: return <div className="p-8 text-center text-gray-500">Coming soon...</div>
      }
    }

    if (user?.role === "admin") {
      return <div className="p-8 text-center text-gray-500">Admin panel coming soon...</div>
    }

    return <div className="p-8 text-center text-gray-500">Coming soon...</div>
  }

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full bg-white">
      {/* App Branding */}
      <div className="p-6 border-b border-blue-100 bg-blue-50/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-300 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-800">Shiksha360</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">

        {/* Tabs */}
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id)
                onItemClick?.()
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
                : "hover:bg-blue-50 border border-transparent"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
              <span className={`font-medium ${isActive ? "text-blue-900" : "text-gray-700"}`}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen border-b border-blue-100 bg-blue-50/30 backdrop-blur-md">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col border-r border-blue-100">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-blue-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-blue-800">Shiksha360</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative hover:bg-blue-100">
              <NotificationSystem />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowChatbot(!showChatbot)} className="hover:bg-blue-100">
              <Bot className="w-5 h-5" />
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 font-semibold bg-white px-3 py-2 rounded-lg shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Header  */}
        <div className="hidden lg:flex bg-white border-b border-blue-100 p-4 justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-blue-800">
              Welcome back, {user?.name}! 👋
            </h2>
            {/* <p className="text-sm text-blue-600">
              You have <span className="font-bold text-blue-900">3 classes</span> scheduled and{" "}
              <span className="font-bold text-blue-900">12 pending assignments</span> to review.
            </p> */}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-blue-100"
            >
              <NotificationSystem />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatbot(!showChatbot)}
              className="hover:bg-blue-100"
            >
              <Bot className="w-5 h-5" />
              AI Assistant
            </Button>
            <div className="h-6 w-px bg-blue-200 mx-2"></div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && <Chatbot isOpen={showChatbot} onToggle={() => setShowChatbot(false)} />}
    </div>
  )
}