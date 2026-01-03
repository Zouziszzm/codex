use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Habit {
    // 1. CORE IDENTITY
    pub habit_id: String,
    pub habit_slug: Option<String>,
    pub habit_name: String,
    pub habit_description: Option<String>,
    pub habit_short_description: Option<String>,
    pub habit_type: String, // boolean, quantitative, duration, checklist
    pub habit_category: Option<String>,
    pub habit_subcategory: Option<String>,
    pub habit_domain: Option<String>,
    pub habit_icon_emoji: Option<String>,
    pub habit_color: Option<String>,
    pub habit_visibility: String, // active, paused, archived
    pub habit_priority_level: i32,
    pub habit_difficulty_level: i32,
    pub habit_motivation_score: f64,
    pub habit_identity_statement: Option<String>,
    pub habit_version: i32,

    // 2. SCHEDULING & FREQUENCY
    pub schedule_type: String, // daily, weekly, custom, interval
    pub schedule_days_of_week: Option<String>,
    pub schedule_days_of_month: Option<String>,
    pub schedule_weeks_of_year: Option<String>,
    pub schedule_interval_value: Option<i32>,
    pub schedule_interval_unit: Option<String>,
    pub schedule_start_date: Option<String>,
    pub schedule_end_date: Option<String>,
    pub schedule_timezone: Option<String>,
    pub schedule_is_flexible: bool,
    pub schedule_grace_period_minutes: i32,
    pub schedule_cutoff_time: Option<String>,
    pub schedule_requires_exact_time: bool,
    pub schedule_time_windows: Option<String>,
    pub schedule_excluded_dates: Option<String>,
    pub schedule_holiday_behavior: Option<String>,
    pub schedule_weekend_behavior: Option<String>,
    pub schedule_failure_reset_rule: Option<String>,

    // 3. TARGET & MEASUREMENT
    pub target_type: String, // count, duration, amount
    pub target_value: Option<f64>,
    pub target_unit: Option<String>,
    pub target_operator: String, // >=, ==, <=
    pub min_target_value: Option<f64>,
    pub max_target_value: Option<f64>,
    pub ideal_target_value: Option<f64>,
    pub baseline_value: Option<f64>,
    pub rolling_target_window: Option<i32>,
    pub carryover_behavior: Option<String>,
    pub overflow_behavior: Option<String>,
    pub partial_completion_allowed: bool,
    pub partial_completion_weight: f64,
    pub completion_threshold_percent: f64,
    pub overachievement_allowed: bool,
    pub overachievement_cap: Option<f64>,
    pub diminishing_returns_curve: Option<String>,

    // 4. DAILY CHECK-IN
    pub checkin_required: bool,
    pub checkin_mode: String, // manual, auto, mixed
    pub checkin_input_type: Option<String>,
    pub checkin_default_value: Option<f64>,
    pub checkin_last_value: Option<f64>,
    pub checkin_notes: Option<String>,
    pub checkin_media_allowed: bool,
    pub checkin_voice_allowed: bool,
    pub checkin_photo_allowed: bool,
    pub checkin_location_required: bool,
    pub checkin_weather_required: bool,
    pub checkin_mood_required: bool,
    pub checkin_energy_required: bool,
    pub checkin_prompt_text: Option<String>,
    pub checkin_confirmation_required: bool,
    pub checkin_failure_reason: Option<String>,
    pub checkin_retry_allowed: bool,
    pub checkin_retry_limit: i32,

    // 5. STREAK LOGIC
    pub streak_current: i32,
    pub streak_longest: i32,
    pub streak_best_window: i32,
    pub streak_start_date: Option<String>,
    pub streak_last_updated_at: Option<i64>,
    pub streak_freeze_available: i32,
    pub streak_freeze_used: i32,
    pub streak_freeze_remaining: i32,
    pub streak_break_reason: Option<String>,
    pub streak_break_date: Option<String>,
    pub streak_repair_allowed: bool,
    pub streak_repair_used: i32,
    pub streak_decay_model: Option<String>,
    pub streak_weight: f64,

    // 6. PERFORMANCE METRICS (DERIVED)
    pub total_completions: i32,
    pub total_failures: i32,
    pub total_skips: i32,
    pub completion_rate_lifetime: f64,
    pub completion_rate_30d: f64,
    pub completion_rate_90d: f64,
    pub completion_rate_365d: f64,
    pub consistency_index: f64,
    pub variance_score: f64,
    pub momentum_score: f64,
    pub habit_strength_score: f64,
    pub habit_entropy_score: f64,
    pub habit_predictability_score: f64,

    // 7. REWARDS & GAMIFICATION
    pub reward_type: Option<String>,
    pub reward_value: Option<f64>,
    pub reward_currency: Option<String>,
    pub reward_frequency: Option<String>,
    pub reward_cap: Option<f64>,
    pub punishment_type: Option<String>,
    pub punishment_value: Option<f64>,
    pub punishment_trigger: Option<String>,
    pub loss_aversion_enabled: bool,
    pub gamification_points: i32,
    pub gamification_level: i32,
    pub gamification_xp: i32,
    pub gamification_badges: Option<String>,

    // 8. MOTIVATION & PSYCHOLOGY
    pub motivation_type: Option<String>, // intrinsic, extrinsic
    pub motivation_reason: Option<String>,
    pub motivation_quote: Option<String>,
    pub identity_alignment_score: f64,
    pub emotional_resistance_score: f64,
    pub friction_level: f64,
    pub activation_energy_score: f64,
    pub habit_loop_cue: Option<String>,
    pub habit_loop_routine: Option<String>,
    pub habit_loop_reward: Option<String>,
    pub temptation_bundling_enabled: bool,

    // 9. DEPENDENCIES & RELATIONS
    pub prerequisite_habit_ids: Option<String>,
    pub dependent_habit_ids: Option<String>,
    pub blocked_by_habit_ids: Option<String>,
    pub unlocks_habit_ids: Option<String>,
    pub linked_goal_ids: Option<String>,
    pub contributing_goal_weight: f64,
    pub linked_task_ids: Option<String>,
    pub linked_diary_page_ids: Option<String>,
    pub linked_job_ids: Option<String>,
    pub dependency_strength_score: f64,

    // 10. ANALYTICS (READ-ONLY)
    pub is_on_track: bool,
    pub projected_completion_rate: f64,
    pub projected_streak_length: i32,
    pub habit_health_status: Option<String>,
    pub burnout_risk_score: f64,
    pub relapse_risk_score: f64,
    pub success_probability: f64,

    // 11. AUDIT & SYSTEM
    pub created_at: i64,
    pub updated_at: i64,
    pub last_completed_at: Option<i64>,
    pub last_failed_at: Option<i64>,
    pub last_skipped_at: Option<i64>,
    pub created_by_profile_id: Option<String>,
    pub last_modified_by_profile_id: Option<String>,
    pub device_id: Option<String>,
    pub session_id: Option<String>,
    pub app_version_created: Option<String>,
    pub app_version_last_modified: Option<String>,
    pub encryption_key_id: Option<String>,
    pub content_hash: Option<String>,
    pub sync_state: String,
    pub conflict_state: Option<String>,
    pub conflict_resolved_at: Option<i64>,
    pub internal_flags: Option<String>,
    pub experimental_fields: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateHabitInput {
    pub habit_name: String,
    pub habit_type: String, // boolean, quantitative, duration, checklist
    pub habit_description: Option<String>,
    pub habit_icon_emoji: Option<String>,
    pub habit_color: Option<String>,
    pub schedule_type: String,
}
