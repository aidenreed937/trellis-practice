import { randomUUID } from 'node:crypto';

import { readEnv } from '../config/env';
import { createDb } from './client';
import { runMigrations } from './migrate';

export async function seedDatabase(databaseUrl = readEnv().DATABASE_URL): Promise<void> {
  runMigrations(databaseUrl);

  const db = createDb(databaseUrl);
  const existing = await db.selectFrom('todos').select(({ fn }) => fn.countAll<number>().as('count')).executeTakeFirst();

  if ((existing?.count ?? 0) === 0) {
    await db
      .insertInto('todos')
      .values({
        id: randomUUID(),
        title: 'Review Trellis workflow',
        completed: 0,
        created_at: new Date().toISOString(),
      })
      .execute();
  }

  await db.destroy();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDatabase();
}
