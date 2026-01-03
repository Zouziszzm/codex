use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct AppState {
    pub db: SqlitePool,
    pub config: AppConfig,
}

#[derive(Clone, Default)]
pub struct AppConfig {
    pub encryption_key: Option<String>,
}

pub type SharedState = Arc<Mutex<AppState>>;
