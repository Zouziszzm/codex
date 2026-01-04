"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Target,
  Briefcase,
  BarChart3,
  Settings,
  Activity,
  Search,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const commands: CommandItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    keywords: ["dashboard", "home", "analytics", "overview"],
  },
  {
    id: "diary",
    title: "Diary",
    url: "/diary",
    icon: BookOpen,
    keywords: ["diary", "journal", "entries", "writing"],
  },
  {
    id: "goals",
    title: "Goals",
    url: "/goals",
    icon: Target,
    keywords: ["goals", "targets", "objectives", "tasks"],
  },
  {
    id: "habits",
    title: "Habits",
    url: "/habits",
    icon: Activity,
    keywords: ["habits", "routine", "tracking", "consistency"],
  },
  {
    id: "jobs",
    title: "Jobs",
    url: "/jobs",
    icon: Briefcase,
    keywords: ["jobs", "applications", "career", "interviews"],
  },
  {
    id: "settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
    keywords: ["settings", "preferences", "config", "profile"],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.keywords.some((keyword) =>
        keyword.toLowerCase().includes(search.toLowerCase())
      ) || cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Super/Windows key + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            router.push(filteredCommands[selectedIndex].url);
            setOpen(false);
            setSearch("");
            setSelectedIndex(0);
          }
        } else if (e.key === "Escape") {
          setOpen(false);
          setSearch("");
          setSelectedIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, filteredCommands, router]);

  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
    setSearch("");
    setSelectedIndex(0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="top"
        className="sm:max-w-2xl mx-auto top-20 rounded-2xl border shadow-2xl p-0"
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-zinc-400" />
            <Input
              placeholder="Search commands..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="border-0 focus-visible:ring-0 text-lg h-12 bg-transparent"
              autoFocus
            />
            <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-md text-xs font-medium text-zinc-500">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>
        <div className="p-2 max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              <p className="text-sm">No commands found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.url)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      index === selectedIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-zinc-50 text-zinc-700"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium">{cmd.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
