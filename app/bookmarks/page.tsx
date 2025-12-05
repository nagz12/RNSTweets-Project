"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Repeat2,
  BookmarkIcon,
  ArrowLeft,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface Tweet {
  id: string;
  content: string;
  author: {
    id: string;
    displayName: string;
    username: string;
  };
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
  viewCount: number;
}
interface BookmarkType {
  id: string;
  tweet: Tweet;
}
export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchBookmarks();
  }, [router]);
  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.bookmarks) {
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveBookmark = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(`/api/bookmarks/${tweetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.tweet.id !== tweetId));
      }
    } catch (err) {
      console.error("Failed to remove bookmark", err);
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
            <p className="text-xs text-muted-foreground">Bookmarks</p>
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
              href="/bookmarks"
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <BookmarkIcon size={24} />
              <span>Bookmarks</span>
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
          <h1 className="text-xl font-bold text-primary">Bookmarks</h1>
          <ThemeSwitcher />
        </div>
        {/* Bookmarks List */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          <div className="border-b border-border bg-card p-6 sticky top-0 z-20 lg:mt-0 mt-16">
            <h2 className="text-2xl font-bold text-foreground">Bookmarks</h2>
            <p className="text-muted-foreground text-sm">
              Save your favorite posts
            </p>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading bookmarks...
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="p-8 text-center">
                <BookmarkIcon
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-foreground font-bold text-xl mb-2">
                  No bookmarks yet
                </p>
                <p className="text-muted-foreground">
                  When you bookmark posts, they'll show up here
                </p>
              </div>
            ) : (
              bookmarks.map((bookmark) => {
                const tweet = bookmark.tweet;
                return (
                  <div
                    key={bookmark.id}
                    className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex space-x-4 gap-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <Link
                            href={`/profile/${tweet.author.username}`}
                            className="font-bold text-foreground truncate hover:underline"
                          >
                            {tweet.author.displayName}
                          </Link>
                          <span className="text-muted-foreground text-sm truncate">
                            @{tweet.author.username}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground text-sm">
                            {formatDate(tweet.createdAt)}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm("Remove this bookmark?")) {
                                handleRemoveBookmark(tweet.id);
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-destructive ml-2"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-foreground mt-2 break-words text-sm md:text-base">
                          {tweet.content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {tweet.viewCount} views
                        </div>
                        <div className="flex justify-around mt-3 text-muted-foreground max-w-xs text-xs md:text-sm">
                          <button className="flex items-center space-x-2 hover:text-primary transition-colors group flex-1 justify-center">
                            <div className="group-hover:bg-primary/10 rounded-full p-2">
                              <MessageCircle size={16} />
                            </div>
                            <span className="hidden md:inline">
                              {tweet.replies}
                            </span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-primary transition-colors group flex-1 justify-center">
                            <div className="group-hover:bg-primary/10 rounded-full p-2">
                              <Repeat2 size={16} />
                            </div>
                            <span className="hidden md:inline">
                              {tweet.retweets}
                            </span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-destructive transition-colors group flex-1 justify-center">
                            <div className="group-hover:bg-destructive/10 rounded-full p-2">
                              <Heart size={16} />
                            </div>
                            <span className="hidden md:inline">
                              {tweet.likes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
