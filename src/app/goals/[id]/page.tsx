"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useParams } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  MoreVertical,
  Edit,
  CheckCircle2,
  Circle,
  Target,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Goal {
  goal_id: string;
  goal_title: string;
  goal_description: string | null;
  goal_status: string;
  goal_type: string;
  progress_percentage: number;
  milestone_completion_percent: number;
  goal_target_date: string | null;
  goal_health_status: string | null;
  goal_priority_level: number;
  goal_urgency_level: number;
  goal_importance_weight: number;
  current_value: number;
  target_value: number | null;
  goal_days_remaining: number | null;
  milestone_count: number;
  milestones_completed_count: number;
  updated_at: number;
  progress_last_updated_at: number | null;
  milestone_ids: string | null;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

function GoalDetailContent() {
  const params = useParams();
  const goalId = params.id as string;
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const fetchGoal = useCallback(async () => {
    try {
      const data = await invoke<Goal>("get_goal", { goal_id: goalId });
      setGoal(data);

      // Parse subtasks from milestone_ids (comma-separated string)
      if (data.milestone_ids) {
        const milestoneIds = data.milestone_ids.split(",").filter(Boolean);
        const parsedSubtasks = milestoneIds.map((id, index) => ({
          id: id.trim(),
          title: `Milestone ${index + 1}`,
          completed: index < data.milestones_completed_count,
        }));
        setSubtasks(parsedSubtasks);
      }
    } catch (err) {
      console.error("Failed to fetch goal:", err);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  const toggleSubtask = async (subtaskId: string) => {
    if (!goal) return;

    const updatedSubtasks = subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);

    // Update progress (simplified - would need backend command)
    // In a real implementation, you'd call an update command here
  };

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse">
        Loading goal details...
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-20 text-center text-destructive font-bold">
        404: Goal not found
      </div>
    );
  }

  const daysRemaining = goal.goal_days_remaining ?? 0;
  const isOverdue = daysRemaining < 0;
  const healthColor =
    goal.goal_health_status === "healthy"
      ? "text-green-500"
      : goal.goal_health_status === "at_risk"
      ? "text-orange-500"
      : "text-red-500";

  return (
    <div className="flex flex-col h-screen bg-white font-geist">
      {/* Navigation Bar */}
      <header className="h-14 border-b flex items-center justify-between px-6 shrink-0 transition-colors bg-zinc-50/30">
        <div className="flex items-center gap-3 text-sm text-zinc-400 overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:text-primary flex items-center gap-1.5 shrink-0 transition-colors uppercase font-black text-[10px] tracking-widest h-auto p-0"
          >
            <Link href="/goals">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="text-xs text-zinc-500">Goals</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="truncate font-black text-zinc-900 uppercase text-[10px] tracking-widest">
            {goal.goal_title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest"
          >
            <Edit className="h-3 w-3 mr-2" />
            Edit
          </Button>

          {/* Info Icon */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-zinc-100 rounded-lg"
              >
                <Info className="h-4 w-4 text-zinc-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Goal Information</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Last Edited
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(goal.updated_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Last Progress Update
                  </p>
                  <p className="text-sm font-medium">
                    {goal.progress_last_updated_at
                      ? new Date(
                          goal.progress_last_updated_at * 1000
                        ).toLocaleString()
                      : "Never"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Total Subtasks
                  </p>
                  <p className="text-sm font-medium">
                    {goal.milestone_count} ({goal.milestones_completed_count}{" "}
                    completed)
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Three Dots Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-zinc-100 rounded-lg"
              >
                <MoreVertical className="h-4 w-4 text-zinc-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Goal Options</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Archive Goal
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Duplicate Goal
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  Delete Goal
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="max-w-[1400px] mx-auto py-12 px-8 space-y-8">
          {/* Goal Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                {goal.goal_title}
              </h1>
            </div>
            {goal.goal_description && (
              <p className="text-zinc-600 text-lg">{goal.goal_description}</p>
            )}
          </div>

          <Separator />

          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Progress
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${goal.progress_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      {Math.round(goal.progress_percentage)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Status
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {goal.goal_status.replace("_", " ")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Health
                  </p>
                  <div className="flex items-center gap-1">
                    <AlertCircle className={cn("h-4 w-4", healthColor)} />
                    <p
                      className={cn(
                        "text-sm font-medium capitalize",
                        healthColor
                      )}
                    >
                      {goal.goal_health_status || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Days Left
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      isOverdue ? "text-red-500" : "text-zinc-900"
                    )}
                  >
                    {isOverdue
                      ? `${Math.abs(daysRemaining)} overdue`
                      : daysRemaining}
                  </p>
                </div>
              </div>

              {goal.target_value && (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Current vs Target
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-600">Current</span>
                        <span className="font-bold">{goal.current_value}</span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${
                              (goal.current_value / goal.target_value) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500">/</div>
                    <div className="text-sm font-bold">{goal.target_value}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subtasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subtasks</CardTitle>
            </CardHeader>
            <CardContent>
              {subtasks.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                  <p className="text-sm">No subtasks defined yet.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Subtask
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                      onClick={() => toggleSubtask(subtask.id)}
                    >
                      {subtask.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-300" />
                      )}
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          subtask.completed && "line-through text-zinc-400"
                        )}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function GoalDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black text-zinc-300 uppercase tracking-widest">
          Loading goal...
        </div>
      }
    >
      <GoalDetailContent />
    </Suspense>
  );
}
