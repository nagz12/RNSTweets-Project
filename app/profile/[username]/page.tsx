"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Link as LinkIcon,
  MapPin,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

type TabKey = "tweets" | "replies";

interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  joinedAt: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

interface Tweet {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    username: string;
    avatar?: string | null;
  };
  likes: number;
  retweets: number;
  replies: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isFlagged?: boolean;
  isDeleted?: boolean;
}

export default function ProfileDynamicPage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [tab, setTab] = useState<TabKey>("tweets");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId);
      } catch (err) {
        console.error("Failed to parse token", err);
      }
    }
    fetchProfileAndTab();
  }, [username, tab]);

  const fetchProfileAndTab = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const commonHeaders: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
        headers: commonHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      }
      const tabPath =
        tab === "tweets"
          ? `/api/users/${encodeURIComponent(username)}/tweets`
          : `/api/users/${encodeURIComponent(username)}/replies`;
      const tweetsRes = await fetch(tabPath, { headers: commonHeaders });
      const tweetsData = await tweetsRes.json();
      if (tweetsRes.ok) {
        setTweets(tweetsData.tweets || tweetsData.replies || []);
      }
    } catch (err) {
      console.error("Profile load error", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!profile) return;
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }
      const endpoint = profile.isFollowing ? "/api/users/unfollow" : "/api/users/follow";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: profile.id }),
      });
      if (res.ok) {
        setProfile({
          ...profile,
          isFollowing: !profile.isFollowing,
          followersCount: profile.isFollowing
            ? profile.followersCount - 1
            : profile.followersCount + 1,
        });
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  const deleteTweet = async (tweetId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }

      let idStr = "";
      try {
        idStr = tweetId == null ? String(tweetId) : String(tweetId);
      } catch (e) {
        idStr = String(tweetId);
      }

      if (!idStr || idStr === "undefined" || idStr === "null") {
        console.error("[PROFILE-DELETE] invalid tweet id", { tweetId });
        alert("Cannot delete: invalid tweet id. See console for details.");
        return;
      }

      const encoded = encodeURIComponent(idStr);
      const res = await fetch(`/api/tweets/${encoded}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTweets((prev) => prev.filter((t) => t.id !== tweetId));
      } else {
        const body = await res.json().catch(() => ({}));
        console.error("Profile delete failed", res.status, body);
        alert(`Failed to delete tweet: ${body?.error || res.status}`);
      }
    } catch (err) {
      console.error("Delete tweet failed", err);
      alert("Failed to delete tweet. See console for details.");
    }
  };

  const renderTweet = (tweet: Tweet) => (
    <div
      key={tweet.id}
      className="border-b border-border p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0" />
          <div>
            <Link href={`/profile/${tweet.author.username}`} className="font-bold">
              {tweet.author.displayName}
            </Link>
            <p className="text-xs text-muted-foreground">@{tweet.author.username}</p>
          </div>
        </div>
        {tweet.author.id === currentUserId && (
          <button
            onClick={() => {
              if (confirm("Delete this Tweet? This action cannot be undone.")) {
                deleteTweet(tweet.id);
              }
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <MoreHorizontal size={18} />
          </button>
        )}
      </div>
      {tweet.isDeleted ? (
        <div className="mt-2 text-sm text-muted-foreground italic">Deleted</div>
      ) : (
        <p className="mt-2 text-sm md:text-base text-foreground break-words">{tweet.content}</p>
      )}
      <div className="flex items-center gap-6 text-muted-foreground text-sm mt-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} /> {tweet.replies}
        </div>
        <div className="flex items-center gap-2">
          <Repeat2 size={16} /> {tweet.retweets}
        </div>
        <div className="flex items-center gap-2">
          <Heart size={16} /> {tweet.likes}
        </div>
      </div>
    </div>
  );

  if (loading && !profile) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }
  if (!profile) {
    return <div className="p-8 text-center text-destructive">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <Link
            href="/feed"
            className="mb-8 flex items-center space-x-2 text-foreground hover:text-primary"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back</span>
          </Link>
          <nav className="space-y-6 flex-1">
            <Link href="/feed" className="text-muted-foreground hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/explore" className="text-muted-foreground hover:text-primary font-medium">
              Explore
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>

        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          <div className="bg-muted h-32 md:h-48 relative overflow-hidden">
            {profile.bannerUrl ? (
              <img
                src={profile.bannerUrl}
                alt="banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10" />
            )}
          </div>
          <div className="px-4 md:px-6 pb-4 relative lg:mt-0 mt-16">
            <div className="flex justify-between items-start -mt-12 md:-mt-16 mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full border-4 border-background overflow-hidden flex-shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50" />
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {profile.isOwnProfile ? (
                  <button className="px-4 py-2 rounded-full font-bold transition-colors bg-secondary text-secondary-foreground hover:bg-muted">
                    Edit profile
                  </button>
                ) : (
                  <button
                    onClick={toggleFollow}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${
                      profile.isFollowing
                        ? "bg-secondary text-secondary-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {profile.isFollowing ? (
                      <span className="flex items-center gap-2">
                        <UserCheck size={16} /> Following
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus size={16} /> Follow
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            {profile.bio && <p className="text-foreground mb-3">{profile.bio}</p>}
            <div className="flex flex-wrap gap-4 text-muted-foreground text-xs md:text-sm mb-4">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              {profile.website && (
                <Link
                  href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                  className="flex items-center gap-1 hover:text-primary"
                  target="_blank"
                >
                  <LinkIcon size={14} /> {profile.website}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Joined{" "}
                {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-6 mb-4 text-sm">
              <span className="cursor-pointer hover:text-primary">
                <strong>{profile.followingCount}</strong> Following
              </span>
              <span className="cursor-pointer hover:text-primary">
                <strong>{profile.followersCount}</strong> Followers
              </span>
            </div>

            <div className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
              <div className="flex">
                <button
                  className={`flex-1 text-center py-3 font-bold ${
                    tab === "tweets"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setTab("tweets")}
                >
                  Tweets
                </button>
                <button
                  className={`flex-1 text-center py-3 font-bold ${
                    tab === "replies"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setTab("replies")}
                >
                  Replies
                </button>
              </div>
            </div>

            <div>
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : tweets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No {tab === "tweets" ? "tweets" : "replies"} yet
                </div>
              ) : (
                tweets.map(renderTweet)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

