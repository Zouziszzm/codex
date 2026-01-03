/*
  # Create User Settings Table

  ## Overview
  This migration creates the user_settings table for storing user preferences,
  workspace configuration, permissions, and system behavior defaults.

  ## New Tables
  - `user_settings`
    ### Identity & Workspace
    - `settings_id` (uuid, primary key) - Unique identifier
    - `user_id` (uuid, required) - Owner user ID
    - `workspace_id` (text) - Workspace identifier
    - `tenant_id` (text) - Tenant identifier
    - `access_scope` (text) - Access scope level

    ### Permissions
    - `read_permission_level` (text) - Read permission level
    - `write_permission_level` (text) - Write permission level
    - `delete_permission_level` (text) - Delete permission level
    - `share_permission_level` (text) - Share permission level
    - `inherit_permissions` (integer) - Boolean: inherit from parent
    - `permission_notes` (text) - Permission documentation

    ### Review & Lifecycle Defaults
    - `review_cycle_type` (text) - Type of review cycle
    - `review_cycle_interval` (text) - Interval duration
    - `lifecycle_expected_next_state` (text) - Expected next state

    ### System Behavior
    - `default_visibility` (text) - Default visibility for new items
    - `default_tags` (text[]) - Default tags
    - `archival_rules` (jsonb) - Rules for archiving
    - `audit_preferences` (jsonb) - Audit logging preferences

    ### System Fields
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on user_settings table
  - Add policies for authenticated users to manage their own settings
  - Each user can only have one settings record
*/

CREATE TABLE IF NOT EXISTS user_settings (
  settings_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity & Workspace
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid(),
  workspace_id text DEFAULT '',
  tenant_id text DEFAULT '',
  access_scope text DEFAULT 'personal',
  
  -- Permissions
  read_permission_level text DEFAULT 'owner',
  write_permission_level text DEFAULT 'owner',
  delete_permission_level text DEFAULT 'owner',
  share_permission_level text DEFAULT 'owner',
  inherit_permissions integer DEFAULT 0,
  permission_notes text DEFAULT '',
  
  -- Review & Lifecycle
  review_cycle_type text DEFAULT 'weekly',
  review_cycle_interval text DEFAULT '7 days',
  lifecycle_expected_next_state text DEFAULT '',
  
  -- System Behavior
  default_visibility text DEFAULT 'private',
  default_tags text[] DEFAULT ARRAY[]::text[],
  archival_rules jsonb DEFAULT '{}'::jsonb,
  audit_preferences jsonb DEFAULT '{}'::jsonb,
  
  -- System
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_settings_user_id ON user_settings(user_id);
