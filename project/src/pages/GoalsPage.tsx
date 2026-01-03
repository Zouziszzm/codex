import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Target, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Drawer } from '../components/Drawer';
import { FormField } from '../components/FormField';
import { SliderField } from '../components/SliderField';

interface Goal {
  goal_id: string;
  goal_title: string;
  goal_description: string;
  current_value: number;
  target_value: number;
  success_metric_unit: string;
  milestone_completion_percentage: number;
  created_at: string;
  goal_status: string;
  progress_percentage: number;
}

interface GoalFormData {
  goal_title: string;
  goal_description: string;
  goal_category: string;
  goal_icon_emoji: string;
  goal_color: string;
  goal_priority_level: string;
  goal_start_date: string;
  goal_target_date: string;
  success_metric_type: string;
  target_value: number;
  success_metric_unit: string;
  milestone_ids: string;
  milestone_required_order: number;
  milestone_weight_distribution: string;
  prerequisite_goal_ids: string;
  unlocks_goal_ids: string;
  unlock_condition_type: string;
  unlock_threshold_value: number;
  linked_habit_ids: string;
  habit_contribution_weights: string;
  linked_task_ids: string;
  motivation_reason: string;
  reward_type: string;
  reward_value: number;
  punishment_type: string;
  goal_review_frequency: string;
  notification_enabled: number;
  display_hidden: number;
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GoalFormData>({
    goal_title: '',
    goal_description: '',
    goal_category: '',
    goal_icon_emoji: '🎯',
    goal_color: '#3b82f6',
    goal_priority_level: 'medium',
    goal_start_date: new Date().toISOString().split('T')[0],
    goal_target_date: '',
    success_metric_type: 'numeric',
    target_value: 0,
    success_metric_unit: '',
    milestone_ids: '',
    milestone_required_order: 0,
    milestone_weight_distribution: '',
    prerequisite_goal_ids: '',
    unlocks_goal_ids: '',
    unlock_condition_type: 'completion',
    unlock_threshold_value: 1.0,
    linked_habit_ids: '',
    habit_contribution_weights: '',
    linked_task_ids: '',
    motivation_reason: '',
    reward_type: '',
    reward_value: 0,
    punishment_type: '',
    goal_review_frequency: 'weekly',
    notification_enabled: 1,
    display_hidden: 0,
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGoals(data as Goal[]);
    }
  };

  const updateField = <K extends keyof GoalFormData>(
    field: K,
    value: GoalFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const blockedByGoalIds = formData.prerequisite_goal_ids
      ? formData.prerequisite_goal_ids.split(',').map((id) => id.trim())
      : [];
    const unlocksGoalIds = formData.unlocks_goal_ids
      ? formData.unlocks_goal_ids.split(',').map((id) => id.trim())
      : [];
    const linkedHabitIds = formData.linked_habit_ids
      ? formData.linked_habit_ids.split(',').map((id) => id.trim())
      : [];
    const linkedTaskIds = formData.linked_task_ids
      ? formData.linked_task_ids.split(',').map((id) => id.trim())
      : [];

    const { error } = await supabase.from('goals').insert({
      goal_title: formData.goal_title,
      goal_description: formData.goal_description,
      goal_category: formData.goal_category,
      goal_icon_emoji: formData.goal_icon_emoji,
      goal_color: formData.goal_color,
      goal_priority_level: formData.goal_priority_level,
      goal_start_date: formData.goal_start_date,
      goal_target_date: formData.goal_target_date,
      success_metric_type: formData.success_metric_type,
      target_value: formData.target_value,
      success_metric_unit: formData.success_metric_unit,
      blocked_by_goal_ids: blockedByGoalIds,
      unlocks_goal_ids: unlocksGoalIds,
      unlock_condition_type: formData.unlock_condition_type,
      unlock_threshold_value: formData.unlock_threshold_value,
      linked_habit_ids: linkedHabitIds,
      linked_task_ids: linkedTaskIds,
      motivation_reason: formData.motivation_reason,
      reward_type: formData.reward_type,
      reward_value: formData.reward_value,
      punishment_type: formData.punishment_type,
      goal_review_frequency: formData.goal_review_frequency,
      notification_enabled: formData.notification_enabled,
      display_hidden: formData.display_hidden,
      goal_status: 'not_started',
      progress_percentage: 0,
    });

    if (!error) {
      await fetchGoals();
      setIsDrawerOpen(false);
      setCurrentStep(1);
      setFormData({
        goal_title: '',
        goal_description: '',
        goal_category: '',
        goal_icon_emoji: '🎯',
        goal_color: '#3b82f6',
        goal_priority_level: 'medium',
        goal_start_date: new Date().toISOString().split('T')[0],
        goal_target_date: '',
        success_metric_type: 'numeric',
        target_value: 0,
        success_metric_unit: '',
        milestone_ids: '',
        milestone_required_order: 0,
        milestone_weight_distribution: '',
        prerequisite_goal_ids: '',
        unlocks_goal_ids: '',
        unlock_condition_type: 'completion',
        unlock_threshold_value: 1.0,
        linked_habit_ids: '',
        habit_contribution_weights: '',
        linked_task_ids: '',
        motivation_reason: '',
        reward_type: '',
        reward_value: 0,
        punishment_type: '',
        goal_review_frequency: 'weekly',
        notification_enabled: 1,
        display_hidden: 0,
      });

      await supabase.from('analytics_events').insert({
        event_type: 'goal_created',
        event_subtype: 'create',
        metric_name: 'goal_count',
        metric_value: 1,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Basics</h3>
            <FormField
              label="Goal Title"
              value={formData.goal_title}
              onChange={(v) => updateField('goal_title', v as string)}
              required
            />
            <FormField
              label="Description"
              value={formData.goal_description}
              onChange={(v) => updateField('goal_description', v as string)}
              type="textarea"
            />
            <FormField
              label="Category"
              value={formData.goal_category}
              onChange={(v) => updateField('goal_category', v as string)}
            />
            <FormField
              label="Icon Emoji"
              value={formData.goal_icon_emoji}
              onChange={(v) => updateField('goal_icon_emoji', v as string)}
            />
            <FormField
              label="Color"
              value={formData.goal_color}
              onChange={(v) => updateField('goal_color', v as string)}
            />
            <FormField
              label="Priority Level"
              value={formData.goal_priority_level}
              onChange={(v) => updateField('goal_priority_level', v as string)}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Time & Measurement</h3>
            <FormField
              label="Start Date"
              value={formData.goal_start_date}
              onChange={(v) => updateField('goal_start_date', v as string)}
              type="date"
            />
            <FormField
              label="Target Date"
              value={formData.goal_target_date}
              onChange={(v) => updateField('goal_target_date', v as string)}
              type="date"
            />
            <FormField
              label="Success Metric Type"
              value={formData.success_metric_type}
              onChange={(v) => updateField('success_metric_type', v as string)}
            />
            <FormField
              label="Target Value"
              value={formData.target_value}
              onChange={(v) => updateField('target_value', v as number)}
              type="number"
            />
            <FormField
              label="Metric Unit"
              value={formData.success_metric_unit}
              onChange={(v) => updateField('success_metric_unit', v as string)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Milestones</h3>
            <FormField
              label="Milestone IDs (comma-separated)"
              value={formData.milestone_ids}
              onChange={(v) => updateField('milestone_ids', v as string)}
            />
            <FormField
              label="Milestone Required Order"
              value={formData.milestone_required_order}
              onChange={(v) => updateField('milestone_required_order', v as number)}
              type="number"
            />
            <FormField
              label="Milestone Weight Distribution (JSON)"
              value={formData.milestone_weight_distribution}
              onChange={(v) => updateField('milestone_weight_distribution', v as string)}
              type="textarea"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Dependencies & Unlocks</h3>
            <FormField
              label="Prerequisite Goals (comma-separated IDs)"
              value={formData.prerequisite_goal_ids}
              onChange={(v) => updateField('prerequisite_goal_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Unlocks Goals (comma-separated IDs)"
              value={formData.unlocks_goal_ids}
              onChange={(v) => updateField('unlocks_goal_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Unlock Condition Type"
              value={formData.unlock_condition_type}
              onChange={(v) => updateField('unlock_condition_type', v as string)}
            />
            <FormField
              label="Unlock Threshold Value"
              value={formData.unlock_threshold_value}
              onChange={(v) => updateField('unlock_threshold_value', v as number)}
              type="number"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Habits & Tasks</h3>
            <FormField
              label="Linked Habits (comma-separated IDs)"
              value={formData.linked_habit_ids}
              onChange={(v) => updateField('linked_habit_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Habit Contribution Weights (JSON)"
              value={formData.habit_contribution_weights}
              onChange={(v) => updateField('habit_contribution_weights', v as string)}
              type="textarea"
            />
            <FormField
              label="Linked Tasks (comma-separated IDs)"
              value={formData.linked_task_ids}
              onChange={(v) => updateField('linked_task_ids', v as string)}
              type="textarea"
            />
          </div>
        );
      case 6:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Motivation & Rewards</h3>
            <FormField
              label="Motivation Reason"
              value={formData.motivation_reason}
              onChange={(v) => updateField('motivation_reason', v as string)}
              type="textarea"
            />
            <FormField
              label="Reward Type"
              value={formData.reward_type}
              onChange={(v) => updateField('reward_type', v as string)}
            />
            <FormField
              label="Reward Value"
              value={formData.reward_value}
              onChange={(v) => updateField('reward_value', v as number)}
              type="number"
            />
            <FormField
              label="Punishment Type"
              value={formData.punishment_type}
              onChange={(v) => updateField('punishment_type', v as string)}
            />
          </div>
        );
      case 7:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Advanced & Optional</h3>
            <FormField
              label="Review Frequency"
              value={formData.goal_review_frequency}
              onChange={(v) => updateField('goal_review_frequency', v as string)}
            />
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notification_enabled === 1}
                  onChange={(e) =>
                    updateField('notification_enabled', e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notifications Enabled
                </span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.display_hidden === 1}
                  onChange={(e) =>
                    updateField('display_hidden', e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Hide from Display
                </span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.goal_status === 'completed').length;
  const avgProgress = goals.length > 0
    ? goals.reduce((acc, g) => acc + (g.progress_percentage || 0), 0) / goals.length
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
            <p className="text-gray-600 mt-1">Long-term outcomes and intent</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Goals</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalGoals}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedGoals}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Avg Progress</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgProgress.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goal Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Milestone Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {goals.map((goal) => (
                  <tr key={goal.goal_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{goal.goal_title}</p>
                        {goal.goal_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {goal.goal_description.substring(0, 80)}...
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(goal.progress_percentage || 0, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {(goal.progress_percentage || 0).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {(goal.milestone_completion_percentage * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(goal.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {goals.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No goals yet. Create your first goal to get started.
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
        title="Create Goal"
      >
        {renderStep()}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Step {currentStep} of 7
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
            {currentStep < 7 ? (
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
                Create Goal
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
