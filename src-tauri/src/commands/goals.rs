use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::goals::model::{CreateGoalInput, Goal};
use crate::domains::goals::repository::{fetch_goal, insert_goal, list_goals};
use crate::domains::goals::validation::validate_create_goal;
use tauri::State;

#[tauri::command]
pub async fn create_goal(
    state: State<'_, SharedState>,
    input: CreateGoalInput,
) -> Result<Goal, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    validate_create_goal(&input)?;
    let id = insert_goal(pool, &input).await?;
    let goal = fetch_goal(pool, &id).await?;
    Ok(goal)
}

#[tauri::command]
pub async fn get_goals(state: State<'_, SharedState>) -> Result<Vec<Goal>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let goals = list_goals(pool).await?;
    Ok(goals)
}
