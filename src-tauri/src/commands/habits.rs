use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::habits::habit_log::{CreateHabitLogInput, HabitLog};
use crate::domains::habits::model::{CreateHabitInput, Habit};
use crate::domains::habits::repository::{
    fetch_habit, get_habit_log_for_date, get_habit_logs_for_date_range,
    insert_habit, insert_habit_log, list_habits,
};
use crate::domains::habits::validation::validate_create_habit;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tauri::State;

#[tauri::command]
pub async fn create_habit(
    state: State<'_, SharedState>,
    input: CreateHabitInput,
) -> Result<Habit, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    validate_create_habit(&input)?;
    let id = insert_habit(pool, &input).await?;
    let habit = fetch_habit(pool, &id).await?;
    Ok(habit)
}

#[tauri::command]
pub async fn get_habits(state: State<'_, SharedState>) -> Result<Vec<Habit>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let habits = list_habits(pool).await?;
    Ok(habits)
}

#[tauri::command]
pub async fn get_habit(
    state: State<'_, SharedState>,
    habit_id: String,
) -> Result<Habit, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let habit = fetch_habit(pool, &habit_id).await?;
    Ok(habit)
}

#[tauri::command]
pub async fn get_today_habits(
    state: State<'_, SharedState>,
    date: String,
) -> Result<Vec<Habit>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let habits = crate::domains::habits::repository::get_today_habits(pool, &date).await?;
    Ok(habits)
}

#[tauri::command]
pub async fn log_habit_completion(
    state: State<'_, SharedState>,
    input: CreateHabitLogInput,
) -> Result<HabitLog, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    let _log_id = insert_habit_log(pool, &input).await?;
    let log = get_habit_log_for_date(pool, &input.habit_id, &input.log_date)
        .await?
        .ok_or_else(|| AppError::NotFound("Habit log not found".to_string()))?;

    Ok(log)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HabitAnalytics {
    pub current_streak: i32,
    pub consistency_score: f64,
    pub completion_rate: f64,
    pub heatmap_data: Vec<HeatmapDay>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HeatmapDay {
    pub date: String,
    pub count: i32,
    pub intensity: f64,
}

#[tauri::command]
pub async fn get_habit_analytics(
    state: State<'_, SharedState>,
    habit_id: String,
    start_date: String,
    end_date: String,
) -> Result<HabitAnalytics, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    let logs = get_habit_logs_for_date_range(pool, &habit_id, &start_date, &end_date).await?;

    // Calculate streak
    let mut current_streak = 0;
    let today = Utc::now().format("%Y-%m-%d").to_string();

    for log in logs.iter().rev() {
        if log.log_date == today && log.status == "completed" {
            current_streak += 1;
            // Decrement date (simplified - would need proper date arithmetic)
        } else {
            break;
        }
    }

    // Calculate completion rate
    let completed_count = logs.iter().filter(|l| l.status == "completed").count();
    let completion_rate = if logs.is_empty() {
        0.0
    } else {
        completed_count as f64 / logs.len() as f64
    };

    // Calculate consistency score (simplified)
    let consistency_score = completion_rate * 100.0;

    // Generate heatmap data
    let mut heatmap_data = Vec::new();
    for log in &logs {
        let intensity = if log.status == "completed" {
            1.0
        } else if log.status == "partial" {
            0.5
        } else {
            0.0
        };
        heatmap_data.push(HeatmapDay {
            date: log.log_date.clone(),
            count: if log.status == "completed" { 1 } else { 0 },
            intensity,
        });
    }

    Ok(HabitAnalytics {
        current_streak,
        consistency_score,
        completion_rate,
        heatmap_data,
    })
}
