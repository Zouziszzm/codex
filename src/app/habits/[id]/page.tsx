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
  Activity,
  Target,
  TrendingUp,
  CheckCircle2,
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

interface Habit {
  habit_id: string;
  habit_name: string;
  habit_description: string | null;
  habit_type: string;
  schedule_type: string;
  habit_visibility: string;
  habit_status: string;
  habit_priority_level: number;
  created_at: number;
  updated_at: number;
  last_completed_at: number | null;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
}

function HabitDetailContent() {
  const params = useParams();
  const habitId = params.id as string;
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHabit = useCallback(async () => {
    try {
      const data = await invoke<Habit>("get_habit", { habit_id: habitId });
      setHabit(data);
    } catch (err) {
      console.error("Failed to fetch habit:", err);
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => {
    fetchHabit();
  }, [fetchHabit]);

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse">
        Loading habit details...
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="p-20 text-center text-destructive font-bold">
        404: Habit not found
      </div>
    );
  }

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
            <Link href="/habits">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="text-xs text-zinc-500">Habits</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="truncate font-black text-zinc-900 uppercase text-[10px] tracking-widest">
            {habit.habit_name}
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
                <SheetTitle>Habit Information</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(habit.created_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(habit.updated_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Last Completed
                  </p>
                  <p className="text-sm font-medium">
                    {habit.last_completed_at
                      ? new Date(
                          habit.last_completed_at * 1000
                        ).toLocaleString()
                      : "Never"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Total Completions
                  </p>
                  <p className="text-sm font-medium">
                    {habit.total_completions}
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
                <SheetTitle>Habit Options</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Archive Habit
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Duplicate Habit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  Delete Habit
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="max-w-[1400px] mx-auto py-12 px-8 space-y-8">
          {/* Habit Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                {habit.habit_name}
              </h1>
            </div>
            {habit.habit_description && (
              <p className="text-zinc-600 text-lg">{habit.habit_description}</p>
            )}
          </div>

          <Separator />

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{habit.current_streak}</p>
                <p className="text-xs text-zinc-500 mt-1">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Longest Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{habit.longest_streak}</p>
                <p className="text-xs text-zinc-500 mt-1">best record</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Total Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black">{habit.total_completions}</p>
                <p className="text-xs text-zinc-500 mt-1">times completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Type
                  </p>
                  <p className="text-sm font-medium capitalize mt-1">
                    {habit.habit_type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Schedule
                  </p>
                  <p className="text-sm font-medium capitalize mt-1">
                    {habit.schedule_type.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Status
                  </p>
                  <p className="text-sm font-medium capitalize mt-1">
                    {habit.habit_status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Priority
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {habit.habit_priority_level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function HabitDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black text-zinc-300 uppercase tracking-widest">
          Loading habit...
        </div>
      }
    >
      <HabitDetailContent />
    </Suspense>
  );
}
