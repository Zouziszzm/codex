use crate::app::error::AppError;
use crate::domains::habits::model::CreateHabitInput;

pub fn validate_create_habit(input: &CreateHabitInput) -> Result<(), AppError> {
    if input.habit_name.trim().is_empty() {
        return Err(AppError::Validation(
            "Habit name cannot be empty.".to_string(),
        ));
    }

    let valid_types = vec!["boolean", "quantitative", "duration", "checklist"];
    if !valid_types.contains(&input.habit_type.as_str()) {
        return Err(AppError::Validation(format!(
            "Invalid habit type: {}. Must be one of {:?}",
            input.habit_type, valid_types
        )));
    }

    Ok(())
}
