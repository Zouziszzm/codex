/*
  # Create Diary Tables with Comprehensive Field Set

  ## Overview
  Creates diary entry tables with all fields from diary.md specification.
  Supports hierarchical page structure, rich content, mood tracking,
  cross-domain linking, and analytics.

  ## Tables
  - `diary_entries` - Main diary entries (pages)
  - `diary_tags` - Tag definitions
  - `diary_entry_tags` - Join table for entry-tag relationships
  - `diary_entry_relations` - Parent-child relationships
  - `diary_entry_links` - Cross-domain links (habits, goals, jobs)
*/

CREATE TABLE diary_entries (
  -- Core Identity & Date
  diary_entry_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL,
  entry_year integer,
  entry_month integer,
  entry_day integer,
  entry_week_of_year integer,
  entry_day_of_week text,
  is_primary_page integer DEFAULT 1,
  primary_page_id uuid,
  is_auto_created integer DEFAULT 0,
  auto_creation_reason text DEFAULT '',
  calendar_type text DEFAULT 'gregorian',
  timezone_at_creation text DEFAULT 'UTC',
  date_locked integer DEFAULT 0,
  date_last_validated_at timestamptz,
  
  -- Hierarchy & Tree
  parent_page_id uuid,
  root_page_id uuid,
  page_depth integer DEFAULT 0,
  page_path text DEFAULT '',
  page_sort_index integer DEFAULT 0,
  page_position_type text DEFAULT 'child',
  has_children integer DEFAULT 0,
  children_count integer DEFAULT 0,
  descendant_count integer DEFAULT 0,
  is_collapsed_by_default integer DEFAULT 0,
  is_archived integer DEFAULT 0,
  is_deleted integer DEFAULT 0,
  deleted_at timestamptz,
  deleted_reason text DEFAULT '',
  restore_parent_id uuid,
  tree_version integer DEFAULT 1,
  
  -- Content Core
  title text DEFAULT '',
  title_plaintext text DEFAULT '',
  content_json jsonb DEFAULT 'null'::jsonb,
  content_plaintext text DEFAULT '',
  content_html_cache text DEFAULT '',
  block_count integer DEFAULT 0,
  paragraph_count integer DEFAULT 0,
  heading_count integer DEFAULT 0,
  list_count integer DEFAULT 0,
  code_block_count integer DEFAULT 0,
  table_count integer DEFAULT 0,
  toggle_count integer DEFAULT 0,
  embed_count integer DEFAULT 0,
  inline_comment_count integer DEFAULT 0,
  content_schema_version text DEFAULT '1.0',
  last_block_edit_at timestamptz,
  
  -- Writing Metrics
  word_count integer DEFAULT 0,
  character_count integer DEFAULT 0,
  sentence_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 0,
  writing_time_seconds integer DEFAULT 0,
  revision_count integer DEFAULT 0,
  avg_words_per_paragraph real DEFAULT 0,
  is_empty_entry integer DEFAULT 1,
  length_category text DEFAULT 'empty',
  length_score real DEFAULT 0,
  last_length_change_at timestamptz,
  
  -- Tags & Classification
  tag_count integer DEFAULT 0,
  tag_names_cache text[] DEFAULT ARRAY[]::text[],
  primary_category text DEFAULT '',
  secondary_categories text[] DEFAULT ARRAY[]::text[],
  semantic_type text DEFAULT '',
  custom_labels jsonb DEFAULT '{}'::jsonb,
  color_label text DEFAULT '',
  icon_emoji text DEFAULT '📝',
  importance_level text DEFAULT 'normal',
  confidence_level real DEFAULT 0.5,
  intent_type text DEFAULT '',
  
  -- Mood & Context
  mood_rating integer DEFAULT 0,
  mood_label text DEFAULT '',
  energy_level integer DEFAULT 0,
  stress_level integer DEFAULT 0,
  sleep_quality integer DEFAULT 0,
  weather_type text DEFAULT '',
  weather_temperature real,
  location_text text DEFAULT '',
  location_lat real,
  location_lng real,
  social_context text DEFAULT '',
  health_context_notes text DEFAULT '',
  gratitude_items jsonb DEFAULT '[]'::jsonb,
  
  -- Cross-Domain Relations
  linked_habit_ids uuid[] DEFAULT ARRAY[]::uuid[],
  completed_habit_ids uuid[] DEFAULT ARRAY[]::uuid[],
  linked_goal_ids uuid[] DEFAULT ARRAY[]::uuid[],
  progressed_goal_ids uuid[] DEFAULT ARRAY[]::uuid[],
  linked_task_ids uuid[] DEFAULT ARRAY[]::uuid[],
  linked_job_ids uuid[] DEFAULT ARRAY[]::uuid[],
  linked_attachment_ids uuid[] DEFAULT ARRAY[]::uuid[],
  backlink_page_ids uuid[] DEFAULT ARRAY[]::uuid[],
  forward_link_page_ids uuid[] DEFAULT ARRAY[]::uuid[],
  relation_strength_score real DEFAULT 0.5,
  
  -- Analytics & Streaks (Derived)
  is_counted_for_streak integer DEFAULT 1,
  daily_streak_index integer DEFAULT 0,
  is_streak_breaker integer DEFAULT 0,
  yearly_day_index integer DEFAULT 0,
  is_filled_day integer DEFAULT 0,
  filled_day_score real DEFAULT 0,
  year_completion_percentage real DEFAULT 0,
  rolling_7_day_avg_words integer DEFAULT 0,
  rolling_30_day_avg_words integer DEFAULT 0,
  longest_streak_so_far integer DEFAULT 0,
  current_streak_length integer DEFAULT 0,
  streak_last_updated_at timestamptz,
  
  -- Filter & Sort Support
  filter_date_bucket text DEFAULT '',
  filter_has_children integer DEFAULT 0,
  filter_has_tags integer DEFAULT 0,
  filter_length_bucket text DEFAULT '',
  filter_mood_bucket text DEFAULT '',
  sort_title_normalized text DEFAULT '',
  sort_last_edited_numeric bigint,
  
  -- Security, Audit & Versioning
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_viewed_at timestamptz,
  created_by_profile_id uuid DEFAULT auth.uid(),
  last_modified_by_profile_id uuid DEFAULT auth.uid(),
  device_id text DEFAULT '',
  session_id text DEFAULT '',
  app_version_created text DEFAULT '',
  app_version_last_modified text DEFAULT '',
  content_hash text DEFAULT '',
  encryption_key_id text DEFAULT '',
  sync_state text DEFAULT 'synced',
  conflict_state text DEFAULT 'none',
  conflict_resolved_at timestamptz,
  data_migration_version integer DEFAULT 1,
  
  -- System & Debug
  is_system_generated integer DEFAULT 0,
  is_recovered_entry integer DEFAULT 0,
  recovery_source text DEFAULT '',
  debug_notes text DEFAULT '',
  internal_flags jsonb DEFAULT '{}'::jsonb,
  experimental_fields jsonb DEFAULT '{}'::jsonb,
  
  -- Owner
  user_id uuid NOT NULL DEFAULT auth.uid(),
  
  UNIQUE(user_id, entry_date, is_primary_page)
);

CREATE TABLE diary_tags (
  tag_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name text NOT NULL,
  tag_color text DEFAULT '#999999',
  tag_icon text DEFAULT '',
  tag_description text DEFAULT '',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  UNIQUE(user_id, tag_name)
);

CREATE TABLE diary_entry_tags (
  entry_tag_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_entry_id uuid NOT NULL REFERENCES diary_entries(diary_entry_id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES diary_tags(tag_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  UNIQUE(diary_entry_id, tag_id)
);

CREATE TABLE diary_entry_relations (
  relation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_entry_id uuid NOT NULL REFERENCES diary_entries(diary_entry_id) ON DELETE CASCADE,
  child_entry_id uuid NOT NULL REFERENCES diary_entries(diary_entry_id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  UNIQUE(parent_entry_id, child_entry_id)
);

CREATE TABLE diary_entry_links (
  link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_entry_id uuid NOT NULL REFERENCES diary_entries(diary_entry_id) ON DELETE CASCADE,
  linked_entity_type text NOT NULL,
  linked_entity_id uuid NOT NULL,
  link_strength real DEFAULT 0.5,
  link_type text DEFAULT 'reference',
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Enable RLS
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entry_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entry_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diary entries"
  ON diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries"
  ON diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary entries"
  ON diary_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own diary tags"
  ON diary_tags FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own diary entry tags"
  ON diary_entry_tags FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own diary entry relations"
  ON diary_entry_relations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own diary entry links"
  ON diary_entry_links FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_entries_date ON diary_entries(entry_date DESC);
CREATE INDEX idx_diary_entries_primary ON diary_entries(is_primary_page);
CREATE INDEX idx_diary_entries_parent ON diary_entries(parent_page_id);
CREATE INDEX idx_diary_entries_root ON diary_entries(root_page_id);
CREATE INDEX idx_diary_tags_user_id ON diary_tags(user_id);
CREATE INDEX idx_diary_entry_tags_entry_id ON diary_entry_tags(diary_entry_id);
CREATE INDEX idx_diary_entry_tags_tag_id ON diary_entry_tags(tag_id);
CREATE INDEX idx_diary_entry_relations_parent ON diary_entry_relations(parent_entry_id);
CREATE INDEX idx_diary_entry_relations_child ON diary_entry_relations(child_entry_id);
CREATE INDEX idx_diary_entry_links_entry_id ON diary_entry_links(diary_entry_id);
