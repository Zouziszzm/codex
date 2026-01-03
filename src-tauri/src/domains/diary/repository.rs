use crate::app::error::AppError;
use crate::domains::diary::model::{CreateDiaryInput, DiaryEntry};
use chrono::Utc;
use sqlx::SqlitePool;
use uuid::Uuid;

pub async fn insert_entry(pool: &SqlitePool, input: &CreateDiaryInput) -> Result<String, AppError> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().timestamp();
    let date = chrono::NaiveDate::parse_from_str(&input.entry_date, "%Y-%m-%d")
        .map_err(|_| AppError::Validation("Invalid date".to_string()))?;

    let year = date.format("%Y").to_string().parse::<i32>().unwrap_or(0);
    let month = date.format("%m").to_string().parse::<i32>().unwrap_or(0);
    let day = date.format("%d").to_string().parse::<i32>().unwrap_or(0);
    let week = date.format("%V").to_string().parse::<i32>().unwrap_or(0);
    let dow = date.format("%u").to_string().parse::<i32>().unwrap_or(0);

    sqlx::query(
        "INSERT INTO diary_entries (
            diary_entry_id, entry_date, entry_year, entry_month, entry_day, 
            entry_week_of_year, entry_day_of_week, content_json, title,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&input.entry_date)
    .bind(year)
    .bind(month)
    .bind(day)
    .bind(week)
    .bind(dow)
    .bind(&input.content_json)
    .bind(&input.title)
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn fetch_entry(pool: &SqlitePool, id: &str) -> Result<DiaryEntry, AppError> {
    let entry =
        sqlx::query_as::<_, DiaryEntry>("SELECT * FROM diary_entries WHERE diary_entry_id = ?")
            .bind(id)
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Diary entry {} not found", id)))?;

    Ok(entry)
}

pub async fn list_entries(pool: &SqlitePool) -> Result<Vec<DiaryEntry>, AppError> {
    let entries = sqlx::query_as::<_, DiaryEntry>(
        "SELECT * FROM diary_entries WHERE is_deleted = 0 AND parent_page_id IS NULL ORDER BY entry_date DESC",
    )
    .fetch_all(pool)
    .await?;

    Ok(entries)
}

pub async fn update_entry(
    pool: &SqlitePool,
    id: &str,
    title: Option<String>,
    content_json: &str,
    word_count: i32,
    mood_label: Option<String>,
    mood_rating: Option<i32>,
    energy_level: Option<i32>,
    stress_level: Option<i32>,
    importance_level: i32,
) -> Result<(), AppError> {
    let now = Utc::now().timestamp();
    sqlx::query(
        "UPDATE diary_entries SET 
            title = ?, 
            content_json = ?, 
            word_count = ?, 
            mood_label = ?, 
            mood_rating = ?, 
            energy_level = ?, 
            stress_level = ?, 
            importance_level = ?,
            updated_at = ? 
         WHERE diary_entry_id = ?",
    )
    .bind(title)
    .bind(content_json)
    .bind(word_count)
    .bind(mood_label)
    .bind(mood_rating)
    .bind(energy_level)
    .bind(stress_level)
    .bind(importance_level)
    .bind(now)
    .bind(id)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn ensure_yearly_entries(pool: &SqlitePool, year_val: i32) -> Result<(), AppError> {
    use chrono::Datelike;
    let start_date = chrono::NaiveDate::from_ymd_opt(year_val, 1, 1).unwrap();
    let is_leap = (year_val % 4 == 0 && year_val % 100 != 0) || (year_val % 400 == 0);
    let days_count = if is_leap { 366 } else { 365 };

    for i in 0..days_count {
        let date = start_date + chrono::Duration::days(i as i64);
        let date_str = date.format("%Y-%m-%d").to_string();

        // Check if exists
        let exists: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM diary_entries WHERE entry_date = ? AND is_primary_page = 1)")
            .bind(&date_str)
            .fetch_one(pool)
            .await?;

        if !exists {
            let id = Uuid::new_v4().to_string();
            let now = Utc::now().timestamp();
            let year = date.year();
            let month = date.month() as i32;
            let day = date.day() as i32;
            let week = date.iso_week().week() as i32;
            let dow = date.weekday().number_from_monday() as i32;

            sqlx::query(
                "INSERT INTO diary_entries (
                    diary_entry_id, entry_date, entry_year, entry_month, entry_day, 
                    entry_week_of_year, entry_day_of_week, content_json, title,
                    is_primary_page, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)",
            )
            .bind(&id)
            .bind(&date_str)
            .bind(year)
            .bind(month)
            .bind(day)
            .bind(week)
            .bind(dow)
            .bind("[{\"type\":\"paragraph\",\"content\":[]}]") // Valid blocknote paragraph
            .bind(format!("Reflection: {}", date_str))
            .bind(now)
            .bind(now)
            .execute(pool)
            .await?;
        }
    }

    Ok(())
}

pub async fn fetch_sub_pages(
    pool: &SqlitePool,
    parent_id: &str,
) -> Result<Vec<DiaryEntry>, AppError> {
    let entries = sqlx::query_as::<_, DiaryEntry>(
        "SELECT * FROM diary_entries WHERE parent_page_id = ? AND is_deleted = 0 ORDER BY created_at ASC",
    )
    .bind(parent_id)
    .fetch_all(pool)
    .await?;

    Ok(entries)
}
