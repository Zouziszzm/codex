# Local-First Personal Productivity Desktop App

## Product & UX Specification (High-Level, Pre-Schema)

---

## 1. Core Vision

This application is a local-first, offline desktop application for Windows, macOS, and Linux.

It acts as a personal operating system combining:

- Diary (Notion-like)
- Habit tracker
- Goal tracker
- Job tracker (Huntr-like, no AI)
- Deep interlinking between all features

Key principles:

- Desktop only
- No cloud
- No AI
- Offline-first
- Extremely detailed, structured data
- Calm, neutral, Notion-inspired UI
- Everything is pages + relationships

---

## 2. Global App Layout (Shell)

The application layout is fixed across all features.

┌────────────────────────┬────────────────────────────────────────┐
│ Left Sidebar │ Right Main Outlet │
│ (collapsible) │ (changes based on active feature) │
└────────────────────────┴────────────────────────────────────────┘

### Left Sidebar (Global Navigation)

- Diary
- Habits
- Goals
- Job Tracker
- (Future) Global Dashboard
- Profile
- Settings

Rules:

- Sidebar is collapsible
- Minimal icons + labels
- Notion-like neutral color palette
- No feature-specific clutter

### Right Side (Main Outlet)

- Always displays the active feature
- Each feature opens to a dashboard view by default
- Dashboards are read-first, action-second

---

## 3. Feature: Diary

### Core Concept

- Every calendar date has a mandatory primary page
- Primary page exists even if the user writes nothing
- Each date acts as a root node for that day
- Users can create unlimited child pages under a date

Example structure:

2026-01-02 (Primary Page)

- Morning thoughts
- Workout reflection
- Late-night notes

---

### Diary Default View (Dashboard)

When clicking the Diary tab, the editor does NOT open directly.

The dashboard contains:

Top section:

- Writing streak (X / 365 or 366)
- Kanban-style blocks:
  - Filled days
  - Missed days
  - Long entries
  - Short entries
  - Tagged entries

Middle section (Filters):

- Go to specific date
- Date range
- Tags
- Length (pages / words)
- Has children / no children

Bottom section (Table):

- Date
- Title
- Length
- Tags
- Child page count
- Last edited

---

### Diary Entry Detail View

Flow:

- Click table row
- Diary detail page opens
- Primary page content is shown
- Child pages listed in a side navigation
- Ability to go back to dashboard

---

### Editor Rules

- Block-based rich text editor
- Supports all Notion-style blocks:
  - Headings
  - Lists
  - Toggles
  - Tables
  - Code blocks
  - Quotes
  - Local embeds
- No AI features
- No cloud embeds

---

## 4. Feature: Habit Tracker

### Default View (Habit Dashboard)

Top blocks:

- Longest streak
- Most consistent habit
- Most missed habit
- Overall completion percentage

Analytics section:

- Streak graphs
- Miss frequency
- Time-based trends

Motivation block:

- Static or rotating quotes
- No AI-generated content

---

### Today’s Habits Section

- List of today’s habits
- Checkbox to mark completion
- Shows streak and linked goals

This is the primary daily interaction area.

---

### Add / Edit Habit Flow

- Click “Add Habit”
- Right-side drawer slides in
- Multi-step form
- Extremely detailed (~200 fields)
- Drawer supports:
  - Add
  - Edit
  - Duplicate
- Drafts auto-save
- Closing drawer does not reset state

---

## 5. Feature: Goal Tracker

### Core Concept

- Goals depend on habits and tasks
- Goals can unlock other goals
- Progress is deterministic and rule-based

Example dependency:

Goal: Reach 50kg

- Depends on:
  - Habit: Daily workout
  - Habit: Calorie tracking
- Unlocks:
  - Goal: Muscle gain phase

---

### Goal Dashboard

- Progress blocks
- Locked vs unlocked goals
- Visual dependency indicators
- Analytics on completion trends

---

### Add / Edit Goal Flow

- Same right-side drawer pattern as habits
- Extremely detailed (~150–200 fields)
- Dependency selection UI
- Unlock preview visualization

---

## 6. Feature: Job Tracker

Inspired by Huntr, but significantly deeper and fully local.

---

### Default View (Job Analytics Dashboard)

Displays:

- Applications sent
- Interviews
- Rejections
- Ghosted applications
- Country-based breakdown
- Timeline graphs

Dashboard is read-only by default.

---

### Job Views

- Table view
- Kanban pipeline view:
  - Applied
  - Interview
  - Offer
  - Rejected
  - Ghosted

---

### Add / Edit Job Flow

- Click “Add Job”
- Right-side drawer opens
- Hybrid Huntr-style form
- Extremely detailed (~250–300 fields)

Sections include:

- Company information
- Role details
- Application metadata
- Follow-ups
- Outcomes
- Linked goals
- Linked habits

No AI assistance.
No automated scraping.

---

## 7. Profile & Settings

### Profile

- Personal information
- Preferences
- Default behaviors

### Settings

- Theme (Notion-like only)
- Encryption settings
- Backup and export
- Keyboard shortcuts
- Data management tools

---

## 8. Global UX Rules (Non-Negotiable)

- Dashboards always open first
- Detail views are secondary
- Editing happens in right-side drawers
- Main context is never destroyed
- Calm UX despite extreme data complexity

End of specification.
