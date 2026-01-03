/*
  # Create Attachments Table

  ## Overview
  This migration creates the attachments table for managing file attachments
  linked to various entities (goals, tasks, diary entries, career applications).
  Supports versioning, encryption, compression, and processing metadata.

  ## New Tables
  - `attachments`
    ### File Identity
    - `attachment_id` (uuid, primary key) - Unique identifier
    - `file_name` (text, required) - Display file name
    - `original_file_name` (text) - Original upload name
    - `file_extension` (text) - File extension
    - `mime_type` (text) - MIME type
    - `file_size_bytes` (bigint) - File size in bytes

    ### Storage & Security
    - `storage_backend` (text) - Storage provider
    - `storage_path` (text) - Path in storage
    - `encryption_algorithm` (text) - Encryption method
    - `encryption_key_id` (text) - Key reference
    - `compression_used` (integer) - Boolean: is compressed
    - `compression_ratio` (real) - Compression ratio

    ### Linking & Context
    - `attached_entity_type` (text) - Entity type (goal, task, etc.)
    - `attached_entity_id` (uuid) - Entity ID
    - `attachment_role` (text) - Purpose of attachment
    - `embedding_supported` (integer) - Boolean: can embed
    - `is_embedded` (integer) - Boolean: is embedded
    - `version_index` (integer) - Version number
    - `version_parent_id` (uuid) - Parent version ID

    ### Processing & Verification
    - `checksum_sha256` (text) - File checksum
    - `checksum_verified` (integer) - Boolean: verified
    - `text_extracted` (integer) - Boolean: text extracted
    - `ocr_performed` (integer) - Boolean: OCR done
    - `preview_available` (integer) - Boolean: preview exists
    - `attachment_notes` (text) - Additional notes

    ### System Fields
    - `created_at` (timestamptz) - Upload timestamp
    - `updated_at` (timestamptz) - Last update
    - `user_id` (uuid) - Owner user ID

  ## Security
  - Enable RLS on attachments table
  - Add policies for authenticated users to manage their own attachments
*/

CREATE TABLE IF NOT EXISTS attachments (
  attachment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File Identity
  file_name text NOT NULL,
  original_file_name text DEFAULT '',
  file_extension text DEFAULT '',
  mime_type text DEFAULT '',
  file_size_bytes bigint DEFAULT 0,
  
  -- Storage & Security
  storage_backend text DEFAULT 'supabase',
  storage_path text DEFAULT '',
  encryption_algorithm text DEFAULT '',
  encryption_key_id text DEFAULT '',
  compression_used integer DEFAULT 0,
  compression_ratio real DEFAULT 0,
  
  -- Linking & Context
  attached_entity_type text DEFAULT '',
  attached_entity_id uuid,
  attachment_role text DEFAULT '',
  embedding_supported integer DEFAULT 0,
  is_embedded integer DEFAULT 0,
  version_index integer DEFAULT 1,
  version_parent_id uuid,
  
  -- Processing & Verification
  checksum_sha256 text DEFAULT '',
  checksum_verified integer DEFAULT 0,
  text_extracted integer DEFAULT 0,
  ocr_performed integer DEFAULT 0,
  preview_available integer DEFAULT 0,
  attachment_notes text DEFAULT '',
  
  -- System
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid()
);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attachments"
  ON attachments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attachments"
  ON attachments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attachments"
  ON attachments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own attachments"
  ON attachments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_attachments_user_id ON attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(attached_entity_type, attached_entity_id);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);
