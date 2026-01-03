# FEATURE 3 — GOAL TRACKER

Authoritative Field Specification + UI Segregation + Backend Structure

====================================================================
PART 1 — MASTER FIELD LIST (AUTHORITATIVE, SINGLE SOURCE OF TRUTH)
====================================================================

--- Core Identity ---

- goal_id
- goal_slug
- goal_title
- goal_short_title
- goal_description
- goal_motivation_statement
- goal_type (outcome, process, performance, learning)
- goal_category
- goal_subcategory
- goal_domain (health, career, finance, learning, personal)
- goal_icon_emoji
- goal_color
- goal_visibility (active, paused, archived)
- goal_status (not_started, in_progress, completed, failed, abandoned)
- goal_priority_level
- goal_importance_weight
- goal_urgency_level
- goal_confidence_score
- goal_version

--- Time & Lifecycle ---

- goal_created_date
- goal_start_date
- goal_target_date
- goal_end_date
- goal_deadline_type (hard, soft)
- goal_time_horizon (short, medium, long)
- goal_review_frequency
- goal_last_reviewed_at
- goal_next_review_at
- goal_time_zone
- goal_is_time_bound
- goal_days_remaining
- goal_days_elapsed
- goal_overdue_days

--- Measurement & Success Criteria ---

- success_metric_type (numeric, boolean, milestone-based, composite)
- success_metric_unit
- baseline_value
- current_value
- target_value
- minimum_success_value
- stretch_target_value
- max_allowed_value
- measurement_operator (>=, <=, ==)
- progress_percentage
- progress_delta
- progress_velocity
- progress_acceleration
- progress_last_updated_at
- progress_is_on_track
- progress_confidence_interval

--- Milestones & Subgoals ---

- milestone_ids
- milestone_count
- milestones_completed_count
- milestone_completion_percentage
- milestone_required_order
- milestone_dependency_mode
- next_milestone_id
- last_completed_milestone_id
- milestone_failure_policy
- milestone_auto_unlock
- milestone_weight_distribution

--- Dependencies & Unlock Logic ---

- prerequisite_goal_ids
- dependent_goal_ids
- blocked_by_goal_ids
- unlocks_goal_ids
- dependency_type (hard, soft)
- dependency_strength_score
- unlock_condition_type
- unlock_threshold_value
- unlock_evaluation_frequency
- unlock_last_evaluated_at
- unlock_is_ready
- unlock_auto_activate

--- Habit & Task Integration ---

- linked_habit_ids
- habit_contribution_weights
- habit_completion_required
- habit_progress_aggregate
- habit_dependency_mode
- linked_task_ids
- task_completion_required
- task_progress_aggregate
- task_dependency_mode
- linked_diary_page_ids
- diary_reflection_required

--- Analytics & Derived Metrics ---

- completion_probability
- failure_probability
- burnout_risk_score
- confidence_trend
- consistency_index
- momentum_score
- volatility_score
- effort_to_reward_ratio
- expected_completion_date
- deviation_from_plan
- goal_health_status
- risk_level
- risk_factors

--- Motivation & Psychology ---

- motivation_type (intrinsic, extrinsic)
- motivation_reason
- identity_alignment_score
- emotional_commitment_score
- resistance_level
- fear_factor
- reward_expectation
- intrinsic_reward_description
- extrinsic_reward_description
- loss_aversion_enabled
- temptation_resistance_score

--- Rewards & Consequences ---

- reward_type
- reward_value
- reward_currency
- reward_trigger
- reward_claimed
- punishment_type
- punishment_value
- punishment_trigger
- consequence_enforced
- consequence_notes

--- Context & Environment ---

- preferred_execution_context
- preferred_time_of_day
- preferred_location
- required_resources
- optional_resources
- external_constraints
- social_support_required
- accountability_partner_id
- accountability_check_frequency

--- UI & Display Control ---

- display_order
- display_group
- display_section
- display_hidden
- display_show_progress
- display_show_dependencies
- display_show_habits
- display_show_tasks
- display_badge_type
- display_custom_label

--- Review & Reflection ---

- last_reflection_text
- reflection_history
- reflection_sentiment_score
- lessons_learned
- obstacles_encountered
- strategy_adjustments
- review_count
- last_strategy_change_at

--- Notifications & Alerts ---

- notification_enabled
- notification_channels
- notification_schedule
- notification_message
- escalation_enabled
- escalation_delay
- escalation_last_triggered_at

--- Audit & Metadata ---

- created_at
- updated_at
- last_viewed_at
- created_by_profile_id
- last_modified_by_profile_id
- device_id
- session_id
- app_version_created
- app_version_last_modified
- data_migration_version

--- Security & System ---

- encryption_key_id
- content_hash
- sync_state
- conflict_state
- conflict_resolved_at
- is_system_generated
- is_template
- template_source
- internal_flags
- experimental_fields

====================================================================
PART 2 — UI FIELD SEGREGATION (WHAT SHOWS WHERE)
====================================================================

--- Goal Dashboard (Top Summary Blocks) ---

- goal_status
- progress_percentage
- goal_health_status
- momentum_score
- completion_probability
- risk_level

--- Dashboard Analytics ---

- progress_percentage
- progress_velocity
- deviation_from_plan
- expected_completion_date
- burnout_risk_score
- consistency_index

--- Goal List / Table View ---

- goal_title
- goal_category
- goal_priority_level
- goal_status
- progress_percentage
- goal_target_date
- goal_days_remaining

--- Filters & Sorting ---

- goal_category
- goal_domain
- goal_status
- goal_priority_level
- risk_level
- progress_percentage
- goal_time_horizon

--- Goal Detail Page (Read Mode) ---

- goal_title
- goal_description
- goal_motivation_statement
- progress_percentage
- milestone_completion_percentage
- linked_habit_ids
- linked_task_ids
- prerequisite_goal_ids
- unlocks_goal_ids
- last_reflection_text

--- Add / Edit Goal Drawer — STEP 1 (Basics) ---

- goal_title
- goal_description
- goal_category
- goal_icon_emoji
- goal_color
- goal_priority_level

--- STEP 2 (Time & Measurement) ---

- goal_start_date
- goal_target_date
- success_metric_type
- target_value
- success_metric_unit

--- STEP 3 (Milestones) ---

- milestone_ids
- milestone_required_order
- milestone_weight_distribution

--- STEP 4 (Dependencies & Unlocks) ---

- prerequisite_goal_ids
- unlocks_goal_ids
- unlock_condition_type
- unlock_threshold_value

--- STEP 5 (Habits & Tasks) ---

- linked_habit_ids
- habit_contribution_weights
- linked_task_ids

--- STEP 6 (Motivation & Rewards) ---

- motivation_reason
- reward_type
- reward_value
- punishment_type

--- STEP 7 (Advanced / Optional) ---

- goal_review_frequency
- notification_enabled
- display_hidden

====================================================================
PART 3 — BACKEND STRUCTURE (HOW THIS LIVES IN STORAGE)
====================================================================

--- Core Tables ---

- goals
- goal_milestones
- goal_dependencies
- goal_habit_links
- goal_task_links
- goal_reviews
- goal_analytics_cache

--- Column-Oriented (Indexed) ---

- goal_id
- goal_title
- goal_category
- goal_status
- goal_priority_level
- goal_target_date
- progress_percentage
- created_at
- updated_at

--- JSON / Semi-Structured ---

- habit_contribution_weights
- reflection_history
- required_resources
- experimental_fields
- internal_flags

--- Derived / Cached Only ---

- goal_health_status
- completion_probability
- expected_completion_date
- burnout_risk_score
- deviation_from_plan

--- Hidden / Backend-Only ---

- encryption_key_id
- device_id
- session_id
- conflict_state
- sync_state
- data_migration_version

--- Integrity Rules ---

- progress fields are derived, never user-edited
- unlock logic evaluated deterministically
- dependency graph must be acyclic
- goal completion locks dependent goals until satisfied

END OF GOAL SPECIFICATION
