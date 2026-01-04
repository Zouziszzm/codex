"use client";

import { useEffect, useState, useMemo } from "react";
import { safeInvoke } from "@/lib/tauri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BookOpen,
  Briefcase,
  Target,
  Zap,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface DashboardSnapshot {
  overall_productivity_score: number;
  overall_consistency_index: number;
  overall_momentum_score: number;
  burnout_risk_global: number;
  system_health_status: string;
  today_diary_exists: boolean;
  today_diary_word_count: number;
  today_habits_completed: number;
  today_habits_total: number;
  today_habit_completion_rate: number;
  diary_current_streak_length: number;
  habits_total_active: number;
  goals_total_active: number;
  goals_avg_progress_percentage: number;
  jobs_total_active: number;
  jobs_applied_total: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const snapshot = await safeInvoke<DashboardSnapshot>("get_dashboard", {
          forceRefresh: false,
        });
        setData(snapshot);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const trendData = useMemo(
    () => [
      { name: "Mon", score: 0 },
      { name: "Tue", score: 0 },
      { name: "Wed", score: 0 },
      { name: "Thu", score: 0 },
      { name: "Fri", score: 0 },
      { name: "Sat", score: 0 },
      { name: "Today", score: (data?.overall_productivity_score || 0) * 100 },
    ],
    [data]
  );

  const healthData = useMemo(
    () => [
      { name: "Stability", value: data ? 100 : 0 },
      { name: "Sync", value: data ? 100 : 0 },
      { name: "Cache", value: data ? 100 : 0 },
    ],
    [data]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-zinc-400 font-medium tracking-tight">
          Synchronizing workspace...
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Notion-style Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-widest">
            Workspace Analytics
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
          Control Center
          <span
            className="h-2 w-2 rounded-full bg-green-500"
            title="System Online"
          />
        </h1>
        <p className="text-zinc-500 max-w-2xl leading-relaxed">
          Your unified productivity stream. Real-time insights from your diary,
          habits, goals, and career pipeline.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Productivity",
            val: data.overall_productivity_score * 100,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Consistency",
            val: data.overall_consistency_index * 100,
            icon: Activity,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Momentum",
            val: data.overall_momentum_score * 100,
            icon: Zap,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Focus Load",
            val: (1 - data.burnout_risk_global) * 100,
            icon: Target,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="border-zinc-100 shadow-none bg-zinc-50/30 hover:bg-white transition-colors"
          >
            <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                {kpi.label}
              </CardDescription>
              <div className={`p-1.5 rounded-md ${kpi.bg}`}>
                <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold leading-none">
                {kpi.val.toFixed(0)}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
        {/* Productivity Chart */}
        <Card className="lg:col-span-8 border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-semibold flex items-center justify-between\">
              Productivity Trend
              <Link
                href="/analytics"
                className="text-xs text-zinc-400 font-normal hover:text-zinc-600 flex items-center gap-1"
              >
                Detailed report <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.05} />
                    <stop offset="95%" stopColor="#000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#18181b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-4 border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-semibold">
              Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#71717a", fontWeight: 500 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {healthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#22c55e"
                          : index === 1
                          ? "#3b82f6"
                          : "#a1a1aa"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Stream */}
      <div className="space-y-6 pt-8 border-t border-zinc-100">
        <h2 className="text-xl font-semibold tracking-tight">System Stream</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/diary">
            <Card className="group hover:border-zinc-300 transition-all shadow-none border-zinc-100 bg-zinc-50/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
                <h3 className="font-semibold text-zinc-900">Daily Journal</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {data.today_diary_exists
                    ? `Captured ${data.today_diary_word_count} words today.`
                    : "No entry detected for today yet."}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      data.today_diary_exists ? "bg-green-500" : "bg-zinc-300"
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {data.diary_current_streak_length} Day Streak
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/habits">
            <Card className="group hover:border-zinc-300 transition-all shadow-none border-zinc-100 bg-zinc-50/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
                <h3 className="font-semibold text-zinc-900">Habit Protocols</h3>
                <p className="text-sm text-zinc-500 mt-1 uppercase tracking-tight font-medium">
                  {data.today_habits_completed} / {data.today_habits_total}{" "}
                  Verified
                </p>
                <div className="mt-4 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all duration-1000"
                    style={{
                      width: `${data.today_habit_completion_rate * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/goals">
            <Card className="group hover:border-zinc-300 transition-all shadow-none border-zinc-100 bg-zinc-50/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Target className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
                <h3 className="font-semibold text-zinc-900">Strategic Goals</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {Math.round(data.goals_avg_progress_percentage * 100)}% Avg
                  Progress
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[8px] font-bold"
                      >
                        G{i + 1}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {data.goals_total_active} Active
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <footer className="pt-12 flex items-center justify-between">
        <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
          Nocturne OS • v1.0.4
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span className="hover:text-zinc-900 cursor-pointer">
            System Logs
          </span>
          <span className="hover:text-zinc-900 cursor-pointer">API Status</span>
        </div>
      </footer>
    </div>
  );
}
