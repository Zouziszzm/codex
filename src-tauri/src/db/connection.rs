use crate::app::error::AppError;
use crate::db::encryption::get_encryption_key;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::SqlitePool;
use std::str::FromStr;

pub async fn establish_connection(database_url: &str) -> Result<SqlitePool, AppError> {
    let key = get_encryption_key();

    let options = SqliteConnectOptions::from_str(database_url)?.create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .after_connect(move |conn, _meta| {
            let key = key.clone();
            Box::pin(async move {
                sqlx::query(&format!("PRAGMA key = '{}';", key))
                    .execute(conn)
                    .await?;
                Ok(())
            })
        })
        .connect_with(options)
        .await?;

    Ok(pool)
}
