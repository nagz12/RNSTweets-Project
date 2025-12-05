"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  LogOut,
  Home,
  Search,
  Bookmark,
  Mail,
  Bell,
  TrendingUp,
  Shield,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface User {
  id: string;
  displayName: string;
  username: string;
  avatar?: string;
}
interface Tweet {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked: boolean;
  isRetweeted: boolean;
  viewCount: number;
  isFlagged?: boolean;
  isDeleted?: boolean;
}
interface Trend {
  id: string;
  hashtag: string;
  postCount: number;
  trendingScore: number;
}
interface CurrentUserStatus {
  empathyScore: number;
  totalDemerits: number;
  isSuspended: boolean;
}
export default function Feed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [empathyWarning, setEmpathyWarning] = useState<string | null>(null);
  const [suggestedEdit, setSuggestedEdit] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<CurrentUserStatus | null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserStatus();
    fetchFeed();
    fetchTrends();
  }, [router]);
  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setUserStatus({
        empathyScore: data.empathyScore ?? 100,
        totalDemerits: data.totalDemerits ?? 0,
        isSuspended: data.isSuspended ?? false,
      });
    } catch (err) {
      console.error("Failed to load user status", err);
    }
  };
  const fetchTrends = async () => {
    try {
      const response = await fetch("/api/tweets/trending");
      const data = await response.json();
      if (data.trending) {
        setTrends(
          data.trending.map((t: any, idx: number) => ({
            id: idx.toString(),
            hashtag: t.tag,
            postCount: t.tweetCount,
            trendingScore: 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching trends:", err);
    }
  };
  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/tweets/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.tweets) {
        setTweets(data.tweets);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };
  const handlePostTweet = async () => {
    if (userStatus?.isSuspended) {
      setError("Your account is suspended due to low empathy score.");
      return;
    }
    if (!newTweet.trim()) return;
    setPosting(true);
    setError("");
    setAiSuggestions([]);
    setEmpathyWarning(null);
    setSuggestedEdit(null);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/tweets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newTweet,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        if (data.suggestions && data.suggestions.length > 0) {
          setAiSuggestions(data.suggestions);
        }
        if (data.suggestedEdit) {
          setSuggestedEdit(data.suggestedEdit);
        }
      } else if (data.tweet) {
        if (data.analysis?.empathyWarning) {
          setEmpathyWarning(data.analysis.empathyWarning.message);
        }
        setNewTweet("");
        setError("");
        await fetchFeed();
      }
    } catch (err) {
      setError("Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };
  const handleLikeTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId }),
      });
      if (response.ok) {
        await fetchFeed();
      }
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };
  const handleRetweetTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/tweets/${tweetId}/retweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId }),
      });
      if (response.ok) {
        await fetchFeed();
      }
    } catch (err) {
      console.error("Error retweeting:", err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    router.push("/");
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
            <p className="text-xs text-muted-foreground">RNSIT Community</p>
          </div>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="flex items-center space-x-4 text-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Home size={24} />
              <span>Home</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Search size={24} />
              <span>Explore</span>
            </Link>
            <Link
              href="/notifications"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Bell size={24} />
              <span>Notifications</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Mail size={24} />
              <span>Messages</span>
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Bookmark size={24} />
              <span>Bookmarks</span>
            </Link>
            <Link
              href="/trending"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <TrendingUp size={24} />
              <span>Trending</span>
            </Link>
            <Link
              href="/wellness"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <Shield size={24} />
              <span>Wellness</span>
            </Link>
          </nav>
          <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
            <ThemeSwitcher />
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center space-x-2 text-destructive hover:text-destructive/80 font-medium bg-destructive/10 hover:bg-destructive/20 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
        {/* Main Feed */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          {/* Tweet Composer */}
          <div className="border-b border-border bg-card p-4 sticky top-0 z-20">
            <div className="space-y-4">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                disabled={userStatus?.isSuspended}
                placeholder="What's happening?!"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-base md:text-lg"
                rows={3}
                maxLength={280}
              />
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-destructive text-sm">
                  {error}
                </div>
              )}
              {aiSuggestions.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    💡 AI Suggestions - Try rephrasing:
                  </p>
                  <ul className="space-y-1">
                    {aiSuggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        onClick={() => setNewTweet(suggestion)}
                      >
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestedEdit && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                    ✨ Suggested Rewrite:
                  </p>
                  <p
                    className="text-xs text-green-600 dark:text-green-400 cursor-pointer hover:underline"
                    onClick={() => setNewTweet(suggestedEdit)}
                  >
                    {suggestedEdit}
                  </p>
                </div>
              )}
              {empathyWarning && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⚠️ {empathyWarning}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newTweet.length}/280
                </span>
                <button
                  onClick={handlePostTweet}
                  disabled={posting || !newTweet.trim() || userStatus?.isSuspended}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 text-sm md:text-base"
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
              {userStatus?.isSuspended && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-3">
                  Your account is suspended due to low empathy score. Posting is disabled.
                </div>
              )}
            </div>
          </div>
          {/* Tweets Feed */}
          <div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading tweets...
              </div>
            ) : tweets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No tweets yet. Follow people to see their posts!
              </div>
            ) : (
              tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex space-x-4">
                    <Link
                      href={`/profile?username=${tweet.author.username}`}
                      className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0 hover:opacity-80 transition-opacity"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tweet?id=${tweet.id}`}
                        className="block cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-bold text-foreground hover:underline">
                            {tweet.author.displayName}
                          </span>
                          <span className="text-muted-foreground truncate">
                            @{tweet.author.username}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground text-sm">
                            {formatDate(tweet.createdAt)}
                          </span>
                        </div>
                        {(tweet.isFlagged || tweet.isDeleted) ? (
                          <div className="mt-2 p-3 bg-muted/50 border border-border rounded-lg">
                            <p className="text-muted-foreground text-sm italic">
                              This content was removed for policy reasons
                            </p>
                          </div>
                        ) : (
                          <p className="text-foreground mt-2 break-words">
                            {tweet.content}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          {tweet.viewCount} views
                        </div>
                      </Link>
                      <div className="flex justify-around mt-3 text-muted-foreground max-w-xs text-sm md:text-base">
                        <Link
                          href={`/tweet?id=${tweet.id}`}
                          className="flex items-center space-x-2 hover:text-primary transition-colors group flex-1 justify-center"
                        >
                          <div className="group-hover:bg-primary/10 rounded-full p-2">
                            <MessageCircle size={16} />
                          </div>
                          <span className="text-xs">{tweet.replies}</span>
                        </Link>
                        <button
                          onClick={() => handleRetweetTweet(tweet.id)}
                          className={`flex items-center space-x-2 transition-colors group flex-1 justify-center ${
                            tweet.isRetweeted
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <div className="group-hover:bg-primary/10 rounded-full p-2">
                            <Repeat2 size={16} />
                          </div>
                          <span className="text-xs">{tweet.retweets}</span>
                        </button>
                        <button
                          onClick={() => handleLikeTweet(tweet.id)}
                          className={`flex items-center space-x-2 transition-colors group flex-1 justify-center ${
                            tweet.isLiked
                              ? "text-destructive"
                              : "text-muted-foreground hover:text-destructive"
                          }`}
                        >
                          <div className="group-hover:bg-destructive/10 rounded-full p-2">
                            <Heart
                              size={16}
                              fill={tweet.isLiked ? "currentColor" : "none"}
                            />
                          </div>
                          <span className="text-xs">{tweet.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-primary transition-colors group flex-1 justify-center">
                          <div className="group-hover:bg-primary/10 rounded-full p-2">
                            <Share size={16} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Right Sidebar - Trending */}
        <div className="hidden xl:block w-80 p-6 border-l border-border overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
            <h2 className="font-bold text-lg mb-4 text-foreground">
              What's happening
            </h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading trends...
                </p>
              ) : trends.length === 0 ? (
                <p className="text-sm text-muted-foreground">No trends yet</p>
              ) : (
                trends.slice(0, 5).map((trend) => (
                  <Link
                    key={trend.id}
                    href={`/explore?q=${encodeURIComponent(trend.hashtag)}`}
                    className="hover:bg-muted p-3 rounded-lg transition-colors block"
                  >
                    <p className="text-xs text-muted-foreground">
                      Trending Worldwide
                    </p>
                    <p className="font-bold text-foreground">
                      #{trend.hashtag}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {trend.postCount.toLocaleString()} Posts
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
