"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { safeInvoke } from "@/lib/tauri";
import { useRouter } from "next/navigation";
import {
  Tag as TagIcon,
  Target,
  Briefcase,
  Search,
  Calendar,
  Filter,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast, ToastContainer } from "@/components/ui/toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DiaryEntry {
  diary_entry_id: string;
  entry_date: string;
  title: string | null;
  word_count: number;
  mood_label: string | null;
  importance_level: number;
  tags?: string[];
  linked_task_ids?: string[];
  linked_goal_ids?: string[];
  linked_job_ids?: string[];
}

export default function DiaryPage() {
  const router = useRouter();
  const { toast, toasts, removeToast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  const todayStr = "2026-01-04";
  const today = useMemo(() => new Date(todayStr), [todayStr]);
  const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeapYear(2026) ? 366 : 365;

  const dayOfYear = useMemo(() => {
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [today]);

  const fetchEntries = useCallback(async () => {
    try {
      const data = await safeInvoke<DiaryEntry[]>("get_diary_entries");
      setEntries(data || []);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const analytics = useMemo(() => {
    const entriesWithContent = entries.filter((e) => e.word_count > 0);

    // Tag distribution analytics
    const tagStats: Record<string, { count: number; totalWords: number }> = {};
    entries.forEach((entry) => {
      entry.tags?.forEach((tag) => {
        if (!tagStats[tag]) tagStats[tag] = { count: 0, totalWords: 0 };
        tagStats[tag].count++;
        tagStats[tag].totalWords += entry.word_count;
      });
    });

    const chartData = Object.entries(tagStats)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avgLength: Math.round(stats.totalWords / stats.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      entriesCount: entriesWithContent.length,
      chartData,
      totalEntries: entries.length,
    };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return [...entries]
      .filter((entry) => {
        const entryDate = new Date(entry.entry_date);
        const matchesSearch =
          (entry.title || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          entry.entry_date.includes(searchQuery);
        const matchesMonth =
          monthFilter === "all" ||
          (entryDate.getMonth() + 1).toString() === monthFilter;
        const matchesTag =
          tagFilter === "all" || (entry.tags && entry.tags.includes(tagFilter));
        return matchesSearch && matchesMonth && matchesTag;
      })
      .sort(
        (a, b) =>
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
      );
  }, [entries, searchQuery, monthFilter, tagFilter]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Notion-style Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Historical Logs
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Diary
          </h1>
        </div>
        <button
          onClick={async () => {
            try {
              const now = new Date();
              const dateStr = now.toISOString().split("T")[0];
              const newEntry = await safeInvoke<DiaryEntry>(
                "create_diary_entry",
                {
                  input: {
                    entry_date: dateStr,
                    title: "Draft Entry",
                    content_json: JSON.stringify({
                      type: "page",
                      content: [{ type: "paragraph", content: [] }],
                    }),
                    parent_page_id: null,
                  },
                }
              );
              if (newEntry) {
                toast({
                  title: "Entry Created",
                  description: "Redirecting to editor...",
                  variant: "success",
                });
                router.push(`/diary/editor?id=${newEntry.diary_entry_id}`);
              } else {
                toast({
                  title: "Action Restricted",
                  description:
                    "Data modification requires the Tauri application.",
                  variant: "destructive",
                });
              }
            } catch (err: unknown) {
              const errorMessage =
                err instanceof Error ? err.message : String(err);
              toast({
                title: "Creation Error",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
          className="h-10 px-4 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          New Entry
        </button>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Analytics & Progress Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <div className="p-6 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Year Progress
              </h3>
              <div className="text-3xl font-bold tracking-tight">
                {dayOfYear}/{totalDays}{" "}
                <span className="text-zinc-300 font-light">day</span> |{" "}
                {analytics.entriesCount}/{totalDays}{" "}
                <span className="text-zinc-300 font-light">entries</span>
              </div>
            </div>

            <div className="flex-1 max-w-md w-full px-4">
              <div className="relative h-3 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-zinc-900 transition-all duration-1000 ease-out z-10"
                  style={{ width: `${(dayOfYear / totalDays) * 100}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-1000 ease-out z-20 opacity-60"
                  style={{
                    width: `${(analytics.entriesCount / totalDays) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span>Elapsed</span>
                <span className="text-blue-500 italic">Captured</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-3xl font-bold">{totalDays - dayOfYear}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Days Remaining
              </div>
            </div>
          </div>
        </div>

        {/* Tag Analytics Chart */}
        <Card className="lg:col-span-12 border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              Tag Distribution & Length
              <span className="text-xs font-normal text-zinc-400">
                Comparing frequency vs average word count
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 h-[240px]">
            {analytics.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="avgLength"
                    name="Avg Words"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    {analytics.chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="#18181b"
                        fillOpacity={
                          0.05 + 0.9 * (index / analytics.chartData.length)
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-300 text-sm italic">
                Insufficient tag data for visualization
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workspace Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-zinc-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all shadow-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full md:w-40 h-10 border-zinc-100 bg-zinc-50/50">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(2026, i).toLocaleString("default", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-40 h-10 border-zinc-100 bg-zinc-50/50">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {/* Actual unique tags should be populated here */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Entries Table */}
      <div className="border rounded-xl border-zinc-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center text-[10px] font-bold uppercase tracking-widest">
                No
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Title/Date
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Day
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Pages
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Tags
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Action
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
                  Retrieving diary stream...
                </TableCell>
              </TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-zinc-300 italic"
                >
                  No records found in this view.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry, index) => {
                const date = new Date(entry.entry_date);
                const dayOfYearNum = Math.ceil(
                  (date.getTime() -
                    new Date(date.getFullYear(), 0, 0).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const pages = Math.ceil(entry.word_count / 250) || 1;

                return (
                  <TableRow
                    key={entry.diary_entry_id}
                    className="group cursor-pointer hover:bg-zinc-50/80 transition-colors"
                    onClick={() =>
                      router.push(`/diary/editor?id=${entry.diary_entry_id}`)
                    }
                  >
                    <TableCell className="text-center font-mono text-xs text-zinc-400">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 group-hover:text-black">
                          {entry.title ||
                            date.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-600">
                      {dayOfYearNum}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-600">
                      {pages}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {entry.tags && entry.tags.length > 0 ? (
                          entry.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-medium"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-300 font-light italic text-xs">
                            No tags
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(entry.linked_goal_ids?.length || 0) > 0 && (
                          <Target className="h-3.5 w-3.5 text-purple-400" />
                        )}
                        {(entry.linked_task_ids?.length || 0) > 0 && (
                          <Calendar className="h-3.5 w-3.5 text-blue-400" />
                        )}
                        {(entry.linked_job_ids?.length || 0) > 0 && (
                          <Briefcase className="h-3.5 w-3.5 text-orange-400" />
                        )}
                        {!entry.linked_goal_ids?.length &&
                          !entry.linked_task_ids?.length &&
                          !entry.linked_job_ids?.length && (
                            <span className="text-zinc-200">—</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="w-10">
                      <ChevronRight className="h-4 w-4 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
