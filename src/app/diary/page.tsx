"use client";

import { useEffect, useState, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useRouter } from "next/navigation";
import {
  Plus,
  BookOpen,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Zap,
  Smile,
  ChevronRight,
  Database,
  Lock,
  History,
  Tag,
  CalendarDays,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

interface DiaryEntry {
  diary_entry_id: string;
  entry_date: string;
  title: string | null;
  word_count: number;
  mood_label: string | null;
  mood_rating: number | null;
  importance_level: number;
  updated_at: number;
}

export default function DiaryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  // States for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [dateSort, setDateSort] = useState("desc");

  const todayStr = "2026-01-03"; // System current date

  const fetchEntries = async () => {
    try {
      const data = await invoke<DiaryEntry[]>("get_diary_entries");
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupSystem = async () => {
    setIsInitializing(true);
    try {
      await invoke("setup_diary");
      await fetchEntries();
    } catch (err) {
      console.error("Setup failed:", err);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    setupSystem();
  }, []);

  // Functional Filtering
  const filteredEntries = useMemo(() => {
    let result = entries.filter((entry) => {
      const matchesSearch =
        (entry.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.entry_date.includes(searchQuery);
      const matchesMood =
        moodFilter === "all" || entry.mood_label === moodFilter;
      const matchesImportance =
        importanceFilter === "all" ||
        entry.importance_level.toString() === importanceFilter;

      return matchesSearch && matchesMood && matchesImportance;
    });

    result.sort((a, b) => {
      const timeA = new Date(a.entry_date).getTime();
      const timeB = new Date(b.entry_date).getTime();
      return dateSort === "desc" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [entries, searchQuery, moodFilter, importanceFilter, dateSort]);

  // Insights
  const stats = useMemo(() => {
    const totalWords = entries.reduce((acc, curr) => acc + curr.word_count, 0);
    const completedCount = entries.filter((e) => e.word_count > 0).length;
    const avgWords =
      completedCount > 0 ? (totalWords / completedCount).toFixed(0) : 0;

    return { totalWords, completedCount, avgWords };
  }, [entries]);

  const handleRowClick = (id: string) => {
    router.push(`/diary/editor?id=${id}`);
  };

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto font-geist">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
            <Database className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              System Calendar Active
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 uppercase italic">
            Diary <span className="text-zinc-400 not-italic">Archive</span>
          </h1>
          <p className="text-zinc-500 text-lg font-medium max-w-md">
            The complete 2026 chronological record. Syncing through {todayStr}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right pr-4 border-r">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Sync Status
            </p>
            <p className="text-xl font-black text-green-600">LIVE</p>
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl border-zinc-200 hover:bg-zinc-50 transition-all font-black uppercase tracking-widest text-[10px] gap-2"
            onClick={setupSystem}
            disabled={isInitializing}
          >
            {isInitializing ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
            ) : (
              <History className="h-4 w-4" />
            )}
            Force Re-Sync
          </Button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: "Total Capacity",
            val: entries.length,
            icon: CalendarDays,
            color: "text-zinc-400",
            desc: "Days in system",
          },
          {
            label: "Active Pages",
            val: stats.completedCount,
            icon: Zap,
            color: "text-orange-500",
            desc: "Entries written",
          },
          {
            label: "Volume",
            val: stats.totalWords.toLocaleString(),
            icon: History,
            color: "text-blue-500",
            desc: "Words logged",
          },
          {
            label: "Avg Depth",
            val: stats.avgWords,
            icon: Smile,
            color: "text-primary",
            desc: "Words per page",
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="border-none bg-zinc-50 shadow-sm relative overflow-hidden"
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-3xl font-black">{kpi.val}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {kpi.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtering Engine */}
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-zinc-900 rounded-3xl text-white">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <Input
            placeholder="Search dates, IDs, or titles..."
            className="pl-12 h-14 bg-zinc-800 border-none text-white placeholder:text-zinc-500 rounded-2xl focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="w-40 h-14 bg-zinc-800 border-none rounded-2xl font-black uppercase text-[10px] tracking-widest">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white border-zinc-800">
              <SelectItem value="all">All Moods</SelectItem>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Focused">Focused</SelectItem>
              <SelectItem value="Tired">Tired</SelectItem>
              <SelectItem value="Energetic">Energetic</SelectItem>
            </SelectContent>
          </Select>

          <Select value={importanceFilter} onValueChange={setImportanceFilter}>
            <SelectTrigger className="w-40 h-14 bg-zinc-800 border-none rounded-2xl font-black uppercase text-[10px] tracking-widest">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white border-zinc-800">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="0">Normal</SelectItem>
              <SelectItem value="1">High</SelectItem>
              <SelectItem value="2">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="h-14 w-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 hover:text-white"
            onClick={() => setDateSort(dateSort === "desc" ? "asc" : "desc")}
          >
            <Filter
              className={cn(
                "h-6 w-6 transition-transform",
                dateSort === "asc" && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Entry List */}
      <div className="rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 pl-10 h-16">
                Entry Point
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                System Identity
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Metrics
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Status
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="h-24">
                  <TableCell colSpan={5} className="px-10">
                    <div className="h-4 bg-zinc-50 rounded animate-pulse w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredEntries.length === 0 ? (
              <TableRow className="h-96">
                <TableCell
                  colSpan={5}
                  className="text-center font-black uppercase text-zinc-300 tracking-[0.5em]"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Database className="h-12 w-12 opacity-10" />
                    Query Result: Empty
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => {
                const isFuture =
                  new Date(entry.entry_date) > new Date(todayStr);
                return (
                  <TableRow
                    key={entry.diary_entry_id}
                    className="group h-24 hover:bg-zinc-50/80 cursor-pointer transition-all border-zinc-100"
                    onClick={() => handleRowClick(entry.diary_entry_id)}
                  >
                    <TableCell className="pl-10">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
                            isFuture
                              ? "bg-zinc-50 border-zinc-100"
                              : "bg-primary/5 border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                          )}
                        >
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div className="font-mono text-[11px] font-black uppercase text-zinc-400">
                          {entry.entry_date}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div
                          className={cn(
                            "font-black text-xl tracking-tighter truncate max-w-md transition-colors",
                            isFuture
                              ? "text-zinc-300"
                              : "text-zinc-900 group-hover:text-primary"
                          )}
                        >
                          {entry.title || "Untethered Fragment"}
                        </div>
                        <div className="flex items-center gap-3">
                          {entry.mood_label && (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 rounded-md text-[9px] font-black uppercase text-zinc-500 tracking-widest">
                              <Smile className="h-3 w-3" />
                              {entry.mood_label}
                            </span>
                          )}
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                            {entry.word_count} Words logged
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 w-4 rounded-full transition-all duration-500",
                              i < (entry.mood_rating || 0)
                                ? "bg-primary group-hover:scale-x-125"
                                : "bg-zinc-100"
                            )}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isFuture ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 text-zinc-400 rounded-full border border-zinc-100 w-fit">
                          <Lock className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Locked
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 w-fit">
                          <Plus className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Active
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="pr-10 text-right">
                      <ChevronRight className="h-6 w-6 text-zinc-300 group-hover:text-primary group-hover:translate-x-2 transition-all opacity-0 group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sub-page management instruction */}
      <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-between group cursor-help transition-all hover:bg-white hover:shadow-xl">
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            <Tag className="h-7 w-7 text-zinc-400" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight uppercase">
              Nested Records
            </p>
            <p className="text-zinc-500 text-sm font-medium">
              To add sub-pages, enter a primary record and use the Studio
              controls.
            </p>
          </div>
        </div>
        <ArrowUpRight className="h-8 w-8 text-zinc-200 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
