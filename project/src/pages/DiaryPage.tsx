import { useState, useEffect } from 'react';
import { Plus, BookOpen, Flame, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Drawer } from '../components/Drawer';
import { FormField } from '../components/FormField';
import { SliderField } from '../components/SliderField';

interface DiaryEntry {
  diary_entry_id: string;
  title: string;
  entry_date: string;
  word_count: number;
  tag_names_cache: string[];
  children_count: number;
  mood_label: string;
}

interface DiaryFormData {
  title: string;
  entry_date: string;
  icon_emoji: string;
  color_label: string;
  semantic_type: string;
  intent_type: string;
  tag_ids: string;
  primary_category: string;
  secondary_categories: string;
  importance_level: string;
  confidence_level: number;
  mood_rating: number;
  energy_level: number;
  stress_level: number;
  sleep_quality: number;
  weather_type: string;
  location_text: string;
  social_context: string;
  linked_habit_ids: string;
  linked_goal_ids: string;
  linked_task_ids: string;
  linked_job_ids: string;
  date_locked: number;
  is_archived: number;
  is_counted_for_streak: number;
}

export function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DiaryFormData>({
    title: '',
    entry_date: new Date().toISOString().split('T')[0],
    icon_emoji: '📝',
    color_label: '',
    semantic_type: '',
    intent_type: '',
    tag_ids: '',
    primary_category: '',
    secondary_categories: '',
    importance_level: 'normal',
    confidence_level: 0.5,
    mood_rating: 0,
    energy_level: 0,
    stress_level: 0,
    sleep_quality: 0,
    weather_type: '',
    location_text: '',
    social_context: '',
    linked_habit_ids: '',
    linked_goal_ids: '',
    linked_task_ids: '',
    linked_job_ids: '',
    date_locked: 0,
    is_archived: 0,
    is_counted_for_streak: 1,
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('is_primary_page', 1)
      .order('entry_date', { ascending: false });

    if (!error && data) {
      setEntries(data as DiaryEntry[]);
    }
  };

  const updateField = <K extends keyof DiaryFormData>(
    field: K,
    value: DiaryFormData[K]
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
    const tagIds = formData.tag_ids
      ? formData.tag_ids.split(',').map((id) => id.trim())
      : [];
    const linkedHabitIds = formData.linked_habit_ids
      ? formData.linked_habit_ids.split(',').map((id) => id.trim())
      : [];
    const linkedGoalIds = formData.linked_goal_ids
      ? formData.linked_goal_ids.split(',').map((id) => id.trim())
      : [];
    const linkedTaskIds = formData.linked_task_ids
      ? formData.linked_task_ids.split(',').map((id) => id.trim())
      : [];
    const linkedJobIds = formData.linked_job_ids
      ? formData.linked_job_ids.split(',').map((id) => id.trim())
      : [];

    const { error } = await supabase.from('diary_entries').insert({
      entry_date: formData.entry_date,
      is_primary_page: 1,
      title: formData.title,
      icon_emoji: formData.icon_emoji,
      color_label: formData.color_label,
      semantic_type: formData.semantic_type,
      intent_type: formData.intent_type,
      primary_category: formData.primary_category,
      secondary_categories: formData.secondary_categories
        .split(',')
        .map((c) => c.trim()),
      importance_level: formData.importance_level,
      confidence_level: formData.confidence_level,
      mood_rating: formData.mood_rating,
      energy_level: formData.energy_level,
      stress_level: formData.stress_level,
      sleep_quality: formData.sleep_quality,
      weather_type: formData.weather_type,
      location_text: formData.location_text,
      social_context: formData.social_context,
      linked_habit_ids: linkedHabitIds,
      linked_goal_ids: linkedGoalIds,
      linked_task_ids: linkedTaskIds,
      linked_job_ids: linkedJobIds,
      date_locked: formData.date_locked,
      is_archived: formData.is_archived,
      is_counted_for_streak: formData.is_counted_for_streak,
      is_empty_entry: 1,
      length_category: 'empty',
    });

    if (!error) {
      await fetchEntries();
      setIsDrawerOpen(false);
      setCurrentStep(1);
      setFormData({
        title: '',
        entry_date: new Date().toISOString().split('T')[0],
        icon_emoji: '📝',
        color_label: '',
        semantic_type: '',
        intent_type: '',
        tag_ids: '',
        primary_category: '',
        secondary_categories: '',
        importance_level: 'normal',
        confidence_level: 0.5,
        mood_rating: 0,
        energy_level: 0,
        stress_level: 0,
        sleep_quality: 0,
        weather_type: '',
        location_text: '',
        social_context: '',
        linked_habit_ids: '',
        linked_goal_ids: '',
        linked_task_ids: '',
        linked_job_ids: '',
        date_locked: 0,
        is_archived: 0,
        is_counted_for_streak: 1,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
            <FormField
              label="Title"
              value={formData.title}
              onChange={(v) => updateField('title', v as string)}
            />
            <FormField
              label="Entry Date"
              value={formData.entry_date}
              onChange={(v) => updateField('entry_date', v as string)}
              type="date"
            />
            <FormField
              label="Icon Emoji"
              value={formData.icon_emoji}
              onChange={(v) => updateField('icon_emoji', v as string)}
            />
            <FormField
              label="Color Label"
              value={formData.color_label}
              onChange={(v) => updateField('color_label', v as string)}
            />
            <FormField
              label="Semantic Type"
              value={formData.semantic_type}
              onChange={(v) => updateField('semantic_type', v as string)}
            />
            <FormField
              label="Intent Type"
              value={formData.intent_type}
              onChange={(v) => updateField('intent_type', v as string)}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Classification</h3>
            <FormField
              label="Tags (comma-separated)"
              value={formData.tag_ids}
              onChange={(v) => updateField('tag_ids', v as string)}
            />
            <FormField
              label="Primary Category"
              value={formData.primary_category}
              onChange={(v) => updateField('primary_category', v as string)}
            />
            <FormField
              label="Secondary Categories (comma-separated)"
              value={formData.secondary_categories}
              onChange={(v) => updateField('secondary_categories', v as string)}
            />
            <FormField
              label="Importance Level"
              value={formData.importance_level}
              onChange={(v) => updateField('importance_level', v as string)}
            />
            <SliderField
              label="Confidence Level"
              value={formData.confidence_level}
              onChange={(v) => updateField('confidence_level', v)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Context</h3>
            <SliderField
              label="Mood Rating"
              value={formData.mood_rating}
              min={0}
              max={10}
              step={1}
            />
            <SliderField
              label="Energy Level"
              value={formData.energy_level}
              min={0}
              max={10}
              step={1}
            />
            <SliderField
              label="Stress Level"
              value={formData.stress_level}
              min={0}
              max={10}
              step={1}
            />
            <SliderField
              label="Sleep Quality"
              value={formData.sleep_quality}
              min={0}
              max={10}
              step={1}
            />
            <FormField
              label="Weather Type"
              value={formData.weather_type}
              onChange={(v) => updateField('weather_type', v as string)}
            />
            <FormField
              label="Location"
              value={formData.location_text}
              onChange={(v) => updateField('location_text', v as string)}
            />
            <FormField
              label="Social Context"
              value={formData.social_context}
              onChange={(v) => updateField('social_context', v as string)}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Relations</h3>
            <FormField
              label="Linked Habits (comma-separated)"
              value={formData.linked_habit_ids}
              onChange={(v) => updateField('linked_habit_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Linked Goals (comma-separated)"
              value={formData.linked_goal_ids}
              onChange={(v) => updateField('linked_goal_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Linked Tasks (comma-separated)"
              value={formData.linked_task_ids}
              onChange={(v) => updateField('linked_task_ids', v as string)}
              type="textarea"
            />
            <FormField
              label="Linked Jobs (comma-separated)"
              value={formData.linked_job_ids}
              onChange={(v) => updateField('linked_job_ids', v as string)}
              type="textarea"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Advanced</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.date_locked === 1}
                  onChange={(e) =>
                    updateField('date_locked', e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Lock Date
                </span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_archived === 1}
                  onChange={(e) =>
                    updateField('is_archived', e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Archive Entry
                </span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_counted_for_streak === 1}
                  onChange={(e) =>
                    updateField('is_counted_for_streak', e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Count for Streak
                </span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diary</h1>
            <p className="text-gray-600 mt-1">Daily reflections and thoughts</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Entries</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{entries.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Streak</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Year Progress</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">0%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Words
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mood
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.diary_entry_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {entry.title || 'Untitled'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.word_count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.tag_names_cache?.length || 0} tags
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.mood_label || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entries.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No diary entries yet. Start writing today.
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
        title="New Diary Entry"
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
                Create Entry
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
