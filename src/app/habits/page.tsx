"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { safeInvoke } from "@/lib/tauri";
import { useRouter } from "next/navigation";
import {
  Flame,
  CheckCircle2,
  Plus,
  TrendingUp,
  Activity,
  Info,
  ChevronRight,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface Habit {
  habit_id: string;
  habit_name: string;
  habit_description: string | null;
  habit_type: string;
  habit_icon_emoji: string | null;
  habit_color: string | null;
  streak_current: number;
  streak_longest: number;
  completion_rate_30d: number;
  consistency_index: number;
  habit_health_status: string | null;
}

interface AnalyticsPoint {
  date: string;
  rate: number;
}

export default function HabitsPage() {
  const router = useRouter();
  const { toast, toasts, removeToast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState<AnalyticsPoint[]>([]);

  const todayStr = "2026-01-04";

  const fetchData = useCallback(async () => {
    try {
      const allHabits = await safeInvoke<Habit[]>("get_habits");
      setHabits(allHabits || []);

      setCompletionData([]); // Remove mock trend
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const heatmapData = useMemo(() => {
    return [] as { day: number; intensity: number }[]; // Remove mock heatmap
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Behavioral Protocols
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Habits
          </h1>
        </div>
        <Button
          onClick={async () => {
            try {
              const newHabit = await safeInvoke<Habit>("create_habit", {
                input: {
                  habit_name: "New Protocol",
                  habit_type: "boolean",
                  habit_description: "Define your protocol objectives here.",
                  habit_icon_emoji: "⚡",
                  habit_color: "#18181b",
                  schedule_type: "daily",
                },
              });
              if (newHabit) {
                toast({
                  title: "Protocol Initialized",
                  description: "New behavioral stream established.",
                  variant: "success",
                });
                fetchData();
              } else {
                toast({
                  title: "Execution Blocked",
                  description:
                    "Protocols can only be established in the desktop shell.",
                  variant: "destructive",
                });
              }
            } catch (err: unknown) {
              const errorMessage =
                err instanceof Error ? err.message : String(err);
              toast({
                title: "Setup Failed",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
          className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Protocol
        </Button>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              Monthly Velocity
              <span className="text-xs font-normal text-zinc-400">
                Global completion rate across all protocols
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.05} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="date" hide />
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
                  dataKey="rate"
                  stroke="#18181b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-semibold">
              Consistency Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid grid-cols-7 gap-1.5">
              {heatmapData.map((d) => (
                <div
                  key={d.day}
                  className={cn(
                    "aspect-square rounded-md transition-all",
                    d.intensity > 0.8
                      ? "bg-zinc-900"
                      : d.intensity > 0.5
                      ? "bg-zinc-400"
                      : d.intensity > 0.2
                      ? "bg-zinc-100"
                      : "bg-zinc-50/50"
                  )}
                  title={`Day ${d.day}: ${(d.intensity * 100).toFixed(0)}%`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-sm bg-zinc-50" />
                <div className="h-2 w-2 rounded-sm bg-zinc-100" />
                <div className="h-2 w-2 rounded-sm bg-zinc-400" />
                <div className="h-2 w-2 rounded-sm bg-zinc-900" />
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 pt-12 border-t border-zinc-100">
        <h2 className="text-xl font-semibold tracking-tight">
          Active Protocols
        </h2>
        <div className="grid gap-4">
          {loading ? (
            <div className="h-40 border-2 border-dashed border-zinc-100 rounded-3xl flex items-center justify-center italic text-zinc-300">
              Initializing behavioral stream...
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.habit_id}
                className="group flex items-center gap-6 p-6 rounded-[2rem] border border-zinc-100 hover:border-zinc-300 transition-all bg-zinc-50/10"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white border border-zinc-100 shadow-sm transition-transform group-hover:scale-110">
                  {habit.habit_icon_emoji ? (
                    <span className="text-2xl">{habit.habit_icon_emoji}</span>
                  ) : (
                    <Circle className="h-6 w-6 text-zinc-200" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">
                      {habit.habit_name}
                    </h3>
                    <div className="px-2 py-0.5 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                      {habit.streak_current} Day Streak
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-1">
                    {habit.habit_description ||
                      "Maintain peak performance through consistent execution."}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <div className="text-lg font-black">
                      {(habit.consistency_index * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Consistency
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-zinc-100"
                        >
                          <Info className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 font-sans"
                      >
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400">
                          Analytics
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="flex justify-between">
                          <span className="text-xs">30d Completion</span>
                          <span className="text-xs font-bold">
                            {(habit.completion_rate_30d * 100).toFixed(0)}%
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex justify-between">
                          <span className="text-xs">Current Streak</span>
                          <span className="text-xs font-bold">
                            {habit.streak_current} days
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex justify-between">
                          <span className="text-xs">Longest Streak</span>
                          <span className="text-xs font-bold">
                            {habit.streak_longest} days
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/habits/${habit.habit_id}`)
                          }
                          className="text-blue-500 font-bold gap-2"
                        >
                          <span className="text-xs">Deep Insights</span>
                          <ChevronRight className="h-3 w-3" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
