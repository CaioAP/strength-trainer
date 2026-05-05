import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function migrate() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // Create migrations table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const executed = await sql`SELECT name FROM _migrations`;
    const executedNames = new Set(executed.map(r => r.name));

    console.log(`Found ${files.length} migration files.`);

    for (const file of files) {
      if (executedNames.has(file)) {
        console.log(`Skipping already executed migration: ${file}`);
        continue;
      }

      console.log(`Executing migration: ${file}...`);
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      await sql.begin(async (sql) => {
        await sql.unsafe(content);
        await sql`INSERT INTO _migrations (name) VALUES (${file})`;
      });
      
      console.log(`Successfully executed ${file}`);
    }

    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
