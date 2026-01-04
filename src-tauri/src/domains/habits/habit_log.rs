use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HabitLog {
    pub log_id: String,
    pub habit_id: String,
    pub log_date: String,
    pub logged_at: i64,
    pub value: Option<f64>,
    pub status: String, // completed, partial, skipped, failed
    pub note: Option<String>,
    pub mood: Option<String>,
    pub energy_level: Option<i32>,
    pub context: Option<String>,
    pub is_manual: bool,
    pub source: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateHabitLogInput {
    pub habit_id: String,
    pub log_date: String,
    pub value: Option<f64>,
    pub status: String,
    pub note: Option<String>,
    pub mood: Option<String>,
    pub energy_level: Option<i32>,
}

