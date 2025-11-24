"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus, Bell, ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface Notification {
  id: string;
  actor: {
    id: string;
    displayName: string;
    username: string;
  };
  type: "like" | "retweet" | "reply" | "follow" | "mention";
  tweet?: {
    id: string;
    content: string;
  };
  isRead: boolean;
  createdAt: string;
}
export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchNotifications();
  }, [router]);
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-destructive" />;
      case "follow":
        return <UserPlus size={16} className="text-primary" />;
      case "reply":
      case "mention":
        return <MessageCircle size={16} className="text-primary" />;
      default:
        return <Bell size={16} className="text-primary" />;
    }
  };
  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "like":
        return `${notification.actor.displayName} liked your post`;
      case "follow":
        return `${notification.actor.displayName} followed you`;
      case "reply":
        return `${notification.actor.displayName} replied to your post`;
      case "mention":
        return `${notification.actor.displayName} mentioned you`;
      default:
        return "You have a new notification";
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffTime / (1000 * 60));
        return `${diffMins}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return "1d ago";
    return date.toLocaleDateString();
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">RNSTweets</h1>
            <p className="text-xs text-muted-foreground">Notifications</p>
          </div>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Explore</span>
            </Link>
            <Link
              href="/notifications"
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <Bell size={24} />
              <span>Notifications</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Messages</span>
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="text-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-primary">Notifications</h1>
          <ThemeSwitcher />
        </div>
        {/* Notifications */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          <div className="border-b border-border bg-card p-6 sticky top-0 z-20 lg:mt-0 mt-16">
            <h2 className="text-2xl font-bold text-foreground">
              Notifications
            </h2>
            <p className="text-muted-foreground text-sm">
              Stay updated with your activity
            </p>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-foreground font-bold text-xl mb-2">
                  No new notifications
                </p>
                <p className="text-muted-foreground">
                  Follow more people and engage with posts to get notifications
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/profile?username=${notification.actor.username}`}
                  className={`border-b border-border p-4 hover:bg-muted/50 transition-colors flex gap-4 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">
                        {notification.actor.displayName}
                      </span>
                      <span className="text-muted-foreground text-sm truncate">
                        @{notification.actor.username}
                      </span>
                    </div>
                    <p className="text-foreground text-sm mt-1">
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
