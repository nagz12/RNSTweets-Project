"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface Statistics {
  totalUsers: number;
  totalTweets: number;
  totalFlaggedTweets: number;
  topDemeritUsers: any[];
}
export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [flaggedTweets, setFlaggedTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAdminData();
  }, [router]);
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const statsResponse = await fetch("/api/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const statsData = await statsResponse.json();
      if (statsData.error) {
        setError(statsData.error);
        setLoading(false);
        return;
      }
      const flaggedResponse = await fetch("/api/admin/flagged", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const flaggedData = await flaggedResponse.json();
      if (flaggedData.error) {
        setError(flaggedData.error);
      } else {
        setStats(statsData.statistics);
        setFlaggedTweets(flaggedData.flaggedTweets);
      }
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/feed" className="text-foreground hover:text-primary">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              Admin Dashboard
            </h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8 text-destructive text-sm lg:text-base">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">Total Users</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {stats?.totalUsers || 0}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">Total Tweets</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {stats?.totalTweets || 0}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">Flagged Tweets</p>
            <p className="text-3xl font-bold text-accent mt-2">
              {stats?.totalFlaggedTweets || 0}
            </p>
          </div>
        </div>
        {stats && stats.topDemeritUsers.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 lg:p-6 mb-8 overflow-x-auto">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-foreground">
              Top Users by Demerit Points
            </h2>
            <ResponsiveContainer width="100%" height={300} minWidth={250}>
              <BarChart
                data={stats.topDemeritUsers.map((u) => ({
                  name: u.user.displayName.split(" ")[0],
                  demerits: u.totalDemerits,
                }))}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Bar dataKey="demerits" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4 text-foreground">
            Flagged Content Queue
          </h2>
          <div className="space-y-4">
            {flaggedTweets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No flagged content
              </p>
            ) : (
              flaggedTweets.map((demerit: any) => (
                <div
                  key={demerit.id}
                  className="border border-border rounded-lg p-4 bg-background hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                    <div>
                      <p className="font-bold text-foreground text-sm lg:text-base">
                        {demerit.user.displayName}
                      </p>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        @{demerit.user.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-accent">
                        {demerit.points} Points
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(demerit.toxicityScore * 100).toFixed(1)}% Toxic
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground mb-2 text-sm break-words">
                    {demerit.content}
                  </p>
                  <p className="text-xs text-destructive">{demerit.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
