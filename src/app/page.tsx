"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  Target,
  ChevronRight,
  ShieldCheck,
  Zap,
  MousePointer2,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const snapshot = await invoke<DashboardSnapshot>("get_dashboard", {
          forceRefresh: false,
        });
        setData(snapshot);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError("Failed to load system metrics.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">
            Warping to System Console...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-destructive">
        <AlertCircle className="mr-2" />
        {error || "System data stream offline"}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto font-geist">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100/50 rounded-full w-fit">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              System Secure & Synced
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900 leading-[0.8] uppercase">
            Control <br /> <span className="text-primary italic">Center</span>
          </h1>
          <p className="text-zinc-500 text-lg font-medium max-w-md leading-relaxed">
            Real-time synchronization of your productivity, habits, and mental
            clarity logs across the entire system.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              System Time
            </p>
            <p className="text-2xl font-black tabular-nums">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="h-10 w-px bg-zinc-200" />
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Date Index
            </p>
            <p className="text-2xl font-black">
              {new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Productivity",
            val: data.overall_productivity_score,
            icon: Activity,
            color: "text-primary",
            desc: "Output efficiency",
          },
          {
            label: "Consistency",
            val: data.overall_consistency_index,
            icon: CheckCircle2,
            color: "text-green-500",
            desc: "Habit lock-in",
          },
          {
            label: "Momentum",
            val: data.overall_momentum_score,
            icon: Flame,
            color: "text-orange-500",
            desc: "Current pace",
          },
          {
            label: "Burnout Risk",
            val: data.burnout_risk_global,
            icon: Brain,
            color: "text-purple-500",
            desc: "Mental load",
            inverse: true,
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border-none bg-zinc-50/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform -rotate-12">
              <kpi.icon className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-4xl font-black tracking-tighter group-hover:scale-105 origin-left transition-transform">
                {(kpi.val * 100).toFixed(0)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    kpi.color.replace("text", "bg")
                  )}
                  style={{ width: `${kpi.val * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-3 font-bold uppercase tracking-widest">
                {kpi.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
        {/* Today's High-Resolution Stream */}
        <Card className="lg:col-span-8 border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-black uppercase tracking-tighter">
                  Identity Stream
                </CardTitle>
                <CardDescription className="text-zinc-500 font-medium">
                  Resolution of current activity cycles.
                </CardDescription>
              </div>
              <Link href="/diary">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-10 px-6 border-zinc-200 font-bold uppercase tracking-widest text-[10px]"
                >
                  View Full Stream
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-10 font-bold">
            {/* Diary Block */}
            <div className="group flex items-center justify-between p-6 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-zinc-900 text-lg tracking-tight uppercase font-black">
                    Daily Recording
                  </p>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    {data.today_diary_exists
                      ? `Verified (${data.today_diary_word_count} words captured)`
                      : "Incomplete Session"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    data.today_diary_exists
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-200 text-zinc-500"
                  )}
                >
                  {data.today_diary_exists ? "Synced" : "Pending"}
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Habits Block */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                    <Zap className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-zinc-900 text-lg tracking-tight uppercase font-black">
                      Habit Execution
                    </p>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                      {data.today_habits_completed} of {data.today_habits_total}{" "}
                      Protocols Verified
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-black tabular-nums">
                  {(data.today_habit_completion_rate * 100).toFixed(0)}%
                </p>
              </div>
              <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                <div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000"
                  style={{
                    width: `${data.today_habit_completion_rate * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Goals & Jobs Grid */}
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="p-6 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-200 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-6 w-6 text-purple-500" />
                  <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Critical Targets
                </p>
                <p className="text-3xl font-black mt-1">
                  {(data.goals_avg_progress_percentage * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 mt-2">
                  Avg system progress
                </p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-200 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                  <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Career Pipeline
                </p>
                <p className="text-3xl font-black mt-1">
                  {data.jobs_applied_total}
                </p>
                <p className="text-[10px] uppercase font-bold text-zinc-500 mt-2">
                  Active applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health & Status Cards */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none bg-zinc-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 opacity-20 group-hover:rotate-12 transition-transform">
              <Activity className="h-40 w-40 text-primary" />
            </div>
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="space-y-2">
                <div className="text-5xl font-black tracking-tighter uppercase">
                  {data.system_health_status}
                </div>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                  Global Integrity Check
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Stability", val: 98, color: "bg-green-500" },
                  { label: "Sync Velocity", val: 84, color: "bg-primary" },
                  { label: "Memory Cache", val: 62, color: "bg-blue-500" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>{stat.label}</span>
                      <span className="text-zinc-500">{stat.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full", stat.color)}
                        style={{ width: `${stat.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 p-8 rounded-[2rem] group hover:bg-zinc-50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <MousePointer2 className="h-4 w-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Total Milestones
            </p>
            <p className="text-4xl font-black tracking-tighter mt-1">
              {data.habits_total_active +
                data.goals_total_active +
                data.jobs_applied_total}
            </p>
            <p className="text-xs font-bold text-zinc-500 mt-4 uppercase tracking-widest">
              Lifetime synchronization events across all domains.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
        <p>© 2026 NOCTURNE OS INTERACTIVE</p>
        <div className="flex gap-8">
          <span className="hover:text-primary cursor-pointer transition-colors">
            Documentation
          </span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            System Privacy
          </span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            Core Nodes
          </span>
        </div>
      </div>
    </div>
  );
}
