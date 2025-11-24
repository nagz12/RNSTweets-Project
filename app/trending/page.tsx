"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface TrendingTopic {
  id: string;
  hashtag: string;
  postCount: number;
  trendingScore: number;
}
export default function TrendingPage() {
  const router = useRouter();
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTrending();
  }, [router]);
  const fetchTrending = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query {
            trending {
              tag
              count
              tweetCount
            }
          }`,
        }),
      });
      const data = await response.json();
      if (data.data?.trending) {
        setTrending(
          data.data.trending.map((t: any, idx: number) => ({
            id: idx.toString(),
            hashtag: t.tag,
            postCount: t.tweetCount,
            trendingScore: 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching trending:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">RNSTweets</h1>
            <p className="text-xs text-muted-foreground">Trending</p>
          </div>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/trending"
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <TrendingUp size={24} />
              <span>Trending</span>
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
          <Link href="/feed" className="text-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-primary">Trending</h1>
          <ThemeSwitcher />
        </div>
        {/* Trending Topics */}
        <div className="flex-1 lg:ml-64 border-r border-border max-w-2xl overflow-y-auto">
          <div className="border-b border-border bg-card p-6 sticky top-0 z-20 lg:mt-0 mt-16">
            <h2 className="text-2xl font-bold text-foreground">Trending</h2>
            <p className="text-muted-foreground text-sm">
              What's happening in your community
            </p>
          </div>
          <div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading trending topics...
              </div>
            ) : trending.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No trending topics yet
              </div>
            ) : (
              trending.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/explore?q=${encodeURIComponent(topic.hashtag)}`}
                  className="border-b border-border p-4 hover:bg-muted/50 transition-colors block"
                >
                  <div className="flex items-start gap-3">
                    <TrendingUp
                      size={20}
                      className="text-primary mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Trending Worldwide
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        #{topic.hashtag}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {topic.postCount.toLocaleString()} posts
                      </p>
                    </div>
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
