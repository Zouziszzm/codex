import { useState, useEffect } from 'react';
import { Plus, Briefcase, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Drawer } from '../components/Drawer';
import { FormField } from '../components/FormField';
import { SliderField } from '../components/SliderField';

interface CareerApplication {
  application_id: string;
  company_name: string;
  role_title: string;
  status: string;
  application_date: string;
  offer_received: number;
  rejection_received: number;
}

interface ApplicationFormData {
  company_name: string;
  company_industry: string;
  company_size: string;
  role_title: string;
  role_level: string;
  role_type: string;
  role_location: string;
  remote_policy: string;
  compensation_band: string;
  currency: string;
  application_date: string;
  application_channel: string;
  application_source: string;
  referral_used: number;
  resume_version_id: string;
  cover_letter_version_id: string;
  portfolio_version_id: string;
  screening_completed: number;
  interview_rounds_planned: number;
  interview_rounds_completed: number;
  offer_received: number;
  offer_details: string;
  decision_deadline: string;
  decision_made: number;
  rejection_received: number;
  rejection_reason: string;
  feedback_received: string;
  lessons_learned: string;
  emotional_impact: string;
  career_alignment_score: number;
  status: string;
}

export function JobsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    company_name: '',
    company_industry: '',
    company_size: '',
    role_title: '',
    role_level: '',
    role_type: '',
    role_location: '',
    remote_policy: '',
    compensation_band: '',
    currency: 'USD',
    application_date: new Date().toISOString().split('T')[0],
    application_channel: '',
    application_source: '',
    referral_used: 0,
    resume_version_id: '',
    cover_letter_version_id: '',
    portfolio_version_id: '',
    screening_completed: 0,
    interview_rounds_planned: 0,
    interview_rounds_completed: 0,
    offer_received: 0,
    offer_details: '',
    decision_deadline: '',
    decision_made: 0,
    rejection_received: 0,
    rejection_reason: '',
    feedback_received: '',
    lessons_learned: '',
    emotional_impact: '',
    career_alignment_score: 0.5,
    status: 'applied',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('application_date', { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
  };

  const updateField = <K extends keyof ApplicationFormData>(
    field: K,
    value: ApplicationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from('career_applications').insert(formData);

    if (!error) {
      await fetchApplications();
      setIsDrawerOpen(false);
      setCurrentStep(1);
      setFormData({
        company_name: '',
        company_industry: '',
        company_size: '',
        role_title: '',
        role_level: '',
        role_type: '',
        role_location: '',
        remote_policy: '',
        compensation_band: '',
        currency: 'USD',
        application_date: new Date().toISOString().split('T')[0],
        application_channel: '',
        application_source: '',
        referral_used: 0,
        resume_version_id: '',
        cover_letter_version_id: '',
        portfolio_version_id: '',
        screening_completed: 0,
        interview_rounds_planned: 0,
        interview_rounds_completed: 0,
        offer_received: 0,
        offer_details: '',
        decision_deadline: '',
        decision_made: 0,
        rejection_received: 0,
        rejection_reason: '',
        feedback_received: '',
        lessons_learned: '',
        emotional_impact: '',
        career_alignment_score: 0.5,
        status: 'applied',
      });

      await supabase.from('analytics_events').insert({
        event_type: 'application_created',
        event_subtype: 'create',
        metric_name: 'application_count',
        metric_value: 1,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Company & Role</h3>
            <FormField
              label="Company Name"
              value={formData.company_name}
              onChange={(v) => updateField('company_name', v as string)}
              required
            />
            <FormField
              label="Company Industry"
              value={formData.company_industry}
              onChange={(v) => updateField('company_industry', v as string)}
            />
            <FormField
              label="Company Size"
              value={formData.company_size}
              onChange={(v) => updateField('company_size', v as string)}
            />
            <FormField
              label="Role Title"
              value={formData.role_title}
              onChange={(v) => updateField('role_title', v as string)}
              required
            />
            <FormField
              label="Role Level"
              value={formData.role_level}
              onChange={(v) => updateField('role_level', v as string)}
            />
            <FormField
              label="Role Type"
              value={formData.role_type}
              onChange={(v) => updateField('role_type', v as string)}
            />
            <FormField
              label="Role Location"
              value={formData.role_location}
              onChange={(v) => updateField('role_location', v as string)}
            />
            <FormField
              label="Remote Policy"
              value={formData.remote_policy}
              onChange={(v) => updateField('remote_policy', v as string)}
            />
            <FormField
              label="Compensation Band"
              value={formData.compensation_band}
              onChange={(v) => updateField('compensation_band', v as string)}
            />
            <FormField
              label="Currency"
              value={formData.currency}
              onChange={(v) => updateField('currency', v as string)}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>
            <FormField
              label="Application Date"
              value={formData.application_date}
              onChange={(v) => updateField('application_date', v as string)}
              type="date"
            />
            <FormField
              label="Application Channel"
              value={formData.application_channel}
              onChange={(v) => updateField('application_channel', v as string)}
            />
            <FormField
              label="Application Source"
              value={formData.application_source}
              onChange={(v) => updateField('application_source', v as string)}
            />
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.referral_used === 1}
                  onChange={(e) => updateField('referral_used', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Referral Used</span>
              </label>
            </div>
            <FormField
              label="Resume Version ID"
              value={formData.resume_version_id}
              onChange={(v) => updateField('resume_version_id', v as string)}
            />
            <FormField
              label="Cover Letter Version ID"
              value={formData.cover_letter_version_id}
              onChange={(v) => updateField('cover_letter_version_id', v as string)}
            />
            <FormField
              label="Portfolio Version ID"
              value={formData.portfolio_version_id}
              onChange={(v) => updateField('portfolio_version_id', v as string)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Interview Pipeline</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.screening_completed === 1}
                  onChange={(e) => updateField('screening_completed', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Screening Completed</span>
              </label>
            </div>
            <FormField
              label="Interview Rounds Planned"
              value={formData.interview_rounds_planned}
              onChange={(v) => updateField('interview_rounds_planned', v as number)}
              type="number"
            />
            <FormField
              label="Interview Rounds Completed"
              value={formData.interview_rounds_completed}
              onChange={(v) => updateField('interview_rounds_completed', v as number)}
              type="number"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Outcome & Decision</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.offer_received === 1}
                  onChange={(e) => updateField('offer_received', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Offer Received</span>
              </label>
            </div>
            <FormField
              label="Offer Details"
              value={formData.offer_details}
              onChange={(v) => updateField('offer_details', v as string)}
              type="textarea"
            />
            <FormField
              label="Decision Deadline"
              value={formData.decision_deadline}
              onChange={(v) => updateField('decision_deadline', v as string)}
              type="date"
            />
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.decision_made === 1}
                  onChange={(e) => updateField('decision_made', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Decision Made</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rejection_received === 1}
                  onChange={(e) => updateField('rejection_received', e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Rejection Received</span>
              </label>
            </div>
            <FormField
              label="Rejection Reason"
              value={formData.rejection_reason}
              onChange={(v) => updateField('rejection_reason', v as string)}
              type="textarea"
            />
            <FormField
              label="Feedback Received"
              value={formData.feedback_received}
              onChange={(v) => updateField('feedback_received', v as string)}
              type="textarea"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Reflection & Alignment</h3>
            <FormField
              label="Lessons Learned"
              value={formData.lessons_learned}
              onChange={(v) => updateField('lessons_learned', v as string)}
              type="textarea"
            />
            <FormField
              label="Emotional Impact"
              value={formData.emotional_impact}
              onChange={(v) => updateField('emotional_impact', v as string)}
              type="textarea"
            />
            <SliderField
              label="Career Alignment Score"
              value={formData.career_alignment_score}
              onChange={(v) => updateField('career_alignment_score', v)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const statusGroups = {
    applied: applications.filter((a) => a.status === 'applied' && !a.offer_received && !a.rejection_received),
    interviewing: applications.filter((a) => a.status === 'interviewing'),
    offered: applications.filter((a) => a.offer_received === 1),
    rejected: applications.filter((a) => a.rejection_received === 1),
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Pipeline</h1>
            <p className="text-gray-600 mt-1">Job applications and interview tracking</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Application
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Applied</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusGroups.applied.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Interviewing</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusGroups.interviewing.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Offered</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusGroups.offered.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Rejected</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusGroups.rejected.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.company_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{app.role_title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          app.offer_received
                            ? 'bg-green-100 text-green-800'
                            : app.rejection_received
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'interviewing'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.offer_received
                          ? 'Offered'
                          : app.rejection_received
                          ? 'Rejected'
                          : app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.application_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No applications yet. Create your first application to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentStep(1);
        }}
        title="New Job Application"
      >
        {renderStep()}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Step {currentStep} of 5
          </div>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Application
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
