# Delivery Plan: FEATURE-001-gym-pwa

## 1. Overview
This delivery plan decomposes the Strength Trainer PWA into a local-first, mobile-optimized implementation. The strategy prioritizes the "Local-First" architecture using Dexie.js for offline persistence, Supabase for authentication and global sync, and Next.js for the PWA framework.

## 2. Epics & User Stories

### Epic 1: Foundation & Infrastructure
- **Story 1.1: Environment & Scaffolding**
  - **As a** developer, **I want** a pre-configured PWA environment, **so that** I can build offline-capable features from day one.
  - **Acceptance Criteria**:
    - [ ] Next.js project initialized with TypeScript and Tailwind CSS.
    - [ ] `next-pwa` configured with a valid manifest and basic service worker.
    - [ ] App is installable on mobile browsers (verified via Lighthouse).
- **Story 1.2: Data Persistence & Sync**
  - **As a** student/trainer, **I want** my data to persist locally even without internet, **so that** I don't lose progress in the gym.
  - **Acceptance Criteria**:
    - [ ] Dexie.js initialized with the schema defined in the technical design.
    - [ ] Supabase project connected with basic Auth (Email/OTP).
    - [ ] Background sync engine prototype that can push/pull a simple table (e.g., `ExerciseMaster`).

### Epic 2: Trainer & Admin Management
- **Story 2.1: Exercise Library Management**
  - **As an** admin, **I want** to manage a master exercise library, **so that** trainers have a standardized set of exercises to choose from.
  - **Acceptance Criteria**:
    - [ ] Interface to CRUD exercises in `ExerciseMaster`.
    - [ ] Row Level Security (RLS) restricts write access to Admins only.
- **Story 2.2: Student Onboarding**
  - **As a** trainer, **I want** to register and invite students, **so that** I can manage their training plans.
  - **Acceptance Criteria**:
    - [ ] Trainer dashboard to add student email and trigger an invite.
    - [ ] Secure invite link logic (Backend creates profile, Frontend handles first-time login).

### Epic 3: Workout Planning & Execution
- **Story 3.1: Plan Construction**
  - **As a** trainer, **I want** to create workouts and plans for my students, **so that** they know exactly what to do.
  - **Acceptance Criteria**:
    - [ ] Multi-step form to create a `Plan` with up to 7 `Workouts`.
    - [ ] Searchable exercise picker from `ExerciseMaster`.
- **Story 3.2: Local-First Workout Execution**
  - **As a** student, **I want** to log my workout in real-time, **so that** I can track my progress and intensity.
  - **Acceptance Criteria**:
    - [ ] Mobile-first UI to start a workout and mark sets as complete.
    - [ ] On-the-fly modification of load/reps/RPE saved to `SessionParamModification`.
    - [ ] State persists in Dexie.js even if the browser tab is closed.

## 3. Implementation Tasks (By Role)

### 🎨 Frontend Engineer
- [x] **FE-001: PWA Scaffolding & Theme**
  - **Description**: Setup Next.js, Tailwind, and mobile-first layout components (Navigation, Header, Card).
  - **Validation**: `npm run dev` shows a responsive layout.
  - **Status**: Completed with Next.js 15, Tailwind v4, Inter font, and PWA manifest.
- [x] **FE-002: Dexie.js Schema & Repository**
  - **Description**: Implement `db.ts` with Dexie schemas and repository functions for all core entities.
  - **Validation**: Unit tests verifying CRUD operations on IndexedDB.
  - **Status**: Initialized Dexie schema in `src/lib/db/dexie.ts`.
- [x] **FE-003: Trainer Dashboard & Student List**
  - **Description**: UI for trainers to see their students and "Add Student" modal.
  - **Validation**: Student list renders from local Dexie state.
  - **Status**: Implemented `TrainerDashboard.tsx` with invite functionality and roster view.
- [x] **FE-004: Plan Builder UI**
  - **Description**: Complex form to create Workouts and PlanExercises.
  - **Dependencies**: BE-001 (DB Schema)
  - **Validation**: Can save a multi-workout plan to Dexie.
  - **Status**: Implemented `NewPlanPage.tsx` with dynamic workout and exercise addition.
- [x] **FE-005: Workout Execution UI**
  - **Description**: The "Active Session" view with set logging, RPE input, and rest timers.
  - **Validation**: Session data persists across page reloads.
  - **Status**: Implemented `ActiveSessionPage.tsx` with mobile-first set tracking.

### ⚙️ Backend Engineer
- [x] **BE-001: Supabase Database Schema**
  - **Description**: Create all tables in Supabase (User, Profiles, Plan, Workout, etc.) with correct FKs.
  - **Validation**: Database schema matches the ER diagram in `design.md`.
  - **Status**: Completed via migration `20240423000000_initial_schema.sql`.
- [x] **BE-002: RLS Policy Implementation**
  - **Description**: Implement PostgreSQL RLS for:
    - Students see only their own `Plan` and `WorkoutExecution`.
    - Trainers see their students' data.
    - Public read-only for `ExerciseMaster`.
  - **Validation**: Supabase dashboard SQL tests for role-based access.
  - **Status**: Defined in `20240423000000_initial_schema.sql`.
- [x] **BE-003: Invite Link Logic**
  - **Description**: Edge Function or API route to generate a secure invite link and create a pending `StudentProfile`.
  - **Validation**: Receiving an email with a valid magic link.
  - **Status**: Implemented as a Server Action in `invite.ts` using Supabase Admin API.
- [x] **BE-004: Sync Engine API**
  - **Description**: Implement "upsert" endpoints or use Supabase Realtime to sync Dexie changes.
  - **Validation**: Data changed in local UI appears in Supabase Dashboard after sync.
  - **Status**: Implemented client-side sync logic in `engine.ts` using Supabase upsert.

### 🚀 DevOps / Infrastructure
- [ ] **DO-001: Service Worker Configuration**
  - **Description**: Configure `next-pwa` for aggressive caching of static assets and `ExerciseMaster` thumbnails.
  - **Validation**: App works in Chrome DevTools "Offline" mode.
- [ ] **DO-002: CI/CD & Environment Setup**
  - **Description**: Setup Vercel deployment with staging and production environments. Configure Supabase environment variables.
  - **Validation**: Successful deployment to `*.vercel.app`.

## 4. Integration & Final Validation
- [ ] **INT-001: End-to-End Offline Sync Test**
  - **Process**: Disable wifi -> Log a workout -> Enable wifi -> Verify data in Supabase.
- [ ] **INT-002: Role Access Audit**
  - **Process**: Login as Student A and attempt to access Student B's workout ID via URL.
- [ ] **INT-003: Lighthouse Audit**
  - **Process**: Run Lighthouse report to ensure 90+ score in PWA and Accessibility.
