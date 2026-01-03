use crate::app::error::AppError;
use crate::domains::goals::model::CreateGoalInput;

pub fn validate_create_goal(input: &CreateGoalInput) -> Result<(), AppError> {
    if input.goal_title.trim().is_empty() {
        return Err(AppError::Validation(
            "Goal title cannot be empty.".to_string(),
        ));
    }

    let valid_types = vec!["outcome", "process", "performance", "learning"];
    if !valid_types.contains(&input.goal_type.as_str()) {
        return Err(AppError::Validation(format!(
            "Invalid goal type: {}. Must be one of {:?}",
            input.goal_type, valid_types
        )));
    }

    Ok(())
}
