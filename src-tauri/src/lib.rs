pub mod analytics;
pub mod app;
pub mod commands;
pub mod db;
pub mod domains;
pub mod migrations;
pub mod utils;

use crate::app::state::{AppConfig, AppState, SharedState};
use crate::db::connection::establish_connection;
use crate::migrations::runner::run_migrations;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

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
                let pool = establish_connection(database_url)
                    .await
                    .expect("Failed to connect to database");

                run_migrations(&pool)
                    .await
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
            crate::commands::diary::get_diary_entry,
            crate::commands::diary::setup_diary,
            crate::commands::diary::update_diary_entry,
            crate::commands::diary::get_diary_sub_pages,
            crate::commands::habits::create_habit,
            crate::commands::habits::get_habits,
            crate::commands::habits::get_today_habits,
            crate::commands::habits::log_habit_completion,
            crate::commands::habits::get_habit_analytics,
            crate::commands::goals::create_goal,
            crate::commands::goals::get_goals,
            crate::commands::goals::get_goal,
            crate::commands::jobs::create_job_application,
            crate::commands::jobs::get_job_applications,
            crate::commands::jobs::get_job_application,
            crate::commands::habits::get_habit,
            crate::commands::dashboard::get_dashboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
