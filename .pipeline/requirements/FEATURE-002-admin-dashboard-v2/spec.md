# Architect Input: Expanded Admin Dashboard (V2)

## 1. Executive Summary
The Strength Trainer PWA requires an expanded Admin Dashboard to transition from simple exercise management to full platform oversight. This update introduces executive metrics, comprehensive trainer lifecycle management (approval/revocation), and global student visibility. The goal is to provide Admins with the tools necessary to manage the growing ecosystem of trainers and students while maintaining data integrity and auditability.

## 2. Core Scope (Functional Requirements)
- [ ] **Executive Metrics**:
    - Real-time count of total exercises in the master library.
    - Real-time count of registered and approved trainers.
    - Real-time count of total active students across the platform.
- [ ] **Trainer Management**:
    - **List View**: A searchable and filterable list of all users with the 'trainer' role or pending trainer status.
    - **Approval Workflow**: Admins must be able to approve pending trainer requests (transitioning user role and activating profile).
    - **Revocation/Deactivation**: Admins can revoke trainer access. This must be a "soft-disable" that prevents login or trainer-specific actions but preserves historical data.
    - **Roster Inspection**: Ability to click into a trainer to view their specific list of assigned students.
- [ ] **Student Overview**:
    - A global, read-only view of all students registered on the platform.
    - Ability to see which trainer is assigned to each student.
- [ ] **Exercise Management**:
    - Maintain existing CRUD functionality for `exercise_master`.
    - Enhance list with search/filter by muscle group.
- [ ] **Audit Logging**:
    - Record all administrative actions: trainer approval, trainer revocation, and exercise library changes (add/delete).

## 3. Technical Constraints & Non-Functional Requirements
- **Security**: 
    - Strict RLS (Row Level Security) ensuring only 'admin' role can access these views and perform management actions.
    - Audit logs must be tamper-resistant (stored in a dedicated schema or table with restricted access).
- **Data Integrity**: 
    - Revoking a trainer must NOT orphan students in a way that breaks their access to historical workout data.
    - Soft-delete implementation for `trainer_profiles` (e.g., `is_active` boolean or `deleted_at` timestamp).
- **Performance**: Dashboard metrics should be cached or optimized (e.g., using Supabase RPC or materialized views if counts become expensive).
- **Platform**: Responsive web view optimized for desktop (Admins) but functional on mobile.

## 4. User Personas & Key Flows
- **Admin**: Platform owner/manager.
  - **Flow 1: Trainer Approval**:
    1. Admin receives notification or checks "Pending Trainers" list.
    2. Admin reviews trainer details.
    3. Admin clicks "Approve".
    4. System updates user role to 'trainer', sets `is_approved = true`, and logs the action.
  - **Flow 2: Revoking Access**:
    1. Admin finds a trainer in the list.
    2. Admin clicks "Revoke Access".
    3. System sets `is_active = false` on the trainer profile.
    4. System logs the action with a reason.
    5. Student's access to historical plans remains, but they are marked as "Unassigned" or "Inactive Trainer".

## 5. Identified Gaps & Edge Cases
- **Orphaned Students**: When a trainer is revoked, students lose their primary point of contact. 
    - *Resolution*: Students should remain linked to the (now inactive) trainer record to preserve `plans` and `workouts` relationship, but UI should show "Trainer Inactive". Admins should have an option to "Bulk Reassign" students to a new trainer.
- **Role Hierarchy**: What if an Admin wants to become a Trainer?
    - *Resolution*: Support multi-role or role-switching, but default to 'admin' having superset permissions.
- **Audit Log Visibility**: Should trainers see why they were revoked?
    - *Resolution*: No, audit logs are for internal Admin use. Trainer receives a generic "Access Revoked" message.

## 6. Recommended Future Features (Backlog)
- **Trainer Application Form**: A way for 'student' users to apply for 'trainer' status within the app.
- **Platform Revenue Dashboard**: If monetization is added, show subscription metrics here.
- **Global Search**: A single search bar to find any user (trainer/student) or exercise.

## 7. Reference Material
- Existing Schema: `supabase/migrations/20240423000000_initial_schema.sql`
- Current Admin Component: `src/components/admin/AdminDashboard.tsx`
