import Database from 'better-sqlite3';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readEnv } from '../config/env';

function sqlitePath(databaseUrl: string): string {
  return databaseUrl.startsWith('file:') ? databaseUrl.slice('file:'.length) : databaseUrl;
}

export function runMigrations(databaseUrl = readEnv().DATABASE_URL): void {
  const db = new Database(sqlitePath(databaseUrl));
  const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

  db.exec(`
    create table if not exists _migrations (
      name text primary key,
      applied_at text not null
    );
  `);

  const applied = new Set(
    db.prepare('select name from _migrations').all().map((row) => (row as { name: string }).name),
  );

  const migrations = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

  for (const migration of migrations) {
    if (applied.has(migration)) continue;

    const sql = readFileSync(join(migrationsDir, migration), 'utf8');
    const apply = db.transaction(() => {
      db.exec(sql);
      db.prepare('insert into _migrations (name, applied_at) values (?, ?)').run(
        migration,
        new Date().toISOString(),
      );
    });

    apply();
  }

  db.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}
