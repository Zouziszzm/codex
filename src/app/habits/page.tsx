"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Plus,
  Activity,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Habit {
  habit_id: string;
  habit_name: string;
  habit_description: string | null;
  habit_type: string;
  habit_icon_emoji: string | null;
  habit_color: string | null;
  streak_current: number;
  streak_longest: number;
  total_completions: number;
  completion_rate_30d: number;
  habit_health_status: string | null;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    habit_name: "",
    habit_type: "boolean",
    habit_description: "",
    habit_icon_emoji: "✨",
    habit_color: "#3b82f6",
    schedule_type: "daily",
  });

  const fetchHabits = async () => {
    try {
      const data = await invoke<Habit[]>("get_habits");
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("create_habit", {
        input: {
          ...formData,
          habit_description: formData.habit_description || null,
          habit_icon_emoji: formData.habit_icon_emoji || null,
          habit_color: formData.habit_color || null,
        },
      });
      setIsOpen(false);
      fetchHabits();
    } catch (err) {
      console.error("Failed to create habit:", err);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Habits
          </h1>
          <p className="text-muted-foreground mt-1">
            Daily routines and consistency
          </p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Habit
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create New Habit</SheetTitle>
              <SheetDescription>
                Build a new consistent routine.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.habit_name}
                  onChange={(e) =>
                    setFormData({ ...formData, habit_name: e.target.value })
                  }
                  placeholder="Morning Meditation..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Habit Type</Label>
                <Select
                  value={formData.habit_type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, habit_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">
                      Boolean (Done/Not Done)
                    </SelectItem>
                    <SelectItem value="quantitative">
                      Quantitative (Numeric)
                    </SelectItem>
                    <SelectItem value="duration">Duration (Time)</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.habit_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      habit_description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emoji">Icon Emoji</Label>
                  <Input
                    id="emoji"
                    value={formData.habit_icon_emoji}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        habit_icon_emoji: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    className="h-10 px-1 py-1"
                    value={formData.habit_color}
                    onChange={(e) =>
                      setFormData({ ...formData, habit_color: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Habit
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-secondary/50" />
              <CardContent className="h-12" />
            </Card>
          ))
        ) : habits.length === 0 ? (
          <div className="col-span-full h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            <Sparkles className="h-8 w-8 mb-2 opacity-20" />
            <p>No habits tracked yet. Start build your first one!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <Card key={habit.habit_id} className="overflow-hidden">
              <div
                className="h-1.5"
                style={{
                  backgroundColor: habit.habit_color || "var(--primary)",
                }}
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {habit.habit_icon_emoji || "✨"}
                    </span>
                    <div>
                      <CardTitle className="text-lg">
                        {habit.habit_name}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 italic text-xs">
                        {habit.habit_description || "No description provided"}
                      </CardDescription>
                    </div>
                  </div>
                  {habit.habit_health_status === "healthy" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">
                      {habit.streak_current} Day Streak
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    Best: {habit.streak_longest}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span>Consistency (30d)</span>
                    <span>{(habit.completion_rate_30d * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${habit.completion_rate_30d * 100}%` }}
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full h-8 text-sm">
                  Check In
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
