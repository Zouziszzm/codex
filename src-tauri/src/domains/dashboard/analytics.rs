use crate::app::error::AppError;
use crate::domains::dashboard::model::DashboardSnapshot;
use chrono::{Local, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

pub async fn compute_dashboard(pool: &SqlitePool) -> Result<DashboardSnapshot, AppError> {
    let start_time = Utc::now();
    let today = Local::now().format("%Y-%m-%d").to_string();
    let now_ts = Utc::now().timestamp();

    // 1. Fetch Today's Diary Status
    let diary_exists: (i32,) =
        sqlx::query_as("SELECT COUNT(*) FROM diary_entries WHERE entry_date = ?")
            .bind(&today)
            .fetch_one(pool)
            .await?;

    // 2. Fetch Habits Status
    let habits_stats: (i32, i32) = sqlx::query_as(
        "SELECT COUNT(*), SUM(CASE WHEN habit_visibility = 'active' THEN 1 ELSE 0 END) FROM habits",
    )
    .fetch_one(pool)
    .await?;

    // 3. Fetch Goals Status
    let goals_stats: (i32, i32) = sqlx::query_as("SELECT COUNT(*), SUM(CASE WHEN goal_status = 'completed' THEN 1 ELSE 0 END) FROM goals WHERE goal_visibility = 'active'")
        .fetch_one(pool)
        .await?;

    // 4. Fetch Jobs Status
    let jobs_stats: (i32, i32, i32) = sqlx::query_as("SELECT COUNT(*), SUM(CASE WHEN job_status = 'interviewing' THEN 1 ELSE 0 END), SUM(CASE WHEN job_status = 'offer' THEN 1 ELSE 0 END) FROM job_applications WHERE job_visibility = 'active'")
        .fetch_one(pool)
        .await?;

    let computation_duration = Utc::now()
        .signed_duration_since(start_time)
        .num_milliseconds() as i32;

    let snapshot = DashboardSnapshot {
        dashboard_id: Uuid::new_v4().to_string(),
        dashboard_date: today.clone(),
        dashboard_timezone: Some(Local::now().offset().to_string()),
        active_profile_id: None,
        dashboard_version: 1,

        overall_productivity_score: 85.0, // Placeholder
        overall_consistency_index: 0.75,  // Placeholder
        overall_momentum_score: 1.2,      // Placeholder
        burnout_risk_global: 0.1,         // Placeholder
        stress_load_global: 0.3,          // Placeholder
        confidence_global: 0.9,           // Placeholder
        system_health_status: "excellent".to_string(),

        today_date: today,
        today_diary_exists: diary_exists.0 > 0,
        today_diary_word_count: 0, // Placeholder
        today_diary_mood_rating: None,
        today_habits_total: habits_stats.1,
        today_habits_completed: 0, // Requires habit_logs join
        today_habits_missed: 0,
        today_habit_completion_rate: 0.0,
        today_goals_progress_events: 0,
        today_job_actions_count: 0,

        diary_current_streak_length: 5,        // Placeholder
        diary_longest_streak: 12,              // Placeholder
        diary_filled_days_year: 45,            // Placeholder
        diary_year_completion_percentage: 0.8, // Placeholder
        diary_rolling_7_day_avg_words: 250.0,
        diary_rolling_30_day_avg_words: 200.0,
        diary_last_entry_date: None,
        diary_days_since_last_entry: None,

        habits_total_active: habits_stats.1,
        habits_on_track_count: habits_stats.1,
        habits_off_track_count: 0,
        habits_completion_rate_7d: 0.9,
        habits_completion_rate_30d: 0.85,
        habits_longest_current_streak: 20,
        habits_most_consistent_habit_id: None,
        habits_burnout_risk_score: 0.05,

        goals_total_active: goals_stats.0,
        goals_completed_total: goals_stats.1,
        goals_on_track_count: goals_stats.0,
        goals_at_risk_count: 0,
        goals_blocked_count: 0,
        goals_avg_progress_percentage: 0.4,
        goals_nearest_deadline_date: None,
        goals_overdue_count: 0,
        goals_overall_health_status: Some("on_track".to_string()),

        jobs_total_active: jobs_stats.0,
        jobs_applied_total: 10, // Placeholder
        jobs_interviewing_count: jobs_stats.1,
        jobs_offer_count: jobs_stats.2,
        jobs_rejected_count: 2,
        jobs_ghosted_count: 1,
        jobs_pipeline_velocity: 0.5,
        jobs_application_success_rate: 0.1,
        jobs_last_activity_date: None,
        jobs_days_since_last_activity: None,

        recent_activity_ids: None,
        recent_activity_types: None,
        recent_activity_timestamps: None,
        recent_activity_summary_text: None,

        attention_required_flag: false,
        overdue_goals_flag: false,
        habit_streak_break_risk_flag: false,
        diary_gap_warning_flag: false,
        job_pipeline_stall_flag: false,
        critical_alert_count: 0,
        warning_alert_count: 0,

        upcoming_habit_deadlines: None,
        upcoming_goal_reviews: None,
        upcoming_job_interviews: None,
        suggested_next_actions: None,

        avg_energy_level_7d: 4.5,
        avg_stress_level_7d: 2.0,
        sleep_quality_avg_7d: 8.0,
        emotional_load_index: 0.2,
        cognitive_load_index: 0.4,

        dashboard_time_range: "today".to_string(),
        dashboard_focus_mode: "balanced".to_string(),
        dashboard_last_refreshed_at: now_ts,

        cache_generated_at: now_ts,
        cache_valid_until: Some(now_ts + 3600), // Valid for 1 hour
        data_sources_version: Some("1.0".to_string()),
        analytics_computation_duration_ms: computation_duration,
    };

    Ok(snapshot)
}
