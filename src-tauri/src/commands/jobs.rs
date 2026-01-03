use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::jobs::model::{CreateJobInput, JobApplication};
use crate::domains::jobs::repository::{
    fetch_job_application, insert_job_application, list_job_applications,
};
use crate::domains::jobs::validation::validate_create_job;
use tauri::State;

#[tauri::command]
pub async fn create_job_application(
    state: State<'_, SharedState>,
    input: CreateJobInput,
) -> Result<JobApplication, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    validate_create_job(&input)?;
    let id = insert_job_application(pool, &input).await?;
    let job = fetch_job_application(pool, &id).await?;
    Ok(job)
}

#[tauri::command]
pub async fn get_job_applications(
    state: State<'_, SharedState>,
) -> Result<Vec<JobApplication>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let jobs = list_job_applications(pool).await?;
    Ok(jobs)
}
