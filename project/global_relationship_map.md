# GLOBAL RELATIONSHIP MAP

Cross-Domain Data Graph

====================================================================

Diary

- links_to → Habits (completed_habit_ids)
- links_to → Goals (progressed_goal_ids)
- links_to → Jobs (reflection on applications)
- links_to → Attachments
- backlinks ↔ Diary pages

Habits

- depends_on → Goals
- contributes_to → Goals
- referenced_by → Diary
- blocks/unlocks → Other Habits

Goals

- depends_on → Habits
- depends_on → Tasks
- unlocks → Other Goals
- referenced_by → Diary
- referenced_by → Jobs

Jobs

- linked_to → Goals (career goals)
- linked_to → Habits (job search habits)
- linked_to → Diary (interview reflections)
- linked_to → Attachments (resume, cover letter)
- linked_to → Contacts (recruiters)

Profile

- owns → All entities
- controls → Visibility, encryption, preferences

Attachments

- attached_to → Diary, Jobs, Goals
- encrypted_via → Profile encryption key

Analytics

- derived_from → ALL domains
- never user-editable
- cached per domain

RULES:

- All relationships are explicit (no magic)
- Many-to-many via join tables
- No circular dependency without unlock logic
- Soft deletes everywhere

END OF RELATIONSHIP MAP
