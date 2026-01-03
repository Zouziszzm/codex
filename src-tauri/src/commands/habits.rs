use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::habits::model::{CreateHabitInput, Habit};
use crate::domains::habits::repository::{fetch_habit, insert_habit, list_habits};
use crate::domains::habits::validation::validate_create_habit;
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
