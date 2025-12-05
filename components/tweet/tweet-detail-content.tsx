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
  Send,
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

export function TweetDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tweetId = searchParams.get("id");
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [replies, setReplies] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [userStatus, setUserStatus] = useState<{ isSuspended: boolean; empathyScore: number; id?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserStatus();
    if (!tweetId) {
      setLoading(false);
      setError("Tweet ID is missing.");
      return;
    }
    fetchTweetDetails();
    async function fetchUserStatus() {
      try {
        const token = localStorage.getItem("auth-token");
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.error) {
          setUserStatus({
            id: data.id,
            isSuspended: data.isSuspended ?? false,
            empathyScore: data.empathyScore ?? 100,
          });
        }
      } catch (err) {
        console.error("Failed to load user status", err);
      }
    }
    async function fetchTweetDetails() {
      try {
        const token = localStorage.getItem("auth-token");
        const tweetResponse = await fetch("/api/tweets/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tweetData = await tweetResponse.json();
        const foundTweet = tweetData.tweets?.find((t: Tweet) => t.id === tweetId);
        if (foundTweet) {
          setTweet(foundTweet);
        }
        const repliesResponse = await fetch(`/api/tweets/${tweetId}/replies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const repliesData = await repliesResponse.json();
        if (repliesData.replies) {
          setReplies(repliesData.replies);
        }
      } catch (err) {
        console.error("Error fetching tweet:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [tweetId, router]);

  const handlePostReply = async () => {
    if (userStatus?.isSuspended) {
      setError("Your account is suspended due to low empathy score.");
      return;
    }
    if (!replyText.trim()) return;
    setPosting(true);
    setError("");
    setAiSuggestions([]);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/tweets/${tweetId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tweetId,
          content: replyText,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        if (data.suggestions && data.suggestions.length > 0) {
          setAiSuggestions(data.suggestions);
        }
      } else if (data.reply) {
        setReplyText("");
        setError("");
        setAiSuggestions([]);
        if (tweetId) {
          await refreshTweet(tweetId);
        }
      }
    } catch (err) {
      setError("Failed to post reply");
    } finally {
      setPosting(false);
    }
  };

  const refreshTweet = async (currentTweetId: string | null = tweetId) => {
    if (!currentTweetId) return;
    try {
      const token = localStorage.getItem("auth-token");
      const tweetResponse = await fetch("/api/tweets/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tweetData = await tweetResponse.json();
      const foundTweet = tweetData.tweets?.find(
        (t: Tweet) => t.id === currentTweetId
      );
      if (foundTweet) {
        setTweet(foundTweet);
      }
      const repliesResponse = await fetch(
        `/api/tweets/${currentTweetId}/replies`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const repliesData = await repliesResponse.json();
      if (repliesData.replies) {
        setReplies(repliesData.replies);
      }
    } catch (err) {
      console.error("Error refreshing tweet:", err);
    }
  };

  const handleLikeTweet = async (id: string, parentTweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      await fetch(`/api/tweets/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId: id }),
      });
      await refreshTweet(parentTweetId);
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };

  const handleRetweetTweet = async (id: string, parentTweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      await fetch(`/api/tweets/${id}/retweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tweetId: id }),
      });
      await refreshTweet(parentTweetId);
    } catch (err) {
      console.error("Error retweeting:", err);
    }
  };

  const handleDeleteTweet = async (id: string, isReply: boolean) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      let idStr = "";
      try {
        idStr = id == null ? String(id) : String(id);
      } catch (e) {
        idStr = String(id);
      }
      if (!idStr || idStr === "undefined" || idStr === "null") {
        console.error("[DETAIL-DELETE] invalid id", { id });
        alert("Cannot delete: invalid id. See console for details.");
        return;
      }

      const endpoint = isReply ? `/api/replies/${encodeURIComponent(idStr)}` : `/api/tweets/${encodeURIComponent(idStr)}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (isReply) {
          setReplies((prev) => prev.filter((r) => r.id !== id));
        } else {
          setTweet(null);
        }
      } else {
        const body = await res.json().catch(() => ({}));
        console.error("Delete failed", res.status, body);
        alert(`Failed to delete: ${body?.error || res.status}`);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete. See console for details.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary">Tweet</h1>
          <ThemeSwitcher />
        </div>
        <div className="flex-1 max-w-2xl mx-auto overflow-y-auto mt-16">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading tweet...
            </div>
          ) : !tweet ? (
            <div className="p-8 text-center text-muted-foreground">
              Tweet not found
            </div>
          ) : (
            <>
              <div className="border-b border-border p-6 bg-card">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0" />
                    <div>
                      <Link
                        href={`/profile/${tweet.author.username}`}
                        className="font-bold text-foreground hover:underline"
                      >
                        {tweet.author.displayName}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        @{tweet.author.username}
                      </p>
                    </div>
                  </div>
                  {userStatus?.id === tweet.author.id && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this Tweet? This action cannot be undone.")) {
                          handleDeleteTweet(tweet.id, false);
                        }
                      }}
                      className="text-muted-foreground hover:text-destructive text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {(tweet.isFlagged || tweet.isDeleted) ? (
                  <div className="mb-4 p-3 bg-muted/50 border border-border rounded-lg">
                    <p className="text-muted-foreground text-sm italic">
                      This content was removed for policy reasons
                    </p>
                  </div>
                ) : (
                  <p className="text-foreground text-xl mb-4">{tweet.content}</p>
                )}
                <p className="text-muted-foreground text-sm mb-4">
                  {formatDate(tweet.createdAt)}
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground border-t border-b border-border py-3">
                  <span>
                    <strong className="text-foreground">
                      {tweet.retweets}
                    </strong>{" "}
                    Retweets
                  </span>
                  <span>
                    <strong className="text-foreground">{tweet.likes}</strong>{" "}
                    Likes
                  </span>
                  <span>
                    <strong className="text-foreground">{tweet.replies}</strong>{" "}
                    Replies
                  </span>
                </div>
                <div className="flex justify-around mt-4 text-muted-foreground">
                  <button className="flex items-center space-x-2 hover:text-primary transition-colors p-2">
                    <MessageCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleRetweetTweet(tweet.id, tweet.id)}
                    className={`flex items-center space-x-2 transition-colors p-2 ${
                      tweet.isRetweeted ? "text-primary" : "hover:text-primary"
                    }`}
                  >
                    <Repeat2 size={20} />
                  </button>
                  <button
                    onClick={() => handleLikeTweet(tweet.id, tweet.id)}
                    className={`flex items-center space-x-2 transition-colors p-2 ${
                      tweet.isLiked
                        ? "text-destructive"
                        : "hover:text-destructive"
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={tweet.isLiked ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="flex items-center space-x-2 hover:text-primary transition-colors p-2">
                    <Share size={20} />
                  </button>
                </div>
              </div>
              <div className="border-b border-border p-4 bg-card">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={userStatus?.isSuspended}
                  placeholder="Tweet your reply"
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  maxLength={280}
                />
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-destructive text-sm mt-2">
                    {error}
                  </div>
                )}
                {aiSuggestions.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-2">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      💡 AI Suggestions:
                    </p>
                    <ul className="space-y-1">
                      {aiSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                          onClick={() => setReplyText(suggestion)}
                        >
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-muted-foreground">
                    {replyText.length}/280
                  </span>
                  <button
                    onClick={handlePostReply}
                    disabled={posting || !replyText.trim() || userStatus?.isSuspended}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:opacity-90 transition-opacity font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {posting ? "Posting..." : "Reply"}
                    <Send size={16} />
                  </button>
                </div>
                {userStatus?.isSuspended && (
                  <div className="mt-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-3">
                    Your account is suspended due to low empathy score. Replying is disabled.
                  </div>
                )}
              </div>
              <div>
                {replies.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No replies yet. Be the first to reply!
                  </div>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/profile/${reply.author.username}`}
                              className="font-bold text-foreground hover:underline truncate"
                            >
                              {reply.author.displayName}
                            </Link>
                            <span className="text-muted-foreground text-sm truncate">
                              @{reply.author.username}
                            </span>
                            {userStatus?.id === reply.author.id && (
                              <button
                                onClick={() => {
                                  if (
                                    confirm("Delete this reply? This action cannot be undone.")
                                  ) {
                                    handleDeleteTweet(reply.id, true);
                                  }
                                }}
                                className="text-muted-foreground hover:text-destructive text-xs ml-2"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          {(reply.isFlagged || reply.isDeleted) ? (
                            <div className="mt-2 p-3 bg-muted/50 border border-border rounded-lg">
                              <p className="text-muted-foreground text-sm italic">
                                This content was removed for policy reasons
                              </p>
                            </div>
                          ) : (
                            <p className="text-foreground mt-2 break-words">
                              {reply.content}
                            </p>
                          )}
                          <div className="flex gap-6 mt-3 text-muted-foreground text-sm">
                            <button
                              onClick={() => handleLikeTweet(reply.id, tweet.id)}
                              className={`flex items-center gap-1 transition-colors ${
                                reply.isLiked
                                  ? "text-destructive"
                                  : "hover:text-destructive"
                              }`}
                            >
                              <Heart
                                size={16}
                                fill={reply.isLiked ? "currentColor" : "none"}
                              />
                              <span>{reply.likes}</span>
                            </button>
                            <button
                              onClick={() => handleRetweetTweet(reply.id, tweet.id)}
                              className={`flex items-center gap-1 transition-colors ${
                                reply.isRetweeted
                                  ? "text-primary"
                                  : "hover:text-primary"
                              }`}
                            >
                              <Repeat2 size={16} />
                              <span>{reply.retweets}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

