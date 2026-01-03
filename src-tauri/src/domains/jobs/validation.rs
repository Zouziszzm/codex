use crate::app::error::AppError;
use crate::domains::jobs::model::CreateJobInput;

pub fn validate_create_job(input: &CreateJobInput) -> Result<(), AppError> {
    if input.job_title.trim().is_empty() {
        return Err(AppError::Validation(
            "Job title cannot be empty.".to_string(),
        ));
    }
    if input.company_name.trim().is_empty() {
        return Err(AppError::Validation(
            "Company name cannot be empty.".to_string(),
        ));
    }
    Ok(())
}
