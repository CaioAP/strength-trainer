---
name: next-supabase-dev
description: Expert guidance for Next.js, React, and Supabase fullstack development. Use when building features that involve Supabase Auth, database schema design, RLS policies, Server Actions, or Realtime subscriptions in a Next.js environment.
---

# Next Supabase Dev

## Overview

This skill provides specialized workflows and best practices for building robust fullstack applications using Next.js (App Router), React, and Supabase. It covers authentication, data fetching, mutations with Server Actions, and database management.

## Core Capabilities

### 1. Authentication & Authorization
- **Server-Side Auth**: Use `@/lib/supabase/server` in SC, Actions, and Route Handlers.
- **Client-Side Auth**: Use `@/lib/supabase/client` in Client Components.
- **RBAC**: Implement and verify role-based access control in Server Actions.
- **RLS**: Design and implement Row Level Security policies.

### 2. Data Fetching & Mutations
- **Server Components**: Direct fetching with zero-bundle size impact.
- **Server Actions**: Secure mutations with automatic revalidation using `revalidatePath` or `revalidateTag`.
- **Realtime**: Type-safe subscriptions for live data updates.

### 3. Database Management
- **Schema Design**: Relational design optimized for Supabase/PostgreSQL.
- **Migrations**: Systematic database changes using timestamped SQL files.

## Workflows

### Creating a New Feature
1. **Schema**: Define the tables and columns in a new migration.
   - Use `scripts/generate_migration.cjs` to create the file.
   - Reference `references/supabase_schema_guidelines.md` for standards.
2. **RLS**: Add appropriate policies to the migration.
3. **Data Access**: Create Server Actions for mutations and fetch data in Server Components.
   - Reference `references/next_supabase_patterns.md` for code snippets.
4. **UI**: Build the interface using React components.
   - Use `assets/supabase_component_template.tsx` as a starting point if needed.

## Resources

### scripts/
- `generate_migration.cjs`: Generates a new timestamped migration file in `supabase/migrations/`.

### references/
- `next_supabase_patterns.md`: Best practices for Auth, Fetching, Actions, and Realtime.
- `supabase_schema_guidelines.md`: Naming conventions, RLS, and performance tips.

### assets/
- `supabase_component_template.tsx`: A boilerplate Client Component with Supabase data fetching.
