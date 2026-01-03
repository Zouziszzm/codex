use crate::app::error::AppError;
use crate::domains::dashboard::model::DashboardSnapshot;
use sqlx::SqlitePool;

pub async fn get_latest_snapshot(pool: &SqlitePool) -> Result<Option<DashboardSnapshot>, AppError> {
    let snapshot = sqlx::query_as::<_, DashboardSnapshot>(
        "SELECT * FROM dashboard_snapshots ORDER BY cache_generated_at DESC LIMIT 1",
    )
    .fetch_optional(pool)
    .await?;

    Ok(snapshot)
}

pub async fn save_snapshot(
    pool: &SqlitePool,
    snapshot: &DashboardSnapshot,
) -> Result<(), AppError> {
    sqlx::query(
        "INSERT INTO dashboard_snapshots (
            dashboard_id, dashboard_date, dashboard_timezone, active_profile_id,
            dashboard_version, overall_productivity_score, overall_consistency_index,
            overall_momentum_score, burnout_risk_global, stress_load_global,
            confidence_global, system_health_status, today_date, today_diary_exists,
            today_diary_word_count, today_diary_mood_rating, today_habits_total,
            today_habits_completed, today_habits_missed, today_habit_completion_rate,
            today_goals_progress_events, today_job_actions_count, diary_current_streak_length,
            diary_longest_streak, diary_filled_days_year, diary_year_completion_percentage,
            diary_rolling_7_day_avg_words, diary_rolling_30_day_avg_words,
            diary_last_entry_date, diary_days_since_last_entry, habits_total_active,
            habits_on_track_count, habits_off_track_count, habits_completion_rate_7d,
            habits_completion_rate_30d, habits_longest_current_streak,
            habits_most_consistent_habit_id, habits_burnout_risk_score, goals_total_active,
            goals_completed_total, goals_on_track_count, goals_at_risk_count,
            goals_blocked_count, goals_avg_progress_percentage, goals_nearest_deadline_date,
            goals_overdue_count, goals_overall_health_status, jobs_total_active,
            jobs_applied_total, jobs_interviewing_count, jobs_offer_count,
            jobs_rejected_count, jobs_ghosted_count, jobs_pipeline_velocity,
            jobs_application_success_rate, jobs_last_activity_date,
            jobs_days_since_last_activity, recent_activity_ids, recent_activity_types,
            recent_activity_timestamps, recent_activity_summary_text,
            attention_required_flag, overdue_goals_flag, habit_streak_break_risk_flag,
            diary_gap_warning_flag, job_pipeline_stall_flag, critical_alert_count,
            warning_alert_count, upcoming_habit_deadlines, upcoming_goal_reviews,
            upcoming_job_interviews, suggested_next_actions, avg_energy_level_7d,
            avg_stress_level_7d, sleep_quality_avg_7d, emotional_load_index,
            cognitive_load_index, dashboard_time_range, dashboard_focus_mode,
            dashboard_last_refreshed_at, cache_generated_at, cache_valid_until,
            data_sources_version, analytics_computation_duration_ms
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )"
    )
    .bind(&snapshot.dashboard_id)
    .bind(&snapshot.dashboard_date)
    .bind(&snapshot.dashboard_timezone)
    .bind(&snapshot.active_profile_id)
    .bind(snapshot.dashboard_version)
    .bind(snapshot.overall_productivity_score)
    .bind(snapshot.overall_consistency_index)
    .bind(snapshot.overall_momentum_score)
    .bind(snapshot.burnout_risk_global)
    .bind(snapshot.stress_load_global)
    .bind(snapshot.confidence_global)
    .bind(&snapshot.system_health_status)
    .bind(&snapshot.today_date)
    .bind(snapshot.today_diary_exists)
    .bind(snapshot.today_diary_word_count)
    .bind(snapshot.today_diary_mood_rating)
    .bind(snapshot.today_habits_total)
    .bind(snapshot.today_habits_completed)
    .bind(snapshot.today_habits_missed)
    .bind(snapshot.today_habit_completion_rate)
    .bind(snapshot.today_goals_progress_events)
    .bind(snapshot.today_job_actions_count)
    .bind(snapshot.diary_current_streak_length)
    .bind(snapshot.diary_longest_streak)
    .bind(snapshot.diary_filled_days_year)
    .bind(snapshot.diary_year_completion_percentage)
    .bind(snapshot.diary_rolling_7_day_avg_words)
    .bind(snapshot.diary_rolling_30_day_avg_words)
    .bind(&snapshot.diary_last_entry_date)
    .bind(snapshot.diary_days_since_last_entry)
    .bind(snapshot.habits_total_active)
    .bind(snapshot.habits_on_track_count)
    .bind(snapshot.habits_off_track_count)
    .bind(snapshot.habits_completion_rate_7d)
    .bind(snapshot.habits_completion_rate_30d)
    .bind(snapshot.habits_longest_current_streak)
    .bind(&snapshot.habits_most_consistent_habit_id)
    .bind(snapshot.habits_burnout_risk_score)
    .bind(snapshot.goals_total_active)
    .bind(snapshot.goals_completed_total)
    .bind(snapshot.goals_on_track_count)
    .bind(snapshot.goals_at_risk_count)
    .bind(snapshot.goals_blocked_count)
    .bind(snapshot.goals_avg_progress_percentage)
    .bind(&snapshot.goals_nearest_deadline_date)
    .bind(snapshot.goals_overdue_count)
    .bind(&snapshot.goals_overall_health_status)
    .bind(snapshot.jobs_total_active)
    .bind(snapshot.jobs_applied_total)
    .bind(snapshot.jobs_interviewing_count)
    .bind(snapshot.jobs_offer_count)
    .bind(snapshot.jobs_rejected_count)
    .bind(snapshot.jobs_ghosted_count)
    .bind(snapshot.jobs_pipeline_velocity)
    .bind(snapshot.jobs_application_success_rate)
    .bind(&snapshot.jobs_last_activity_date)
    .bind(snapshot.jobs_days_since_last_activity)
    .bind(&snapshot.recent_activity_ids)
    .bind(&snapshot.recent_activity_types)
    .bind(&snapshot.recent_activity_timestamps)
    .bind(&snapshot.recent_activity_summary_text)
    .bind(snapshot.attention_required_flag)
    .bind(snapshot.overdue_goals_flag)
    .bind(snapshot.habit_streak_break_risk_flag)
    .bind(snapshot.diary_gap_warning_flag)
    .bind(snapshot.job_pipeline_stall_flag)
    .bind(snapshot.critical_alert_count)
    .bind(snapshot.warning_alert_count)
    .bind(&snapshot.upcoming_habit_deadlines)
    .bind(&snapshot.upcoming_goal_reviews)
    .bind(&snapshot.upcoming_job_interviews)
    .bind(&snapshot.suggested_next_actions)
    .bind(snapshot.avg_energy_level_7d)
    .bind(snapshot.avg_stress_level_7d)
    .bind(snapshot.sleep_quality_avg_7d)
    .bind(snapshot.emotional_load_index)
    .bind(snapshot.cognitive_load_index)
    .bind(&snapshot.dashboard_time_range)
    .bind(&snapshot.dashboard_focus_mode)
    .bind(snapshot.dashboard_last_refreshed_at)
    .bind(snapshot.cache_generated_at)
    .bind(snapshot.cache_valid_until)
    .bind(&snapshot.data_sources_version)
    .bind(snapshot.analytics_computation_duration_ms)
    .execute(pool)
    .await?;

    Ok(())
}
