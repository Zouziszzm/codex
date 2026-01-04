-- 0007_habit_logs.sql

CREATE TABLE habit_logs (
    log_id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL,
    log_date TEXT NOT NULL,
    logged_at INTEGER NOT NULL,
    value REAL,
    status TEXT NOT NULL, -- completed, partial, skipped, failed
    note TEXT,
    mood TEXT,
    energy_level INTEGER,
    context TEXT,
    is_manual INTEGER NOT NULL DEFAULT 1,
    source TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE CASCADE,
    UNIQUE(habit_id, log_date)
);

CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_log_date ON habit_logs(log_date);

