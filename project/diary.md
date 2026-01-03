# FEATURE 1 — DIARY

Authoritative Field Specification + UI Segregation + Backend Structure

====================================================================
PART 1 — MASTER FIELD LIST (AUTHORITATIVE, SINGLE SOURCE OF TRUTH)
====================================================================

--- Core Identity & Date Anchoring ---

- diary_entry_id
- entry_date
- entry_year
- entry_month
- entry_day
- entry_week_of_year
- entry_day_of_week
- is_primary_page
- primary_page_id
- is_auto_created
- auto_creation_reason
- calendar_type
- timezone_at_creation
- date_locked
- date_last_validated_at

--- Hierarchy & Tree Structure ---

- parent_page_id
- root_page_id
- page_depth
- page_path
- page_sort_index
- page_position_type
- has_children
- children_count
- descendant_count
- is_collapsed_by_default
- is_archived
- is_deleted
- deleted_at
- deleted_reason
- restore_parent_id
- tree_version

--- Content Core ---

- title
- title_plaintext
- content_json
- content_plaintext
- content_html_cache
- block_count
- paragraph_count
- heading_count
- list_count
- code_block_count
- table_count
- toggle_count
- embed_count
- inline_comment_count
- content_schema_version
- last_block_edit_at

--- Writing Metrics ---

- word_count
- character_count
- sentence_count
- reading_time_minutes
- writing_time_seconds
- revision_count
- avg_words_per_paragraph
- is_empty_entry
- length_category
- length_score
- last_length_change_at

--- Tags & Classification ---

- tag_ids
- tag_names_cache
- tag_count
- primary_category
- secondary_categories
- semantic_type
- custom_labels
- color_label
- icon_emoji
- importance_level
- confidence_level
- intent_type

--- Mood & Context ---

- mood_rating
- mood_label
- energy_level
- stress_level
- sleep_quality
- weather_type
- weather_temperature
- location_text
- location_lat
- location_lng
- social_context
- health_context_notes
- gratitude_items

--- Cross-Domain Relations ---

- linked_habit_ids
- completed_habit_ids
- linked_goal_ids
- progressed_goal_ids
- linked_task_ids
- linked_job_ids
- linked_attachment_ids
- backlink_page_ids
- forward_link_page_ids
- relation_strength_score

--- Analytics & Streaks (Derived) ---

- is_counted_for_streak
- daily_streak_index
- is_streak_breaker
- yearly_day_index
- is_filled_day
- filled_day_score
- year_completion_percentage
- rolling_7_day_avg_words
- rolling_30_day_avg_words
- longest_streak_so_far
- current_streak_length
- streak_last_updated_at

--- Filter & Sort Support ---

- filter_date_bucket
- filter_has_children
- filter_has_tags
- filter_length_bucket
- filter_mood_bucket
- sort_title_normalized
- sort_date_numeric
- sort_last_edited_numeric

--- Security, Audit & Versioning ---

- created_at
- updated_at
- last_viewed_at
- created_by_profile_id
- last_modified_by_profile_id
- device_id
- session_id
- app_version_created
- app_version_last_modified
- content_hash
- encryption_key_id
- sync_state
- conflict_state
- conflict_resolved_at
- data_migration_version

--- System & Debug ---

- is_system_generated
- is_recovered_entry
- recovery_source
- debug_notes
- internal_flags
- experimental_fields

====================================================================
PART 2 — UI FIELD SEGREGATION (WHAT SHOWS WHERE)
====================================================================

--- Diary Dashboard (Top Kanban Blocks) ---

- current_streak_length
- longest_streak_so_far
- year_completion_percentage
- is_filled_day
- filled_day_score
- rolling_7_day_avg_words
- rolling_30_day_avg_words
- length_category
- mood_label

--- Dashboard Analytics Charts ---

- word_count
- writing_time_seconds
- mood_rating
- energy_level
- stress_level
- yearly_day_index
- daily_streak_index

--- Filters (Dashboard + Table) ---

- entry_date
- entry_year
- entry_month
- tag_ids
- tag_names_cache
- length_category
- filter_length_bucket
- filter_mood_bucket
- filter_has_children
- filter_has_tags
- is_filled_day
- is_primary_page

--- Table View Columns ---

- entry_date
- title
- word_count
- tag_names_cache
- children_count
- last_block_edit_at
- is_filled_day
- mood_label

--- Detail Page (Read Mode) ---

- title
- content_json
- content_html_cache
- block_count
- word_count
- linked_habit_ids
- linked_goal_ids
- linked_task_ids
- linked_job_ids
- gratitude_items
- mood_rating
- energy_level
- weather_type

--- Editor (Inline, Notion-like) ---

- title
- content_json
- content_schema_version
- inline_comment_count
- last_block_edit_at

--- Add / Edit Page Drawer — STEP 1 (Basic Info) ---

- title
- entry_date (locked for primary page)
- icon_emoji
- color_label
- semantic_type
- intent_type

--- Drawer — STEP 2 (Classification) ---

- tag_ids
- primary_category
- secondary_categories
- importance_level
- confidence_level

--- Drawer — STEP 3 (Context) ---

- mood_rating
- energy_level
- stress_level
- sleep_quality
- weather_type
- location_text
- social_context

--- Drawer — STEP 4 (Relations) ---

- linked_habit_ids
- linked_goal_ids
- linked_task_ids
- linked_job_ids
- linked_attachment_ids

--- Drawer — STEP 5 (Advanced / Optional) ---

- date_locked
- is_archived
- is_counted_for_streak
- custom_labels

====================================================================
PART 3 — BACKEND STRUCTURE (HOW THIS LIVES IN STORAGE)
====================================================================

--- Core Tables ---

- diary_entries
- diary_pages (same table, distinguished by is_primary_page)
- diary_tags
- diary_entry_tags (join)
- diary_page_relations
- diary_attachments
- diary_backlinks

--- Column-Oriented (Indexed) Fields ---

- diary_entry_id
- entry_date
- is_primary_page
- parent_page_id
- root_page_id
- word_count
- mood_rating
- is_filled_day
- sort_date_numeric
- created_at
- updated_at

--- JSON / Semi-Structured Fields ---

- content_json
- experimental_fields
- internal_flags
- gratitude_items
- custom_labels

--- Derived / Cached (Never User-Editable) ---

- filled_day_score
- year_completion_percentage
- rolling_7_day_avg_words
- rolling_30_day_avg_words
- relation_strength_score
- longest_streak_so_far
- current_streak_length

--- Hidden / Backend-Only ---

- content_hash
- encryption_key_id
- device_id
- session_id
- conflict_state
- sync_state
- data_migration_version

--- Integrity Rules ---

- ONE primary page per entry_date
- primary_page_id MUST self-reference on root
- child pages MUST reference root_page_id
- deletion is soft-delete only
- streak fields are recomputed, not user-editable

END OF DIARY SPECIFICATION
