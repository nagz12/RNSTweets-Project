"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  TrendingUp,
  Shield,
  Lightbulb,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
interface WellnessData {
  empathyScore: number;
  totalDemerits: number;
  recentDemerits: number;
  bullyingPatternsAsOffender: number;
  bullyingPatternsAsVictim: number;
  recommendations: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
  detailedPatterns: {
    asOffender: Array<{ victim: string; type: string; incidentCount: number }>;
    asVictim: Array<{
      offender: string;
      type: string;
      incidentCount: number;
    }>;
  };
}
export default function WellnessPage() {
  const router = useRouter();
  const [data, setData] = useState<WellnessData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchWellnessData();
  }, [router]);
  const fetchWellnessData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/ai/wellness-dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.error) {
        console.error(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error("Error fetching wellness data:", err);
    } finally {
      setLoading(false);
    }
  };
  const getEmpathyColor = (score: number) => {
    if (score >= 0.7) return "text-green-600 dark:text-green-400";
    if (score >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  const getEmpathyLabel = (score: number) => {
    if (score >= 0.7) return "Excellent";
    if (score >= 0.4) return "Good";
    return "Needs Improvement";
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300";
      case "high":
        return "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300";
      case "low":
        return "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300";
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300";
    }
  };
  const getPriorityIcon = (type: string) => {
    switch (type) {
      case "behavior":
        return <AlertTriangle size={20} />;
      case "empathy":
        return <Heart size={20} />;
      case "positive":
        return <Lightbulb size={20} />;
      default:
        return <TrendingUp size={20} />;
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed left-0 top-0 h-screen p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">RNSTweets</h1>
            <p className="text-xs text-muted-foreground">Wellness Dashboard</p>
          </div>
          <nav className="space-y-6 flex-1">
            <Link
              href="/feed"
              className="flex items-center space-x-4 text-muted-foreground hover:text-primary font-bold text-lg transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/wellness"
              className="flex items-center space-x-4 text-primary font-bold text-lg"
            >
              <Shield size={24} />
              <span>Wellness</span>
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="text-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-primary">Wellness Dashboard</h1>
          <ThemeSwitcher />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-64 max-w-4xl overflow-y-auto">
          <div className="border-b border-border bg-card p-6 sticky top-0 z-20 lg:mt-0 mt-16">
            <h2 className="text-2xl font-bold text-foreground">
              Your Communication Wellness
            </h2>
            <p className="text-muted-foreground text-sm">
              AI-powered insights to help you communicate better
            </p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading your wellness data...
            </div>
          ) : !data ? (
            <div className="p-8 text-center text-muted-foreground">
              Unable to load wellness data
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Empathy Score Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Empathy Score
                  </h3>
                  <Heart
                    size={24}
                    className={getEmpathyColor(data.empathyScore)}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${getEmpathyColor(
                      data.empathyScore
                    )}`}
                  >
                    {(data.empathyScore * 100).toFixed(0)}%
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getEmpathyLabel(data.empathyScore)}
                  </span>
                </div>
                <div className="mt-4 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      data.empathyScore >= 0.7
                        ? "bg-green-500"
                        : data.empathyScore >= 0.4
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${data.empathyScore * 100}%` }}
                  />
                </div>
              </div>
              {/* Demerit Status */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Behavioral Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Demerits
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        data.totalDemerits > 20
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {data.totalDemerits}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Recent Issues
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {data.recentDemerits}
                    </p>
                  </div>
                </div>
              </div>
              {/* Bullying Patterns */}
              {(data.bullyingPatternsAsOffender > 0 ||
                data.bullyingPatternsAsVictim > 0) && (
                <div className="bg-card border border-red-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle
                      size={20}
                      className="text-red-600 dark:text-red-400"
                    />
                    Pattern Alerts
                  </h3>
                  {data.bullyingPatternsAsOffender > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                        Concerning Behavior Detected
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {data.detailedPatterns.asOffender.map(
                          (pattern, idx) => (
                            <li key={idx}>
                              • {pattern.type} pattern with @{pattern.victim} (
                              {pattern.incidentCount} incidents)
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {data.bullyingPatternsAsVictim > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">
                        You may be experiencing harassment
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {data.detailedPatterns.asVictim.map((pattern, idx) => (
                          <li key={idx}>
                            • {pattern.type} from @{pattern.offender} (
                            {pattern.incidentCount} incidents)
                          </li>
                        ))}
                      </ul>
                      <button className="mt-3 text-sm text-primary hover:underline">
                        Report to administrators
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Recommendations */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Personalized Recommendations
                </h3>
                <div className="space-y-3">
                  {data.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 flex items-start gap-3 ${getPriorityColor(
                        rec.priority
                      )}`}
                    >
                      <div className="mt-0.5">{getPriorityIcon(rec.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rec.message}</p>
                      </div>
                    </div>
                  ))}
                  {data.recommendations.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Great job! Keep up the positive communication.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
