import { existsSync, unlinkSync } from 'node:fs';

import { readEnv } from '../config/env';
import { seedDatabase } from './seed';

function sqlitePath(databaseUrl: string): string {
  return databaseUrl.startsWith('file:') ? databaseUrl.slice('file:'.length) : databaseUrl;
}

export async function resetDatabase(databaseUrl = readEnv().DATABASE_URL): Promise<void> {
  const path = sqlitePath(databaseUrl);

  for (const file of [path, `${path}-shm`, `${path}-wal`]) {
    if (existsSync(file)) {
      unlinkSync(file);
    }
  }

  await seedDatabase(databaseUrl);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await resetDatabase();
}
