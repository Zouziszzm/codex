use crate::app::error::AppError;
use crate::domains::habits::model::{CreateHabitInput, Habit};
use chrono::Utc;
use sqlx::SqlitePool;
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
