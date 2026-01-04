use crate::app::error::AppError;
use crate::domains::habits::habit_log::{CreateHabitLogInput, HabitLog};
use crate::domains::habits::model::{CreateHabitInput, Habit};
use chrono::Utc;
use sqlx::{Row, SqlitePool};
use uuid::Uuid;

pub async fn insert_habit(pool: &SqlitePool, input: &CreateHabitInput) -> Result<String, AppError> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();

    sqlx::query(
        "INSERT INTO habits (
            habit_id, habit_name, habit_type, habit_description, 
            habit_icon_emoji, habit_color, schedule_type,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&input.habit_name)
    .bind(&input.habit_type)
    .bind(&input.habit_description)
    .bind(&input.habit_icon_emoji)
    .bind(&input.habit_color)
    .bind(&input.schedule_type)
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn fetch_habit(pool: &SqlitePool, id: &str) -> Result<Habit, AppError> {
    let habit = sqlx::query_as::<_, Habit>("SELECT * FROM habits WHERE habit_id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Habit {} not found", id)))?;

    Ok(habit)
}

pub async fn list_habits(pool: &SqlitePool) -> Result<Vec<Habit>, AppError> {
    let habits = sqlx::query_as::<_, Habit>(
        "SELECT * FROM habits WHERE habit_visibility != 'archived' ORDER BY created_at DESC",
    )
    .fetch_all(pool)
    .await?;

    Ok(habits)
}

pub async fn get_today_habits(pool: &SqlitePool, date: &str) -> Result<Vec<Habit>, AppError> {
    let habits = sqlx::query_as::<_, Habit>(
        "SELECT * FROM habits 
         WHERE habit_visibility = 'active' 
         AND (schedule_start_date IS NULL OR schedule_start_date <= ?)
         AND (schedule_end_date IS NULL OR schedule_end_date >= ?)
         ORDER BY habit_priority_level DESC, created_at ASC",
    )
    .bind(date)
    .bind(date)
    .fetch_all(pool)
    .await?;

    Ok(habits)
}

pub async fn insert_habit_log(
    pool: &SqlitePool,
    input: &CreateHabitLogInput,
) -> Result<String, AppError> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();

    sqlx::query(
        "INSERT OR REPLACE INTO habit_logs (
            log_id, habit_id, log_date, logged_at, value, status, 
            note, mood, energy_level, is_manual, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)",
    )
    .bind(&id)
    .bind(&input.habit_id)
    .bind(&input.log_date)
    .bind(now)
    .bind(&input.value)
    .bind(&input.status)
    .bind(&input.note)
    .bind(&input.mood)
    .bind(&input.energy_level)
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn get_habit_logs_for_date_range(
    pool: &SqlitePool,
    habit_id: &str,
    start_date: &str,
    end_date: &str,
) -> Result<Vec<HabitLog>, AppError> {
    let rows = sqlx::query(
        "SELECT log_id, habit_id, log_date, logged_at, value, status, 
         note, mood, energy_level, context, is_manual, source, created_at, updated_at
         FROM habit_logs 
         WHERE habit_id = ? AND log_date >= ? AND log_date <= ?
         ORDER BY log_date ASC",
    )
    .bind(habit_id)
    .bind(start_date)
    .bind(end_date)
    .fetch_all(pool)
    .await?;

    let mut logs = Vec::new();
    for row in rows {
        logs.push(HabitLog {
            log_id: row.get("log_id"),
            habit_id: row.get("habit_id"),
            log_date: row.get("log_date"),
            logged_at: row.get("logged_at"),
            value: row.get("value"),
            status: row.get("status"),
            note: row.get("note"),
            mood: row.get("mood"),
            energy_level: row.get("energy_level"),
            context: row.get("context"),
            is_manual: row.get::<i32, _>("is_manual") != 0,
            source: row.get("source"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        });
    }

    Ok(logs)
}

pub async fn get_habit_log_for_date(
    pool: &SqlitePool,
    habit_id: &str,
    date: &str,
) -> Result<Option<HabitLog>, AppError> {
    let row = sqlx::query(
        "SELECT log_id, habit_id, log_date, logged_at, value, status, 
         note, mood, energy_level, context, is_manual, source, created_at, updated_at
         FROM habit_logs WHERE habit_id = ? AND log_date = ?",
    )
    .bind(habit_id)
    .bind(date)
    .fetch_optional(pool)
    .await?;

    if let Some(row) = row {
        Ok(Some(HabitLog {
            log_id: row.get("log_id"),
            habit_id: row.get("habit_id"),
            log_date: row.get("log_date"),
            logged_at: row.get("logged_at"),
            value: row.get("value"),
            status: row.get("status"),
            note: row.get("note"),
            mood: row.get("mood"),
            energy_level: row.get("energy_level"),
            context: row.get("context"),
            is_manual: row.get::<i32, _>("is_manual") != 0,
            source: row.get("source"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        }))
    } else {
        Ok(None)
    }
}
