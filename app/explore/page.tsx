"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Search,
  ArrowLeft,
  TrendingUp,
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
  isLiked: boolean;
  isRetweeted: boolean;
  isFlagged?: boolean;
  isDeleted?: boolean;
}
interface Trend {
  id: string;
  hashtag: string;
  postCount: number;
  trendingScore: number;
}
interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}
export default function ExplorePage() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchExploreFeed();
    fetchTrends();
  }, [router]);
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
  const fetchExploreFeed = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/tweets/explore", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.tweets) {
        setTweets(data.tweets);
      }
    } catch (err) {
      console.error("Error fetching explore feed:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowUsers(false);
      setUsers([]);
      fetchExploreFeed();
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");
      const response = await fetch(
        `/api/tweets/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.tweets) {
        setTweets(data.tweets);
      }
      if (data.users) {
        setUsers(data.users);
        setShowUsers(true);
      } else {
        setShowUsers(false);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error searching:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      const token = localStorage.getItem("auth-token");
      const endpoint = isFollowing ? "/api/users/unfollow" : "/api/users/follow";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId: userId,
        }),
      });
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  isFollowing: !isFollowing,
                  followerCount: isFollowing
                    ? user.followerCount - 1
                    : user.followerCount + 1,
                }
              : user
          )
        );
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };
  const handleLikeTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId }),
      });
      await fetchExploreFeed();
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };
  const handleRetweetTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      await fetch(`/api/tweets/${tweetId}/retweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId }),
      });
      await fetchExploreFeed();
    } catch (err) {
      console.error("Error retweeting:", err);
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
            <p className="text-xs text-muted-foreground">Explore</p>
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
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <Search size={24} />
              <span>Explore</span>
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
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
          <h1 className="text-xl font-bold text-primary">Explore</h1>
          <ThemeSwitcher />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          {/* Search Bar */}
          <div className="border-b border-border bg-card p-4 sticky top-0 z-20 lg:mt-0 mt-16">
            <div className="flex items-center bg-input border border-border rounded-full px-4 py-2 gap-2">
              <Search
                size={20}
                className="text-muted-foreground flex-shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search posts, people, or hashtags..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-sm md:text-base"
              />
            </div>
          </div>
          {/* Users Section */}
          {showUsers && users.length > 0 && (
            <div className="border-b border-border">
              <div className="p-4 bg-card">
                <h2 className="font-bold text-lg text-foreground mb-4">
                  People
                </h2>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile?username=${user.username}`}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0 overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground truncate">
                              {user.displayName}
                            </p>
                            {user.isVerified && (
                              <span className="text-primary">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            @{user.username}
                          </p>
                          {user.bio && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {user.bio}
                            </p>
                          )}
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{user.followerCount} followers</span>
                            <span>{user.followingCount} following</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFollow(user.id, user.isFollowing);
                        }}
                        className={`ml-4 px-4 py-2 rounded-full font-semibold text-sm transition-colors flex-shrink-0 ${
                          user.isFollowing
                            ? "bg-secondary text-secondary-foreground hover:bg-muted"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Tweets Section */}
          {tweets.length > 0 && (
            <div className={showUsers && users.length > 0 ? "border-t border-border" : ""}>
              {showUsers && users.length > 0 && (
                <div className="p-4 bg-card border-b border-border">
                  <h2 className="font-bold text-lg text-foreground">Posts</h2>
                </div>
              )}
              <div>
                {tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex space-x-4 gap-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="font-bold text-foreground truncate">
                          {tweet.author.displayName}
                        </span>
                        <span className="text-muted-foreground text-sm truncate">
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
                        <p className="text-foreground mt-2 break-words text-sm md:text-base">
                          {tweet.content}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {tweet.viewCount} views
                      </div>
                      <div className="flex justify-around mt-3 text-muted-foreground max-w-xs text-xs md:text-sm">
                        <Link
                          href={`/tweet?id=${tweet.id}`}
                          className="flex items-center space-x-2 hover:text-primary transition-colors group flex-1 justify-center"
                        >
                          <div className="group-hover:bg-primary/10 rounded-full p-2">
                            <MessageCircle size={16} />
                          </div>
                          <span className="hidden md:inline">
                            {tweet.replies}
                          </span>
                        </Link>
                        <button
                          onClick={() => handleRetweetTweet(tweet.id)}
                          className={`flex items-center space-x-2 transition-colors group flex-1 justify-center ${
                            tweet.isRetweeted
                              ? "text-primary"
                              : "hover:text-primary"
                          }`}
                        >
                          <div className="group-hover:bg-primary/10 rounded-full p-2">
                            <Repeat2 size={16} />
                          </div>
                          <span className="hidden md:inline">
                            {tweet.retweets}
                          </span>
                        </button>
                        <button
                          onClick={() => handleLikeTweet(tweet.id)}
                          className={`flex items-center space-x-2 transition-colors group flex-1 justify-center ${
                            tweet.isLiked
                              ? "text-destructive"
                              : "hover:text-destructive"
                          }`}
                        >
                          <div className="group-hover:bg-destructive/10 rounded-full p-2">
                            <Heart
                              size={16}
                              fill={tweet.isLiked ? "currentColor" : "none"}
                            />
                          </div>
                          <span className="hidden md:inline">
                            {tweet.likes}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          )}
          {/* Empty State */}
          {!loading && !showUsers && tweets.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? "No results found" : "No posts found"}
            </div>
          )}
        </div>
        {/* Right Sidebar - Trending */}
        <div className="hidden xl:block w-80 p-6 border-l border-border overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
            <h2 className="font-bold text-lg mb-4 text-foreground">
              What's happening
            </h2>
            <div className="space-y-4">
              {trends.length === 0 ? (
                <p className="text-sm text-muted-foreground">No trends yet</p>
              ) : (
                trends.slice(0, 5).map((trend) => (
                  <Link
                    key={trend.id}
                    href={`/explore?q=${encodeURIComponent(trend.hashtag)}`}
                    className="hover:bg-muted p-3 rounded-lg transition-colors block group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Trending Worldwide
                      </p>
                    </div>
                    <p className="font-bold text-foreground group-hover:text-primary">
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
