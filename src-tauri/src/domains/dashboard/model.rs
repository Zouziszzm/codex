use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct DashboardSnapshot {
    // 1. DASHBOARD IDENTITY & CONTEXT
    pub dashboard_id: String,
    pub dashboard_date: String, // YYYY-MM-DD (today)
    pub dashboard_timezone: Option<String>,
    pub active_profile_id: Option<String>,
    pub dashboard_version: i32,

    // 2. GLOBAL OVERVIEW METRICS (TOP SUMMARY)
    pub overall_productivity_score: f64,
    pub overall_consistency_index: f64,
    pub overall_momentum_score: f64,
    pub burnout_risk_global: f64,
    pub stress_load_global: f64,
    pub confidence_global: f64,
    pub system_health_status: String, // excellent, good, warning, critical

    // 3. TODAY SNAPSHOT (PRIMARY FOCUS)
    pub today_date: String,
    pub today_diary_exists: bool,
    pub today_diary_word_count: i32,
    pub today_diary_mood_rating: Option<i32>,
    pub today_habits_total: i32,
    pub today_habits_completed: i32,
    pub today_habits_missed: i32,
    pub today_habit_completion_rate: f64,
    pub today_goals_progress_events: i32,
    pub today_job_actions_count: i32,

    // 4. DIARY DASHBOARD AGGREGATES
    pub diary_current_streak_length: i32,
    pub diary_longest_streak: i32,
    pub diary_filled_days_year: i32,
    pub diary_year_completion_percentage: f64,
    pub diary_rolling_7_day_avg_words: f64,
    pub diary_rolling_30_day_avg_words: f64,
    pub diary_last_entry_date: Option<String>,
    pub diary_days_since_last_entry: Option<i32>,

    // 5. HABIT DASHBOARD AGGREGATES
    pub habits_total_active: i32,
    pub habits_on_track_count: i32,
    pub habits_off_track_count: i32,
    pub habits_completion_rate_7d: f64,
    pub habits_completion_rate_30d: f64,
    pub habits_longest_current_streak: i32,
    pub habits_most_consistent_habit_id: Option<String>,
    pub habits_burnout_risk_score: f64,

    // 6. GOAL DASHBOARD AGGREGATES
    pub goals_total_active: i32,
    pub goals_completed_total: i32,
    pub goals_on_track_count: i32,
    pub goals_at_risk_count: i32,
    pub goals_blocked_count: i32,
    pub goals_avg_progress_percentage: f64,
    pub goals_nearest_deadline_date: Option<String>,
    pub goals_overdue_count: i32,
    pub goals_overall_health_status: Option<String>,

    // 7. JOB TRACKER DASHBOARD AGGREGATES
    pub jobs_total_active: i32,
    pub jobs_applied_total: i32,
    pub jobs_interviewing_count: i32,
    pub jobs_offer_count: i32,
    pub jobs_rejected_count: i32,
    pub jobs_ghosted_count: i32,
    pub jobs_pipeline_velocity: f64,
    pub jobs_application_success_rate: f64,
    pub jobs_last_activity_date: Option<String>,
    pub jobs_days_since_last_activity: Option<i32>,

    // 8. RECENT ACTIVITY FEED (CROSS-DOMAIN)
    pub recent_activity_ids: Option<String>,
    pub recent_activity_types: Option<String>,
    pub recent_activity_timestamps: Option<String>,
    pub recent_activity_summary_text: Option<String>,

    // 9. ALERTS, RISKS & ATTENTION REQUIRED
    pub attention_required_flag: bool,
    pub overdue_goals_flag: bool,
    pub habit_streak_break_risk_flag: bool,
    pub diary_gap_warning_flag: bool,
    pub job_pipeline_stall_flag: bool,
    pub critical_alert_count: i32,
    pub warning_alert_count: i32,

    // 10. UPCOMING & NEXT ACTIONS
    pub upcoming_habit_deadlines: Option<String>,
    pub upcoming_goal_reviews: Option<String>,
    pub upcoming_job_interviews: Option<String>,
    pub suggested_next_actions: Option<String>,

    // 11. TIME, ENERGY & WELLBEING SUMMARY
    pub avg_energy_level_7d: f64,
    pub avg_stress_level_7d: f64,
    pub sleep_quality_avg_7d: f64,
    pub emotional_load_index: f64,
    pub cognitive_load_index: f64,

    // 12. FILTERS & DASHBOARD STATE (READ-ONLY)
    pub dashboard_time_range: String, // today, 7d, 30d, year
    pub dashboard_focus_mode: String, // balanced, habits, goals, career
    pub dashboard_last_refreshed_at: i64,

    // 13. AUDIT, CACHE & SYSTEM
    pub cache_generated_at: i64,
    pub cache_valid_until: Option<i64>,
    pub data_sources_version: Option<String>,
    pub analytics_computation_duration_ms: i32,
}
