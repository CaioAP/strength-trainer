# Supabase Schema Guidelines

## Naming Conventions
- Table names: `snake_case`, plural (e.g., `student_profiles`).
- Column names: `snake_case` (e.g., `user_id`).
- Primary keys: `id uuid DEFAULT gen_random_uuid() PRIMARY KEY`.

## Row Level Security (RLS)
- ALWAYS enable RLS on every table.
- Create explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- Use `auth.uid()` to restrict access to own data.

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);
```

## Migrations
- Use timestamp-prefixed files in `supabase/migrations/`.
- Every migration should be idempotent where possible.
- Include comments explaining the change.

## Performance
- Index foreign keys.
- Index columns used in common `WHERE` clauses.
- Use `JSONB` sparingly for unstructured data.
