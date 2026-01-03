pub mod app;
pub mod db;
pub mod domains;
pub mod commands;
pub mod migrations;
pub mod analytics;
pub mod utils;

use std::sync::Arc;
use tokio::sync::Mutex;
use crate::app::state::{AppState, SharedState, AppConfig};
use crate::db::connection::establish_connection;
use crate::migrations::runner::run_migrations;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Initialize database
            let database_url = "sqlite:nocturne.db";
            
            let pool = tauri::async_runtime::block_on(async {
                let pool = establish_connection(database_url).await
                    .expect("Failed to connect to database");
                
                run_migrations(&pool).await
                    .expect("Failed to run migrations");
                
                pool
            });

            let state: SharedState = Arc::new(Mutex::new(AppState {
                db: pool,
                config: AppConfig::default(),
            }));

            app.manage(state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            crate::commands::diary::create_diary_entry,
            crate::commands::diary::get_diary_entries,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}