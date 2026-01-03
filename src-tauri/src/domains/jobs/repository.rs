use crate::app::error::AppError;
use crate::domains::jobs::model::{CreateJobInput, JobApplication};
use chrono::{Local, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

pub async fn insert_job_application(
    pool: &SqlitePool,
    input: &CreateJobInput,
) -> Result<String, AppError> {
    let id = Uuid::new_v4().to_string();
    let slug = format!(
        "{}-{}-{}",
        input.company_name.to_lowercase().replace(" ", "-"),
        input.job_title.to_lowercase().replace(" ", "-"),
        Uuid::new_v4().to_string()[..8].to_string()
    );
    let now_ts = Utc::now().timestamp();
    let today = Local::now().format("%Y-%m-%d").to_string();

    sqlx::query(
        "INSERT INTO job_applications (
            job_application_id, job_application_slug, job_title, company_name,
            job_level, job_employment_type, job_work_mode, job_posting_url,
            application_created_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&slug)
    .bind(&input.job_title)
    .bind(&input.company_name)
    .bind(&input.job_level)
    .bind(&input.job_employment_type)
    .bind(&input.job_work_mode)
    .bind(&input.job_posting_url)
    .bind(today)
    .bind(now_ts)
    .bind(now_ts)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn fetch_job_application(
    pool: &SqlitePool,
    id: &str,
) -> Result<JobApplication, AppError> {
    let job = sqlx::query_as::<_, JobApplication>(
        "SELECT * FROM job_applications WHERE job_application_id = ?",
    )
    .bind(id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Job application {} not found", id)))?;

    Ok(job)
}

pub async fn list_job_applications(pool: &SqlitePool) -> Result<Vec<JobApplication>, AppError> {
    let jobs = sqlx::query_as::<_, JobApplication>(
        "SELECT * FROM job_applications WHERE job_visibility = 'active' ORDER BY created_at DESC",
    )
    .fetch_all(pool)
    .await?;

    Ok(jobs)
}
