use crate::app::error::AppError;
use sqlx::SqlitePool;

pub async fn run_migrations(pool: &SqlitePool) -> Result<(), AppError> {
    sqlx::migrate!("./src/db/migrations").run(pool).await?;
    Ok(())
}
