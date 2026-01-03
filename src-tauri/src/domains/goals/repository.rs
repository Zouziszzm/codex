use crate::app::error::AppError;
use crate::domains::goals::model::{CreateGoalInput, Goal};
use chrono::{Local, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

pub async fn insert_goal(pool: &SqlitePool, input: &CreateGoalInput) -> Result<String, AppError> {
    let id = Uuid::new_v4().to_string();
    let slug = format!(
        "{}-{}",
        input.goal_title.to_lowercase().replace(" ", "-"),
        Uuid::new_v4().to_string()[..8].to_string()
    );
    let now_ts = Utc::now().timestamp();
    let today = Local::now().format("%Y-%m-%d").to_string();

    sqlx::query(
        "INSERT INTO goals (
            goal_id, goal_slug, goal_title, goal_type, goal_category, 
            goal_description, goal_target_date, goal_created_date,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&slug)
    .bind(&input.goal_title)
    .bind(&input.goal_type)
    .bind(&input.goal_category)
    .bind(&input.goal_description)
    .bind(&input.goal_target_date)
    .bind(today)
    .bind(now_ts)
    .bind(now_ts)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn fetch_goal(pool: &SqlitePool, id: &str) -> Result<Goal, AppError> {
    let goal = sqlx::query_as::<_, Goal>("SELECT * FROM goals WHERE goal_id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Goal {} not found", id)))?;

    Ok(goal)
}

pub async fn list_goals(pool: &SqlitePool) -> Result<Vec<Goal>, AppError> {
    let goals = sqlx::query_as::<_, Goal>(
        "SELECT * FROM goals WHERE goal_status != 'completed' AND goal_visibility = 'active' ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await?;

    Ok(goals)
}
