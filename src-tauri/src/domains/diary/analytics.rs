use crate::app::error::AppError;
use sqlx::SqlitePool;

pub async fn recompute_diary_analytics(
    _pool: &SqlitePool,
    _entry_date: &str,
) -> Result<(), AppError> {
    Ok(())
}
