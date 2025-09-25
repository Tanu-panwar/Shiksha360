"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Send, X, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onToggle: () => void
}

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${user?.name}! Welcome to the Zrosis HR Assistant. I can help you navigate the HR system, answer policy questions, and guide you through various tasks. What would you like to know about?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("leave") || message.includes("vacation") || message.includes("time off")) {
      return "For leave requests, go to 'Leave Management' in the sidebar. You can submit requests, check your leave balance (15 vacation days, 10 sick days annually), and track approval status. Would you like me to guide you through submitting a leave request?"
    }

    if (
      message.includes("salary") ||
      message.includes("payroll") ||
      message.includes("pay") ||
      message.includes("slip")
    ) {
      return "For salary information, visit 'Salary Slips' in the sidebar. You can view detailed pay breakdowns, download PDF slips, and see deductions (PF, TDS, PT). HR can edit salary components from their panel. Need help accessing your latest pay slip?"
    }

    if (message.includes("attendance") || message.includes("clock") || message.includes("time tracking")) {
      return "Use the 'Attendance' section to clock in/out, track work hours, and manage breaks. Your daily/weekly hours are automatically calculated. Remember to clock out for lunch breaks. Having trouble with time tracking?"
    }

    if (message.includes("meeting") || message.includes("schedule") || message.includes("google meet")) {
      return "Schedule meetings using 'Schedule Meeting' in the sidebar. You can create Google Meet links, invite attendees, set recurring meetings, and manage your meeting calendar. Need help setting up a team meeting?"
    }

    if (message.includes("employee") || message.includes("staff") || message.includes("team member")) {
      if (user?.role === "hr" || user?.role === "admin") {
        return "As an HR user, you can manage employees through 'Employee Management'. Add new employees, update profiles, assign departments, and track performance. You also have access to recruitment and department management."
      }
      return "You can view team information in 'Departments' and communicate with colleagues through 'Communication'. For employee-related requests, contact your HR department."
    }

    if (message.includes("document") || message.includes("file") || message.includes("policy")) {
      return "Access company documents and policies in the 'Documents' section. You can upload files, organize by categories, and control access permissions. All company policies, handbooks, and forms are available there."
    }

    if (message.includes("training") || message.includes("course") || message.includes("learning")) {
      return "Explore training opportunities in the 'Training' section. Enroll in courses, track your learning progress, earn certifications, and build your skill profile. Your manager can assign mandatory training courses."
    }

    if (message.includes("expense") || message.includes("reimbursement") || message.includes("receipt")) {
      return "Submit expense claims in the 'Expenses' section. Upload receipts, categorize expenses, and track reimbursement status. Managers can approve/reject claims, and you'll get notifications on status updates."
    }

    if (message.includes("performance") || message.includes("review") || message.includes("goal")) {
      return "Manage your performance in the 'Performance' section. Set goals, track progress, participate in reviews, and receive feedback. Your manager can conduct evaluations and provide 360-degree feedback."
    }

    if (message.includes("asset") || message.includes("equipment") || message.includes("laptop")) {
      return "Track company assets in the 'Assets' section. View assigned equipment, report issues, request maintenance, and manage asset transfers. All your assigned laptops, phones, and equipment are listed there."
    }

    if (message.includes("chat") || message.includes("message") || message.includes("communication")) {
      return "Use 'Communication' for messaging colleagues. Send direct messages, join department groups, share files, and participate in team discussions. All conversations are secure and searchable."
    }

    if (message.includes("calendar") || message.includes("event") || message.includes("appointment")) {
      return "Manage your schedule in the 'Calendar' section. View monthly/weekly/daily calendars, create events, set reminders, and see team availability. You can also drag-and-drop to reschedule events."
    }

    if (message.includes("settings") || message.includes("profile") || message.includes("preferences")) {
      return "Update your preferences in 'Settings'. Change your profile photo, notification settings, privacy controls, and appearance themes. You can also manage your password and contact information."
    }

    if (message.includes("help") || message.includes("support") || message.includes("how to")) {
      return `I'm here to help with the Zrosis HR System! I can guide you through: Leave requests, Salary slips, Attendance tracking, Meeting scheduling, Document access, Training enrollment, Expense claims, Performance reviews, Asset management, and more. What specific task do you need help with?`
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return `Hello ${user?.name}! Welcome to the Zrosis HR Assistant. I can help you navigate the HR system, answer policy questions, and guide you through various tasks. What would you like to know about?`
    }

    if (message.includes("thank") || message.includes("thanks")) {
      return "You're welcome! I'm always here to help with your HR needs. Feel free to ask me anything about the Zrosis HR System anytime!"
    }

    return `I'd be happy to help you with that! Here are some quick actions you can take:

📋 **Leave Request** - Go to Leave Management
💰 **View Pay Slip** - Check Salary Slips  
⏰ **Clock In/Out** - Use Attendance
📅 **Schedule Meeting** - Use Schedule Meeting
📄 **Find Documents** - Browse Documents
🎓 **Take Training** - Explore Training

For specific questions, try asking about policies, procedures, or any HR topic. How else can I assist you?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-80 sm:w-96 bg-white shadow-2xl border-0 transition-all duration-300 ${
          isMinimized ? "h-16" : "h-96"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm font-medium">HR Assistant</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Online
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg text-sm ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border-gray-200 focus:border-blue-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
