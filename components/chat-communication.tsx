"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { useData, type ChatMessage } from "@/contexts/data-context"
import {
  Send,
  Search,
  Plus,
  MessageSquare,
  Users,
  Megaphone,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react"

interface NewMessageData {
  receiverId: string
  departmentId: string
  message: string
  type: "direct" | "department" | "announcement"
}

export function ChatCommunication() {
  const { user } = useAuth()
  const { messages, employees, departments, addMessage } = useData()
  const [activeChat, setActiveChat] = useState<string>("")
  const [chatType, setChatType] = useState<"direct" | "department">("direct")
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [newMessageData, setNewMessageData] = useState<NewMessageData>({
    receiverId: "",
    departmentId: "",
    message: "",
    type: "direct",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample messages for demo
  useEffect(() => {
    if (messages.length === 0 && user?.id) {
      const sampleMessages: Omit<ChatMessage, "id" | "timestamp">[] = [
        {
          senderId: "emp-2",
          receiverId: user.id,
          message: "Hi! How's the quarterly report coming along?",
          type: "direct",
        },
        {
          senderId: user.id,
          receiverId: "emp-2",
          message: "Going well! Should have it ready by tomorrow.",
          type: "direct",
        },
        {
          senderId: "manager-hr",
          departmentId: "dept-general",
          message: "Team meeting scheduled for Friday at 2 PM. Please confirm your attendance.",
          type: "department",
        },
        {
          senderId: "manager-hr",
          message: "Reminder: Please submit your timesheets by end of day Friday.",
          type: "announcement",
        },
      ]
      sampleMessages.forEach(addMessage)
    }
  }, [messages.length, addMessage, user?.id])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    return employee?.name || "Unknown Employee"
  }

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId)
    return department?.name || "Unknown Department"
  }

  const getDirectChats = () => {
    const userMessages = messages.filter(
      (msg) => msg.type === "direct" && (msg.senderId === user?.id || msg.receiverId === user?.id),
    )

    const chatPartners = new Set<string>()
    userMessages.forEach((msg) => {
      if (msg.senderId === user?.id && msg.receiverId) {
        chatPartners.add(msg.receiverId)
      } else if (msg.receiverId === user?.id) {
        chatPartners.add(msg.senderId)
      }
    })

    return Array.from(chatPartners).map((partnerId) => {
      const partner = employees.find((e) => e.id === partnerId)
      const lastMessage = userMessages
        .filter(
          (msg) =>
            (msg.senderId === partnerId && msg.receiverId === user?.id) ||
            (msg.senderId === user?.id && msg.receiverId === partnerId),
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      return {
        id: partnerId,
        name: partner?.name || "Unknown",
        lastMessage: lastMessage?.message || "",
        timestamp: lastMessage?.timestamp || "",
        unread: 0, // In a real app, you'd track unread messages
      }
    })
  }

  const getDepartmentChats = () => {
    const userDepartments = departments.filter(
      (dept) => user?.departmentId === dept.id || user?.role === "hr" || user?.role === "admin",
    )

    return userDepartments.map((dept) => {
      const lastMessage = messages
        .filter((msg) => msg.type === "department" && msg.departmentId === dept.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      return {
        id: dept.id,
        name: dept.name,
        lastMessage: lastMessage?.message || "No messages yet",
        timestamp: lastMessage?.timestamp || "",
        unread: 0,
      }
    })
  }

  const getAnnouncements = () => {
    return messages
      .filter((msg) => msg.type === "announcement")
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  }

  const getChatMessages = () => {
    if (!activeChat) return []

    if (chatType === "direct") {
      return messages
        .filter(
          (msg) =>
            msg.type === "direct" &&
            ((msg.senderId === user?.id && msg.receiverId === activeChat) ||
              (msg.senderId === activeChat && msg.receiverId === user?.id)),
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    } else {
      return messages
        .filter((msg) => msg.type === "department" && msg.departmentId === activeChat)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    addMessage({
      senderId: user?.id || "",
      receiverId: chatType === "direct" ? activeChat : undefined,
      departmentId: chatType === "department" ? activeChat : undefined,
      message: newMessage,
      type: chatType,
    })

    setNewMessage("")
  }

  const handleNewChat = () => {
    if (!newMessageData.message.trim()) return

    addMessage({
      senderId: user?.id || "",
      receiverId: newMessageData.type === "direct" ? newMessageData.receiverId : undefined,
      departmentId: newMessageData.type === "department" ? newMessageData.departmentId : undefined,
      message: newMessageData.message,
      type: newMessageData.type,
    })

    setIsNewChatOpen(false)
    setNewMessageData({
      receiverId: "",
      departmentId: "",
      message: "",
      type: "direct",
    })
  }

  const handleAnnouncement = () => {
    if (!newMessageData.message.trim()) return

    addMessage({
      senderId: user?.id || "",
      message: newMessageData.message,
      type: "announcement",
    })

    setIsAnnouncementOpen(false)
    setNewMessageData({
      receiverId: "",
      departmentId: "",
      message: "",
      type: "direct",
    })
  }

  const canMakeAnnouncements = user?.role === "hr" || user?.role === "admin" || user?.role === "manager"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Chat & Communication</CardTitle>
              <CardDescription>Communicate with your team</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start New Chat</DialogTitle>
                    <DialogDescription>Send a message to a colleague or department</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Chat Type</Label>
                      <Select
                        value={newMessageData.type}
                        onValueChange={(value: "direct" | "department") =>
                          setNewMessageData({ ...newMessageData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Message</SelectItem>
                          <SelectItem value="department">Department Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newMessageData.type === "direct" ? (
                      <div className="space-y-2">
                        <Label>Send To</Label>
                        <Select
                          value={newMessageData.receiverId}
                          onValueChange={(value) => setNewMessageData({ ...newMessageData, receiverId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees
                              .filter((emp) => emp.id !== user?.id)
                              .map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.name} ({employee.role})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select
                          value={newMessageData.departmentId}
                          onValueChange={(value) => setNewMessageData({ ...newMessageData, departmentId: value })}
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
                    )}

                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={newMessageData.message}
                        onChange={(e) => setNewMessageData({ ...newMessageData, message: e.target.value })}
                        placeholder="Type your message..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewChatOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNewChat}>Send Message</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {canMakeAnnouncements && (
                <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4" />
                      Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make Announcement</DialogTitle>
                      <DialogDescription>Send a company-wide announcement</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Announcement Message</Label>
                        <Textarea
                          value={newMessageData.message}
                          onChange={(e) => setNewMessageData({ ...newMessageData, message: e.target.value })}
                          placeholder="Type your announcement..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAnnouncementOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAnnouncement}>Send Announcement</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="direct" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                <TabsTrigger value="direct" className="text-xs">
                  Direct
                </TabsTrigger>
                <TabsTrigger value="departments" className="text-xs">
                  Departments
                </TabsTrigger>
                <TabsTrigger value="announcements" className="text-xs">
                  News
                </TabsTrigger>
              </TabsList>

              <TabsContent value="direct" className="mt-0">
                <ScrollArea className="h-[450px]">
                  <div className="space-y-1 p-4 pt-0">
                    {getDirectChats()
                      .filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            activeChat === chat.id && chatType === "direct"
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setActiveChat(chat.id)
                            setChatType("direct")
                          }}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{chat.name}</div>
                            <div className="text-xs text-gray-600 truncate">{chat.lastMessage}</div>
                          </div>
                          {chat.unread > 0 && <Badge className="bg-blue-600 text-white text-xs">{chat.unread}</Badge>}
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="departments" className="mt-0">
                <ScrollArea className="h-[450px]">
                  <div className="space-y-1 p-4 pt-0">
                    {getDepartmentChats()
                      .filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            activeChat === chat.id && chatType === "department"
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setActiveChat(chat.id)
                            setChatType("department")
                          }}
                        >
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{chat.name}</div>
                            <div className="text-xs text-gray-600 truncate">{chat.lastMessage}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="announcements" className="mt-0">
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2 p-4 pt-0">
                    {getAnnouncements().map((announcement) => (
                      <div key={announcement.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Megaphone className="h-4 w-4 text-yellow-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-yellow-800">
                              {getEmployeeName(announcement.senderId)}
                            </div>
                            <div className="text-sm text-gray-700 mt-1">{announcement.message}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              {new Date(announcement.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Messages Area */}
        <Card className="lg:col-span-3">
          {activeChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {chatType === "direct" ? (
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getEmployeeName(activeChat)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">
                        {chatType === "direct" ? getEmployeeName(activeChat) : getDepartmentName(activeChat)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {chatType === "direct" ? "Direct Message" : "Department Chat"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {getChatMessages().map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === user?.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {chatType === "department" && message.senderId !== user?.id && (
                            <div className="text-xs font-medium mb-1 opacity-75">
                              {getEmployeeName(message.senderId)}
                            </div>
                          )}
                          <div className="text-sm">{message.message}</div>
                          <div
                            className={`text-xs mt-1 ${
                              message.senderId === user?.id ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start messaging</h3>
                <p className="text-gray-600">Choose from your direct messages or department chats</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
