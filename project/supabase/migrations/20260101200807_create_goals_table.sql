/*
  # Create Goals Table

  ## Overview
  This migration creates the goals table for tracking long-term outcomes and intent.
  Each goal represents a desired outcome with comprehensive tracking of progress,
  strategy, risks, and alignment with user identity.

  ## New Tables
  - `goals`
    ### Identity & Meaning
    - `goal_id` (uuid, primary key) - Unique identifier for the goal
    - `goal_name` (text, required) - Name of the goal
    - `goal_description` (text) - Detailed description
    - `goal_type` (text) - Type classification
    - `goal_horizon` (text) - Time horizon (short/medium/long term)
    - `goal_timescale` (text) - Specific timescale
    - `goal_scope` (text) - Scope of the goal
    - `goal_abstraction_level` (text) - Level of abstraction
    - `identity_relevance` (real) - How relevant to user identity (0-1)
    - `existential_weight` (real) - Existential importance (0-1)
    - `goal_story` (text) - Narrative context

    ### Success Definition & Progress
    - `success_definition` (text) - What success looks like
    - `progress_metric_name` (text) - Name of progress metric
    - `progress_current_value` (real) - Current progress value
    - `progress_target_value` (real) - Target value
    - `progress_unit` (text) - Unit of measurement
    - `progress_confidence` (real) - Confidence in progress (0-1)
    - `progress_velocity` (real) - Rate of progress
    - `progress_volatility` (real) - Volatility of progress
    - `milestones` (jsonb) - Milestone definitions
    - `milestone_completion_rate` (real) - Completion percentage

    ### Strategy & Support
    - `supporting_habits` (text[]) - Related habit IDs
    - `supporting_tasks` (text[]) - Related task IDs
    - `conflicting_goals` (text[]) - Conflicting goal IDs
    - `resource_requirements` (text) - Required resources
    - `strategy_notes` (text) - Strategy documentation

    ### Risk & Mitigation
    - `risk_factors` (text) - Identified risks
    - `risk_probability` (real) - Probability of risk (0-1)
    - `risk_impact` (real) - Impact severity (0-1)
    - `mitigation_strategies` (text) - Mitigation plans
    - `fallback_goals` (text) - Alternative goals

    ### Meta & System
    - `tags` (text[]) - Categorization tags
    - `labels` (text[]) - Additional labels
    - `confidence_level` (real) - Overall confidence (0-1)
    - `review_status` (text) - Review state
    - `review_notes` (text) - Review documentation
    - `notes` (text) - General notes
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp
    - `user_id` (uuid) - Owner user ID

  ## Security
  - Enable RLS on goals table
  - Add policy for authenticated users to manage their own goals
*/

CREATE TABLE IF NOT EXISTS goals (
  goal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity & Meaning
  goal_name text NOT NULL,
  goal_description text DEFAULT '',
  goal_type text DEFAULT '',
  goal_horizon text DEFAULT '',
  goal_timescale text DEFAULT '',
  goal_scope text DEFAULT '',
  goal_abstraction_level text DEFAULT '',
  identity_relevance real DEFAULT 0.5,
  existential_weight real DEFAULT 0.5,
  goal_story text DEFAULT '',
  
  -- Success Definition & Progress
  success_definition text DEFAULT '',
  progress_metric_name text DEFAULT '',
  progress_current_value real DEFAULT 0,
  progress_target_value real DEFAULT 0,
  progress_unit text DEFAULT '',
  progress_confidence real DEFAULT 0.5,
  progress_velocity real DEFAULT 0,
  progress_volatility real DEFAULT 0,
  milestones jsonb DEFAULT '[]'::jsonb,
  milestone_completion_rate real DEFAULT 0,
  
  -- Strategy & Support
  supporting_habits text[] DEFAULT ARRAY[]::text[],
  supporting_tasks text[] DEFAULT ARRAY[]::text[],
  conflicting_goals text[] DEFAULT ARRAY[]::text[],
  resource_requirements text DEFAULT '',
  strategy_notes text DEFAULT '',
  
  -- Risk & Mitigation
  risk_factors text DEFAULT '',
  risk_probability real DEFAULT 0,
  risk_impact real DEFAULT 0,
  mitigation_strategies text DEFAULT '',
  fallback_goals text DEFAULT '',
  
  -- Meta & System
  tags text[] DEFAULT ARRAY[]::text[],
  labels text[] DEFAULT ARRAY[]::text[],
  confidence_level real DEFAULT 0.5,
  review_status text DEFAULT 'draft',
  review_notes text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_tags ON goals USING gin(tags);
