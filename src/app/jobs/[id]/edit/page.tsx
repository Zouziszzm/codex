"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Briefcase,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  job_description: string | null;
  job_url: string | null;
}

function JobEditContent() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    job_status: "applied",
    job_level: "",
    job_work_mode: "",
    job_location_text: "",
    job_location_country: "",
    application_submitted_date: "",
    salary_min: "",
    salary_max: "",
    job_stage: "",
    job_description: "",
    job_url: "",
  });

  const fetchJob = useCallback(async () => {
    try {
      const data = await invoke<JobApplication>("get_job_application", {
        job_id: jobId,
      });
      setFormData({
        job_title: data.job_title || "",
        company_name: data.company_name || "",
        job_status: data.job_status || "applied",
        job_level: data.job_level || "",
        job_work_mode: data.job_work_mode || "",
        job_location_text: data.job_location_text || "",
        job_location_country: data.job_location_country || "",
        application_submitted_date: data.application_submitted_date || "",
        salary_min: data.salary_min?.toString() || "",
        salary_max: data.salary_max?.toString() || "",
        job_stage: data.job_stage || "",
        job_description: data.job_description || "",
        job_url: data.job_url || "",
      });
    } catch (err) {
      console.error("Failed to fetch job:", err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real implementation, you'd call an update_job command here
      // await invoke("update_job_application", { job_id: jobId, input: formData });
      alert("Update functionality coming soon - backend command needed");
      router.push(`/jobs/${jobId}`);
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse">
        Loading job details...
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
            <Link href={`/jobs/${jobId}`}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="text-xs text-zinc-500">Jobs</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
          <span className="truncate font-black text-zinc-900 uppercase text-[10px] tracking-widest">
            Edit Application
          </span>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-9 px-4 text-[10px] font-black uppercase tracking-widest"
        >
          <Save className="h-3 w-3 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="max-w-[1400px] mx-auto py-12 px-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">
              Edit Job Application
            </h1>
            <p className="text-zinc-500">
              Update the details of this job application
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) =>
                      setFormData({ ...formData, job_title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_status">Status</Label>
                  <Select
                    value={formData.job_status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job_status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_level">Level</Label>
                  <Select
                    value={formData.job_level}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job_level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_work_mode">Work Mode</Label>
                  <Select
                    value={formData.job_work_mode}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job_work_mode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job_location_text">Location</Label>
                  <Input
                    id="job_location_text"
                    value={formData.job_location_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        job_location_text: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_location_country">Country</Label>
                  <Input
                    id="job_location_country"
                    value={formData.job_location_country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        job_location_country: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Salary Min</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) =>
                      setFormData({ ...formData, salary_min: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Salary Max</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) =>
                      setFormData({ ...formData, salary_max: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_submitted_date">
                    Application Date
                  </Label>
                  <Input
                    id="application_submitted_date"
                    type="date"
                    value={formData.application_submitted_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        application_submitted_date: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job_stage">Stage</Label>
                <Input
                  id="job_stage"
                  value={formData.job_stage}
                  onChange={(e) =>
                    setFormData({ ...formData, job_stage: e.target.value })
                  }
                  placeholder="e.g., Phone Screen, Technical Interview"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_url">Job URL</Label>
                <Input
                  id="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={(e) =>
                    setFormData({ ...formData, job_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_description">Description</Label>
                <textarea
                  id="job_description"
                  className="w-full min-h-[200px] px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.job_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      job_description: e.target.value,
                    })
                  }
                  placeholder="Job description or notes..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function JobEditPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black text-zinc-300 uppercase tracking-widest">
          Loading...
        </div>
      }
    >
      <JobEditContent />
    </Suspense>
  );
}
