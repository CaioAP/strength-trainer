const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) {
  console.error('Please provide a name for the migration.');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const filename = `${timestamp}_${name}.sql`;
const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const filePath = path.join(migrationsDir, filename);
fs.writeFileSync(filePath, `-- Migration: ${name}\n\n`);

console.log(`Migration created: ${filePath}`);
