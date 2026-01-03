use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::diary::analytics::recompute_diary_analytics;
use crate::domains::diary::model::{CreateDiaryInput, DiaryEntry};
use crate::domains::diary::repository::{
    ensure_yearly_entries, fetch_entry, fetch_sub_pages, insert_entry, list_entries, update_entry,
};
use crate::domains::diary::validation::{validate_create, validate_update};
use tauri::State;

#[tauri::command]
pub async fn create_diary_entry(
    state: State<'_, SharedState>,
    input: CreateDiaryInput,
) -> Result<DiaryEntry, AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    validate_create(&input)?;
    let id = insert_entry(pool, &input).await?;
    recompute_diary_analytics(pool, &input.entry_date).await?;
    let entry = fetch_entry(pool, &id).await?;
    Ok(entry)
}

#[tauri::command]
pub async fn get_diary_entries(state: State<'_, SharedState>) -> Result<Vec<DiaryEntry>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let entries = list_entries(pool).await?;
    Ok(entries)
}

#[tauri::command]
pub async fn get_diary_entry(
    state: State<'_, SharedState>,
    id: String,
) -> Result<DiaryEntry, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let entry = fetch_entry(pool, &id).await?;
    Ok(entry)
}

#[tauri::command]
pub async fn setup_diary(state: State<'_, SharedState>) -> Result<(), AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    ensure_yearly_entries(pool, 2026).await?;
    Ok(())
}

#[tauri::command]
pub async fn update_diary_entry(
    state: State<'_, SharedState>,
    id: String,
    title: Option<String>,
    content_json: String,
    word_count: i32,
    mood_label: Option<String>,
    mood_rating: Option<i32>,
    energy_level: Option<i32>,
    stress_level: Option<i32>,
    importance_level: i32,
) -> Result<(), AppError> {
    let state = state.lock().await;
    let pool = &state.db;

    // Fetch existing entry to check date
    let entry = fetch_entry(pool, &id).await?;
    validate_update(&entry.entry_date)?;

    update_entry(
        pool,
        &id,
        title,
        &content_json,
        word_count,
        mood_label,
        mood_rating,
        energy_level,
        stress_level,
        importance_level,
    )
    .await?;
    Ok(())
}

#[tauri::command]
pub async fn get_diary_sub_pages(
    state: State<'_, SharedState>,
    parent_id: String,
) -> Result<Vec<DiaryEntry>, AppError> {
    let state = state.lock().await;
    let pool = &state.db;
    let entries = fetch_sub_pages(pool, &parent_id).await?;
    Ok(entries)
}
