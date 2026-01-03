use crate::app::error::AppError;
use crate::app::state::SharedState;
use crate::domains::dashboard::analytics::compute_dashboard;
use crate::domains::dashboard::model::DashboardSnapshot;
use crate::domains::dashboard::repository::{get_latest_snapshot, save_snapshot};
use chrono::Utc;
use tauri::State;

#[tauri::command]
pub async fn get_dashboard(
    state: State<'_, SharedState>,
    force_refresh: bool,
) -> Result<DashboardSnapshot, AppError> {
    let state_lock = state.lock().await;
    let pool = &state_lock.db;

    if !force_refresh {
        if let Some(snapshot) = get_latest_snapshot(pool).await? {
            // Check if cache is still valid
            let now = Utc::now().timestamp();
            if let Some(valid_until) = snapshot.cache_valid_until {
                if now < valid_until {
                    return Ok(snapshot);
                }
            }
        }
    }

    // Drop lock before expensive computation if possible,
    // but here we need the pool which is inside the lock.
    // For now, we keep the lock as the computation is mostly DB queries.
    let fresh_snapshot = compute_dashboard(pool).await?;
    save_snapshot(pool, &fresh_snapshot).await?;

    Ok(fresh_snapshot)
}
