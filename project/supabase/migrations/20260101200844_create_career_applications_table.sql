/*
  # Create Career Applications Table

  ## Overview
  This migration creates the career_applications table for tracking job applications
  through the entire hiring pipeline, from application to final decision.

  ## New Tables
  - `career_applications`
    ### Company & Role Information
    - `application_id` (uuid, primary key) - Unique identifier
    - `company_name` (text, required) - Company name
    - `company_industry` (text) - Industry sector
    - `company_size` (text) - Company size classification
    - `role_title` (text, required) - Job title
    - `role_level` (text) - Seniority level
    - `role_type` (text) - Employment type (full-time, contract, etc.)
    - `role_location` (text) - Physical location
    - `remote_policy` (text) - Remote work policy
    - `compensation_band` (text) - Salary range
    - `currency` (text) - Currency for compensation

    ### Application Details
    - `application_date` (timestamptz) - When applied
    - `application_channel` (text) - How applied (website, referral, etc.)
    - `application_source` (text) - Where found (LinkedIn, etc.)
    - `referral_used` (integer) - Boolean: was referral used
    - `resume_version_id` (text) - Reference to resume version
    - `cover_letter_version_id` (text) - Reference to cover letter
    - `portfolio_version_id` (text) - Reference to portfolio

    ### Interview Pipeline
    - `screening_completed` (integer) - Boolean: screening done
    - `interview_rounds_planned` (integer) - Total rounds expected
    - `interview_rounds_completed` (integer) - Rounds completed

    ### Outcome & Decision
    - `offer_received` (integer) - Boolean: offer received
    - `offer_details` (text) - Offer specifics
    - `decision_deadline` (timestamptz) - Decision due date
    - `decision_made` (integer) - Boolean: decision finalized
    - `rejection_received` (integer) - Boolean: was rejected
    - `rejection_reason` (text) - Why rejected
    - `feedback_received` (text) - Feedback from company

    ### Reflection & Alignment
    - `lessons_learned` (text) - Personal takeaways
    - `emotional_impact` (text) - Emotional response notes
    - `career_alignment_score` (real) - Alignment with goals (0-1)

    ### System Fields
    - `status` (text) - Current pipeline status
    - `created_at` (timestamptz) - Creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp
    - `user_id` (uuid) - Owner user ID

  ## Security
  - Enable RLS on career_applications table
  - Add policies for authenticated users to manage their own applications
*/

CREATE TABLE IF NOT EXISTS career_applications (
  application_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company & Role
  company_name text NOT NULL,
  company_industry text DEFAULT '',
  company_size text DEFAULT '',
  role_title text NOT NULL,
  role_level text DEFAULT '',
  role_type text DEFAULT '',
  role_location text DEFAULT '',
  remote_policy text DEFAULT '',
  compensation_band text DEFAULT '',
  currency text DEFAULT 'USD',
  
  -- Application Details
  application_date timestamptz DEFAULT now(),
  application_channel text DEFAULT '',
  application_source text DEFAULT '',
  referral_used integer DEFAULT 0,
  resume_version_id text DEFAULT '',
  cover_letter_version_id text DEFAULT '',
  portfolio_version_id text DEFAULT '',
  
  -- Interview Pipeline
  screening_completed integer DEFAULT 0,
  interview_rounds_planned integer DEFAULT 0,
  interview_rounds_completed integer DEFAULT 0,
  
  -- Outcome & Decision
  offer_received integer DEFAULT 0,
  offer_details text DEFAULT '',
  decision_deadline timestamptz,
  decision_made integer DEFAULT 0,
  rejection_received integer DEFAULT 0,
  rejection_reason text DEFAULT '',
  feedback_received text DEFAULT '',
  
  -- Reflection & Alignment
  lessons_learned text DEFAULT '',
  emotional_impact text DEFAULT '',
  career_alignment_score real DEFAULT 0.5,
  
  -- System
  status text DEFAULT 'applied',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON career_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON career_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON career_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON career_applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_career_user_id ON career_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_career_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_created_at ON career_applications(created_at DESC);
