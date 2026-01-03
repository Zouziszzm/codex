/*
  # Create Analytics Events Table

  ## Overview
  This migration creates the analytics_events table for tracking system events,
  metrics, and user activity across all domains. Supports time-series analysis,
  anomaly detection, and trend tracking.

  ## New Tables
  - `analytics_events`
    ### Event Identity
    - `event_id` (uuid, primary key) - Unique identifier
    - `event_type` (text) - Type of event
    - `event_subtype` (text) - Subtype classification
    - `event_timestamp` (timestamptz) - When event occurred
    - `related_entity_type` (text) - Related entity type
    - `related_entity_id` (uuid) - Related entity ID

    ### Metrics
    - `metric_name` (text) - Name of metric
    - `metric_value` (real) - Metric value
    - `metric_unit` (text) - Unit of measurement

    ### Aggregation & Analysis
    - `aggregation_window` (text) - Time window for aggregation
    - `aggregation_method` (text) - How aggregated (sum, avg, etc.)
    - `baseline_value` (real) - Baseline for comparison
    - `delta_value` (real) - Change from baseline
    - `trend_direction` (text) - up/down/stable
    - `anomaly_detected` (integer) - Boolean: anomaly present
    - `anomaly_score` (real) - Anomaly severity
    - `confidence_interval` (real) - Statistical confidence
    - `analytics_notes` (text) - Additional notes

    ### System Fields
    - `created_at` (timestamptz) - Record creation
    - `user_id` (uuid) - Associated user

  ## Security
  - Enable RLS on analytics_events table
  - Add policies for authenticated users to view their own analytics
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event Identity
  event_type text NOT NULL,
  event_subtype text DEFAULT '',
  event_timestamp timestamptz DEFAULT now(),
  related_entity_type text DEFAULT '',
  related_entity_id uuid,
  
  -- Metrics
  metric_name text DEFAULT '',
  metric_value real DEFAULT 0,
  metric_unit text DEFAULT '',
  
  -- Aggregation & Analysis
  aggregation_window text DEFAULT '',
  aggregation_method text DEFAULT '',
  baseline_value real DEFAULT 0,
  delta_value real DEFAULT 0,
  trend_direction text DEFAULT 'stable',
  anomaly_detected integer DEFAULT 0,
  anomaly_score real DEFAULT 0,
  confidence_interval real DEFAULT 0.95,
  analytics_notes text DEFAULT '',
  
  -- System
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, event_subtype);
CREATE INDEX IF NOT EXISTS idx_analytics_entity ON analytics_events(related_entity_type, related_entity_id);
