"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Plus,
  Briefcase,
  ExternalLink,
  Building2,
  MapPin,
  Search,
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

interface JobApplication {
  job_application_id: string;
  job_title: string;
  company_name: string;
  job_status: string;
  job_level: string | null;
  job_work_mode: string | null;
  job_location_text: string | null;
  job_posting_url: string | null;
  application_submitted_date: string | null;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    job_level: "mid",
    job_employment_type: "full_time",
    job_work_mode: "hybrid",
    job_posting_url: "",
  });

  const fetchJobs = async () => {
    try {
      const data = await invoke<JobApplication[]>("get_job_applications");
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("create_job_application", {
        input: {
          ...formData,
          job_level: formData.job_level || null,
          job_employment_type: formData.job_employment_type || null,
          job_work_mode: formData.job_work_mode || null,
          job_posting_url: formData.job_posting_url || null,
        },
      });
      setIsOpen(false);
      fetchJobs();
    } catch (err) {
      console.error("Failed to create job application:", err);
    }
  };

  const activeJobs = jobs.filter((j) =>
    ["applied", "interviewing", "offer"].includes(j.job_status)
  ).length;
  const interviewingJobs = jobs.filter(
    (j) => j.job_status === "interviewing"
  ).length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Job Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Career pipeline and application status
          </p>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Job Application</SheetTitle>
              <SheetDescription>
                Track a new career opportunity.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.job_title}
                  onChange={(e) =>
                    setFormData({ ...formData, job_title: e.target.value })
                  }
                  placeholder="Software Engineer..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  required
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  placeholder="Acme Corp..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.job_level}
                    onValueChange={(v) =>
                      setFormData({ ...formData, job_level: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select
                    value={formData.job_work_mode}
                    onValueChange={(v) =>
                      setFormData({ ...formData, job_work_mode: v })
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Posting URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.job_posting_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      job_posting_url: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/jobs/..."
                />
              </div>
              <Button type="submit" className="w-full">
                Track Application
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
            <Search className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewingJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job & Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading applications...
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No job applications tracked. Start your search today.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.job_application_id}>
                  <TableCell>
                    <div className="font-medium">{job.job_title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {job.company_name}
                      {job.job_level && <span>• {job.job_level}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize 
                      ${
                        job.job_status === "offer"
                          ? "bg-green-100 text-green-800"
                          : job.job_status === "interviewing"
                          ? "bg-blue-100 text-blue-800"
                          : job.job_status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.job_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.job_location_text ||
                        job.job_work_mode ||
                        "Not specified"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {job.application_submitted_date
                      ? new Date(
                          job.application_submitted_date
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {job.job_posting_url && (
                      <a
                        href={job.job_posting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
