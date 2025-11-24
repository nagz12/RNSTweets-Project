"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Send, ArrowLeft, Mail } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface User {
  id: string;
  displayName: string;
  username: string;
  avatar?: string;
}
interface Message {
  id: string;
  sender: User;
  recipient: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}
interface Conversation {
  user: User;
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime?: string;
}
export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      setCurrentUserId(payload.userId);
    } catch (err) {
      console.error("Error decoding token:", err);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId);
      } catch (e) {
        console.error("Fallback decode also failed:", e);
      }
    }
    fetchConversations();
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/messages/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(
        `/api/messages?conversationWith=${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId);
    fetchMessages(userId);
  };
  useEffect(() => {
    if (!currentUserId || selectedConversation) return;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    if (userId && userId !== selectedConversation) {
      setSelectedConversation(userId);
      fetchMessages(userId);
    }
  }, [currentUserId, selectedConversation]);
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: selectedConversation,
          content: newMessage,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setNewMessage("");
        await fetchMessages(selectedConversation);
        await fetchConversations();
        setTimeout(() => scrollToBottom(), 100);
      } else {
        console.error("Failed to send message:", data);
        const errorMsg = data.error || data.message || "Failed to send message";
        alert(`Error: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      const errorMsg = err?.message || "An error occurred while sending the message";
      alert(`Error: ${errorMsg}`);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">RNSTweets</h1>
            <p className="text-xs text-muted-foreground">Messages</p>
          </div>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <Mail size={24} />
              <span>Messages</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Explore</span>
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          {selectedConversation ? (
            <>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-foreground hover:text-primary"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-primary">Messages</h1>
              <ThemeSwitcher />
            </>
          ) : (
            <>
              <Link href="/feed" className="text-foreground hover:text-primary">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-xl font-bold text-primary">Messages</h1>
              <ThemeSwitcher />
            </>
          )}
        </div>
        {/* Conversations List */}
        {(!selectedConversation || !isMobileView) && (
          <div
            className={`${
              isMobileView ? "hidden" : "w-80"
            } lg:w-80 lg:ml-64 border-r border-border flex flex-col bg-card`}
          >
            <div className="border-b border-border p-6 sticky top-0 z-10 bg-card">
              <h2 className="text-2xl font-bold text-foreground">Messages</h2>
              <p className="text-xs text-muted-foreground">
                Your conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading messages...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Mail size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-xs mt-2">
                    Start a conversation by visiting someone's profile
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user.id}
                    onClick={() => handleSelectConversation(conv.user.id)}
                    className={`w-full border-b border-border p-4 hover:bg-muted/50 transition-colors text-left ${
                      selectedConversation === conv.user.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {conv.user.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage || "@" + conv.user.username}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
        {/* Message View */}
        {selectedConversation ? (
          <div className={`flex-1 flex flex-col ${isMobileView ? "ml-0" : ""}`}>
            {/* Message Header */}
            <div className="border-b border-border bg-card p-4 lg:p-6 sticky top-0 z-10 hidden lg:block">
              <h3 className="text-xl font-bold text-foreground">
                {
                  conversations.find((c) => c.user.id === selectedConversation)
                    ?.user.displayName
                }
              </h3>
              <p className="text-sm text-muted-foreground">
                @
                {
                  conversations.find((c) => c.user.id === selectedConversation)
                    ?.user.username
                }
              </p>
            </div>
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-2 lg:mt-0 mt-16"
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isOwn = currentUserId && msg.sender.id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex w-full ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex flex-col ${
                            isOwn ? "items-end" : "items-start"
                          } max-w-[75%] lg:max-w-[60%]`}
                        >
                          <div
                            className={`px-4 py-2 break-words ${
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                                : "bg-muted/80 text-foreground rounded-2xl rounded-bl-sm border border-border/50"
                            }`}
                            style={{
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
                            <p className="text-sm lg:text-base whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                          <p
                            className={`text-xs mt-1 px-2 ${
                              isOwn
                                ? "text-muted-foreground text-right"
                                : "text-muted-foreground text-left"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            {/* Message Input */}
            <div className="border-t border-border bg-card p-4 lg:p-6 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-input border border-border rounded-full px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm lg:text-base"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
