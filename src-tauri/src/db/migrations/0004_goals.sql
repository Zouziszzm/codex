-- 0004_goals.sql

CREATE TABLE goals (
    -- 1. CORE IDENTITY & CLASSIFICATION
    goal_id TEXT PRIMARY KEY NOT NULL,
    goal_slug TEXT UNIQUE NOT NULL,
    goal_title TEXT NOT NULL,
    goal_short_title TEXT,
    goal_description TEXT,
    goal_motivation_statement TEXT,
    goal_type TEXT NOT NULL, -- outcome, process, performance, learning
    goal_category TEXT,
    goal_subcategory TEXT,
    goal_domain TEXT, -- health, career, finance, learning, personal
    goal_icon_emoji TEXT,
    goal_color TEXT,
    goal_visibility TEXT NOT NULL DEFAULT 'active', -- active, paused, archived
    goal_status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, failed, abandoned
    goal_priority_level INTEGER NOT NULL DEFAULT 0,
    goal_importance_weight REAL NOT NULL DEFAULT 1.0,
    goal_urgency_level INTEGER NOT NULL DEFAULT 0,
    goal_confidence_score REAL NOT NULL DEFAULT 0.0,
    goal_version INTEGER NOT NULL DEFAULT 1,

    -- 2. TIME, LIFECYCLE & REVIEW SYSTEM
    goal_created_date TEXT NOT NULL,
    goal_start_date TEXT,
    goal_target_date TEXT,
    goal_end_date TEXT,
    goal_deadline_type TEXT NOT NULL DEFAULT 'soft', -- hard, soft
    goal_time_horizon TEXT, -- short, medium, long
    goal_review_frequency TEXT, -- daily, weekly, monthly
    goal_last_reviewed_at INTEGER,
    goal_next_review_at INTEGER,
    goal_time_zone TEXT,
    goal_is_time_bound INTEGER NOT NULL DEFAULT 0,
    goal_days_remaining INTEGER,
    goal_days_elapsed INTEGER,
    goal_overdue_days INTEGER,

    -- 3. MEASUREMENT, METRICS & SUCCESS CRITERIA
    success_metric_type TEXT NOT NULL DEFAULT 'numeric', -- numeric, boolean, milestone, composite
    success_metric_unit TEXT,
    baseline_value REAL,
    current_value REAL NOT NULL DEFAULT 0.0,
    target_value REAL,
    minimum_success_value REAL,
    stretch_target_value REAL,
    max_allowed_value REAL,
    measurement_operator TEXT NOT NULL DEFAULT '>=', -- >=, <=, ==
    progress_percentage REAL NOT NULL DEFAULT 0.0,
    progress_delta REAL NOT NULL DEFAULT 0.0,
    progress_velocity REAL NOT NULL DEFAULT 0.0,
    progress_acceleration REAL NOT NULL DEFAULT 0.0,
    progress_last_updated_at INTEGER,
    progress_is_on_track INTEGER NOT NULL DEFAULT 1,
    progress_confidence_interval REAL,

    -- 4. MILESTONES, SUBGOALS & PHASES
    milestone_ids TEXT,
    milestone_count INTEGER NOT NULL DEFAULT 0,
    milestones_completed_count INTEGER NOT NULL DEFAULT 0,
    milestone_completion_percent REAL NOT NULL DEFAULT 0.0,
    milestone_required_order INTEGER NOT NULL DEFAULT 0,
    milestone_dependency_mode TEXT NOT NULL DEFAULT 'flexible', -- strict, flexible
    next_milestone_id TEXT,
    last_completed_milestone_id TEXT,
    milestone_failure_policy TEXT,
    milestone_auto_unlock INTEGER NOT NULL DEFAULT 0,
    milestone_weight_distribution TEXT,

    -- 5. DEPENDENCIES, BLOCKERS & UNLOCK LOGIC
    prerequisite_goal_ids TEXT,
    dependent_goal_ids TEXT,
    blocked_by_goal_ids TEXT,
    unlocks_goal_ids TEXT,
    dependency_type TEXT NOT NULL DEFAULT 'soft', -- hard, soft
    dependency_strength_score REAL NOT NULL DEFAULT 0.0,
    unlock_condition_type TEXT,
    unlock_threshold_value REAL,
    unlock_evaluation_frequency TEXT,
    unlock_last_evaluated_at INTEGER,
    unlock_is_ready INTEGER NOT NULL DEFAULT 1,
    unlock_auto_activate INTEGER NOT NULL DEFAULT 0,

    -- 6. HABIT, TASK, DIARY & JOB INTEGRATION
    linked_habit_ids TEXT,
    habit_contribution_weights TEXT,
    habit_completion_required INTEGER NOT NULL DEFAULT 0,
    habit_progress_aggregate REAL NOT NULL DEFAULT 0.0,
    habit_dependency_mode TEXT NOT NULL DEFAULT 'flexible',
    linked_task_ids TEXT,
    task_completion_required INTEGER NOT NULL DEFAULT 0,
    task_progress_aggregate REAL NOT NULL DEFAULT 0.0,
    task_dependency_mode TEXT NOT NULL DEFAULT 'flexible',
    linked_diary_page_ids TEXT,
    diary_reflection_required INTEGER NOT NULL DEFAULT 0,
    linked_job_ids TEXT,
    job_progress_dependency TEXT,

    -- 7. ANALYTICS, HEALTH & RISK (DERIVED — READ ONLY)
    completion_probability REAL NOT NULL DEFAULT 0.0,
    failure_probability REAL NOT NULL DEFAULT 0.0,
    burnout_risk_score REAL NOT NULL DEFAULT 0.0,
    confidence_trend REAL NOT NULL DEFAULT 0.0,
    consistency_index REAL NOT NULL DEFAULT 0.0,
    momentum_score REAL NOT NULL DEFAULT 0.0,
    volatility_score REAL NOT NULL DEFAULT 0.0,
    effort_to_reward_ratio REAL NOT NULL DEFAULT 0.0,
    expected_completion_date TEXT,
    deviation_from_plan REAL NOT NULL DEFAULT 0.0,
    goal_health_status TEXT,
    risk_level TEXT,
    risk_factors TEXT,

    -- 8. MOTIVATION, PSYCHOLOGY & IDENTITY
    motivation_type TEXT, -- intrinsic, extrinsic
    motivation_reason TEXT,
    identity_alignment_score REAL NOT NULL DEFAULT 0.0,
    emotional_commitment_score REAL NOT NULL DEFAULT 0.0,
    resistance_level REAL NOT NULL DEFAULT 0.0,
    fear_factor REAL NOT NULL DEFAULT 0.0,
    reward_expectation REAL,
    intrinsic_reward_description TEXT,
    extrinsic_reward_description TEXT,
    loss_aversion_enabled INTEGER NOT NULL DEFAULT 0,
    temptation_resistance_score REAL NOT NULL DEFAULT 0.0,

    -- 9. REWARDS, CONSEQUENCES & INCENTIVES
    reward_type TEXT,
    reward_value REAL,
    reward_currency TEXT,
    reward_trigger TEXT,
    reward_claimed INTEGER NOT NULL DEFAULT 0,
    punishment_type TEXT,
    punishment_value REAL,
    punishment_trigger TEXT,
    consequence_enforced INTEGER NOT NULL DEFAULT 0,
    consequence_notes TEXT,

    -- 10. CONTEXT, ENVIRONMENT & EXECUTION PREFERENCES
    preferred_execution_context TEXT,
    preferred_time_of_day TEXT,
    preferred_location TEXT,
    required_resources TEXT,
    optional_resources TEXT,
    external_constraints TEXT,
    social_support_required INTEGER NOT NULL DEFAULT 0,
    accountability_partner_id TEXT,
    accountability_check_frequency TEXT,

    -- 11. UI, DISPLAY & VISIBILITY CONTROL
    display_order INTEGER NOT NULL DEFAULT 0,
    display_group TEXT,
    display_section TEXT,
    display_hidden INTEGER NOT NULL DEFAULT 0,
    display_show_progress INTEGER NOT NULL DEFAULT 1,
    display_show_dependencies INTEGER NOT NULL DEFAULT 1,
    display_show_habits INTEGER NOT NULL DEFAULT 1,
    display_show_tasks INTEGER NOT NULL DEFAULT 1,
    display_badge_type TEXT,
    display_custom_label TEXT,

    -- 12. REVIEW, REFLECTION & LEARNING
    last_reflection_text TEXT,
    reflection_history TEXT,
    reflection_sentiment_score REAL NOT NULL DEFAULT 0.0,
    lessons_learned TEXT,
    obstacles_encountered TEXT,
    strategy_adjustments TEXT,
    review_count INTEGER NOT NULL DEFAULT 0,
    last_strategy_change_at INTEGER,

    -- 13. NOTIFICATIONS & ALERTS
    notification_enabled INTEGER NOT NULL DEFAULT 1,
    notification_channels TEXT,
    notification_schedule TEXT,
    notification_message TEXT,
    escalation_enabled INTEGER NOT NULL DEFAULT 0,
    escalation_delay INTEGER,
    escalation_last_triggered_at INTEGER,

    -- 14. AUDIT, SECURITY & SYSTEM
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_viewed_at INTEGER,
    created_by_profile_id TEXT,
    last_modified_by_profile_id TEXT,
    device_id TEXT,
    session_id TEXT,
    app_version_created TEXT,
    app_version_last_modified TEXT,
    encryption_key_id TEXT,
    content_hash TEXT,
    sync_state TEXT NOT NULL DEFAULT 'local',
    conflict_state TEXT,
    conflict_resolved_at INTEGER,
    data_migration_version INTEGER NOT NULL DEFAULT 1,

    -- 15. SYSTEM & DEBUG (HIDDEN)
    is_system_generated INTEGER NOT NULL DEFAULT 0,
    is_template INTEGER NOT NULL DEFAULT 0,
    template_source TEXT,
    internal_flags TEXT,
    experimental_fields TEXT
);
