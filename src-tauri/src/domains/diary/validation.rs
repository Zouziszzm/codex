use crate::app::error::AppError;
use crate::domains::diary::model::CreateDiaryInput;
use chrono::NaiveDate;

pub fn validate_create(input: &CreateDiaryInput) -> Result<(), AppError> {
    let date = NaiveDate::parse_from_str(&input.entry_date, "%Y-%m-%d").map_err(|_| {
        AppError::Validation("Invalid date format. Expected YYYY-MM-DD.".to_string())
    })?;

    if date.format("%Y").to_string().parse::<i32>().unwrap_or(0) < 2026 {
        return Err(AppError::Validation(
            "Diary entries must start from 2026 onwards.".to_string(),
        ));
    }

    let today = chrono::Utc::now().naive_utc().date();
    if date > today {
        return Err(AppError::Validation(
            "Future dates are currently locked for new entries.".to_string(),
        ));
    }

    if input.content_json.is_empty() {
        return Err(AppError::Validation("Content cannot be empty.".to_string()));
    }
    Ok(())
}

pub fn validate_update(entry_date: &str) -> Result<(), AppError> {
    let date = NaiveDate::parse_from_str(entry_date, "%Y-%m-%d")
        .map_err(|_| AppError::Validation("Invalid entry date format.".to_string()))?;

    let today = chrono::Utc::now().naive_utc().date();
    if date > today {
        return Err(AppError::Validation(
            "Future entries cannot be modified.".to_string(),
        ));
    }
    Ok(())
}
