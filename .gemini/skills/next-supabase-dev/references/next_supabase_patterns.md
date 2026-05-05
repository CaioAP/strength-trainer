# Next.js + Supabase Patterns

## Authentication

### Server-Side Auth
Always use `createClient` from `@/lib/supabase/server` in Server Components, Server Actions, and Route Handlers.

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // ...
}
```

### Protecting Routes
Use middleware for session refresh and basic protection, but always verify auth status in the component/action for sensitive data.

## Data Fetching

### Server Components
Fetch data directly in Server Components using the server client.

```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*');
```

### Client Components
Use the client client from `@/lib/supabase/client` for realtime or user-interactive fetches.

## Mutations (Server Actions)
Use Server Actions for all mutations. Ensure role-based access control (RBAC) is checked within the action.

```typescript
'use server';
import { createClient } from '@/lib/supabase/server';

export async function myAction(formData: FormData) {
  const supabase = await createClient();
  // Check auth and role
  // Perform mutation
}
```

## Realtime
Use the client client to subscribe to changes.

```typescript
useEffect(() => {
  const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      console.log('New message!', payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase]);
```
