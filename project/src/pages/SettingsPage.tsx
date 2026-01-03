import { useState, useEffect } from 'react';
import { Save, User, Shield, Clock, Sliders } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FormField } from '../components/FormField';

interface UserSettings {
  settings_id?: string;
  workspace_id: string;
  tenant_id: string;
  access_scope: string;
  read_permission_level: string;
  write_permission_level: string;
  delete_permission_level: string;
  share_permission_level: string;
  inherit_permissions: number;
  permission_notes: string;
  review_cycle_type: string;
  review_cycle_interval: string;
  lifecycle_expected_next_state: string;
  default_visibility: string;
  default_tags: string;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    workspace_id: '',
    tenant_id: '',
    access_scope: 'personal',
    read_permission_level: 'owner',
    write_permission_level: 'owner',
    delete_permission_level: 'owner',
    share_permission_level: 'owner',
    inherit_permissions: 0,
    permission_notes: '',
    review_cycle_type: 'weekly',
    review_cycle_interval: '7 days',
    lifecycle_expected_next_state: '',
    default_visibility: 'private',
    default_tags: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .maybeSingle();

    if (!error && data) {
      setSettings({
        settings_id: data.settings_id,
        workspace_id: data.workspace_id,
        tenant_id: data.tenant_id,
        access_scope: data.access_scope,
        read_permission_level: data.read_permission_level,
        write_permission_level: data.write_permission_level,
        delete_permission_level: data.delete_permission_level,
        share_permission_level: data.share_permission_level,
        inherit_permissions: data.inherit_permissions,
        permission_notes: data.permission_notes,
        review_cycle_type: data.review_cycle_type,
        review_cycle_interval: data.review_cycle_interval,
        lifecycle_expected_next_state: data.lifecycle_expected_next_state,
        default_visibility: data.default_visibility,
        default_tags: data.default_tags.join(', '),
      });
    }
  };

  const updateField = <K extends keyof UserSettings>(
    field: K,
    value: UserSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    const tagsArray = settings.default_tags
      ? settings.default_tags.split(',').map((t) => t.trim())
      : [];

    const settingsData = {
      ...settings,
      default_tags: tagsArray,
    };

    if (settings.settings_id) {
      const { error } = await supabase
        .from('user_settings')
        .update(settingsData)
        .eq('settings_id', settings.settings_id);

      if (!error) {
        setSaveMessage('Settings saved successfully');
      } else {
        setSaveMessage('Error saving settings');
      }
    } else {
      const { error } = await supabase.from('user_settings').insert(settingsData);

      if (!error) {
        setSaveMessage('Settings created successfully');
        await fetchSettings();
      } else {
        setSaveMessage('Error creating settings');
      }
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your workspace and preferences</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Identity & Workspace</h2>
            </div>
            <div className="space-y-4">
              <FormField
                label="Workspace ID"
                value={settings.workspace_id}
                onChange={(v) => updateField('workspace_id', v as string)}
              />
              <FormField
                label="Tenant ID"
                value={settings.tenant_id}
                onChange={(v) => updateField('tenant_id', v as string)}
              />
              <FormField
                label="Access Scope"
                value={settings.access_scope}
                onChange={(v) => updateField('access_scope', v as string)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Permissions</h2>
            </div>
            <div className="space-y-4">
              <FormField
                label="Read Permission Level"
                value={settings.read_permission_level}
                onChange={(v) => updateField('read_permission_level', v as string)}
              />
              <FormField
                label="Write Permission Level"
                value={settings.write_permission_level}
                onChange={(v) => updateField('write_permission_level', v as string)}
              />
              <FormField
                label="Delete Permission Level"
                value={settings.delete_permission_level}
                onChange={(v) => updateField('delete_permission_level', v as string)}
              />
              <FormField
                label="Share Permission Level"
                value={settings.share_permission_level}
                onChange={(v) => updateField('share_permission_level', v as string)}
              />
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.inherit_permissions === 1}
                    onChange={(e) =>
                      updateField('inherit_permissions', e.target.checked ? 1 : 0)
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Inherit Permissions
                  </span>
                </label>
              </div>
              <FormField
                label="Permission Notes"
                value={settings.permission_notes}
                onChange={(v) => updateField('permission_notes', v as string)}
                type="textarea"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Review & Lifecycle Defaults
              </h2>
            </div>
            <div className="space-y-4">
              <FormField
                label="Review Cycle Type"
                value={settings.review_cycle_type}
                onChange={(v) => updateField('review_cycle_type', v as string)}
              />
              <FormField
                label="Review Cycle Interval"
                value={settings.review_cycle_interval}
                onChange={(v) => updateField('review_cycle_interval', v as string)}
              />
              <FormField
                label="Lifecycle Expected Next State"
                value={settings.lifecycle_expected_next_state}
                onChange={(v) => updateField('lifecycle_expected_next_state', v as string)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sliders className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">System Behavior</h2>
            </div>
            <div className="space-y-4">
              <FormField
                label="Default Visibility"
                value={settings.default_visibility}
                onChange={(v) => updateField('default_visibility', v as string)}
              />
              <FormField
                label="Default Tags (comma-separated)"
                value={settings.default_tags}
                onChange={(v) => updateField('default_tags', v as string)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            {saveMessage && (
              <span
                className={`text-sm font-medium ${
                  saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
