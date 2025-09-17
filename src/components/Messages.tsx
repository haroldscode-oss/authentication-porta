import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft } from "lucide-react"
import { useKV } from '@github/spark/hooks'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface Conversation {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  lastSeen?: Date
}

interface MessagesProps {
  onBack?: () => void
}

export function Messages({ onBack }: MessagesProps = {}) {
  const [conversations, setConversations] = useKV<Conversation[]>("conversations", [
    {
      id: "1",
      userId: "user1",
      userName: "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
      lastMessage: "Great! I'll have the design ready by tomorrow.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
      isOnline: true
    },
    {
      id: "2", 
      userId: "user2",
      userName: "Mike Chen",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      lastMessage: "When can we schedule the meeting?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 0,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      id: "3",
      userId: "user3", 
      userName: "Emma Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      lastMessage: "The project looks amazing! 🎉",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 1,
      isOnline: true
    },
    {
      id: "4",
      userId: "user4",
      userName: "Alex Thompson", 
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      lastMessage: "I've sent the files over. Let me know if you need anything else.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      unreadCount: 0,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    }
  ])

  const [messages, setMessages] = useKV<Message[]>("messages", [
    {
      id: "1",
      senderId: "user1",
      senderName: "Sarah Johnson", 
      senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
      content: "Hi! I saw your graphic design project and I'm really interested.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: true
    },
    {
      id: "2",
      senderId: "me",
      senderName: "You",
      content: "Thanks for reaching out! I'd love to discuss the details with you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isRead: true
    },
    {
      id: "3", 
      senderId: "user1",
      senderName: "Sarah Johnson",
      senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
      content: "Perfect! What's your timeline for this project?",
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      isRead: true
    },
    {
      id: "4",
      senderId: "me", 
      senderName: "You",
      content: "I can have the initial concepts ready within 3-4 days. Does that work for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
      isRead: true
    },
    {
      id: "5",
      senderId: "user1",
      senderName: "Sarah Johnson",
      senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150", 
      content: "Great! I'll have the design ready by tomorrow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false
    }
  ])

  const [selectedConversation, setSelectedConversation] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowConversationList(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const currentConversation = conversations?.find(c => c.id === selectedConversation)
  const conversationMessages = messages?.filter(m => 
    (m.senderId === currentConversation?.userId) || 
    (m.senderId === "me" && selectedConversation === currentConversation?.id)
  ) || []

  const filteredConversations = conversations?.filter(conversation =>
    conversation.userName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You", 
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: true
    }

    setMessages(current => [...(current || []), message])
    
    // Update conversation last message
    setConversations(current => 
      (current || []).map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date() }
          : conv
      )
    )
    
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString()
  }

  const markAsRead = (conversationId: string) => {
    setConversations(current =>
      (current || []).map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    )
  }

  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    markAsRead(conversationId)
    if (isMobileView) {
      setShowConversationList(false)
    }
  }

  const goBackToConversations = () => {
    setShowConversationList(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-screen bg-background"
    >
      {/* Header with back button */}
      {onBack && (
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border shadow-sm hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Button>
        </div>
      )}
      {/* Conversations Sidebar */}
      <motion.div 
        className={`${
          isMobileView 
            ? showConversationList ? 'w-full' : 'hidden'
            : 'w-80'
        } border-r border-border bg-card flex flex-col`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">Messages</h1>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: "oklch(0.98 0 0)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id 
                    ? 'bg-accent' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.userAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {conversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">
                        {conversation.userName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 px-2 py-1 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {!conversation.isOnline && conversation.lastSeen && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last seen {formatTime(conversation.lastSeen)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      {/* Chat Area */}
      <motion.div 
        className={`${
          isMobileView 
            ? showConversationList ? 'hidden' : 'w-full'
            : 'flex-1'
        } flex flex-col bg-background`}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMobileView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goBackToConversations}
                      className="mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentConversation.userAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {currentConversation.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {currentConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {currentConversation.userName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentConversation.isOnline ? 'Online' : `Last seen ${formatTime(currentConversation.lastSeen!)}`}
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
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${
                      message.senderId === 'me' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      {message.senderId !== 'me' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.senderId === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'me' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10 min-h-[40px] resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}