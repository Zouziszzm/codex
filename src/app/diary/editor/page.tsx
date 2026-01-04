"use client";

import { useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { safeInvoke } from "@/lib/tauri";
import {
  ChevronLeft,
  Info,
  Plus,
  FileText,
  ChevronRight,
  MoreVertical,
  Lock,
  History,
  Smile,
  Zap,
  Brain,
  Flag,
  Type,
  Maximize2,
  Columns,
  Link as LinkIcon,
  Unlock,
} from "lucide-react";
import NocturneEditor from "@/components/diary/editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface DiaryEntry {
  diary_entry_id: string;
  entry_date: string;
  title: string | null;
  content_json: string;
  word_count: number;
  created_at: number;
  updated_at: number;
  parent_page_id: string | null;
  mood_label: string | null;
  mood_rating: number | null;
  energy_level: number | null;
  stress_level: number | null;
  importance_level: number;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { toast } = useToast();

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [subPages, setSubPages] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [fontStyle, setFontStyle] = useState<"sans" | "serif" | "mono">("sans");

  const todayStr = "2026-01-04";
  const isFuture = useMemo(() => {
    if (!entry) return false;
    return new Date(entry.entry_date) > new Date(todayStr);
  }, [entry, todayStr]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const data = await safeInvoke<DiaryEntry>("get_diary_entry", { id });
      setEntry(data);

      const children = await safeInvoke<DiaryEntry[]>("get_diary_sub_pages", {
        parentId: id,
      });
      setSubPages(children || []);
    } catch (err) {
      console.error("Failed to fetch diary entry:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const saveEntry = async (updates: Partial<DiaryEntry>) => {
    if (!entry || isFuture || isLocked) return;
    const newEntry = { ...entry, ...updates };

    try {
      setIsSaving(true);
      await safeInvoke("update_diary_entry", {
        id: newEntry.diary_entry_id,
        title: newEntry.title,
        contentJson: newEntry.content_json,
        wordCount: newEntry.word_count,
        moodLabel: newEntry.mood_label,
        moodRating: newEntry.mood_rating,
        energyLevel: newEntry.energy_level,
        stressLevel: newEntry.stress_level,
        importanceLevel: newEntry.importance_level,
      });
      setEntry({ ...newEntry, updated_at: Math.floor(Date.now() / 1000) });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const createSubPage = async () => {
    if (!entry || isFuture) return;

    const hasEmptySubPage = subPages.some(
      (page) => !page.word_count || page.word_count < 1
    );
    if (hasEmptySubPage) {
      toast({
        title: "Finish your current page first!",
        description:
          "First finish this u fool before being greedy for more! 😄",
        variant: "destructive",
      });
      return;
    }

    try {
      await safeInvoke("create_diary_entry", {
        input: {
          title: "",
          entry_date: entry.entry_date,
          content_json: "[]",
          parent_page_id: entry.diary_entry_id,
        },
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create sub_page:", err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-300">
        <div className="h-8 w-8 animate-spin border-2 border-zinc-200 border-t-zinc-900 rounded-full" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Synchronizing Page...
        </span>
      </div>
    );

  if (!entry)
    return (
      <div className="p-20 text-center text-zinc-400 font-bold">
        404: Page Not Found
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white transition-all duration-700">
      {/* Notion-style Toolbar */}
      <header className="h-10 border-b border-zinc-100 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-sm z-40">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <button
            onClick={() => router.push("/diary")}
            className="hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Journal
          </button>
          <ChevronRight className="h-2 w-2 opacity-20" />
          <span className="text-zinc-900 truncate max-w-[120px]">
            {entry.title || entry.entry_date}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isSaving && (
            <span className="text-[8px] font-black text-blue-500 mr-2 uppercase tracking-tighter">
              Saving...
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-zinc-100"
              >
                <Info className="h-3.5 w-3.5 text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 font-sans">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400">
                Identity
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex justify-between">
                <span className="text-xs">Last Edited</span>
                <span className="text-xs font-bold">
                  {new Date(entry.updated_at * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-between">
                <span className="text-xs">Words</span>
                <span className="text-xs font-bold">{entry.word_count}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-between">
                <span className="text-xs">Pages</span>
                <span className="text-xs font-bold">
                  {Math.ceil(entry.word_count / 250) || 1}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-zinc-100"
              >
                <MoreVertical className="h-3.5 w-3.5 text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 font-sans">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <Type className="h-3.5 w-3.5" />
                  <span className="text-xs">Font Style</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setFontStyle("sans")}
                    className="text-xs"
                  >
                    Default Sans
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFontStyle("serif")}
                    className="text-xs"
                  >
                    Classic Serif
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFontStyle("mono")}
                    className="text-xs"
                  >
                    Technical Mono
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() => setIsFullWidth(!isFullWidth)}
                className="gap-2"
              >
                {isFullWidth ? (
                  <Columns className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">
                  {isFullWidth ? "Default Width" : "Full Width"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsLocked(!isLocked)}
                className="gap-2"
              >
                {isLocked ? (
                  <Unlock className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">
                  {isLocked ? "Unlock Page" : "Lock Page"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <History className="h-3.5 w-3.5" />
                <span className="text-xs">Version History</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <LinkIcon className="h-3.5 w-3.5" />
                <span className="text-xs">Connections</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Surface Area */}
      <main
        className={cn(
          "flex-1 overflow-y-auto pt-16 pb-32 transition-all duration-500",
          fontStyle === "serif"
            ? "font-serif"
            : fontStyle === "mono"
            ? "font-mono"
            : "font-sans"
        )}
      >
        <div
          className={cn(
            "mx-auto px-6 transition-all duration-500",
            isFullWidth ? "max-w-none" : "max-w-3xl"
          )}
        >
          {/* Page Title */}
          <div className="mb-10 group">
            <input
              value={entry.title || ""}
              onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              onBlur={(e) => saveEntry({ title: e.target.value })}
              placeholder="Untitled"
              className="w-full text-5xl font-bold tracking-tight outline-none placeholder:text-zinc-100 text-zinc-900 bg-transparent"
              disabled={isLocked || isFuture}
            />
            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Smile className="h-3 w-3" />
                {entry.mood_label || "Natural"}
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                {entry.energy_level || 5}/10
              </div>
              <div className="flex items-center gap-1.5">
                <Brain className="h-3 w-3" />
                S: {entry.stress_level || 2}
              </div>
            </div>
          </div>

          {/* Editor Core */}
          <div
            className={cn(
              "min-h-[60vh]",
              (isLocked || isFuture) && "opacity-60 pointer-events-none"
            )}
          >
            <NocturneEditor
              initialContent={entry.content_json}
              onChange={(content) =>
                saveEntry({
                  content_json: content,
                  word_count: content.split(" ").length,
                })
              }
              editable={!isLocked && !isFuture}
            />
          </div>

          {/* Nested Hierarchy */}
          <div className="mt-20 pt-10 border-t border-zinc-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Child Nodes
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={createSubPage}
                className="h-6 px-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 gap-1"
              >
                <Plus className="h-3 w-3" />
                New Child
              </Button>
            </div>

            <div className="grid gap-1">
              {subPages.map((page) => (
                <button
                  key={page.diary_entry_id}
                  onClick={() =>
                    router.push(`/diary/editor?id=${page.diary_entry_id}`)
                  }
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 group text-left transition-all"
                >
                  <FileText className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                  <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
                    {page.title || "Untitled Sub-page"}
                  </span>
                </button>
              ))}
              {subPages.length === 0 && (
                <p className="text-[10px] text-zinc-300 font-medium uppercase tracking-tighter">
                  No hierarchical nodes established.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <ToastContainer toasts={[]} onRemove={() => {}} />
    </div>
  );
}

export default function DiaryEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse">
          Waking up system...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
