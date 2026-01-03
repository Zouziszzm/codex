"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import {
  ChevronLeft,
  Info,
  Calendar,
  Hash,
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
} from "lucide-react";
import Link from "next/link";
import NocturneEditor from "@/components/diary/editor";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [subPages, setSubPages] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFuture, setIsFuture] = useState(false);

  const todayStr = "2026-01-03";

  // Fetch Page Data
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const data = await invoke<DiaryEntry>("get_diary_entry", { id });
      setEntry(data);

      const children = await invoke<DiaryEntry[]>("get_diary_sub_pages", {
        parentId: id,
      });
      setSubPages(children);

      // Rule Check: Is this a future date?
      const entryDate = new Date(data.entry_date);
      const today = new Date(todayStr);
      if (entryDate > today) {
        setIsFuture(true);
      }
    } catch (err) {
      console.error("Failed to fetch diary entry:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  // Handle Save
  const saveEntry = async (updates: Partial<DiaryEntry>) => {
    if (!entry || isFuture) return;
    const newEntry = { ...entry, ...updates };

    try {
      setIsSaving(true);
      await invoke("update_diary_entry", {
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

  const handleEditorChange = async (jsonContent: string) => {
    if (!entry || isFuture) return;

    let words = 0;
    try {
      const blocks = JSON.parse(jsonContent);
      blocks.forEach((b: any) => {
        if (b.content && Array.isArray(b.content)) {
          b.content.forEach((c: any) => {
            if (c.text) words += c.text.trim().split(/\s+/).length;
          });
        }
      });
    } catch (e) {}

    await saveEntry({ content_json: jsonContent, word_count: words });
  };

  const createSubPage = async () => {
    if (!entry) return;
    try {
      const newTitle = "Untitled Sub-page";
      await invoke("create_diary_entry", {
        input: {
          title: newTitle,
          entry_date: entry.entry_date,
          content_json: '[{"type":"paragraph","content":[]}]',
          parent_page_id: entry.diary_entry_id,
        },
      });
      fetchData();
    } catch (err) {
      console.error("Failed to create sub-page:", err);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">
        Initializing System Stream...
      </div>
    );
  if (!entry)
    return (
      <div className="p-20 text-center text-destructive font-bold">
        404: IDENTITY NOT FOUND
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-white font-geist">
      {/* Navigation Bar */}
      <header className="h-14 border-b flex items-center justify-between px-6 shrink-0 transition-colors bg-zinc-50/30">
        <div className="flex items-center gap-3 text-sm text-zinc-400 overflow-hidden">
          <Link
            href="/diary"
            className="hover:text-primary flex items-center gap-1.5 shrink-0 transition-colors uppercase font-black text-[10px] tracking-widest"
          >
            <ChevronLeft className="h-4 w-4" />
            Archive
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="truncate font-black text-zinc-900 uppercase text-[10px] tracking-widest">
            {entry.title || "Untethered Fragment"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isSaving && (
            <span className="text-[10px] uppercase font-black text-primary animate-pulse tracking-widest bg-primary/5 px-2 py-1 rounded">
              Syncing...
            </span>
          )}
          {isFuture && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-black/20">
              <Lock className="h-3 w-3" />
              Locked System
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-zinc-100 rounded-xl"
              >
                <Info className="h-5 w-5 text-zinc-400" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-8 overflow-y-auto">
              <SheetHeader className="mb-10 text-left">
                <SheetTitle className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                  Identity <br />{" "}
                  <span className="text-zinc-400">Metadata</span>
                </SheetTitle>
                <SheetDescription className="font-medium text-zinc-500">
                  Deep system audit and configuration labels.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-10">
                {/* Status KPI */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                      Created
                    </p>
                    <p className="text-sm font-bold">
                      {new Date(entry.created_at * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                      Words
                    </p>
                    <p className="text-sm font-bold">{entry.word_count}</p>
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                {/* Mood & Label */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Atmosphere Label
                    </Label>
                    <Select
                      disabled={isFuture}
                      value={entry.mood_label || "Stable"}
                      onValueChange={(val) => saveEntry({ mood_label: val })}
                    >
                      <SelectTrigger className="h-12 bg-zinc-50 border-zinc-100 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 text-white border-zinc-800">
                        <SelectItem
                          value="Stable"
                          className="font-bold uppercase text-[10px] tracking-widest"
                        >
                          Stable
                        </SelectItem>
                        <SelectItem
                          value="Focused"
                          className="font-bold uppercase text-[10px] tracking-widest"
                        >
                          Focused
                        </SelectItem>
                        <SelectItem
                          value="Tired"
                          className="font-bold uppercase text-[10px] tracking-widest"
                        >
                          Tired
                        </SelectItem>
                        <SelectItem
                          value="Energetic"
                          className="font-bold uppercase text-[10px] tracking-widest"
                        >
                          Energetic
                        </SelectItem>
                        <SelectItem
                          value="Reflective"
                          className="font-bold uppercase text-[10px] tracking-widest"
                        >
                          Reflective
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Vibe Intensity
                      </Label>
                      <span className="text-[10px] font-black text-primary uppercase">
                        {entry.mood_rating || 0}/5
                      </span>
                    </div>
                    <Slider
                      disabled={isFuture}
                      value={[entry.mood_rating || 0]}
                      max={5}
                      step={1}
                      onValueChange={(vals) =>
                        saveEntry({ mood_rating: vals[0] })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Energy Level
                      </Label>
                      <span className="text-[10px] font-black text-orange-500 uppercase">
                        {entry.energy_level || 0}/5
                      </span>
                    </div>
                    <Slider
                      disabled={isFuture}
                      value={[entry.energy_level || 0]}
                      max={5}
                      step={1}
                      onValueChange={(vals) =>
                        saveEntry({ energy_level: vals[0] })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        System Stress
                      </Label>
                      <span className="text-[10px] font-black text-red-500 uppercase">
                        {entry.stress_level || 0}/5
                      </span>
                    </div>
                    <Slider
                      disabled={isFuture}
                      value={[entry.stress_level || 0]}
                      max={5}
                      step={1}
                      onValueChange={(vals) =>
                        saveEntry({ stress_level: vals[0] })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Record Priority
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        val: 0,
                        label: "Normal",
                        color: "bg-zinc-100 text-zinc-600",
                      },
                      {
                        val: 1,
                        label: "High",
                        color: "bg-orange-100 text-orange-700",
                      },
                      {
                        val: 2,
                        label: "Critical",
                        color: "bg-red-100 text-red-700",
                      },
                    ].map((p) => (
                      <Button
                        key={p.val}
                        variant="ghost"
                        disabled={isFuture}
                        className={cn(
                          "h-10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                          entry.importance_level === p.val
                            ? p.color
                            : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                        )}
                        onClick={() => saveEntry({ importance_level: p.val })}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <History className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Audit Trail Active
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                    "Metadata integrity is critical for long-term pattern
                    recognition. Labels updated at{" "}
                    {new Date(entry.updated_at * 1000).toLocaleTimeString()}."
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-zinc-100 rounded-xl text-zinc-400"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Editor Surface */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden selection:bg-primary/10 bg-white">
        <div className="max-w-4xl mx-auto py-24 px-16 space-y-16">
          {/* Page Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                {entry.entry_date}
              </div>
              <div className="h-px bg-zinc-100 flex-1" />
              <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                Record ID: {entry.diary_entry_id.split("-")[0]}
              </div>
            </div>

            <input
              className="w-full text-7xl font-black tracking-tighter outline-none bg-transparent placeholder:text-zinc-100 text-zinc-900 leading-[0.9] uppercase"
              placeholder="Entry Point Title"
              defaultValue={entry.title || ""}
              disabled={isFuture}
              onBlur={(e) => {
                if (isFuture) return;
                saveEntry({ title: e.target.value });
              }}
            />
          </div>

          {/* Quick Context Tags */}
          <div className="flex gap-4 border-b border-zinc-50 pb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Smile className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {entry.mood_label || "Stable"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                E: {entry.energy_level || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Brain className="h-4 w-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                S: {entry.stress_level || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
              <Flag
                className={cn(
                  "h-4 w-4",
                  entry.importance_level === 2
                    ? "text-red-500"
                    : entry.importance_level === 1
                    ? "text-orange-500"
                    : "text-zinc-400"
                )}
              />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Priority
              </span>
            </div>
          </div>

          {/* Editor */}
          <div className="-mx-16 min-h-[500px]">
            <NocturneEditor
              initialContent={entry.content_json}
              onChange={handleEditorChange}
              editable={!isFuture}
            />
          </div>

          {/* Sub-pages section */}
          <div className="pt-20 border-t border-zinc-100 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                  Nested Chronicles
                </h3>
                <p className="text-xs font-medium text-zinc-500 mt-1">
                  Deep linking related sub-pages for this entry.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={createSubPage}
                className="h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl border-zinc-200 hover:bg-zinc-50 gap-2"
                disabled={isFuture}
              >
                <Plus className="h-4 w-4" />
                Add Nested Page
              </Button>
            </div>

            <div className="grid gap-3">
              {subPages.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl opacity-40">
                  <FileText className="h-8 w-8 text-zinc-300" />
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic text-center">
                    No hierarchy established <br /> for this entry point.
                  </div>
                </div>
              ) : (
                subPages.map((page) => (
                  <Link
                    key={page.diary_entry_id}
                    href={`/diary/editor?id=${page.diary_entry_id}`}
                    className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-zinc-100 hover:border-primary/20 hover:bg-primary/5 group transition-all"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover:border-primary/20 transition-colors">
                      <FileText className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-black tracking-tight text-zinc-900 uppercase group-hover:text-primary transition-colors">
                        {page.title || "Untitled Sub-page"}
                      </span>
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">
                        Captured at{" "}
                        {new Date(page.created_at * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-zinc-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DiaryEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black text-zinc-300 uppercase tracking-widest">
          Warping to stream...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
