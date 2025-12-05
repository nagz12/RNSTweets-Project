"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ArrowLeft,
  Calendar,
  Mail,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  location?: string;
  website?: string;
  avatar?: string;
  banner?: string;
  isVerified: boolean;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  tweetCount: number;
  isFollowing: boolean;
  empathyScore?: number;
  totalDemerits?: number;
  isSuspended?: boolean;
}
interface Tweet {
  id: string;
  content: string;
  author: User;
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
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    if (username) {
      fetchProfile();
    }
  }, [username, router]);
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(
        `/api/users/profile?username=${encodeURIComponent(username)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setIsFollowing(data.user.isFollowing);
        await fetchTweets(data.user.id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchTweets = async (userId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(
        `/api/users/tweets?userId=${encodeURIComponent(userId)}`,
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
    } catch (err) {
      console.error("Error fetching tweets:", err);
    }
  };
  const handleFollow = async () => {
    if (!user?.id) return;
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
          targetUserId: user.id,
        }),
      });
      if (response.ok) {
        setIsFollowing(!isFollowing);
        if (user) {
          setUser({
            ...user,
            followerCount: isFollowing
              ? user.followerCount - 1
              : user.followerCount + 1,
          });
        }
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
      await fetchUserTweets();
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
      await fetchUserTweets();
    } catch (err) {
      console.error("Error retweeting:", err);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  if (!user)
    return (
      <div className="p-8 text-center text-destructive">User not found</div>
    );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <Link
            href="/feed"
            className="mb-8 flex items-center space-x-2 text-foreground hover:text-primary"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back</span>
          </Link>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="text-muted-foreground hover:text-primary font-medium"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-primary font-medium"
            >
              Explore
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="text-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <p className="font-bold text-foreground text-sm">
              {user.displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.tweetCount} posts
            </p>
          </div>
          <ThemeSwitcher />
        </div>
        {/* Profile Content */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          <div className="bg-muted h-32 md:h-48 relative overflow-hidden">
            {user.banner ? (
              <img
                src={user.banner || "/placeholder.svg"}
                alt="banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10" />
            )}
          </div>
          {/* Profile Info */}
          <div className="px-4 md:px-6 pb-4 relative lg:mt-0 mt-16">
            {/* Profile Picture */}
            <div className="flex justify-between items-start -mt-12 md:-mt-16 mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full border-4 border-background overflow-hidden flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50" />
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {user && currentUserId && user.id !== currentUserId && (
                  <Link
                    href={`/messages?userId=${user.id}`}
                    className="px-4 py-2 rounded-full font-bold transition-colors bg-secondary text-secondary-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <Mail size={16} />
                    <span>Message</span>
                  </Link>
                )}
                {user && currentUserId && user.id !== currentUserId && (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${
                      isFollowing
                        ? "bg-secondary text-secondary-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>
            {/* Name and Handle */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground">
                {user.displayName}
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            {/* Bio */}
            {user.bio && (
              <p className="text-foreground mb-4 text-sm md:text-base">
                {user.bio}
              </p>
            )}
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-muted-foreground text-xs md:text-sm mb-4">
              {user.location && <span>📍 {user.location}</span>}
              {user.website && <span>🔗 {user.website}</span>}
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
            {/* Follow Stats */}
            <div className="flex gap-6 mb-4 border-t border-b border-border py-4">
              <div className="cursor-pointer hover:text-primary">
                <span className="font-bold text-foreground">
                  {user.followingCount}
                </span>
                <span className="text-muted-foreground text-xs md:text-sm ml-1">
                  Following
                </span>
              </div>
              <div className="cursor-pointer hover:text-primary">
                <span className="font-bold text-foreground">
                  {user.followerCount}
                </span>
                <span className="text-muted-foreground text-xs md:text-sm ml-1">
                  Followers
                </span>
              </div>
            </div>
            {/* Empathy & Demerit Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Empathy Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {(user.empathyScore ?? 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Demerits</p>
                <p className="text-2xl font-bold text-foreground">
                  {user.totalDemerits ?? 0}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={`text-sm font-semibold ${
                    user.isSuspended
                      ? "text-destructive"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {user.isSuspended ? "Suspended" : "Active"}
                </p>
              </div>
            </div>
            {user.isSuspended && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-3 mb-4">
                This account is suspended due to low empathy score. Posting and messaging are disabled.
              </div>
            )}
          </div>
          {/* Tabs */}
          <div className="border-b border-border sticky top-0 lg:top-0 bg-background/80 backdrop-blur z-10">
            <div className="flex">
              <button className="flex-1 text-center py-4 font-bold text-primary border-b-2 border-primary text-sm md:text-base">
                Posts
              </button>
              <button className="flex-1 text-center py-4 text-muted-foreground hover:text-primary text-sm md:text-base">
                Likes
              </button>
            </div>
          </div>
          {/* Tweets */}
          <div>
            {tweets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No posts yet
              </div>
            ) : (
              tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex space-x-4 gap-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-bold text-foreground text-sm md:text-base">
                            {tweet.author.displayName}
                          </span>
                          <span className="text-muted-foreground text-xs md:text-sm">
                            @{tweet.author.username}
                          </span>
                        </div>
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
      </div>
    </div>
  );
}
