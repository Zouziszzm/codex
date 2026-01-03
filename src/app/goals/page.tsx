"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Plus,
  Target,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    goal_title: "",
    goal_type: "outcome",
    goal_category: "career",
    goal_description: "",
    goal_target_date: "",
  });

  const fetchGoals = async () => {
    try {
      const data = await invoke<Goal[]>("get_goals");
      setGoals(data);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("create_goal", {
        input: {
          ...formData,
          goal_category: formData.goal_category || null,
          goal_description: formData.goal_description || null,
          goal_target_date: formData.goal_target_date || null,
        },
      });
      setIsOpen(false);
      fetchGoals();
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const completedGoals = goals.filter(
    (g) => g.goal_status === "completed"
  ).length;
  const avgProgress =
    goals.length > 0
      ? goals.reduce((acc, g) => acc + g.progress_percentage, 0) / goals.length
      : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Long-term outcomes and intent
          </p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create New Goal</SheetTitle>
              <SheetDescription>
                Define a new outcome or objective to track.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.goal_title}
                  onChange={(e) =>
                    setFormData({ ...formData, goal_title: e.target.value })
                  }
                  placeholder="Master Rust programming..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={formData.goal_type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, goal_type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outcome">Outcome (Result)</SelectItem>
                    <SelectItem value="process">
                      Process (Consistency)
                    </SelectItem>
                    <SelectItem value="performance">
                      Performance (Skill)
                    </SelectItem>
                    <SelectItem value="learning">
                      Learning (Knowledge)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.goal_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal_description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_date">Target Date</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.goal_target_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal_target_date: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading goals...
                </TableCell>
              </TableRow>
            ) : goals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No goals yet. Create your first goal to get started.
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => (
                <TableRow key={goal.goal_id}>
                  <TableCell className="max-w-[300px]">
                    <div className="font-medium truncate">
                      {goal.goal_title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate italic">
                      {goal.goal_description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm">
                      {goal.goal_status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${goal.progress_percentage * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono">
                        {(goal.progress_percentage * 100).toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      {goal.goal_target_date
                        ? new Date(goal.goal_target_date).toLocaleDateString()
                        : "No deadline"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {goal.goal_health_status === "healthy" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : goal.goal_health_status === "at_risk" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-300" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
