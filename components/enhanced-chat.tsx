"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Search, Users, MessageCircle, Phone, Video, MoreVertical, Paperclip, Smile, Circle } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "file" | "system"
  chatId: string
}

interface Chat {
  id: string
  name: string
  type: "direct" | "group" | "department"
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
}

interface OnlineUser {
  id: string
  name: string
  lastSeen: Date
  isOnline: boolean
}

export function EnhancedChat() {
  const { user } = useAuth()
  const { employees } = useData()
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserList, setShowUserList] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const notificationAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const createNotificationSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 600
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (error) {
        console.log("Audio context not available")
      }
    }

    notificationAudioRef.current = { play: createNotificationSound } as any
  }, [])

  useEffect(() => {
    const simulateOnlineUsers = () => {
      const online = employees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        lastSeen: new Date(),
        isOnline: Math.random() > 0.3, // 70% chance of being online
      }))
      setOnlineUsers(online)
    }

    simulateOnlineUsers()
    // Update online status every 30 seconds
    const interval = setInterval(simulateOnlineUsers, 30000)
    return () => clearInterval(interval)
  }, [employees])

  // Initialize chats
  useEffect(() => {
    const initializeChats = () => {
      const initialChats: Chat[] = [
        {
          id: "general",
          name: "General Discussion",
          type: "group",
          participants: employees.map((e) => e.id),
          unreadCount: 2,
        },
        {
          id: "announcements",
          name: "HR Announcements",
          type: "group",
          participants: employees.map((e) => e.id),
          unreadCount: 1,
        },
      ]

      // Add department chats
      const departments = [...new Set(employees.map((e) => e.department))]
      departments.forEach((dept) => {
        if (dept) {
          initialChats.push({
            id: `dept-${dept.toLowerCase()}`,
            name: `${dept} Team`,
            type: "department",
            participants: employees.filter((e) => e.department === dept).map((e) => e.id),
            unreadCount: 0,
          })
        }
      })

      setChats(initialChats)
    }

    if (employees.length > 0) {
      initializeChats()
    }
  }, [employees])

  // Initialize sample messages
  useEffect(() => {
    const sampleMessages: ChatMessage[] = [
      {
        id: "1",
        senderId: "emp-2",
        senderName: "Jane Smith",
        content: "Good morning everyone! Hope you all have a great day ahead.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: "text",
        chatId: "general",
      },
      {
        id: "2",
        senderId: "emp-3",
        senderName: "Mike Johnson",
        content: "Thanks Jane! Looking forward to the team meeting today.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        type: "text",
        chatId: "general",
      },
      {
        id: "3",
        senderId: "hr-1",
        senderName: "HR Admin",
        content: "Reminder: Please submit your timesheets by end of day Friday.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: "text",
        chatId: "announcements",
      },
    ]
    setMessages(sampleMessages)
  }, [])

  useEffect(() => {
    const simulateIncomingMessages = () => {
      // Only simulate if user is not currently typing
      if (document.activeElement?.tagName !== "INPUT") {
        const randomEmployee = employees[Math.floor(Math.random() * employees.length)]
        const randomChats = chats.filter((c) => c.participants.includes(user?.id || ""))

        if (randomEmployee && randomChats.length > 0 && randomEmployee.id !== user?.id) {
          const randomChat = randomChats[Math.floor(Math.random() * randomChats.length)]
          const messages = [
            "Hey, how's the project going?",
            "Can we schedule a quick meeting?",
            "Thanks for your help earlier!",
            "Don't forget about the deadline tomorrow.",
            "Great work on the presentation!",
            "Are you available for a call?",
            "I've updated the document.",
            "Let me know if you need any assistance.",
          ]

          const newMessage: ChatMessage = {
            id: `sim-${Date.now()}-${Math.random()}`,
            senderId: randomEmployee.id,
            senderName: randomEmployee.name,
            content: messages[Math.floor(Math.random() * messages.length)],
            timestamp: new Date(),
            type: "text",
            chatId: randomChat.id,
          }

          setMessages((prev) => [...prev, newMessage])

          // Update unread count if not in active chat
          if (randomChat.id !== activeChat) {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === randomChat.id
                  ? { ...chat, unreadCount: chat.unreadCount + 1, lastMessage: newMessage }
                  : chat,
              ),
            )

            // Play notification sound
            if (notificationAudioRef.current) {
              notificationAudioRef.current.play()
            }
          } else {
            // Update last message even if in active chat
            setChats((prev) =>
              prev.map((chat) => (chat.id === randomChat.id ? { ...chat, lastMessage: newMessage } : chat)),
            )
          }
        }
      }
    }

    // Simulate incoming messages every 15-45 seconds
    const interval = setInterval(simulateIncomingMessages, Math.random() * 30000 + 15000)
    return () => clearInterval(interval)
  }, [employees, chats, activeChat, user])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      chatId: activeChat,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Update last message in chat
    setChats((prev) => prev.map((chat) => (chat.id === activeChat ? { ...chat, lastMessage: message } : chat)))
  }

  const startDirectChat = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee || !user) return

    const chatId = `direct-${[user.id, employeeId].sort().join("-")}`

    // Check if chat already exists
    const existingChat = chats.find((c) => c.id === chatId)
    if (existingChat) {
      setActiveChat(chatId)
      setShowUserList(false)
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)))
      return
    }

    // Create new direct chat
    const newChat: Chat = {
      id: chatId,
      name: employee.name,
      type: "direct",
      participants: [user.id, employeeId],
      unreadCount: 0,
    }

    setChats((prev) => [...prev, newChat])
    setActiveChat(chatId)
    setShowUserList(false)
  }

  const selectChat = (chatId: string) => {
    setActiveChat(chatId)
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)))
  }

  const filteredEmployees = employees.filter(
    (emp) => emp.id !== user?.id && emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeChatData = chats.find((c) => c.id === activeChat)
  const activeChatMessages = messages.filter((m) => m.chatId === activeChat)

  const getUserOnlineStatus = (userId: string) => {
    return onlineUsers.find((u) => u.id === userId)?.isOnline || false
  }

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Messages</h3>
            <Button variant="outline" size="sm" onClick={() => setShowUserList(!showUserList)}>
              <Users className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {showUserList ? (
          <ScrollArea className="flex-1">
            <div className="p-2">
              <h4 className="font-medium mb-2 px-2">Start a conversation</h4>
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                  onClick={() => startDirectChat(employee.id)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Circle
                      className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${
                        getUserOnlineStatus(employee.id)
                          ? "fill-green-500 text-green-500"
                          : "fill-gray-400 text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getUserOnlineStatus(employee.id) ? "Online" : "Offline"} • {employee.position}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {employee.department}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer ${
                    activeChat === chat.id ? "bg-muted" : ""
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {chat.type === "direct"
                          ? chat.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : chat.type === "group"
                            ? "G"
                            : "D"}
                      </AvatarFallback>
                    </Avatar>
                    {chat.type === "direct" && (
                      <Circle
                        className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${
                          getUserOnlineStatus(chat.participants.find((p) => p !== user?.id) || "")
                            ? "fill-green-500 text-green-500"
                            : "fill-gray-400 text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{chat.name}</p>
                      {chat.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {activeChatData?.type === "direct"
                        ? activeChatData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : activeChatData?.type === "group"
                          ? "G"
                          : "D"}
                    </AvatarFallback>
                  </Avatar>
                  {activeChatData?.type === "direct" && (
                    <Circle
                      className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${
                        getUserOnlineStatus(activeChatData.participants.find((p) => p !== user?.id) || "")
                          ? "fill-green-500 text-green-500"
                          : "fill-gray-400 text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{activeChatData?.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {activeChatData?.type === "direct"
                      ? getUserOnlineStatus(activeChatData.participants.find((p) => p !== user?.id) || "")
                        ? "Online"
                        : "Offline"
                      : `${activeChatData?.participants.length} participants`}
                  </p>
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

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderId !== user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <p className="text-xs font-medium mb-1">{message.senderName}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
