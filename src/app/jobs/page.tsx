"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { safeInvoke } from "@/lib/tauri";
import { useRouter } from "next/navigation";
import {
  Plus,
  Briefcase,
  Building2,
  DollarSign,
  ChevronRight,
  Search,
  Info,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast, ToastContainer } from "@/components/ui/toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface JobApplication {
  job_application_id: string;
  job_title: string;
  company_name: string;
  job_status: string;
  salary_min: number | null;
  salary_max: number | null;
  application_submitted_date: string | null;
  days_since_applied: number | null;
}

export default function JobsPage() {
  const router = useRouter();
  const { toast, toasts, removeToast } = useToast();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchJobs = useCallback(async () => {
    try {
      const data = await safeInvoke<JobApplication[]>("get_job_applications");
      setJobs(data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const analytics = useMemo(() => {
    const appliedCount = jobs.length;
    const inProgressCount = jobs.filter(
      (j) =>
        !["rejected", "withdrawn", "hired"].includes(j.job_status.toLowerCase())
    ).length;

    const frequencyData: { date: string; count: number }[] = []; // Remove mock frequency data

    return { appliedCount, inProgressCount, frequencyData };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || job.job_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "—";
    if (min && max)
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    return `$${((min || max || 0) / 1000).toFixed(0)}k+`;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Career Pipeline
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Opportunities
          </h1>
        </div>
        <Button
          onClick={async () => {
            try {
              const newJob = await safeInvoke<JobApplication>(
                "create_job_application",
                {
                  input: {
                    job_title: "New Opportunity",
                    company_name: "Strategic Organization",
                    job_level: "senior",
                    job_employment_type: "full_time",
                    job_work_mode: "remote",
                    job_posting_url: "https://example.com/careers",
                  },
                }
              );
              if (newJob) {
                toast({
                  title: "Application Logged",
                  description: "New pipeline entry established.",
                  variant: "success",
                });
                fetchJobs();
              } else {
                toast({
                  title: "Action Denied",
                  description:
                    "Job logging is restricted to the Tauri environment.",
                  variant: "destructive",
                });
              }
            } catch (err: unknown) {
              const errorMessage =
                err instanceof Error ? err.message : String(err);
              toast({
                title: "Logging Error",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
          className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
        >
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                Application Frequency
                <span className="text-xs font-normal text-zinc-400">
                  Submissions over past 14 days
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.frequencyData}>
                  <defs>
                    <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#18181b"
                        stopOpacity={0.05}
                      />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="count"
                    stroke="#18181b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorJob)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 grid gap-4 content-start">
          <Card className="border-zinc-100 shadow-none bg-zinc-50/20">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black">
                {analytics.appliedCount}
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-100 shadow-none bg-zinc-50/20">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-black text-blue-600">
                {analytics.inProgressCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 pt-8 border-t border-zinc-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search pipeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 h-10 border-zinc-100 bg-zinc-50/50">
            <SelectValue placeholder="Pipeline Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-xl border-zinc-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="w-12 text-center text-[10px] font-bold uppercase tracking-widest">
                No
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Role / Company
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Salary
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="w-10 text-[10px] font-bold uppercase tracking-widest">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center italic">
                  Retrieving career data...
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job, index) => (
                <TableRow
                  key={job.job_application_id}
                  className="group cursor-pointer hover:bg-zinc-50/80 transition-colors"
                  onClick={() => router.push(`/jobs/${job.job_application_id}`)}
                >
                  <TableCell className="text-center font-mono text-xs">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{job.job_title}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                        <Building2 className="h-2.5 w-2.5" />
                        {job.company_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-mono">
                      <DollarSign className="h-3 w-3" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        job.job_status === "offer"
                          ? "bg-green-100 text-green-700"
                          : job.job_status === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-700"
                      )}
                    >
                      {job.job_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
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
