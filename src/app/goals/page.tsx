"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { safeInvoke } from "@/lib/tauri";
import { useRouter } from "next/navigation";
import { Target, Plus, TrendingUp, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface Goal {
  goal_id: string;
  goal_title: string;
  goal_description: string | null;
  goal_status: string;
  goal_type: string;
  progress_percentage: number;
  goal_target_date: string | null;
  goal_priority_level: number;
  goal_importance_weight: number;
}

export default function GoalsPage() {
  const router = useRouter();
  const { toast, toasts, removeToast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await safeInvoke<Goal[]>("get_goals");
      setGoals(data || []);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const analytics = useMemo(() => {
    const avgProgress =
      goals.length > 0
        ? goals.reduce((acc, g) => acc + g.progress_percentage, 0) /
          goals.length
        : 0;

    const chartData = goals
      .map((g) => ({
        name:
          g.goal_title.length > 15
            ? g.goal_title.substring(0, 12) + "..."
            : g.goal_title,
        progress: Math.round(g.progress_percentage * 100),
        raw: g.progress_percentage,
      }))
      .sort((a, b) => b.raw - a.raw)
      .slice(0, 5);

    return {
      avgProgress: Math.round(avgProgress * 100),
      chartData,
    };
  }, [goals]);

  const velocityData = useMemo(() => [], []); // Remove mock velocity

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Strategic Directives
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Goals
          </h1>
        </div>
        <Button
          onClick={async () => {
            try {
              const newGoal = await safeInvoke<Goal>("create_goal", {
                input: {
                  goal_title: "New Strategic Directive",
                  goal_type: "outcome",
                  goal_description: "Define your high-level objective here.",
                  goal_category: "career",
                  goal_target_date: new Date(new Date().getFullYear(), 11, 31)
                    .toISOString()
                    .split("T")[0],
                },
              });
              if (newGoal) {
                toast({
                  title: "Directive Issued",
                  description: "Strategic node operational.",
                  variant: "success",
                });
                fetchGoals();
              } else {
                toast({
                  title: "Access Restricted",
                  description:
                    "Directives must be issued from the Tauri console.",
                  variant: "destructive",
                });
              }
            } catch (err: unknown) {
              const errorMessage =
                err instanceof Error ? err.message : String(err);
              toast({
                title: "Directive Error",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
          className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
        >
          <Plus className="h-4 w-4" />
          New Directive
        </Button>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Tabs defaultValue="analytics" className="w-full">
        <div className="border-b border-zinc-100 mb-8">
          <TabsList className="bg-transparent p-0 gap-8 h-10">
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 h-10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 rounded-none px-0 h-10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900"
            >
              Details
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analytics" className="space-y-12 mt-0 outline-none">
          <div className="grid gap-8 lg:grid-cols-12">
            <Card className="lg:col-span-8 border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                  Execution Velocity
                  <div className="flex flex-col text-right">
                    <span className="text-2xl font-black">
                      {analytics.avgProgress}%
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      System Average
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData}>
                    <defs>
                      <linearGradient
                        id="goalGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#18181b"
                          stopOpacity={0.05}
                        />
                        <stop
                          offset="95%"
                          stopColor="#18181b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#a1a1aa" }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      cursor={{ stroke: "#18181b", strokeWidth: 1 }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="velocity"
                      stroke="#18181b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#goalGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-semibold">
                  Priority Nodes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.chartData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#71717a", fontWeight: 600 }}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                    />
                    <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={12}>
                      {analytics.chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#18181b" : "#a1a1aa"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 mt-0 outline-none">
          <div className="border rounded-xl border-zinc-100 overflow-hidden shadow-sm shadow-zinc-200/50">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 text-center text-[10px] font-bold uppercase tracking-widest">
                    No
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Directive
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Progress
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Target
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                    Weight
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-zinc-300 italic"
                    >
                      Scanning directive database...
                    </TableCell>
                  </TableRow>
                ) : (
                  goals.map((goal, index) => (
                    <TableRow
                      key={goal.goal_id}
                      className="group cursor-pointer hover:bg-zinc-50/80 transition-colors"
                      onClick={() => router.push(`/goals/${goal.goal_id}`)}
                    >
                      <TableCell className="text-center font-mono text-xs text-zinc-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900">
                            {goal.goal_title}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-tighter line-clamp-1">
                            {goal.goal_description || "Operational target"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-zinc-900 transition-all duration-1000"
                              style={{
                                width: `${goal.progress_percentage * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold font-mono">
                            {(goal.progress_percentage * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                            goal.goal_status === "completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-zinc-100 text-zinc-600"
                          )}
                        >
                          {goal.goal_status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-zinc-500">
                        {goal.goal_target_date || "Open"}
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-zinc-400">
                        {goal.goal_importance_weight.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="pt-12 border-t border-zinc-50 flex items-center justify-between opacity-30">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <Settings className="h-3 w-3" />
          Target Acquisition System
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Calculated at {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}
