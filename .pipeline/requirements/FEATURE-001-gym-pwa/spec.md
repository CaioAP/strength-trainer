# Architect Input: Strength Trainer PWA

## 1. Executive Summary
The Strength Trainer PWA is a mobile-first, browser-rendered Progressive Web Application designed to streamline the relationship between personal trainers and their students. It centralizes workout management, allowing trainers to create bespoke or template-based plans, while providing students with a robust interface to execute, modify, and log their training sessions, even without an active internet connection.

## 2. Core Scope (Functional Requirements)
- [ ] **Admin Management**: Centralized administration to register personal trainers and manage a global master exercise library (standardizing naming, descriptions, and media).
- [ ] **Student Onboarding**: Trainers can register students and trigger invitation links via email.
- [ ] **Workout Planning**: Trainers can create individual workout plans (limited to 7 workouts per plan) and reusable templates for faster assignment.
- [ ] **Configurable Exercises**: Each exercise in a plan supports configuration of reps, sets, load (weight), and rest periods.
- [ ] **Workout Execution**: Students can initiate a workout from their assigned plan, marking sets and exercises as completed in real-time.
- [ ] **Effort Logging**: Integration of RPE (Rate of Perceived Exertion) logging for every set or exercise to track intensity.
- [ ] **On-the-fly Modifications**: Students can adjust load and reps during a session. These changes are temporary (session-specific) and do not permanently alter the master plan unless promoted.
- [ ] **Sync Engine**: Bi-directional synchronization of workout logs once a connection is established after offline usage.

## 3. Technical Constraints & Non-Functional Requirements
- **Offline Mode**: Workouts must be cached locally using Service Workers and IndexedDB. Students must be able to complete a full session offline.
- **Session Persistence**: Active workout state (timers, completed sets) must auto-save locally to prevent data loss if the browser tab is closed or the app crashes.
- **Platform**: Mobile-first PWA. Must be installable on iOS and Android via the browser.
- **Performance**: Near-instant feedback for logging sets; local-first architecture to minimize perceived latency.
- **Security**: Secure email-based invitation flow; role-based access control (Admin vs. Trainer vs. Student).

## 4. User Personas & Key Flows
- **Admin**: Oversees the platform ecosystem.
  - Flow: Log in -> Add/Edit Exercise to Master Library -> Register new Trainer.
- **Personal Trainer**: Manages their roster of students.
  - Flow: Log in -> Create Workout Template -> Assign Template to Student -> Customize for Student.
- **Student**: The primary end-user executing workouts.
  - Flow: Open App (Offline/Online) -> Select Workout -> Perform Sets -> Adjust Weight/Reps -> Log RPE -> Complete & Sync.

## 5. Identified Gaps & Edge Cases
- **Sync Conflict Resolution**: If a trainer modifies a plan while a student is executing an offline version of it. 
  - *Recommendation*: Prioritize student's session data; prompt to update plan after session completion.
- **Media Caching**: High-resolution exercise videos/images could bloat local storage. 
  - *Recommendation*: Cache only thumbnails or low-res versions for offline; download on-demand when online.
- **Session Abandonment**: How to handle sessions that were started but never "completed".
  - *Recommendation*: Auto-archive or prompt to resume after 24 hours of inactivity.
- **Account Recovery**: Standard PWA challenge with cleared browser data.
  - *Recommendation*: Robust server-side backup and standard auth recovery flows.

## 6. Recommended Future Features (Backlog)
- **Progress Analytics**: Visual charts showing volume, 1RM estimates, and RPE trends over time.
- **Rest Timers**: Interactive, configurable countdown timers between sets with audio/haptic feedback.
- **Video Demonstrations**: Built-in player for exercise technique videos from the master library.
- **Trainer Dashboard**: Aggregated view of student consistency and effort trends.

## 7. Reference Material
- Initial Project Goals provided by user.
- Offline/Persistence technical mandates.
