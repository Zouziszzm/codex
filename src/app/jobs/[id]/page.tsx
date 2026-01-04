"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  MoreVertical,
  Edit,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Building2,
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

interface JobApplication {
  job_application_id: string;
  job_title: string;
  company_name: string;
  job_status: string;
  job_level: string | null;
  job_work_mode: string | null;
  job_location_text: string | null;
  job_location_country: string | null;
  application_submitted_date: string | null;
  salary_min: number | null;
  salary_max: number | null;
  job_stage: string | null;
  days_since_applied: number | null;
  job_pipeline_health_status: string | null;
  job_description: string | null;
  job_url: string | null;
  updated_at: number;
  created_at: number;
}

function JobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = useCallback(async () => {
    try {
      const data = await invoke<JobApplication>("get_job_application", {
        job_id: jobId,
      });
      setJob(data);
    } catch (err) {
      console.error("Failed to fetch job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-20 text-center text-destructive font-bold">
        404: Job application not found
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    applied: "bg-blue-100 text-blue-800",
    interviewing: "bg-purple-100 text-purple-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

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
            <Link href="/jobs">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="text-xs text-zinc-500">Jobs</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="truncate font-black text-zinc-900 uppercase text-[10px] tracking-widest">
            {job.job_title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest"
            onClick={() => router.push(`/jobs/${jobId}/edit`)}
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
                <SheetTitle>Job Information</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(job.created_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(job.updated_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Days Since Applied
                  </p>
                  <p className="text-sm font-medium">
                    {job.days_since_applied ?? "N/A"}
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
                <SheetTitle>Job Options</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Duplicate Application
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  Delete Application
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="max-w-4xl mx-auto py-12 px-8 space-y-8">
          {/* Job Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                    {job.job_title}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Building2 className="h-4 w-4" />
                  <span className="text-lg font-medium">
                    {job.company_name}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  statusColors[job.job_status] || "bg-gray-100 text-gray-800"
                )}
              >
                {job.job_status}
              </span>
            </div>
          </div>

          <Separator />

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {job.job_location_text || "Not specified"}
                </p>
                {job.job_location_country && (
                  <p className="text-sm text-zinc-500 mt-1">
                    {job.job_location_country}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Application Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {job.application_submitted_date
                    ? new Date(
                        job.application_submitted_date
                      ).toLocaleDateString()
                    : "Not specified"}
                </p>
                {job.days_since_applied !== null && (
                  <p className="text-sm text-zinc-500 mt-1">
                    {job.days_since_applied} days ago
                  </p>
                )}
              </CardContent>
            </Card>

            {job.salary_min && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Salary Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">
                    ${job.salary_min.toLocaleString()}
                    {job.salary_max && ` - $${job.salary_max.toLocaleString()}`}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {job.job_level && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Level
                    </p>
                    <p className="text-sm font-medium">{job.job_level}</p>
                  </div>
                )}
                {job.job_work_mode && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Work Mode
                    </p>
                    <p className="text-sm font-medium">{job.job_work_mode}</p>
                  </div>
                )}
                {job.job_stage && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Stage
                    </p>
                    <p className="text-sm font-medium">{job.job_stage}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {job.job_description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-700 whitespace-pre-wrap">
                  {job.job_description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Job URL */}
          {job.job_url && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(job.job_url!, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Job Posting
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black text-zinc-300 uppercase tracking-widest">
          Loading job...
        </div>
      }
    >
      <JobDetailContent />
    </Suspense>
  );
}
