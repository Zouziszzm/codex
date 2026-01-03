/*
  # Recreate Goals Table with Comprehensive Field Set

  ## Overview
  This migration recreates the goals table with all fields as specified in goals.md.
  It includes identity, timing, measurement, milestones, dependencies, habits/tasks,
  analytics, motivation, rewards, context, UI controls, review, notifications, and audit fields.

  ## Tables
  - `goals` - Main goals table with 150+ fields
  - `goal_milestones` - Milestone definitions
  - `goal_dependencies` - Goal dependencies
  - `goal_habit_links` - Links between goals and habits
  - `goal_task_links` - Links between goals and tasks
  - `goal_reviews` - Historical reviews
*/

DROP TABLE IF EXISTS goals CASCADE;

CREATE TABLE goals (
  -- Core Identity
  goal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_slug text,
  goal_title text NOT NULL,
  goal_short_title text DEFAULT '',
  goal_description text DEFAULT '',
  goal_motivation_statement text DEFAULT '',
  goal_type text DEFAULT 'outcome',
  goal_category text DEFAULT '',
  goal_subcategory text DEFAULT '',
  goal_domain text DEFAULT '',
  goal_icon_emoji text DEFAULT '🎯',
  goal_color text DEFAULT '#3b82f6',
  goal_visibility text DEFAULT 'active',
  goal_status text DEFAULT 'not_started',
  goal_priority_level text DEFAULT 'medium',
  goal_importance_weight real DEFAULT 0.5,
  goal_urgency_level real DEFAULT 0.5,
  goal_confidence_score real DEFAULT 0.5,
  goal_version integer DEFAULT 1,
  
  -- Time & Lifecycle
  goal_created_date timestamptz DEFAULT now(),
  goal_start_date timestamptz,
  goal_target_date timestamptz,
  goal_end_date timestamptz,
  goal_deadline_type text DEFAULT 'soft',
  goal_time_horizon text DEFAULT 'medium',
  goal_review_frequency text DEFAULT 'weekly',
  goal_last_reviewed_at timestamptz,
  goal_next_review_at timestamptz,
  goal_time_zone text DEFAULT 'UTC',
  goal_is_time_bound integer DEFAULT 1,
  goal_days_remaining integer DEFAULT 0,
  goal_days_elapsed integer DEFAULT 0,
  goal_overdue_days integer DEFAULT 0,
  
  -- Measurement & Success
  success_metric_type text DEFAULT 'numeric',
  success_metric_unit text DEFAULT '',
  baseline_value real DEFAULT 0,
  current_value real DEFAULT 0,
  target_value real DEFAULT 0,
  minimum_success_value real DEFAULT 0,
  stretch_target_value real DEFAULT 0,
  max_allowed_value real DEFAULT 0,
  measurement_operator text DEFAULT '>=',
  progress_percentage real DEFAULT 0,
  progress_delta real DEFAULT 0,
  progress_velocity real DEFAULT 0,
  progress_acceleration real DEFAULT 0,
  progress_last_updated_at timestamptz,
  progress_is_on_track integer DEFAULT 1,
  progress_confidence_interval real DEFAULT 0.95,
  
  -- Milestones
  milestone_count integer DEFAULT 0,
  milestones_completed_count integer DEFAULT 0,
  milestone_completion_percentage real DEFAULT 0,
  milestone_required_order integer DEFAULT 0,
  milestone_dependency_mode text DEFAULT 'linear',
  next_milestone_id uuid,
  last_completed_milestone_id uuid,
  milestone_failure_policy text DEFAULT 'pause',
  milestone_auto_unlock integer DEFAULT 0,
  
  -- Dependencies & Unlocks
  blocked_by_goal_ids uuid[] DEFAULT ARRAY[]::uuid[],
  unlocks_goal_ids uuid[] DEFAULT ARRAY[]::uuid[],
  dependency_type text DEFAULT 'soft',
  dependency_strength_score real DEFAULT 0.5,
  unlock_condition_type text DEFAULT 'completion',
  unlock_threshold_value real DEFAULT 1.0,
  unlock_evaluation_frequency text DEFAULT 'daily',
  unlock_last_evaluated_at timestamptz,
  unlock_is_ready integer DEFAULT 0,
  unlock_auto_activate integer DEFAULT 1,
  
  -- Habit & Task Integration
  linked_habit_ids uuid[] DEFAULT ARRAY[]::uuid[],
  habit_completion_required integer DEFAULT 0,
  habit_progress_aggregate real DEFAULT 0,
  habit_dependency_mode text DEFAULT 'supporting',
  linked_task_ids uuid[] DEFAULT ARRAY[]::uuid[],
  task_completion_required integer DEFAULT 0,
  task_progress_aggregate real DEFAULT 0,
  task_dependency_mode text DEFAULT 'supporting',
  linked_diary_page_ids uuid[] DEFAULT ARRAY[]::uuid[],
  diary_reflection_required integer DEFAULT 0,
  
  -- Analytics & Derived
  completion_probability real DEFAULT 0.5,
  failure_probability real DEFAULT 0.5,
  burnout_risk_score real DEFAULT 0,
  confidence_trend text DEFAULT 'stable',
  consistency_index real DEFAULT 0,
  momentum_score real DEFAULT 0,
  volatility_score real DEFAULT 0,
  effort_to_reward_ratio real DEFAULT 1.0,
  expected_completion_date timestamptz,
  deviation_from_plan real DEFAULT 0,
  goal_health_status text DEFAULT 'unknown',
  risk_level text DEFAULT 'low',
  risk_factors text DEFAULT '',
  
  -- Motivation & Psychology
  motivation_type text DEFAULT 'intrinsic',
  motivation_reason text DEFAULT '',
  identity_alignment_score real DEFAULT 0.5,
  emotional_commitment_score real DEFAULT 0.5,
  resistance_level real DEFAULT 0,
  fear_factor real DEFAULT 0,
  reward_expectation text DEFAULT '',
  intrinsic_reward_description text DEFAULT '',
  extrinsic_reward_description text DEFAULT '',
  loss_aversion_enabled integer DEFAULT 0,
  temptation_resistance_score real DEFAULT 0.5,
  
  -- Rewards & Consequences
  reward_type text DEFAULT '',
  reward_value real DEFAULT 0,
  reward_currency text DEFAULT '',
  reward_trigger text DEFAULT '',
  reward_claimed integer DEFAULT 0,
  punishment_type text DEFAULT '',
  punishment_value real DEFAULT 0,
  punishment_trigger text DEFAULT '',
  consequence_enforced integer DEFAULT 0,
  consequence_notes text DEFAULT '',
  
  -- Context & Environment
  preferred_execution_context text DEFAULT '',
  preferred_time_of_day text DEFAULT '',
  preferred_location text DEFAULT '',
  required_resources text DEFAULT '',
  optional_resources text DEFAULT '',
  external_constraints text DEFAULT '',
  social_support_required integer DEFAULT 0,
  accountability_partner_id uuid,
  accountability_check_frequency text DEFAULT 'weekly',
  
  -- UI & Display
  display_order integer DEFAULT 0,
  display_group text DEFAULT '',
  display_section text DEFAULT '',
  display_hidden integer DEFAULT 0,
  display_show_progress integer DEFAULT 1,
  display_show_dependencies integer DEFAULT 1,
  display_show_habits integer DEFAULT 1,
  display_show_tasks integer DEFAULT 1,
  display_badge_type text DEFAULT 'standard',
  display_custom_label text DEFAULT '',
  
  -- Review & Reflection
  last_reflection_text text DEFAULT '',
  reflection_history jsonb DEFAULT '[]'::jsonb,
  reflection_sentiment_score real DEFAULT 0,
  lessons_learned text DEFAULT '',
  obstacles_encountered text DEFAULT '',
  strategy_adjustments text DEFAULT '',
  review_count integer DEFAULT 0,
  last_strategy_change_at timestamptz,
  
  -- Notifications & Alerts
  notification_enabled integer DEFAULT 1,
  notification_channels text[] DEFAULT ARRAY[]::text[],
  notification_schedule text DEFAULT '',
  notification_message text DEFAULT '',
  escalation_enabled integer DEFAULT 0,
  escalation_delay text DEFAULT '',
  escalation_last_triggered_at timestamptz,
  
  -- Audit & Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_viewed_at timestamptz,
  created_by_profile_id uuid DEFAULT auth.uid(),
  last_modified_by_profile_id uuid DEFAULT auth.uid(),
  device_id text DEFAULT '',
  session_id text DEFAULT '',
  app_version_created text DEFAULT '',
  app_version_last_modified text DEFAULT '',
  data_migration_version integer DEFAULT 1,
  
  -- Security & System
  encryption_key_id text DEFAULT '',
  content_hash text DEFAULT '',
  sync_state text DEFAULT 'synced',
  conflict_state text DEFAULT 'none',
  conflict_resolved_at timestamptz,
  is_system_generated integer DEFAULT 0,
  is_template integer DEFAULT 0,
  template_source text DEFAULT '',
  internal_flags jsonb DEFAULT '{}'::jsonb,
  experimental_fields jsonb DEFAULT '{}'::jsonb,
  
  -- Owner
  user_id uuid NOT NULL DEFAULT auth.uid()
);

CREATE TABLE goal_milestones (
  milestone_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  milestone_title text NOT NULL,
  milestone_description text DEFAULT '',
  milestone_order integer NOT NULL,
  milestone_target_value real,
  milestone_unit text DEFAULT '',
  milestone_start_date timestamptz,
  milestone_target_date timestamptz,
  milestone_completed_date timestamptz,
  milestone_status text DEFAULT 'pending',
  milestone_weight real DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

CREATE TABLE goal_dependencies (
  dependency_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  dependent_goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  dependency_type text DEFAULT 'hard',
  strength_score real DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  UNIQUE(parent_goal_id, dependent_goal_id)
);

CREATE TABLE goal_habit_links (
  link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  habit_id uuid NOT NULL,
  contribution_weight real DEFAULT 1.0,
  is_required integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

CREATE TABLE goal_task_links (
  link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  task_id uuid NOT NULL,
  is_required integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

CREATE TABLE goal_reviews (
  review_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(goal_id) ON DELETE CASCADE,
  review_date timestamptz DEFAULT now(),
  reflection_text text DEFAULT '',
  sentiment_score real DEFAULT 0,
  progress_at_review real,
  obstacles_noted text DEFAULT '',
  strategy_changes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_habit_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for goals
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for milestones
CREATE POLICY "Users can manage own goal milestones"
  ON goal_milestones FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for dependencies
CREATE POLICY "Users can manage own goal dependencies"
  ON goal_dependencies FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for habit links
CREATE POLICY "Users can manage own goal habit links"
  ON goal_habit_links FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for task links
CREATE POLICY "Users can manage own goal task links"
  ON goal_task_links FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Users can manage own goal reviews"
  ON goal_reviews FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(goal_status);
CREATE INDEX idx_goals_target_date ON goals(goal_target_date);
CREATE INDEX idx_goals_category ON goals(goal_category);
CREATE INDEX idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX idx_goal_dependencies_parent ON goal_dependencies(parent_goal_id);
CREATE INDEX idx_goal_dependencies_dependent ON goal_dependencies(dependent_goal_id);
CREATE INDEX idx_goal_habit_links_goal_id ON goal_habit_links(goal_id);
CREATE INDEX idx_goal_task_links_goal_id ON goal_task_links(goal_id);
CREATE INDEX idx_goal_reviews_goal_id ON goal_reviews(goal_id);
