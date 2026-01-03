# DATABASE NORMALIZATION PLAN

(SQLite + Drizzle ORM)

====================================================================

LEVEL 1 — CORE ENTITIES (STRICT TABLES)

- diary_entries
- habits
- goals
- job_applications
- profiles
- attachments

RULE:

- Each represents a real-world object
- Has stable primary key
- Soft delete only

LEVEL 2 — RELATION TABLES (M:N)

- diary_habits
- diary_goals
- habit_goals
- goal_dependencies
- job_goals
- job_habits
- attachment_links

RULE:

- No embedded arrays for core relations
- All relations queryable

LEVEL 3 — EVENT / HISTORY TABLES

- habit_checkins
- goal_progress_events
- job_status_events
- diary_edit_history

RULE:

- Append-only
- Drives analytics & streaks

LEVEL 4 — DERIVED / CACHE TABLES

- habit_analytics_cache
- goal_analytics_cache
- job_analytics_cache
- diary_analytics_cache

RULE:

- Recomputable
- Never user-editable

LEVEL 5 — JSON FIELDS (ONLY WHEN NECESSARY)
Allowed:

- rich text content
- experimental flags
- UI preferences

Avoid:

- core relationships
- frequently filtered fields

INDEX STRATEGY:

- date fields
- status fields
- foreign keys
- soft-delete flags

END OF NORMALIZATION PLAN
