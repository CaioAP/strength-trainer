# Delivery Plan: FEATURE-002-admin-dashboard-v2

## 1. Overview
Breakdown of the Expanded Admin Dashboard implementation. Focus on Supabase RPCs for sensitive actions, RLS hardening, and a robust desktop-optimized React UI.

## 2. Epics & User Stories

### Epic 1: Database & Security
*Goal: Establish the data foundation and security layer for administrative operations.*

- **Story 1.1: Trainer Profile Extensions**
  - **As an** Admin, **I want** to track trainer approval and activation status, **so that** I can manage their access to the platform.
  - **Acceptance Criteria**:
    - [ ] `trainer_profiles` has `is_approved` (boolean, default false).
    - [ ] `trainer_profiles` has `is_active` (boolean, default true).
    - [ ] Existing records are backfilled appropriately.

- **Story 1.2: Tamper-Resistant Audit Logs**
  - **As an** Admin, **I want** a record of all administrative actions, **so that** I can maintain accountability and audit the system.
  - **Acceptance Criteria**:
    - [ ] `admin_audit_logs` table created in public schema.
    - [ ] Columns: `id`, `admin_id`, `action`, `target_id`, `target_type`, `payload`, `created_at`.
    - [ ] RLS enabled: `SELECT` only for admins, no `UPDATE` or `DELETE` allowed.

- **Story 1.3: RLS Hardening**
  - **As an** Admin, **I want** full visibility into all platform data, **so that** I can oversee operations without restriction.
  - **Acceptance Criteria**:
    - [ ] All tables (`profiles`, `trainer_profiles`, `student_profiles`, `plans`, `workouts`) have RLS policies granting `ALL` permissions to users with `role = 'admin'`.

### Epic 2: Administrative API
*Goal: Encapsulate business logic for sensitive administrative actions in secure RPC functions.*

- **Story 2.1: Platform Metrics API**
  - **As an** Admin, **I want** to see high-level stats at a glance, **so that** I can gauge platform health.
  - **Acceptance Criteria**:
    - [ ] RPC `get_admin_metrics()` returns counts for total exercises, total trainers, pending trainers, and total students.
    - [ ] Function is restricted to callers with `admin` role.

- **Story 2.2: Trainer Lifecycle Management**
  - **As an** Admin, **I want** to approve or revoke trainers through a single secure action, **so that** user roles and statuses are updated atomically.
  - **Acceptance Criteria**:
    - [ ] RPC `approve_trainer(target_user_id)` updates `profiles.role` to 'trainer', sets `is_approved = true`, and logs the action.
    - [ ] RPC `revoke_trainer(target_user_id)` sets `is_active = false` and logs the action.
    - [ ] Both functions use `SECURITY DEFINER` and explicitly check `auth.uid()` role.

### Epic 3: Dashboard UI
*Goal: Build the administrative interface with a focus on data density and efficient management.*

- **Story 3.1: Executive Metrics Dashboard**
  - **As an** Admin, **I want** to see real-time metrics, **so that** I can monitor platform usage.
  - **Acceptance Criteria**:
    - [ ] Visual cards showing total exercises, active trainers, and total students.
    - [ ] Data fetched via `get_admin_metrics()` RPC.

- **Story 3.2: Trainer Management View**
  - **As an** Admin, **I want** to filter and manage trainers, **so that** I can handle approvals and revocations efficiently.
  - **Acceptance Criteria**:
    - [ ] Searchable list of all trainers.
    - [ ] "Approve" button for pending trainers.
    - [ ] "Revoke" button for active trainers.
    - [ ] "View Roster" to see a trainer's assigned students.

- **Story 3.3: Global Student Roster**
  - **As an** Admin, **I want** a read-only list of all students, **so that** I can see who is training on the platform.
  - **Acceptance Criteria**:
    - [ ] List showing student email/name and their current trainer.
    - [ ] Search functionality.

- **Story 3.4: Enhanced Exercise Library**
  - **As an** Admin, **I want** to filter the master exercise library by muscle group, **so that** I can manage content more effectively.
  - **Acceptance Criteria**:
    - [ ] Filter dropdown for muscle groups in the Exercise Management tab.

## 3. Implementation Tasks (By Role)

### ⚙️ Backend Engineer
- [x] **[BE-001]**: Schema Migrations - Profiles & Audit Logs
  - **Description**: Implement SQL migration to add `is_approved`/`is_active` to `trainer_profiles` and create `admin_audit_logs`.
  - **Validation**: Inspect table structure in Supabase Dashboard.
- [x] **[BE-002]**: Implement Administrative RPC Functions
  - **Description**: Create `get_admin_metrics`, `approve_trainer`, and `revoke_trainer` PL/pgSQL functions.
  - **Validation**: Execute functions via Supabase SQL Editor as different roles to verify access control.
- [x] **[BE-003]**: Global RLS Update
  - **Description**: Script to add `admin` bypass policies to all existing tables.
  - **Validation**: Verify admin can `SELECT *` from all tables while student/trainer are restricted.

### 🎨 Frontend Engineer
- [x] **[FE-001]**: Admin Metrics Components
  - **Description**: Implement layout and cards for executive metrics. Use `get_admin_metrics` RPC.
  - **Dependencies**: [BE-002]
  - **Validation**: Display matches database counts.
- [x] **[FE-002]**: Trainer Management List & Actions
  - **Description**: Build searchable table for trainers. Implement "Approve" and "Revoke" button logic calling RPCs.
  - **Dependencies**: [BE-002]
  - **Validation**: Action updates UI state and database.
- [x] **[FE-003]**: Global Student Roster Component
  - **Description**: Create read-only student list with trainer mapping.
  - **Validation**: Correctly displays assignments.
- [x] **[FE-004]**: Refactor Exercise Management
  - **Description**: Add muscle group filtering to the existing exercise list.
  - **Validation**: Filtering accurately narrows list.

## 4. Integration & Final Validation
1. Verify Role-Based Access: Ensure non-admins receive 403 or redirect when attempting to access `/admin`.
2. End-to-End Approval Flow: Register a new user, approve via Admin, verify they can now log in as a Trainer.
3. Audit Trail Verification: Perform actions and verify entries in `admin_audit_logs`.
