use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Goal {
    // 1. CORE IDENTITY & CLASSIFICATION
    pub goal_id: String,
    pub goal_slug: String,
    pub goal_title: String,
    pub goal_short_title: Option<String>,
    pub goal_description: Option<String>,
    pub goal_motivation_statement: Option<String>,
    pub goal_type: String, // outcome, process, performance, learning
    pub goal_category: Option<String>,
    pub goal_subcategory: Option<String>,
    pub goal_domain: Option<String>, // health, career, finance, learning, personal
    pub goal_icon_emoji: Option<String>,
    pub goal_color: Option<String>,
    pub goal_visibility: String, // active, paused, archived
    pub goal_status: String,     // not_started, in_progress, completed, failed, abandoned
    pub goal_priority_level: i32,
    pub goal_importance_weight: f64,
    pub goal_urgency_level: i32,
    pub goal_confidence_score: f64,
    pub goal_version: i32,

    // 2. TIME, LIFECYCLE & REVIEW SYSTEM
    pub goal_created_date: String,
    pub goal_start_date: Option<String>,
    pub goal_target_date: Option<String>,
    pub goal_end_date: Option<String>,
    pub goal_deadline_type: String,            // hard, soft
    pub goal_time_horizon: Option<String>,     // short, medium, long
    pub goal_review_frequency: Option<String>, // daily, weekly, monthly
    pub goal_last_reviewed_at: Option<i64>,
    pub goal_next_review_at: Option<i64>,
    pub goal_time_zone: Option<String>,
    pub goal_is_time_bound: bool,
    pub goal_days_remaining: Option<i32>,
    pub goal_days_elapsed: Option<i32>,
    pub goal_overdue_days: Option<i32>,

    // 3. MEASUREMENT, METRICS & SUCCESS CRITERIA
    pub success_metric_type: String, // numeric, boolean, milestone, composite
    pub success_metric_unit: Option<String>,
    pub baseline_value: Option<f64>,
    pub current_value: f64,
    pub target_value: Option<f64>,
    pub minimum_success_value: Option<f64>,
    pub stretch_target_value: Option<f64>,
    pub max_allowed_value: Option<f64>,
    pub measurement_operator: String, // >=, <=, ==
    pub progress_percentage: f64,
    pub progress_delta: f64,
    pub progress_velocity: f64,
    pub progress_acceleration: f64,
    pub progress_last_updated_at: Option<i64>,
    pub progress_is_on_track: bool,
    pub progress_confidence_interval: Option<f64>,

    // 4. MILESTONES, SUBGOALS & PHASES
    pub milestone_ids: Option<String>,
    pub milestone_count: i32,
    pub milestones_completed_count: i32,
    pub milestone_completion_percent: f64,
    pub milestone_required_order: bool,
    pub milestone_dependency_mode: String, // strict, flexible
    pub next_milestone_id: Option<String>,
    pub last_completed_milestone_id: Option<String>,
    pub milestone_failure_policy: Option<String>,
    pub milestone_auto_unlock: bool,
    pub milestone_weight_distribution: Option<String>,

    // 5. DEPENDENCIES, BLOCKERS & UNLOCK LOGIC
    pub prerequisite_goal_ids: Option<String>,
    pub dependent_goal_ids: Option<String>,
    pub blocked_by_goal_ids: Option<String>,
    pub unlocks_goal_ids: Option<String>,
    pub dependency_type: String, // hard, soft
    pub dependency_strength_score: f64,
    pub unlock_condition_type: Option<String>,
    pub unlock_threshold_value: Option<f64>,
    pub unlock_evaluation_frequency: Option<String>,
    pub unlock_last_evaluated_at: Option<i64>,
    pub unlock_is_ready: bool,
    pub unlock_auto_activate: bool,

    // 6. HABIT, TASK, DIARY & JOB INTEGRATION
    pub linked_habit_ids: Option<String>,
    pub habit_contribution_weights: Option<String>,
    pub habit_completion_required: bool,
    pub habit_progress_aggregate: f64,
    pub habit_dependency_mode: String,
    pub linked_task_ids: Option<String>,
    pub task_completion_required: bool,
    pub task_progress_aggregate: f64,
    pub task_dependency_mode: String,
    pub linked_diary_page_ids: Option<String>,
    pub diary_reflection_required: bool,
    pub linked_job_ids: Option<String>,
    pub job_progress_dependency: Option<String>,

    // 7. ANALYTICS, HEALTH & RISK (DERIVED — READ ONLY)
    pub completion_probability: f64,
    pub failure_probability: f64,
    pub burnout_risk_score: f64,
    pub confidence_trend: f64,
    pub consistency_index: f64,
    pub momentum_score: f64,
    pub volatility_score: f64,
    pub effort_to_reward_ratio: f64,
    pub expected_completion_date: Option<String>,
    pub deviation_from_plan: f64,
    pub goal_health_status: Option<String>,
    pub risk_level: Option<String>,
    pub risk_factors: Option<String>,

    // 8. MOTIVATION, PSYCHOLOGY & IDENTITY
    pub motivation_type: Option<String>, // intrinsic, extrinsic
    pub motivation_reason: Option<String>,
    pub identity_alignment_score: f64,
    pub emotional_commitment_score: f64,
    pub resistance_level: f64,
    pub fear_factor: f64,
    pub reward_expectation: Option<f64>,
    pub intrinsic_reward_description: Option<String>,
    pub extrinsic_reward_description: Option<String>,
    pub loss_aversion_enabled: bool,
    pub temptation_resistance_score: f64,

    // 9. REWARDS, CONSEQUENCES & INCENTIVES
    pub reward_type: Option<String>,
    pub reward_value: Option<f64>,
    pub reward_currency: Option<String>,
    pub reward_trigger: Option<String>,
    pub reward_claimed: bool,
    pub punishment_type: Option<String>,
    pub punishment_value: Option<f64>,
    pub punishment_trigger: Option<String>,
    pub consequence_enforced: bool,
    pub consequence_notes: Option<String>,

    // 10. CONTEXT, ENVIRONMENT & EXECUTION PREFERENCES
    pub preferred_execution_context: Option<String>,
    pub preferred_time_of_day: Option<String>,
    pub preferred_location: Option<String>,
    pub required_resources: Option<String>,
    pub optional_resources: Option<String>,
    pub external_constraints: Option<String>,
    pub social_support_required: bool,
    pub accountability_partner_id: Option<String>,
    pub accountability_check_frequency: Option<String>,

    // 11. UI, DISPLAY & VISIBILITY CONTROL
    pub display_order: i32,
    pub display_group: Option<String>,
    pub display_section: Option<String>,
    pub display_hidden: bool,
    pub display_show_progress: bool,
    pub display_show_dependencies: bool,
    pub display_show_habits: bool,
    pub display_show_tasks: bool,
    pub display_badge_type: Option<String>,
    pub display_custom_label: Option<String>,

    // 12. REVIEW, REFLECTION & LEARNING
    pub last_reflection_text: Option<String>,
    pub reflection_history: Option<String>,
    pub reflection_sentiment_score: f64,
    pub lessons_learned: Option<String>,
    pub obstacles_encountered: Option<String>,
    pub strategy_adjustments: Option<String>,
    pub review_count: i32,
    pub last_strategy_change_at: Option<i64>,

    // 13. NOTIFICATIONS & ALERTS
    pub notification_enabled: bool,
    pub notification_channels: Option<String>,
    pub notification_schedule: Option<String>,
    pub notification_message: Option<String>,
    pub escalation_enabled: bool,
    pub escalation_delay: Option<i32>,
    pub escalation_last_triggered_at: Option<i64>,

    // 14. AUDIT, SECURITY & SYSTEM
    pub created_at: i64,
    pub updated_at: i64,
    pub last_viewed_at: Option<i64>,
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
    pub data_migration_version: i32,

    // 15. SYSTEM & DEBUG (HIDDEN)
    pub is_system_generated: bool,
    pub is_template: bool,
    pub template_source: Option<String>,
    pub internal_flags: Option<String>,
    pub experimental_fields: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateGoalInput {
    pub goal_title: String,
    pub goal_type: String, // outcome, process, performance, learning
    pub goal_category: Option<String>,
    pub goal_description: Option<String>,
    pub goal_target_date: Option<String>,
}
