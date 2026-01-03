-- 0006_dashboard.sql

CREATE TABLE dashboard_snapshots (
    -- 1. DASHBOARD IDENTITY & CONTEXT
    dashboard_id TEXT PRIMARY KEY NOT NULL,
    dashboard_date TEXT NOT NULL,      -- YYYY-MM-DD (today)
    dashboard_timezone TEXT,
    active_profile_id TEXT,
    dashboard_version INTEGER NOT NULL DEFAULT 1,

    -- 2. GLOBAL OVERVIEW METRICS (TOP SUMMARY)
    overall_productivity_score REAL NOT NULL DEFAULT 0.0,
    overall_consistency_index REAL NOT NULL DEFAULT 0.0,
    overall_momentum_score REAL NOT NULL DEFAULT 0.0,
    burnout_risk_global REAL NOT NULL DEFAULT 0.0,
    stress_load_global REAL NOT NULL DEFAULT 0.0,
    confidence_global REAL NOT NULL DEFAULT 0.0,
    system_health_status TEXT NOT NULL DEFAULT 'good', -- excellent, good, warning, critical

    -- 3. TODAY SNAPSHOT (PRIMARY FOCUS)
    today_date TEXT NOT NULL,
    today_diary_exists INTEGER NOT NULL DEFAULT 0,
    today_diary_word_count INTEGER NOT NULL DEFAULT 0,
    today_diary_mood_rating INTEGER,
    today_habits_total INTEGER NOT NULL DEFAULT 0,
    today_habits_completed INTEGER NOT NULL DEFAULT 0,
    today_habits_missed INTEGER NOT NULL DEFAULT 0,
    today_habit_completion_rate REAL NOT NULL DEFAULT 0.0,
    today_goals_progress_events INTEGER NOT NULL DEFAULT 0,
    today_job_actions_count INTEGER NOT NULL DEFAULT 0,

    -- 4. DIARY DASHBOARD AGGREGATES
    diary_current_streak_length INTEGER NOT NULL DEFAULT 0,
    diary_longest_streak INTEGER NOT NULL DEFAULT 0,
    diary_filled_days_year INTEGER NOT NULL DEFAULT 0,
    diary_year_completion_percentage REAL NOT NULL DEFAULT 0.0,
    diary_rolling_7_day_avg_words REAL NOT NULL DEFAULT 0.0,
    diary_rolling_30_day_avg_words REAL NOT NULL DEFAULT 0.0,
    diary_last_entry_date TEXT,
    diary_days_since_last_entry INTEGER,

    -- 5. HABIT DASHBOARD AGGREGATES
    habits_total_active INTEGER NOT NULL DEFAULT 0,
    habits_on_track_count INTEGER NOT NULL DEFAULT 0,
    habits_off_track_count INTEGER NOT NULL DEFAULT 0,
    habits_completion_rate_7d REAL NOT NULL DEFAULT 0.0,
    habits_completion_rate_30d REAL NOT NULL DEFAULT 0.0,
    habits_longest_current_streak INTEGER NOT NULL DEFAULT 0,
    habits_most_consistent_habit_id TEXT,
    habits_burnout_risk_score REAL NOT NULL DEFAULT 0.0,

    -- 6. GOAL DASHBOARD AGGREGATES
    goals_total_active INTEGER NOT NULL DEFAULT 0,
    goals_completed_total INTEGER NOT NULL DEFAULT 0,
    goals_on_track_count INTEGER NOT NULL DEFAULT 0,
    goals_at_risk_count INTEGER NOT NULL DEFAULT 0,
    goals_blocked_count INTEGER NOT NULL DEFAULT 0,
    goals_avg_progress_percentage REAL NOT NULL DEFAULT 0.0,
    goals_nearest_deadline_date TEXT,
    goals_overdue_count INTEGER NOT NULL DEFAULT 0,
    goals_overall_health_status TEXT,

    -- 7. JOB TRACKER DASHBOARD AGGREGATES
    jobs_total_active INTEGER NOT NULL DEFAULT 0,
    jobs_applied_total INTEGER NOT NULL DEFAULT 0,
    jobs_interviewing_count INTEGER NOT NULL DEFAULT 0,
    jobs_offer_count INTEGER NOT NULL DEFAULT 0,
    jobs_rejected_count INTEGER NOT NULL DEFAULT 0,
    jobs_ghosted_count INTEGER NOT NULL DEFAULT 0,
    jobs_pipeline_velocity REAL NOT NULL DEFAULT 0.0,
    jobs_application_success_rate REAL NOT NULL DEFAULT 0.0,
    jobs_last_activity_date TEXT,
    jobs_days_since_last_activity INTEGER,

    -- 8. RECENT ACTIVITY FEED (CROSS-DOMAIN)
    recent_activity_ids TEXT,           -- stored as JSON or comma-separated
    recent_activity_types TEXT,
    recent_activity_timestamps TEXT,
    recent_activity_summary_text TEXT,

    -- 9. ALERTS, RISKS & ATTENTION REQUIRED
    attention_required_flag INTEGER NOT NULL DEFAULT 0,
    overdue_goals_flag INTEGER NOT NULL DEFAULT 0,
    habit_streak_break_risk_flag INTEGER NOT NULL DEFAULT 0,
    diary_gap_warning_flag INTEGER NOT NULL DEFAULT 0,
    job_pipeline_stall_flag INTEGER NOT NULL DEFAULT 0,
    critical_alert_count INTEGER NOT NULL DEFAULT 0,
    warning_alert_count INTEGER NOT NULL DEFAULT 0,

    -- 10. UPCOMING & NEXT ACTIONS
    upcoming_habit_deadlines TEXT,
    upcoming_goal_reviews TEXT,
    upcoming_job_interviews TEXT,
    suggested_next_actions TEXT,

    -- 11. TIME, ENERGY & WELLBEING SUMMARY
    avg_energy_level_7d REAL NOT NULL DEFAULT 0.0,
    avg_stress_level_7d REAL NOT NULL DEFAULT 0.0,
    sleep_quality_avg_7d REAL NOT NULL DEFAULT 0.0,
    emotional_load_index REAL NOT NULL DEFAULT 0.0,
    cognitive_load_index REAL NOT NULL DEFAULT 0.0,

    -- 12. FILTERS & DASHBOARD STATE (READ-ONLY)
    dashboard_time_range TEXT NOT NULL DEFAULT 'today', -- today, 7d, 30d, year
    dashboard_focus_mode TEXT NOT NULL DEFAULT 'balanced', -- balanced, habits, goals, career
    dashboard_last_refreshed_at INTEGER NOT NULL,

    -- 13. AUDIT, CACHE & SYSTEM
    cache_generated_at INTEGER NOT NULL,
    cache_valid_until INTEGER,
    data_sources_version TEXT,
    analytics_computation_duration_ms INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_dashboard_snapshots_date ON dashboard_snapshots(dashboard_date);
